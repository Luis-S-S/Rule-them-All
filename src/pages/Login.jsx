import { useState, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { Context } from '../store';
import { setIntercept, setUser } from '../store/actions';

import { auth } from '../config/firebase';
import { getDocById } from '../services/firestore';

import ButtonPrimary from '../components/ButtonPrimary/ButtonPrimary';
import GoogleLoginButton from '../components/GoogleLoginButton/GoogleLoginButton';
import Input from '../components/Input/Input';

export default function Login() {
  const [form, setForm] = useState({});
  const { dispatch } = useContext(Context);

  const handlerOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = await getDocById('users', userCredential.user.uid);
      if (!userCredential.user.emailVerified) {
        dispatch(setIntercept({
          title: 'Error',
          message: 'We need to verify your email, please check your inbox or spam folder',
          navigation: '/login',
          buttonMsg: 'Continue',
        }));
      } else {
        localStorage.setItem('userToken', userCredential.user.accessToken);
        dispatch(setUser(user));
        dispatch(setIntercept({
          title: 'Success',
          message: user.username ? 'Login successful' : 'Complete sign up process',
          navigation: user.username ? '/' : '/signup_detail',
          buttonMsg: user.username ? 'Continue' : 'Finish sign up',
        }));
      }
    } catch (error) {
      dispatch(setIntercept({
        title: 'Error', message: 'Login failed', navigation: '/login', buttonMsg: 'Try again',
      }));
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handlerEmailLogin}>
        <Input type="email" name="email" labelText="Email" onChange={handlerOnChange} />
        <Input type="password" name="password" labelText="Password" onChange={handlerOnChange} />
        <ButtonPrimary isSubmit>Login</ButtonPrimary>
      </form>
      <GoogleLoginButton isLogin>Login with Google</GoogleLoginButton>
    </div>
  );
}
