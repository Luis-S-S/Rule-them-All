import { useState, useEffect, useContext } from 'react';

import { Context } from '../../store';
import { setIntercept } from '../../store/actions';

import { getAllDocsByField, editDocById, deleteDocById } from '../../services/firestore';

import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import './TournamentInvites.scss';

export default function TournamentInvites() {
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const [tournamentInvites, setTournamentInvites] = useState([]);

  const getTournamentInvites = async () => {
    const response = await getAllDocsByField(user?.username, 'tournamentInvitations', 'player');
    setTournamentInvites(response);
  };

  const handleAcceptInvite = async (e) => {
    const tournamentTitle = e.target.parentElement.attributes.name.value;
    const invitationId = e.target.parentElement.id;
    const [doc] = await getAllDocsByField(tournamentTitle, 'tournaments', 'title');
    const newProspectives = doc.prospectivePlayers.filter((player) => player !== user?.username);
    doc.players.push(user?.username);
    await editDocById('tournaments', doc.id, {
      prospectivePlayers: newProspectives,
      players: doc.players,
    });
    await deleteDocById('tournamentInvitations', invitationId);
    dispatch(setIntercept({
      title: 'Invitation Accepted',
      message: `You have accepted the invitation to ${tournamentTitle} tournament`,
      navigation: '/invitations',
      buttonMsg: 'Go to Tournaments',
    }));
    setTournamentInvites(tournamentInvites.filter((invite) => invite.id !== invitationId));
  };

  const handleRejectInvite = async (e) => {
    const tournamentTitle = e.target.parentElement.attributes.name.value;
    const invitationId = e.target.parentElement.id;
    const [doc] = await getAllDocsByField(tournamentTitle, 'tournaments', 'title');
    const newProspectives = doc.prospectivePlayers.filter((player) => player !== user?.username);
    await editDocById('tournaments', doc.id, {
      prospectivePlayers: newProspectives,
    });
    await deleteDocById('tournamentInvitations', invitationId);
    dispatch(setIntercept({
      title: 'Invitation Declined',
      message: `You have declined the invitation to ${tournamentTitle} tournament`,
      navigation: '/invitations',
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
    <section className="tournament-invites__container">
      <h1>Tournament Invitations</h1>
      {tournamentInvites?.length > 0
        ? (
          tournamentInvites.map((tournamentInvite) => (
            <div key={tournamentInvite?.id} id={tournamentInvite?.id} name={tournamentInvite?.tournament} className="tournament-invites__invite">
              <p>{`Torneo: ${tournamentInvite?.tournament}`}</p>
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

          ))
        )
        : (<h1>Currently you don&apos;t have any invitations</h1>)}
    </section>
  );
}
