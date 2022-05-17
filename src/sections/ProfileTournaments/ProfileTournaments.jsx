/* eslint-disable max-len */
import { useState, useEffect, useContext } from 'react';

import { Context } from '../../store';

import { getAllDocs } from '../../services/firestore';

import ProfileTournamentItem from '../../components/ProfileTournamentItem/ProfileTournamentItem';
import './ProfileTournaments.scss';

export default function ProfileInfo() {
  const { state } = useContext(Context);
  const { user } = state;
  const [created, setCreated] = useState([]);
  const [participating, setParticipating] = useState([]);
  const [finished, setFinished] = useState([]);

  const getCreatedTournaments = async () => {
    const allTournaments = await getAllDocs('tournaments');
    const createdTournaments = allTournaments.filter((tournament) => {
      const validationOne = tournament.admin === user?.username;
      return validationOne && tournament.status !== 'finished';
    });
    const participatingTournaments = allTournaments.filter((tournament) => {
      const validationOne = tournament.players.includes(user?.username);
      return validationOne && tournament.status !== 'finished';
    });
    const finishedTournaments = allTournaments.filter((tournament) => {
      const validationOne = (tournament.admin === user?.username || tournament.players.includes(user?.username));
      return validationOne && tournament.status === 'finished';
    });
    setCreated(createdTournaments);
    setParticipating(participatingTournaments);
    setFinished(finishedTournaments);
  };

  useEffect(() => {
    getCreatedTournaments();
  }, [user]);

  return (
    <div className="profile-page__tournaments">
      <h1>Tournaments</h1>
      <div className="profile-tournaments__container">
        <div className="profile-tournaments__list">
          <h2>Created</h2>
          {created?.length > 0
            ? (created.map((tournament) => (
              <ProfileTournamentItem key={tournament?.id} tournament={tournament} type="admin" />
            )))
            : (<h3>Create your first tournament!</h3>)}
        </div>
        <div className="profile-tournaments__list">
          <h2>Participating</h2>
          {participating?.length > 0
            ? (participating.map((tournament) => (
              <ProfileTournamentItem key={tournament?.id} tournament={tournament} type="participant" />
            )))
            : (<h3>Join your first tournament!</h3>)}
        </div>
        <div className="profile-tournaments__list">
          <h2>Finished</h2>
          {finished?.length > 0
            ? (finished.map((tournament) => (
              <ProfileTournamentItem key={tournament?.id} tournament={tournament} type="participant" />
            )))
            : (<h3>No tournaments finished</h3>)}
        </div>
      </div>
    </div>
  );
}
