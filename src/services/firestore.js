import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';

import { emitRealTime } from './realTime';

/**
 * Get all documents from the database
 * @param {String} collectionName
 * @returns An array with all documents in the collection
 */
export async function getAllDocs(collectionName) {
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
export async function getAllDocsNoId(collectionName) {
  const collectionRef = collection(db, collectionName);
  const documents = await getDocs(collectionRef);
  const docsArray = documents.docs.map((document) => document.data());
  return docsArray;
}

/**
 *
 * @param {String} value Search value
 * @param {String} collectionName Collection to query
 * @param {String} searchField Field to query, if not specified, it will search with 'username'
 * @returns An array with all the coincidences
 */
export async function getAllDocsByField(value, collectionName, searchField = 'username') {
  if (!value) { return null; }
  const collectionReference = collection(db, collectionName);
  const queryResult = await query(collectionReference, where(searchField, '==', value));
  const docsSnapshot = await getDocs(queryResult);
  const documents = docsSnapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
  return documents;
}

/**
 * Get a document from the database
 * @param {String} collectionName
 * @param {String} id
 * @returns {Object} A document if it exists, otherwise returns false
 */
export async function getDocById(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return { id: docSnap.id, ...data };
  }
  return false;
}

/**
 *
 * @param {Object} data Object with the data to be updated in the database
 * @param {String} collectionName Collection name
 * @param {String} id Document id
 * @returns {Void} Creates a document with the id provided if it doesn't exist
 */
export async function createDocWithId(collectionName, id, data) {
  const docRef = doc(db, collectionName, id);
  const res = await setDoc(docRef, data);
  return res;
}

/**
 *
 * @param {Object} data Object with the data to be added to the database
 * @param {String} collectionName Collection name
 * @returns new document with autogenerated id
 */
export async function createDoc(collectionName, data) {
  const collectionRef = collection(db, collectionName);
  const res = await addDoc(collectionRef, data);
  return res;
}

export async function editDocById(collectionName, id, data) {
  const docRef = doc(db, collectionName, id);
  const res = await updateDoc(docRef, data);
  return res;
}

export async function deleteDocById(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  const res = await deleteDoc(docRef);
  return res;
}

export async function queryCollectionByUsername(collectionName, username) {
  const collectionRef = collection(db, collectionName);
  const queryResult = query(collectionRef, where('username', '>=', username), where('username', '<=', `${username}\uf8ff`));
  const documents = await getDocs(queryResult);
  const docsArray = documents.docs.map((document) => document.data());
  return docsArray;
}

// eslint-disable-next-line max-len
export async function createAndSendTournamentInvitation(tournamentTitle, userId) {
  const invitation = {
    tournament: tournamentTitle, player: userId, acceptedInvite: false, timeStamp: Date.now(),
  };
  await emitRealTime(userId, {
    title: 'New tournament invitation',
    msg: `You have a new tournament invitation from ${tournamentTitle}`,
    invitationTime: Date.now(),
  });
  await createDoc('tournamentInvitations', invitation);
}

export async function createAndSendFriendInvitation(usernameFrom, usernameTo) {
  const invitation = {
    usernameFrom, usernameTo, acceptedInvite: false, timeStamp: new Date(),
  };
  await createDoc('friendInvitations', invitation);
}
