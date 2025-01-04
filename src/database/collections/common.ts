/* eslint-disable @typescript-eslint/no-explicit-any */
import { collections } from "../constants";
import {
    getDocument,
    getAllDocuments,
    postDocuments,
    postDocument,
    updateDocument,
    getDocumentsByArrayFilter,
    removeDocumentById
} from "../database.service";

function createCollectionLayer<T extends Record<string, (collectionName: collections, ...args: any[]) => any>>(
    collectionName: collections,
    methods: T
  ): { [K in keyof T]: (...args: Parameters<T[K]> extends [any, ...infer U] ? U : never) => ReturnType<T[K]> } {
    const wrappedMethods: Partial<
      { [K in keyof T]: (...args: Parameters<T[K]> extends [any, ...infer U] ? U : never) => ReturnType<T[K]> }
    > = {};
  
    for (const key in methods) {
      if (Object.prototype.hasOwnProperty.call(methods, key)) {
        const method = methods[key];
        wrappedMethods[key] = ((...args: any[]) => method(collectionName, ...args)) as any;
      }
    }
  
    return wrappedMethods as { [K in keyof T]: (...args: Parameters<T[K]> extends [any, ...infer U] ? U : never) => ReturnType<T[K]> };
  }

  const methods = {
    getOne: getDocument,
    getAll: getAllDocuments,
    createMany: postDocuments,
    createOne: postDocument,
    updateOne: updateDocument,
    getByArrayFilter: getDocumentsByArrayFilter,
    remove: removeDocumentById,
};

const getCollectionLayer = (collectionName: collections) => createCollectionLayer(collectionName, methods);

export { getCollectionLayer };
  