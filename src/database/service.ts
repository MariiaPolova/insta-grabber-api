import { collections } from "./constants";
import db from "./firebase";
import { IAccount } from "./interfaces/accounts";

async function getDocument<T>(collectionName: collections, filter: { id?: string, username?: string }) {
    const { id, username } = filter;
    const docRef: FirebaseFirestore.CollectionReference = db.collection(collectionName);
    let query: FirebaseFirestore.Query;
    if (id) { 
        const doc = await docRef.doc(id).get();
        if (doc.exists) {
            return doc.data() as T;
        }
    } else if (username) {
        query = docRef.where(`username`, '==', `${username}`);
    }

    const snapshot = await query.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as IAccount;
};

async function getAllDocuments<T>(collectionName: collections, filter?: object) {
    let query: FirebaseFirestore.Query = db.collection(collectionName);

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
