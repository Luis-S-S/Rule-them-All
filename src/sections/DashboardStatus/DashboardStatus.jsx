import { useState } from 'react';
import PropTypes from 'prop-types';

import { scheduleHandler } from '../../services/tournaments';

import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';

import './DashboardStatus.scss';

export default function DashboardStatus({
  type, status, players, onChangeStatus,
}) {
  const [statusError, setStatusError] = useState('');

  const handleChangeStatus = (changeObject) => {
    onChangeStatus(changeObject);
  };

  const handleActivate = (e) => {
    const newStatus = e.target.name;
    if (status === 'Scheduled' && players.length < 2) {
      setStatusError('You need at least 2 players to start a tournament');
    } else {
      setStatusError('');
      const schedule = scheduleHandler(type, players);
      handleChangeStatus({ status: newStatus, schedule });
    }
  };

  const handleFinish = (e) => {
    const newStatus = e.target.name;
    handleChangeStatus({ status: newStatus });
  };

  return (
    <div className="dashboard-status__container">
      <h2>{`Status: ${status}`}</h2>
      {status === 'Scheduled'
        ? (<ButtonPrimary isSubmit={false} onClick={handleActivate} name="Active">Start tournament!</ButtonPrimary>)
        : (<ButtonPrimary isSubmit={false} onClick={handleFinish} name="Finished">Finish tournament!</ButtonPrimary>)}
      {statusError && (<p className="form__error--generic">{statusError}</p>)}
    </div>
  );
}

DashboardStatus.propTypes = {
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChangeStatus: PropTypes.func.isRequired,
};
