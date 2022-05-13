import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
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

/**
 *
 * @param {Object} data  Body of the document
 * @param {String} collectionName Collection in whch the document will be added
 * @param {String} newId [optional] If not provided, a new id will be generated
 * @returns {VoidFunction}
 */
async function createDoc(data, collectionName, newId) {
  let res;
  if (newId) {
    const docRef = doc(db, collectionName, newId);
    res = await setDoc(docRef, data);
  } else {
    const collectionRef = collection(db, collectionName);
    res = await addDoc(collectionRef, data);
  }
  return res;
}

export {
  getAllDocs,
  getAllDocsNoId,
  getDocById,
  createDoc,
};
