import { Query, CollectionReference, WriteResult } from 'firebase-admin/firestore';
import { collections } from "./constants.js";
import { db } from "../firebase.js";

function generateFirebaseId(collectionName: collections): string {
  return db.collection(collectionName).doc().id;
}

async function getDocument<T>(collectionName: collections, user_id: string, filter?: { id?: string, key?: string, value?: string }) {
    const { id, key, value } = filter || {};
    const docRef: CollectionReference = db.collection(collectionName);
    let query: Query;
    if (id) {
        const doc = await docRef.doc(id)?.get();
        if (doc?.exists) {
            const data = doc.data() as T;
            if ((data as any).user_id !== user_id) {
                return null;
            }
            return data;
        } else {
            return null;
        }
    } else if (key && value) {
        query = docRef.where(key, '==', `${value}`);

        const snapshot = await query.get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            return null;
        }

        const doc = snapshot.docs[0];
        if ((doc.data() as any).user_id !== user_id) {
            return null;
        }
        return { id: doc.id, ...doc.data() } as T;
    }
};

async function getAllDocuments<T>(collectionName: collections, user_id: string, filter?: object) {
    let query: Query = db.collection(collectionName).where('user_id', '==', user_id);

    if (filter) {
        const filters = Object.entries(filter);
        filters.forEach(filterEntry => {
            const [filterKey, filterValue] = filterEntry;
            query = query.where(`${filterKey}`, '==', `${filterValue}`);
        })
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return [];
    }

    const results = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));
    return results as T[];
};

async function postDocuments<T>(collectionName: collections, user_id: string, documents: T[]) {
    const batch = db.batch();
    documents.forEach(doc => {
        const docRef = db.collection(collectionName).doc(); //automatically generate unique id
        batch.set(docRef, { ...doc, user_id } as FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData>);
    })

    return batch.commit();
};

async function postDocument<T>(collectionName: collections, user_id: string, document: T) {
    //automatically generate unique id
    const docRef = await db.collection(collectionName).add({ ...document, user_id } as FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData>);
    const doc = await docRef.get();
    if (doc.exists) {
        console.log("Added document data:", doc.data());
        return { id: doc.id, ...doc.data() };
    } else {
        console.log("Failed to post document, no data found.");
        return null;
    }
};

async function updateDocument<T>(collectionName: collections, user_id: string, documentId: string, updateData: Partial<T>) {
    const documentRef = db.collection(collectionName).doc(documentId);
    const doc = await documentRef.get();
    if (doc.exists && (doc.data() as any).user_id === user_id) {
        await documentRef.update(updateData);
    } else {
        console.log("Failed to update document, no data found or user_id mismatch.");
    }
};

async function getDocumentsByArrayFilter<T>(collectionName: collections, user_id: string, fieldName: keyof T, arrayFilter: Array<string | number>) {
    const collectionRef = db.collection(collectionName);
    console.log('fieldName', fieldName);
    console.log('arrayFilter', arrayFilter);
    const querySnapshot = await collectionRef
        .where('user_id', '==', user_id)
        .where(fieldName as string, "array-contains-any", arrayFilter)
        .get();

    const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return results as T[];
};

async function getDocumentsInArray<T>(collectionName: collections, user_id: string, fieldName: keyof T, arrayFilter: Array<string | number>) {
    const collectionRef = db.collection(collectionName);
    const querySnapshot = await collectionRef
        .where('user_id', '==', user_id)
        .where(fieldName as string, "in", arrayFilter)
        .get();

    const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return results as T[];
};

async function removeDocumentById(collectionName: collections, user_id: string, id: string): Promise<WriteResult> {
    const docRef = db.collection(collectionName).doc(id);
    const doc = await docRef.get();
    if (doc.exists && (doc.data() as any).user_id === user_id) {
        return docRef.delete();
    } else {
        console.log("Failed to remove document, no data found or user_id mismatch.");
        return Promise.reject("Failed to remove document, no data found or user_id mismatch.");
    }
}

async function removeDocumentsByField<T>(collectionName: collections, user_id: string, fieldName: keyof T, fieldValue: string): Promise<void> {
    const querySnapshot = await db.collection(collectionName)
        .where('user_id', '==', user_id)
        .where(fieldName as string, "==", fieldValue)
        .get();

    const batch = db.batch();
    querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Documents with ${fieldName as string}=${fieldValue} removed from ${collectionName}`);
}

export {
    generateFirebaseId,
    getDocument,
    getAllDocuments,
    postDocuments,
    postDocument,
    updateDocument,
    getDocumentsByArrayFilter,
    removeDocumentById,
    getDocumentsInArray,
    removeDocumentsByField
};
