import { pipeline, Readable } from 'stream';
import { promisify } from 'util';
import { storage } from "../firebase";

import serviceAccount from '../grabber-firebase-adminsdk.private.json';

const bucket = storage.bucket(serviceAccount.storage_bucket);

type ActionType = "read" | "write" | "delete" | "resumable";
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


const uploadFileFromCDN = async (cdnUrl: string, destinationPath: string): Promise<{ url: string, path: string}> => {
    try {

        console.log(`start uploading Firebase Storage: ${cdnUrl}`);
        const response = await fetch(cdnUrl);

        // Add artificial delay (e.g., 500ms)
        await delay(500);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        // // Optional: Validate content type for videos or images
        // const allowedTypes = ['video/mp4', 'video/avi', 'image/jpeg', 'image/png'];
        // if (!allowedTypes.includes(contentType)) {
        //     throw new Error(`Unsupported file type: ${contentType}`);
        // }
        
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
        return { url: file.publicUrl(), path: destinationPath };
    } catch (error) {
        console.error(`Error uploading image ${cdnUrl}:`, error);
        throw error;
    }
};

const uploadImage = async (filePath: string, destination: string) => {
    await bucket.upload(filePath, {
        destination,
        public: true,
    });
};

const getSignedImage = async (fileName: string) => {
    const file = bucket.file(fileName);
    const options = {
        action: "read" as ActionType,
        expires: Date.now() + 60 * 60 * 1000, // URL expiration (1 hour from now)
      };
    const [url] = await file.getSignedUrl(options);  
    return url;
}

export { uploadImage, uploadFileFromCDN, getSignedImage };
