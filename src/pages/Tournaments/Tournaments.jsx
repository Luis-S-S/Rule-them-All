import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../store';
import './Tournaments.scss';

export default function Tournaments() {
  const { state } = useContext(Context);
  const { user } = state;
  return (
    <div className="tournaments-page">
      <h1 className="page-title--generic">Welcome to the Arena!</h1>
      {user?.username && (
        <div className="tournament-create__container">
          <Link className="tournament__create-link" to="/create_tournament">
            <img className="tournament__create-icon" src="/icons/hammer-icon-white.svg" alt="Create tournament" />
          </Link>
          <h4>Create a Tournament!</h4>
        </div>
      )}
      <section className="tournaments-page__container">All tournaments</section>
    </div>
  );
}
