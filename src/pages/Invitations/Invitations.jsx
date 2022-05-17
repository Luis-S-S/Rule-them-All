import { useState, useEffect, useContext } from 'react';

import { Context } from '../../store';

import { getAllDocsByUsername } from '../../services/firestore';

import FriendInvites from '../../sections/FriendInvites/FriendInvites';
import TournamentInvites from '../../sections/TournamentInvites/TournamentInvites';

import './Invitations.scss';

export default function Invitations() {
  const { state } = useContext(Context);
  const { user } = state;
  const [friendInvites, setFriendInvites] = useState([]);
  const [tournamentInvites, setTournamentInvites] = useState([]);

  const getFriendInvites = async () => {
    const response = await getAllDocsByUsername('friendInvitations', user?.username, 'usernameTo');
    setFriendInvites(response);
  };

  const getTournamentInvites = async () => {
    const response = await getAllDocsByUsername('tournamentInvitations', user?.username, 'player');
    setTournamentInvites(response);
  };

  useEffect(() => {
    getFriendInvites();
    getTournamentInvites();
  }, [user]);

  return (
    <main className="invitations-page">
      <h1>Your Invites</h1>
      <div className="invitations__container">
        <FriendInvites friendInvites={friendInvites} />
        <TournamentInvites tournamentInvites={tournamentInvites} />
      </div>
    </main>
  );
}
