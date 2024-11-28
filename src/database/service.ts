import { collections } from "./constants";
import db from "./firebase";

async function getDocument<T>(collectionName: collections, filter: { id?: string, username?: string }) {
    const { id, username } = filter;
    const docRef = db.collection(collectionName);
    let query;
    if (id) { 
        query = await docRef.doc(id); 
    } else if (username) {
        query = docRef.where(`username`, '==', `${username}`);
    }

    const doc = await query.get();
    if (doc.exists) {
        return doc.data() as T;
    }
    return null;
};

async function getAllDocuments<T>(collectionName: collections, filter?: object) {
    const collectionRef = db.collection(collectionName);

    let query;
    if (filter) {
        const filters = Object.entries(filter);
        filters.forEach(filterEntry => {
            const [filterKey, filterValue] = filterEntry;
            query = collectionRef.where(`${filterKey}`, '==', `${filterValue}`);
        })
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    return snapshot.docs.map(doc => doc.data()) as T[];
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
    return db.collection(collectionName).add(document);
};

export { getDocument, getAllDocuments, postDocuments, postDocument };
