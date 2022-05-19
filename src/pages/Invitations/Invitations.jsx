import { useState, useEffect, useContext } from 'react';

import { Context } from '../../store';

import { getAllDocsByField } from '../../services/firestore';

import FriendInvites from '../../sections/FriendInvites/FriendInvites';
import TournamentInvites from '../../sections/TournamentInvites/TournamentInvites';

import './Invitations.scss';

export default function Invitations() {
  const { state } = useContext(Context);
  const { user } = state;
  const [friendInvites, setFriendInvites] = useState([]);

  const getFriendInvites = async () => {
    const response = await getAllDocsByField(user?.username, 'friendInvitations', 'usernameTo');
    setFriendInvites(response);
  };

  useEffect(() => {
    if (user) {
      getFriendInvites();
    }
  }, [user]);

  // console.log(friendInvites);
  // console.log(tournamentInvites);

  return (
    <main className="invitations-page">
      <h1>Your Invites</h1>
      <div className="invitations__container">
        <FriendInvites friendInvites={friendInvites} />
        <TournamentInvites />
      </div>
    </main>
  );
}
