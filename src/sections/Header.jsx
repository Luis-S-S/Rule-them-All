import { useContext } from 'react';
import { auth } from '../config/firebase';

import { Context } from '../store';
import { clearUser } from '../store/actions';

export default function Header() {
  const { dispatch } = useContext(Context);

  const handlerSignout = () => {
    auth.signOut();
    dispatch(clearUser());
    localStorage.removeItem('userToken');
  };

  return (
    <header>
      <h1>Header JSX</h1>
      <button onClick={handlerSignout} type="button">Cerrar Sesión</button>
    </header>
  );
}
