import { useState, useContext, useEffect } from 'react';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { Context } from '../store';
import { setIntercept } from '../store/actions';
import { createDocOnEmailSignup } from '../services/authentication';
import { auth, googleProvider } from '../services/googleAuth';
import { createDocWithId, isSignupComplete, getDocById } from '../services/firestore';

import ButtonPrimary from '../components/ButtonPrimary/ButtonPrimary';

export default function SignUp() {
  const { dispatch } = useContext(Context);
  const [form, setForm] = useState({});

  const handlerOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerOnSubmit = async (e) => {
    e.preventDefault();
    const user = await createDocOnEmailSignup(form.email, form.password);
    if (user.accessToken) {
      localStorage.setItem('userToken', user.accessToken);
      const isComplete = await isSignupComplete(user.uid);
      dispatch(setIntercept({ title: 'Success', message: 'Signup successful', navigation: isComplete ? '/' : '/signup_detail' }));
    } else {
      dispatch(setIntercept({ title: 'Error', message: 'Signup failed', navigation: '/signup' }));
    }
  };

  const handlerGoogleLogin = async () => {
    await signInWithRedirect(auth, googleProvider);
  };

  useEffect(() => {
    async function googleLoginResult() {
      const result = await getRedirectResult(auth);
      if (result) {
        try {
          const docExists = await getDocById('users', result?.user.uid);
          if (!docExists) {
            await createDocWithId({ email: result?.user.email }, 'users', result?.user.uid);
          }
          const isComplete = await isSignupComplete(result?.user.uid);
          dispatch(setIntercept({ title: 'Success', message: 'Signup successful', navigation: isComplete ? '/' : '/signup_detail' }));
        } catch (error) {
          dispatch(setIntercept({ title: 'Error', message: 'Signup with Google failed', navigation: '/signup' }));
        }
      }

      return result?.user;
    }

    googleLoginResult();
  }, []);

  return (
    <div className="signup-container">
      <form className="signup-form">
        <div className="form__control">
          <label htmlFor="email">
            Email
            <input type="email" name="email" id="email" onChange={handlerOnChange} />
          </label>
        </div>
        <div className="form__control">
          <label htmlFor="password">
            Password
            <input type="password" name="password" id="password" onChange={handlerOnChange} />
          </label>
        </div>
        <ButtonPrimary isSubmit={false} onClick={handlerGoogleLogin}>
          Sign up with Google
        </ButtonPrimary>
        <ButtonPrimary isSubmit onClick={handlerOnSubmit}>Sign up</ButtonPrimary>
      </form>
    </div>
  );
}
