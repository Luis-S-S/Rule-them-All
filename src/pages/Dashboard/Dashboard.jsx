import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Context } from '../../store';
import { setIntercept } from '../../store/actions';

import { getDocById, editDocById, deleteDocById } from '../../services/firestore';

import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import DashboardStatus from '../../sections/DashboardStatus/DashboardStatus';
import RemoveableListItem from '../../components/RemoveableListItem/RemoveableListItem';
import './Dashboard.scss';

export default function Dashboard() {
  const [tournament, setTournament] = useState(null);
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const { id } = useParams();

  // emit realtime updates

  const getTournamentInfo = async () => {
    const response = await getDocById('tournaments', id);
    if (response.admin === user?.username) {
      setTournament(response);
    }
  };

  const onChangeStatus = async (changeObject) => {
    setTournament({ ...tournament, ...changeObject });
    await editDocById('tournaments', id, changeObject);
  };

  const onRemovePlayer = async (player) => {
    const newPlayers = tournament.players.filter((p) => p !== player);
    await editDocById('tournaments', id, { players: newPlayers });
    setTournament({ ...tournament, players: newPlayers });
    dispatch(setIntercept({
      title: 'Player removed',
      message: `${player} has been removed from the tournament`,
      navigation: `/tournament/admin/${id}`,
      buttonMsg: 'Continue',
    }));
  };

  const onDeleteTournament = async () => {
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

  return (
    <div className="dashboard-page">
      {tournament
        ? (
          <div className="dashboard__content">
            <h1>{tournament?.title}</h1>
            <DashboardStatus
              type={tournament?.type}
              status={tournament?.status}
              players={tournament?.players}
              onChangeStatus={onChangeStatus}
            />
            <div className="dashboard__players">
              <h2 className="dashboard__players__title">Players</h2>
              {tournament?.players.length > 0 ? (
                tournament?.players.map((player) => (
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
