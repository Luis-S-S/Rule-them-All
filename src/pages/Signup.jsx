import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAuthWithEmailAndPassword } from '../services/authentication';

import ButtonPrimary from '../components/ButtonPrimary/ButtonPrimary';

export default function SignUp() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handlerOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const res = await createAuthWithEmailAndPassword(form.email, form.password);
    if (!res.accessToken) {
      // Show error
      console.log(res);
    } else {
      // Show success
      navigate('/');
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
        <ButtonPrimary isSubmit onClick={handlerSubmit}>Sign up</ButtonPrimary>
      </form>
    </div>
  );
}
