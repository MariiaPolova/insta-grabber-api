import { collections } from "./constants";
import { db } from "../firebase";
import { Query, CollectionReference } from 'firebase-admin/firestore';

async function getDocument<T>(collectionName: collections, filter: { id?: string, key?: string, value?: string }) {
    const { id, key, value } = filter;
    const docRef: CollectionReference = db.collection(collectionName);
    let query: Query;
    if (id) {
        const doc = await docRef.doc(id)?.get();
        if (doc?.exists) {
            return doc.data() as T;
        } else {
            return null;
        }
    } else if (key && value) {
        query = docRef.where(key, '==', `${value}`);
    }

    const snapshot = await query.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as T;
};

async function getAllDocuments<T>(collectionName: collections, filter?: object) {
    let query: Query = db.collection(collectionName);

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
        id: doc.id,
        ...doc.data(),
    }));
    return results as T[];
};

async function postDocuments<T>(collectionName: collections, documents: T[]) {
    const batch = db.batch();
    documents.forEach(doc => {
        const docRef = db.collection(collectionName).doc(); //automatically generate unique id
        batch.set(docRef, doc);
    })

    return batch.commit();
};

async function postDocument<T>(collectionName: collections, document: T) {
    //automatically generate unique id
    const docRef = await db.collection(collectionName).add(document);
    const doc = await docRef.get();
    if (doc.exists) {
        console.log("Added document data:", doc.data());
        return { id: doc.id, ...doc.data() };
    } else {
        console.log("Failed to post document, no data found.");
        return null;
    }
};

async function updateDocument<T>(collectionName: collections, documentId: string, updateData: Partial<T>) {
    const documentRef = db.collection(collectionName).doc(documentId);
    await documentRef.update(updateData);
};

async function getDocumentsByArrayFilter<T>(collectionName: collections, fieldName: keyof T, arrayFilter: Array<string | number>) {
    const collectionRef = db.collection(collectionName);
    console.log('fieldName', fieldName);
    console.log('arrayFilter', arrayFilter);
    const querySnapshot = await collectionRef
        .where(fieldName as string, "array-contains-any", arrayFilter)
        .get();

    const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return results as T[];
};

async function getDocumentsInArray<T>(collectionName: collections, fieldName: keyof T, arrayFilter: Array<string | number>) {
    const collectionRef = db.collection(collectionName);
    console.log('fieldName', fieldName);
    console.log('arrayFilter', arrayFilter);
    const querySnapshot = await collectionRef
        .where(fieldName as string, "in", arrayFilter)
        .get();

    const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return results as T[];
};

async function removeDocumentById(collectionName: collections, id) {
    return db.collection(collectionName).doc(id).delete();
}

async function removeDocumentsByField<T>(collectionName: collections, fieldName: keyof T, fieldValue: string): Promise<void> {
    const querySnapshot = await db.collection(collectionName)
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
