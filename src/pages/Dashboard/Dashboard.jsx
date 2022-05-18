import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Context } from '../../store';
import { setIntercept } from '../../store/actions';

import {
  getDocById, editDocById, deleteDocById, getAllDocsByField,
} from '../../services/firestore';

import DashboardStatus from '../../sections/DashboardStatus/DashboardStatus';
import DashboardSchedule from '../../sections/DashboardSchedule/DashboardSchedule';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import RemoveableListItem from '../../components/RemoveableListItem/RemoveableListItem';
import './Dashboard.scss';

export default function Dashboard() {
  const [tournament, setTournament] = useState(null);
  const [playersNames, setPlayersNames] = useState([]);
  const [playerAndIdObj, setPlayerAndIdObj] = useState([]);
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const { id } = useParams();

  // emit realtime updates

  const getTournamentInfo = async () => {
    const response = await getDocById('tournaments', id);
    if (response.admin === user?.id) {
      setTournament(response);
    }
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
    await editDocById('tournaments', id, { players: newPlayers });
    setTournament({ ...tournament, players: newPlayers });
    dispatch(setIntercept({
      title: 'Player removed',
      message: `${playerUsername} has been removed from the tournament`,
      navigation: `/tournament/admin/${id}`,
      buttonMsg: 'Continue',
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

  useEffect(() => {
    if (user) {
      getTournamentInfo(user);
    }
  }, [user]);

  useEffect(() => {
    if (tournament) {
      getPlayersNames();
    }
  }, [tournament]);

  return (
    <div className="dashboard-page">
      {tournament
        ? (
          <div className="dashboard__content">
            <h1>{tournament?.title}</h1>
            <DashboardStatus
              tournamentData={tournament}
              onChangeStatus={onChangeStatus}
            />
            {(tournament?.schedule?.length > 0 && tournament?.status === 'Active') && (
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
                  <RemoveableListItem key={player} element={player} onRemove={onRemovePlayer} />
                ))
              ) : (
                <h3>No player has accepted invitations yet</h3>
              )}
            </div>
            {tournament?.status !== 'Finished' && (
              <ButtonPrimary isSubmit={false} onClick={onDeleteTournament}>
                Delete Tournament
              </ButtonPrimary>
            )}
          </div>
        )
        : (<h1>Not authorized</h1>)}
    </div>
  );
}
