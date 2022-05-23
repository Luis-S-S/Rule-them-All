import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { Context } from '../../store';
import { setIntercept, setUser } from '../../store/actions';

import { auth } from '../../config/firebase';
import { forgotPasswordEmail } from '../../services/authentication';
import { getDocById } from '../../services/firestore';

import ButtonPrimary from '../../components/Buttons/ButtonPrimary';
import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton';
import Input from '../../components/Input/Input';
import './Login.scss';

export default function Login() {
  const [form, setForm] = useState({});
  const [emailError, setEmailError] = useState(null);
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const navigate = useNavigate();

  const handlerOnChange = (e) => {
    const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (e.target.name === 'email') {
      const msg = emailRegExp.test(e.target.value) ? null : 'Invalid email';
      setEmailError(msg);
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const loginUser = await getDocById('users', userCredential.user.uid);
      if (!userCredential.user.emailVerified) {
        dispatch(setIntercept({
          title: 'Error',
          message: 'We need to verify your email, please check your inbox or spam folder',
          navigation: '/login',
          buttonMsg: 'Continue',
        }));
      } else {
        localStorage.setItem('userToken', userCredential.user.accessToken);
        dispatch(setUser(loginUser));
        dispatch(setIntercept({
          title: 'Success',
          message: loginUser.username ? 'Login successful' : 'Complete sign up process',
          navigation: loginUser.username ? '/' : '/signup_detail',
          buttonMsg: loginUser.username ? 'Continue' : 'Finish sign up',
        }));
      }
    } catch (error) {
      dispatch(setIntercept({
        title: 'Login unsuccessful',
        message: 'email or password incorrect',
        navigation: '/login',
        buttonMsg: 'Try again',
      }));
    }
  };

  const handleForgotPassword = async () => {
    try {
      await forgotPasswordEmail(form.email);
      dispatch(setIntercept({
        title: 'Success',
        message: 'We have sent you an email with a link to reset your password',
        navigation: '/login',
        buttonMsg: 'Go to login',
      }));
    } catch (error) {
      dispatch(setIntercept({
        title: 'Error',
        message: 'Email not found',
        navigation: '/login',
        buttonMsg: 'Try again',
      }));
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <main className="login-page">
      <div className="login__container">
        <h1 className="login__title">Login</h1>
        <form className="login-form" onSubmit={handlerEmailLogin}>
          <Input type="email" name="email" labelText="Email" onChange={handlerOnChange} error={emailError} dataCy="email" />
          <Input type="password" name="password" labelText="Password" onChange={handlerOnChange} dataCy="password" />
          <ButtonPrimary isSubmit dataCy="login-button">Login</ButtonPrimary>
          <button className="forgot-password__button" type="button" onClick={handleForgotPassword}>
            Forgot password?
          </button>
        </form>
        <GoogleLoginButton isLogin>
          <img src="/icons/google-icon.svg" alt="Google" className="google__icon" />
          Login with Google
        </GoogleLoginButton>
      </div>
    </main>
  );
}
