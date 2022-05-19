import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Context } from '../../store';
import { setValidationIntercept, setIntercept } from '../../store/actions';

import { scheduleHandler } from '../../services/tournaments';
import { getAllDocsByField, deleteDocById } from '../../services/firestore';

import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';

import './DashboardStatus.scss';

export default function DashboardStatus({ tournamentData, onChangeStatus }) {
  const {
    title, type, status, players,
  } = tournamentData;
  const { dispatch } = useContext(Context);
  const { id } = useParams();
  const [statusError, setStatusError] = useState('');

  const handleChangeStatus = (changeObject) => {
    onChangeStatus(changeObject);
  };

  const handleActivate = async (e) => {
    const newStatus = e.target.name;
    if (status === 'Scheduled' && players.length < 2) {
      setStatusError('You need at least 2 players to start a tournament');
    } else {
      setStatusError('');
      const invitations = await getAllDocsByField(title, 'tournamentInvitations', 'tournament');
      invitations.forEach((invitation) => deleteDocById('tournamentInvitations', invitation.id));
      const schedule = scheduleHandler(type, players);
      handleChangeStatus({ status: newStatus, schedule, prospectivePlayers: null });
      dispatch(setIntercept({
        title: 'Status update',
        message: 'You have started the tournament',
        navigation: `/tournament/admin/${id}`,
        buttonMsg: 'Go to dashboard',
      }));
    }
  };

  const validateHandleActivate = (e) => {
    dispatch(setValidationIntercept({
      title: 'Status change',
      message: 'Are you sure you want to start the tournament? You won\'t be able to add any players or undo after this',
      navigationOnCancel: `/tournament/admin/${id}`,
      executableFunction: handleActivate,
      parameters: [e],
    }));
  };

  const handleFinish = (e) => {
    const newStatus = e.target.name;
    handleChangeStatus({ status: newStatus });
    dispatch(setIntercept({
      title: 'Status update',
      message: 'You have marked the tournament as completed',
      navigation: `/standing/${id}`,
      buttonMsg: 'Go to tournament',
    }));
  };

  const validateHandleFinish = (e) => {
    dispatch(setValidationIntercept({
      title: 'Status change',
      message: 'Are you sure you want to mark the tournament as completed? You won\'t be able to undo this',
      navigationOnCancel: `/tournament/admin/${id}`,
      executableFunction: handleFinish,
      parameters: [e],
    }));
  };

  return (
    <div className="dashboard-status__container">
      <h2>{`Status: ${status}`}</h2>
      {status === 'Scheduled' && (<ButtonPrimary isSubmit={false} onClick={validateHandleActivate} name="Active">Start tournament!</ButtonPrimary>)}
      {status === 'Active' && (<ButtonPrimary isSubmit={false} onClick={validateHandleFinish} name="Finished">Finish the tournament!</ButtonPrimary>)}
      {statusError && (<p className="form__error--generic">{statusError}</p>)}
    </div>
  );
}

DashboardStatus.propTypes = {
  tournamentData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    players: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onChangeStatus: PropTypes.func.isRequired,
};
