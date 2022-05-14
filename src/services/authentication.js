import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithRedirect,
} from 'firebase/auth';

import { auth } from '../config/firebase';
import { createDocWithId } from './firestore';

const googleProvider = new GoogleAuthProvider();
const defaultAvatar = 'https://res.cloudinary.com/dt7ptke8d/image/upload/c_scale,w_150/v1652478967/logo-light--bw_virbfz.png';

/**
 * Function validates already used email or weak passwords
 * @param {String} email
 * @param {String} password
 * @returns The new user created or an error if it fails
 */
export async function createDocOnEmailSignup(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  await createDocWithId('users', userCredential.user.uid, { email, avatar: defaultAvatar });
  return userCredential.user;
}

export async function googleLoginWithRedirect() {
  await signInWithRedirect(auth, googleProvider);
}
