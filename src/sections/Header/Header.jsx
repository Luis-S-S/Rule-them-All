import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../config/firebase';

import { Context } from '../../store';
import { clearUser, setIntercept } from '../../store/actions';

import { editDocById } from '../../services/firestore';

import './Header.scss';

export default function Header() {
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const handlerSignout = () => {
    auth.signOut();
    localStorage.removeItem('userToken');
    dispatch(clearUser());
    dispatch(setIntercept({
      title: 'Logging out',
      message: 'You have been signed out securely from your account',
      navigation: '/',
      buttonMsg: 'Acknowledge',
    }));
  };

  const handlerCollapsableMenu = () => {
    const $sideMenu = document.querySelector('.collapse__menu');
    $sideMenu.classList.toggle('active');
  };

  document.addEventListener('click', (e) => {
    const $sideMenu = document.querySelector('.collapse__menu');
    const $toggleButton = document.querySelector('[data-toggle-button]');
    const $toggleImage = document.querySelector('[data-toggle-image]');
    if (e.target !== $toggleButton && e.target !== $toggleImage && e.target !== $sideMenu) {
      $sideMenu.classList.remove('active');
    }
  });

  const handleWatchInvites = async () => {
    await editDocById('users', user.id, { lastInviteChecked: Date.now() });
  };

  return (
    <header className="header__container">
      <div className="header__left">
        <button className="button__transparent--generic" type="button" onClick={handlerCollapsableMenu} data-toggle-button>
          <img className="header__menu" src="/icons/burguer-menu-icon.svg" alt="Menu" data-toggle-image />
        </button>
        <ul className="collapse__menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/tournaments">Tournaments</Link></li>
          {(user && !user?.username) && (<li><Link to="/signup_detail">Complete sign up</Link></li>)}
          {user?.username && (<li><Link to="/profile">Profile</Link></li>)}
          {user?.username && (<li><Link onClick={handleWatchInvites} to="/invitations">Invitations</Link></li>)}
          <li><a href="https://github.com/Luis-S-S" target="_blank" rel="noreferrer">Creator</a></li>
        </ul>
      </div>
      <div className="header__logo-container">
        <Link to="/">
          <img className="header__logo" src="/logos/logo-dark--colored.png" alt="Logo" />
        </Link>
      </div>
      <div className="header__right">
        {
          !user
            ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Join Us</Link>
              </>
            )
            : (<button type="button" onClick={handlerSignout}>Sign out</button>)
        }
      </div>
    </header>
  );
}
