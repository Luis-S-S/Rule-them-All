import { useState, useContext } from 'react';

import { Context } from '../store';
import { setIntercept } from '../store/actions';

import { createDocOnEmailSignup } from '../services/authentication';

import ButtonPrimary from '../components/ButtonPrimary/ButtonPrimary';
import GoogleLoginButton from '../components/GoogleLoginButton/GoogleLoginButton';
import Input from '../components/Input/Input';

export default function SignUp() {
  const { dispatch } = useContext(Context);
  const [form, setForm] = useState({});

  const handlerOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerEmailSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      dispatch(setIntercept({
        title: 'Error', message: 'Password and confirm password are the same', navigation: '/signup', buttonMsg: 'Try again',
      }));
      return null;
    }
    const user = await createDocOnEmailSignup(form.email, form.password);
    if (user.accessToken) {
      dispatch(setIntercept({
        title: 'Success',
        message: 'Sign up successful, please check your inbox or spam folder to verify your email',
        navigation: '/login',
        buttonMsg: 'Continue',
      }));
    } else {
      dispatch(setIntercept({
        title: 'Error', message: 'Sign up failed', navigation: '/signup', buttonMsg: 'Try again',
      }));
    }
    return null;
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handlerEmailSignup}>
        <Input type="email" name="email" labelText="Email" onChange={handlerOnChange} />
        <Input type="password" name="password" labelText="Password" onChange={handlerOnChange} />
        <Input type="password" name="confirmPassword" labelText="Confirm Password" onChange={handlerOnChange} />
        <ButtonPrimary isSubmit>Sign up</ButtonPrimary>
      </form>
      <GoogleLoginButton isLogin={false}>Sign up with Google</GoogleLoginButton>
    </div>
  );
}
