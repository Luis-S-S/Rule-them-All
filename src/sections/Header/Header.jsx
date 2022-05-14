import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../config/firebase';

import { Context } from '../../store';
import { clearUser } from '../../store/actions';

import './Header.scss';

export default function Header() {
  const { dispatch } = useContext(Context);

  const handlerSignout = () => {
    auth.signOut();
    dispatch(clearUser());
    localStorage.removeItem('userToken');
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

  return (
    <header className="header__container">
      <div className="header__left">
        <button className="r-button--transparent" type="button" onClick={handlerCollapsableMenu} data-toggle-button>
          <img className="header__menu" src="/icons/burguer-menu-icon.svg" alt="Menu" data-toggle-image />
        </button>
        <ul className="collapse__menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>
      <div className="header__logo-container">
        <Link to="/">
          <img className="header__logo" src="/logos/logo-dark--colored.png" alt="Logo" />
        </Link>
      </div>
      <div className="header__right">
        <Link to="/login">Login</Link>
      </div>
      {2 === 3 && (<button type="button" onClick={handlerSignout}>Sign out</button>)}
    </header>
  );
}
