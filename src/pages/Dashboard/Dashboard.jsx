import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Context } from '../../store';
import { setIntercept, setValidationIntercept } from '../../store/actions';

import {
  getDocById, editDocById, deleteDocById, getAllDocsByField, listenDocById,
} from '../../services/firestore';

import ButtonWarning from '../../components/Buttons/ButtonWarning';
import CopyToClipboard from '../../components/CopyToClipboard/CopyToClipboard';
import DashboardSchedule from '../../sections/DashboardSchedule/DashboardSchedule';
import DashboardStatus from '../../sections/DashboardStatus/DashboardStatus';
import RemoveableListItem from '../../components/RemoveableListItem/RemoveableListItem';
import './Dashboard.scss';

export default function Dashboard() {
  const [tournament, setTournament] = useState(null);
  const [playersNames, setPlayersNames] = useState([]);
  const [prospectivePlayersNames, setProspectivePlayersNames] = useState([]);
  const [playerAndIdObj, setPlayerAndIdObj] = useState([]);
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const { id } = useParams();
  const validation = {
    notFinished: tournament?.status !== 'Finished',
    isFinished: tournament?.status === 'Finished',
    isActive: tournament?.status === 'Active',
    isScheduled: tournament?.status === 'Scheduled',
  };

  const getTournamentInfo = async () => {
    listenDocById('tournaments', id, setTournament);
  };

  const getPlayersNames = async () => {
    const promises = tournament?.players.map((player) => getDocById('users', player));
    const promisesResponses = await Promise.all(promises);
    const names = promisesResponses.map((response) => response.username);
    const namesAndId = promisesResponses
      .map((response) => ({ username: response.username, id: response.id }));
    setPlayersNames(names);
    setPlayerAndIdObj(namesAndId);
  };

  const getProspectivePlayersNames = async () => {
    const promises = tournament?.prospectivePlayers?.map((prospectivePlayer) => getDocById('users', prospectivePlayer));
    const promisesResponses = await Promise.all(promises);
    const names = promisesResponses.map((response) => response.username);
    setProspectivePlayersNames(names);
  };

  const onChangeStatus = async (changeObject) => {
    setTournament({ ...tournament, ...changeObject });
    await editDocById('tournaments', id, changeObject);
  };

  const onResultUpdate = async (index, result) => {
    const newSchedule = [...tournament.schedule];
    newSchedule[index].resultP1 = result;
    setTournament({ ...tournament, schedule: newSchedule });
    await editDocById('tournaments', id, { schedule: newSchedule });
  };

  const onRemovePlayer = async (playerUsername) => {
    const [response] = await getAllDocsByField(playerUsername, 'users');
    const playerId = response.id;
    const newPlayers = tournament.players.filter((p) => p !== playerId);
    if (newPlayers.length >= 2) {
      let schedule = tournament.schedule ? [...tournament.schedule] : [];
      if (validation.isActive) {
        schedule = schedule
          .filter((round) => (round.player1 !== playerId && round.player2 !== playerId));
      }
      await editDocById('tournaments', id, { players: newPlayers, schedule });
      setTournament({ ...tournament, players: newPlayers, schedule });
      dispatch(setIntercept({
        title: 'Player removed',
        message: `${playerUsername} has been removed from the tournament`,
        navigation: `/tournament/admin/${id}`,
        buttonMsg: 'Continue',
      }));
    } else {
      dispatch(setIntercept({
        title: 'Unable to remove player',
        message: 'The minimum number of players is 2. If you want, you can delete this tournament and start a new one',
        navigation: `/tournament/admin/${id}`,
        buttonMsg: 'Continue',
      }));
    }
  };

  const validateOnRemovePlayer = async (playerUsername) => {
    dispatch(setValidationIntercept({
      title: 'Remove player',
      message: `Are you sure you want to remove ${playerUsername} from the tournament?`,
      navigationOnCancel: `/tournament/admin/${id}`,
      executableFunction: onRemovePlayer,
      parameters: [playerUsername],
    }));
  };

  const onDeleteTournament = async () => {
    const invitations = await getAllDocsByField(tournament?.title, 'tournamentInvitations', 'tournament');
    invitations.forEach((invitation) => deleteDocById('tournamentInvitations', invitation.id));
    await deleteDocById('tournaments', id);
    dispatch(setIntercept({
      title: 'Tournament deleted',
      message: 'The tournament has been deleted',
      navigation: '/profile',
      buttonMsg: 'Go to profile',
    }));
  };

  const validateOnDeleteTournament = async () => {
    dispatch(setValidationIntercept({
      title: 'Delete tournament',
      message: 'Are you sure you want to delete the tournament?',
      navigationOnCancel: `/tournament/admin/${id}`,
      executableFunction: onDeleteTournament,
    }));
  };

  useEffect(() => {
    if (user) {
      getTournamentInfo(user);
    }
  }, [user]);

  useEffect(() => {
    if (tournament) {
      getPlayersNames();
      getProspectivePlayersNames();
    }
  }, [tournament]);

  return (
    <main className="dashboard-page">
      {(tournament && (tournament.admin === user.id))
        ? (
          <div className="dashboard__content">
            <h1 className="page-title--generic">{tournament?.title}</h1>
            <h1 className="title--generic">{tournament?.game}</h1>
            <DashboardStatus
              tournamentData={tournament}
              onChangeStatus={onChangeStatus}
            />
            {(validation.isScheduled && tournament?.isPublic) && (
              <CopyToClipboard
                buttonText="Copy link to clipboard!"
                textToCopy={`https://rulethemall.vercel.app/tournament/join/${id}`}
              />
            )}
            <div className="dasboard__body">
              {(validation.isActive && tournament?.schedule?.length > 0) && (
              <DashboardSchedule
                tournament={tournament}
                playerAndIdObj={playerAndIdObj}
                onResultsChange={onResultUpdate}
              />
              )}
              <div className="dashboard__players">
                <h2 className="dashboard__players__title">Players</h2>
                {playersNames?.length > 0 ? (
                  playersNames?.map((player) => (
                    validation.notFinished
                      ? (
                        <RemoveableListItem
                          key={player}
                          element={player}
                          onRemove={validateOnRemovePlayer}
                        />
                      )
                      : (
                        <div>{player}</div>
                      )
                  ))
                ) : (
                  <h3>No player has accepted invitations yet</h3>
                )}
              </div>
              {(validation.isScheduled && !tournament?.isPublic) && (
              <div className="dashboard__players">
                <h2 className="dashboard__players__title">Prospective Players</h2>
                {prospectivePlayersNames?.length > 0 ? (
                  prospectivePlayersNames?.map((player) => <div>{player}</div>)
                ) : (
                  <h3>No prospective players at the time</h3>
                )}
              </div>
              )}
            </div>
            {validation.notFinished && (
              <ButtonWarning isSubmit={false} onClick={validateOnDeleteTournament}>
                Delete Tournament
              </ButtonWarning>
            )}
          </div>
        )
        : (
          <div className="dashboard-page__error">
            <h1 className="dashboard__error">Not authorized</h1>
          </div>
        )}
    </main>
  );
}
