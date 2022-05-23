import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Context } from '../../store';
import { setIntercept, setValidationIntercept } from '../../store/actions';

import { getDocById, editDocById } from '../../services/firestore';

import ButtonPrimary from '../../components/Buttons/ButtonPrimary';
import LinkPrimary from '../../components/LinkPrimary/LinkPrimary';
import './JoinTournament.scss';

export default function JoinTournament() {
  const [tournament, setTournament] = useState(null);
  const { id } = useParams();
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const getTournamentInfo = async (tournamentId) => {
    const response = await getDocById('tournaments', tournamentId);
    setTournament(response);
  };

  const joinTournament = async (tournamentInfo) => {
    let newPlayers = [];
    if (tournamentInfo.players) {
      if (tournamentInfo.status !== 'Scheduled') {
        dispatch(setIntercept({
          title: 'Unable to join',
          message: 'Tournament has already started',
          navigation: '/profile',
          buttonMsg: 'Go to profile',
        }));
        return;
      }
      if (tournamentInfo.players.includes(user.id)) {
        dispatch(setIntercept({
          title: 'Unable to join',
          message: 'You are already in this tournament',
          navigation: '/profile',
          buttonMsg: 'Go to profile',
        }));
        return;
      }
      if (tournamentInfo.players.length >= tournamentInfo.maxPlayers) {
        dispatch(setIntercept({
          title: 'Unable to join',
          message: 'This tournament is full',
          navigation: '/profile',
          buttonMsg: 'Go to profile',
        }));
        return;
      }
      newPlayers = [...tournamentInfo.players, user.id];
    } else {
      newPlayers.push(user.id);
    }
    await editDocById('tournaments', tournamentInfo.id, { players: newPlayers });
    dispatch(setIntercept({
      title: 'Success',
      message: 'You have successfully joined the tournament',
      navigationOnCancel: `/tournament/join/${id}`,
      buttonMsg: 'Continue',
    }));
  };

  const validateJoinTournament = (params) => {
    dispatch(setValidationIntercept({
      title: 'Are you sure?',
      message: 'Once you join the tournament, only the tournament admin can remove you from the tournament',
      navigationOnCancel: '/profile',
      executableFunction: joinTournament,
      parameters: [params],
    }));
  };

  useEffect(() => {
    getTournamentInfo(id);
  }, [user]);

  return (
    <main className="join-tournament-page">
      <div className="join-tournament__container">
        <h1 className="join-tournament__title">Join Tournament</h1>
        {(!user) && (
        <>
          <p>You have to Login in order to join the tournament</p>
          <LinkPrimary path="/login">Login</LinkPrimary>
        </>
        )}
        {(user && !tournament) && (
        <h2>No tournament found! Please verify the invitation link and try again</h2>
        )}
        {(user && tournament && tournament?.maxPlayers <= tournament?.players.length) && (
        <h2>The tournament is already full! Better luck next time!</h2>
        )}
        {(user && tournament && tournament?.maxPlayers > tournament?.players.length)
          && (
            <>
              <h3 className="tournament-item__title">{tournament?.title}</h3>
              <p>{`Type of tournament: ${tournament?.type}`}</p>
              <p>{`Tournament status: ${tournament?.status}`}</p>
              <div className="join-tournament__buttons">
                <LinkPrimary path="/">Go home</LinkPrimary>
                <ButtonPrimary
                  isSubmit={false}
                  onClick={() => { validateJoinTournament(tournament); }}
                  dataCy="join-tournament-button"
                >
                  Join
                </ButtonPrimary>
              </div>
            </>
          )}
      </div>
    </main>
  );
}
