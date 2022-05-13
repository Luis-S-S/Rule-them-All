import { useState, useContext, useEffect } from 'react';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { Context } from '../store';
import { setIntercept } from '../store/actions';
import { createAuthWithEmailAndPassword } from '../services/authentication';
import { auth, googleProvider } from '../services/googleAuth';
import { createDoc } from '../services/firestore';

import ButtonPrimary from '../components/ButtonPrimary/ButtonPrimary';

export default function SignUp() {
  const { dispatch } = useContext(Context);
  const [form, setForm] = useState({});

  const handlerOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerGoogleLogin = async () => {
    await signInWithRedirect(auth, googleProvider);
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const res = await createAuthWithEmailAndPassword(form.email, form.password);
    if (!res.accessToken) {
      const payload = {
        title: 'Error',
        message: 'Invalid email or password',
        navigation: '/signup',
      };
      dispatch(setIntercept(payload));
    } else {
      const payload = {
        title: 'Success',
        message: 'You have successfully signed up',
        navigation: '/signup_detail',
      };
      localStorage.setItem('user', res.accessToken);
      dispatch(setIntercept(payload));
    }
  };

  useEffect(() => {
    async function googleLoginResult() {
      const response = await getRedirectResult(auth);
      console.log(response?.user);
      if (response?.user) {
        await createDoc({ email: response.user.email }, 'users', response.user.uid);
      }
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
        <ButtonPrimary isSubmit onClick={handlerSubmit}>Sign up</ButtonPrimary>
      </form>
    </div>
  );
}
