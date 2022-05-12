import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
} from 'firebase/firestore';
import { app } from '../config/firebase';

const db = getFirestore(app);

/**
 * Get all documents from the database
 * @param {String} collectionName
 * @returns An array with all documents in the collection
 */
async function getAllDocs(collectionName) {
  const collectionReference = collection(db, collectionName);
  const documents = await getDocs(collectionReference);
  const docsArray = documents.docs.map((document) => {
    const data = document.data();
    return { id: document.id, ...data };
  });
  return docsArray;
}

/**
 * Get all documents from the database without the Id
 * @param {String} collectionName
 * @returns An array with all documents in the collection w/o the Id
 */
async function getAllDocsNoId(collectionName) {
  const collectionRef = collection(db, collectionName);
  const documents = await getDocs(collectionRef);
  const docsArray = documents.docs.map((document) => document.data());
  return docsArray;
}

/**
 * Get a document from the database
 * @param {String} collectionName
 * @param {String} id
 * @returns A document if it exists, otherwise an error msg
 */
async function getDocById(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return { id: docSnap.id, ...data };
  }
  return 'No such document!';
}

export {
  getAllDocs,
  getAllDocsNoId,
  getDocById,
};
