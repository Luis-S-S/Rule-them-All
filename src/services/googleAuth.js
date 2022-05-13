import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { app } from '../config/firebase';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
