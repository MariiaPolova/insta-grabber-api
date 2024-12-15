import { pipeline, Readable } from 'stream';
import { promisify } from 'util';
import { storage } from "../firebase";

import serviceAccount from '../grabber-firebase-adminsdk.private.json';

const bucket = storage.bucket(serviceAccount.storage_bucket);

const pipelineAsync = promisify(pipeline);

function toNodeReadableStream(readableStream: ReadableStream<Uint8Array>): Readable {
    const reader = readableStream.getReader();

    return new Readable({
        async read() {
            const { value, done } = await reader.read();
            if (done) {
                this.push(null); // End the stream
            } else {
                this.push(Buffer.from(value)); // Push the chunk
            }
        },
    });
}


const uploadImageFromCDN = async (cdnUrl: string, destinationPath: string): Promise<string> => {
    try {
        const response = await fetch(cdnUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        // Convert the response body to a Node.js readable stream
        const nodeReadableStream = toNodeReadableStream(response.body as ReadableStream<Uint8Array>);

        // Create a write stream for Firebase Storage
        const file = bucket.file(destinationPath);
        const writeStream = file.createWriteStream({
            metadata: {
                contentType,
            },
        });

        // Pipe the readable stream to Firebase Storage
        await pipelineAsync(nodeReadableStream, writeStream);

        console.log(`File uploaded to Firebase Storage at: ${destinationPath}`);
        //   return file.getSignedUrl({action: 'read', expires: 10000});
        return file.publicUrl();
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

const uploadImage = async (filePath, destination) => {
    await bucket.upload(filePath, {
        destination,
        public: true,
    });
};

export { uploadImage, uploadImageFromCDN };
