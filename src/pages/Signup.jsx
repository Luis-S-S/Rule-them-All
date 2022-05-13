import { useState } from 'react';
import { createAuthWithEmailAndPassword } from '../services/authentication';

import ButtonPrimary from '../components/ButtonPrimary/ButtonPrimary';

export default function SignUp() {
  const [form, setForm] = useState({});

  const handlerOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const res = await createAuthWithEmailAndPassword(form.email, form.password);
    localStorage.setItem('token', res.user.accessToken);
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
        <ButtonPrimary isSubmit onClick={handlerSubmit}>Sign up</ButtonPrimary>
      </form>
    </div>
  );
}
