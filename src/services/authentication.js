import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';

import { createDoc } from './firestore';

import { app } from '../config/firebase';

const auth = getAuth(app);

export async function createAuthWithEmailAndPassword(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await createDoc({ email }, 'users', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    return error.message;
  }
}

export async function signAuthWithEmailAndPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    return `${error.code} ${error.message}`;
  }
}
