import { useContext, useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import PropTypes from 'prop-types';

import { Context } from '../../store';
import { setIntercept, setUser } from '../../store/actions';

import { auth } from '../../config/firebase';
import { googleLoginWithRedirect } from '../../services/authentication';
import { createDocWithId, getDocById } from '../../services/firestore';

import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';

export default function GoogleLoginButton({ children, isLogin }) {
  const defaultAvatar = 'https://res.cloudinary.com/dt7ptke8d/image/upload/c_scale,w_150/v1652478967/logo-light--bw_virbfz.png';
  const { dispatch } = useContext(Context);
  const messageType = isLogin ? 'Login' : 'Sign up';

  useEffect(() => {
    async function googleLoginResult() {
      const userCredential = await getRedirectResult(auth);
      if (userCredential) {
        try {
          let userDoc = await getDocById('users', userCredential?.user.uid);
          if (!userDoc) {
            await createDocWithId('users', userCredential?.user.uid, { email: userCredential?.user.email, avatar: defaultAvatar });
            userDoc = await getDocById('users', userCredential?.user.uid);
          }
          localStorage.setItem('userToken', userCredential?.user.accessToken);
          dispatch(setUser(userDoc));
          dispatch(setIntercept({
            title: 'Success',
            message: `${messageType} with Google successful`,
            navigation: userDoc.username ? '/' : '/signup_detail',
            buttonMsg: userDoc.username ? 'Continue' : 'Finish sign up',
          }));
        } catch (error) {
          dispatch(setIntercept({
            title: 'Error', message: `${messageType} with Google failed`, navigation: '/signup', buttonMsg: 'Try again',
          }));
        }
      }
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
  isLogin: PropTypes.bool.isRequired,
};
