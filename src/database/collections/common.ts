/* eslint-disable @typescript-eslint/no-explicit-any */
import { collections } from "../constants.js";
import {
    getDocument,
    getAllDocuments,
    postDocuments,
    postDocument,
    updateDocument,
    getDocumentsByArrayFilter,
    removeDocumentById,
    getDocumentsInArray,
    removeDocumentsByField
} from "../database.service.js";
  
function createCollectionFunction<T extends (collectionName: collections, ...args: any[]) => any>(
    collectionName: collections,
    method: T
  ): (...args: Parameters<T> extends [any, ...infer U] ? U : never) => ReturnType<T> {
    return (...args: any[]) => method(collectionName, ...args);
  }

  const createCollectionLayer = <T>(collectionName: collections) => {
    return {
        getOne: createCollectionFunction(collectionName, getDocument<T>),
        getAll: createCollectionFunction(collectionName, getAllDocuments<T>),
        createMany: createCollectionFunction(collectionName, postDocuments<T>),
        createOne: createCollectionFunction(collectionName, postDocument<T>),
        updateOne: createCollectionFunction(collectionName, updateDocument<T>),
        getByArrayFilter: createCollectionFunction(collectionName, getDocumentsByArrayFilter<T>),
        getDocumentsInArray: createCollectionFunction(collectionName, getDocumentsInArray<T>),
        remove: createCollectionFunction(collectionName, removeDocumentById),
        removeByField: createCollectionFunction(collectionName, removeDocumentsByField<T>),
        }
};

const getCollectionLayer = <T>(collectionName: collections) => createCollectionLayer<T>(collectionName);

export { getCollectionLayer };
  