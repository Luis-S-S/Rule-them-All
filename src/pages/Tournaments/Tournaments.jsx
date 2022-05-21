import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Context } from '../../store';

import { listenAllDocs } from '../../services/firestore';

import TournamentListItem from '../../components/TournamentListItem/TournamentListItem';
import './Tournaments.scss';

export default function Tournaments() {
  const [openTournaments, setOpenTournaments] = useState([]);
  const [availableTournaments, setAvailableTournaments] = useState([]);
  const [privateTournaments, setPrivateTournaments] = useState([]);
  const { state } = useContext(Context);
  const { user } = state;

  useEffect(() => {
    listenAllDocs('tournaments', 'isPublic', '==', true, setOpenTournaments);
    listenAllDocs('tournaments', 'isPublic', '==', false, setPrivateTournaments);
  }, []);

  useEffect(() => {
    if (openTournaments.length) {
      setAvailableTournaments(openTournaments.filter((tournament) => tournament.schedule === 'Scheduled'));
    }
  }, [openTournaments]);

  return (
    <main className="tournaments-page">
      <h1 className="page-title--generic">Welcome to the Arena!</h1>
      {user?.username && (
        <div className="tournament-create__container">
          <Link className="tournament__create-link" to="/create_tournament">
            <img className="tournament__create-icon" src="/icons/hammer-icon-white.svg" alt="Create tournament" />
          </Link>
          <h4>Create a Tournament!</h4>
        </div>
      )}
      <section className="tournaments-page__container">
        <div className="tournament-list__container">
          <h2 className="title--generic">Join a tournament!</h2>
          {availableTournaments.length ? (
            availableTournaments.map((tournament) => <TournamentListItem tournament={tournament} />)
          ) : (
            <h2 className="title--generic">No open tournaments</h2>
          )}
        </div>
        <div className="tournament-list__container">
          <h2 className="title--generic">Watch tournament results</h2>
          {privateTournaments.length ? (
            privateTournaments.map((tournament) => <TournamentListItem tournament={tournament} />)
          ) : (
            <h2 className="title--generic">No tournaments to track</h2>
          )}
        </div>
      </section>
    </main>
  );
}
