import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';

import { createDocWithId } from './firestore';

import { app } from '../config/firebase';

const auth = getAuth(app);

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

export { auth };
