import { useContext, useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import PropTypes from 'prop-types';

import { Context } from '../../store';
import { setIntercept } from '../../store/actions';

import { auth } from '../../config/firebase';
import { googleLoginWithRedirect } from '../../services/authentication';
import { createDocWithId, isSignupComplete, getDocById } from '../../services/firestore';

import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';

export default function GoogleLoginButton({ children }) {
  const { dispatch } = useContext(Context);

  useEffect(() => {
    async function googleLoginResult() {
      const result = await getRedirectResult(auth);
      if (result) {
        try {
          const docExists = await getDocById('users', result?.user.uid);
          if (!docExists) {
            await createDocWithId({ email: result?.user.email }, 'users', result?.user.uid);
          }
          localStorage.setItem('userToken', result?.user.accessToken);
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
    <ButtonPrimary isSubmit={false} onClick={googleLoginWithRedirect}>
      {children}
    </ButtonPrimary>
  );
}

GoogleLoginButton.propTypes = {
  children: PropTypes.node.isRequired,
};
