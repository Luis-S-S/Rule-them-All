import { useState, useEffect, useContext } from 'react';

import { Context } from '../../store';
import { setIntercept } from '../../store/actions';

import { getAllDocsByField, editDocById, deleteDocById } from '../../services/firestore';

import ButtonPrimary from '../../components/Buttons/ButtonPrimary';
import './Invitations.scss';

export default function Invitations() {
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const [tournamentInvites, setTournamentInvites] = useState([]);

  const getTournamentInvites = async () => {
    const response = await getAllDocsByField(user?.id, 'tournamentInvitations', 'player');
    setTournamentInvites(response);
  };

  const handleAcceptInvite = async (e) => {
    const tournamentTitle = e.target.parentElement.parentElement.attributes.name.value;
    const invitationId = e.target.parentElement.parentElement.id;
    const [doc] = await getAllDocsByField(tournamentTitle, 'tournaments', 'title');
    const newProspectives = doc.prospectivePlayers.filter((player) => player !== user?.id);
    if (!doc.players.includes(user?.id)) { doc.players.push(user?.id); }
    await editDocById('tournaments', doc.id, {
      prospectivePlayers: newProspectives,
      players: doc.players,
    });
    await deleteDocById('tournamentInvitations', invitationId);
    dispatch(setIntercept({
      title: 'Invitation Accepted',
      message: `You have accepted the invitation to ${tournamentTitle} tournament`,
      navigation: '/profile',
      buttonMsg: 'Go to Tournaments',
    }));
    setTournamentInvites(tournamentInvites.filter((invite) => invite.id !== invitationId));
  };

  const handleRejectInvite = async (e) => {
    const tournamentTitle = e.target.parentElement.parentElement.attributes.name.value;
    const invitationId = e.target.parentElement.parentElement.id;
    const [doc] = await getAllDocsByField(tournamentTitle, 'tournaments', 'title');
    const newProspectives = doc.prospectivePlayers.filter((player) => player !== user?.id);
    await editDocById('tournaments', doc.id, {
      prospectivePlayers: newProspectives,
    });
    await deleteDocById('tournamentInvitations', invitationId);
    dispatch(setIntercept({
      title: 'Invitation Declined',
      message: `You have declined the invitation to ${tournamentTitle} tournament`,
      navigation: '/profile',
      buttonMsg: 'Go to Tournaments',
    }));
    setTournamentInvites(tournamentInvites.filter((invite) => invite.id !== invitationId));
  };

  useEffect(() => {
    if (user) {
      getTournamentInvites();
    }
  }, [user]);

  return (
    <main className="invitations-page">
      <h1 className="page-title--generic">Tournament Invitations</h1>
      <section className="tournament-invites__container">
        {tournamentInvites?.length > 0
          ? (
            tournamentInvites.map((tournamentInvite) => (
              <div key={tournamentInvite?.id} id={tournamentInvite?.id} name={tournamentInvite?.tournament} className="tournament-invites__invite">
                <div className="invite__header">
                  <h2 className="invite-header__title title--generic">{tournamentInvite?.tournament}</h2>
                  <p className="invite-header__title">
                    <span className="bold--generic">Game:</span>
                    {' '}
                    {tournamentInvite?.tournament}
                  </p>
                </div>
                <div className="invite__buttons">
                  {tournamentInvite?.acceptedInvite
                    ? (
                      <ButtonPrimary isSubmit={false}>Go to tournament</ButtonPrimary>
                    )
                    : (
                      <>
                        <ButtonPrimary isSubmit={false} onClick={handleAcceptInvite}>
                          Accept
                        </ButtonPrimary>
                        <ButtonPrimary isSubmit={false} onClick={handleRejectInvite}>
                          Decline
                        </ButtonPrimary>
                      </>
                    )}
                </div>
              </div>
            ))
          )
          : (<h1>Currently you don&apos;t have any invitations</h1>)}
      </section>
    </main>
  );
}
