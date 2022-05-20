import { useState, useContext } from 'react';

import { Context } from '../../store';
import { setIntercept } from '../../store/actions';

import { createDocOnEmailSignup } from '../../services/authentication';

import ButtonPrimary from '../../components/Buttons/ButtonPrimary';
import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton';
import Input from '../../components/Input/Input';
import './Signup.scss';

export default function SignUp() {
  const { dispatch } = useContext(Context);
  const [form, setForm] = useState({});
  const [emailErr, setEmailErr] = useState(null);
  const [passwordErr, setPasswordErr] = useState(null);
  const [confirmErr, setConfirmErr] = useState(null);
  const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handlerOnChange = (e) => {
    if (e.target.name === 'email') {
      const msg = emailRegExp.test(e.target.value) ? null : 'Invalid email';
      setEmailErr(msg);
    }
    if (e.target.name === 'password') {
      const msg = e.target.value.length < 6 ? 'Password must be at least 6 characters' : null;
      setPasswordErr(msg);
    }
    if (e.target.name === 'confirmPassword') {
      const msg = e.target.value !== form.password ? 'Password does not match' : null;
      setConfirmErr(msg);
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerEmailSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      dispatch(setIntercept({
        title: 'Error', message: 'Passwords did not match, try again', navigation: '/signup', buttonMsg: 'Try again',
      }));
      return null;
    }
    try {
      await createDocOnEmailSignup(form.email, form.password);
      dispatch(setIntercept({
        title: 'Success',
        message: 'Sign up successful, please check your inbox or spam folder to verify your email',
        navigation: '/login',
        buttonMsg: 'Continue',
      }));
    } catch (error) {
      let errorMsg;
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMsg = 'Email already in use';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Invalid email';
          break;
        case 'auth/weak-password':
          errorMsg = 'Password must be at least 6 characters';
          break;
        default:
          errorMsg = 'Something went wrong';
          break;
      }
      dispatch(setIntercept({
        title: 'An error ocurred', message: errorMsg, navigation: '/signup', buttonMsg: 'Try again',
      }));
    }
    return null;
  };

  return (
    <main className="signup-page">
      <div className="signup__container">
        <h1 className="signup__title">Sign up</h1>
        <form className="signup-form" onSubmit={handlerEmailSignup}>
          <Input type="text" name="email" labelText="Email" onChange={handlerOnChange} error={emailErr} />
          <Input type="password" name="password" labelText="Password" onChange={handlerOnChange} error={passwordErr} />
          <Input type="password" name="confirmPassword" labelText="Confirm Password" onChange={handlerOnChange} error={confirmErr} />
          <ButtonPrimary isSubmit>Sign up</ButtonPrimary>
        </form>
        <GoogleLoginButton isLogin={false}>
          <img src="/icons/google-icon.svg" alt="Google" className="google__icon" />
          Sign up with Google
        </GoogleLoginButton>
      </div>
    </main>
  );
}
