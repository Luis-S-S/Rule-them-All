import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithRedirect,
} from 'firebase/auth';

import { auth } from '../config/firebase';
import { createDocWithId } from './firestore';

const googleProvider = new GoogleAuthProvider();

/**
 * Function validates already used email or weak passwords
 * @param {String} email
 * @param {String} password
 * @returns The new user created or an error if it fails
 */
export async function createDocOnEmailSignup(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await createDocWithId({ email }, 'users', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    return error.message;
  }
}

export async function googleLoginWithRedirect() {
  await signInWithRedirect(auth, googleProvider);
}
