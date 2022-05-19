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

  const getMyTournaments = async (userData) => {
    const allTournaments = await getAllDocs('tournaments');
    const createdTournaments = allTournaments.filter((tournament) => {
      const validationOne = tournament.admin === userData.id;
      return validationOne && tournament.status !== 'Finished';
    });
    const participatingTournaments = allTournaments.filter((tournament) => {
      const validationOne = tournament.players?.includes(userData.id);
      return validationOne && tournament.status !== 'Finished';
    });
    const finishedTournaments = allTournaments.filter((tournament) => {
      const validationOne = (tournament.admin === userData.id || tournament.players?.includes(userData.id));
      return validationOne && tournament.status === 'Finished';
    });
    setCreated(createdTournaments);
    setParticipating(participatingTournaments);
    setFinished(finishedTournaments);
  };

  useEffect(() => {
    if (user) {
      getMyTournaments(user);
    }
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
            : (<h3 className="profile-tournament__error">Create your first tournament!</h3>)}
        </div>
        <div className="profile-tournaments__list">
          <h2>Participating</h2>
          {participating?.length > 0
            ? (participating.map((tournament) => (
              <ProfileTournamentItem key={tournament?.id} tournament={tournament} type="participant" />
            )))
            : (<h3 className="profile-tournament__error">Join your first tournament!</h3>)}
        </div>
        <div className="profile-tournaments__list">
          <h2>Finished</h2>
          {finished?.length > 0
            ? (finished.map((tournament) => (
              <ProfileTournamentItem key={tournament?.id} tournament={tournament} type="participant" />
            )))
            : (<h3 className="profile-tournament__error">No tournaments finished</h3>)}
        </div>
      </div>
    </div>
  );
}
