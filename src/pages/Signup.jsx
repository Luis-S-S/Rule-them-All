import { useState, useContext } from 'react';

import { Context } from '../store';
import { setIntercept } from '../store/actions';

import { isSignupComplete } from '../services/firestore';
import { createDocOnEmailSignup } from '../services/authentication';

import ButtonPrimary from '../components/ButtonPrimary/ButtonPrimary';
import GoogleLoginButton from '../components/GoogleLoginButton/GoogleLoginButton';

export default function SignUp() {
  const { dispatch } = useContext(Context);
  const [form, setForm] = useState({});

  const handlerOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerEmailSignup = async (e) => {
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
        <ButtonPrimary isSubmit onClick={handlerEmailSignup}>Sign up</ButtonPrimary>
      </form>
      <GoogleLoginButton>Sign up with Google</GoogleLoginButton>
    </div>
  );
}
