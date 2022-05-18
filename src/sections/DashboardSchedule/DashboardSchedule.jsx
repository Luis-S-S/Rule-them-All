/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';

import './DashboardSchedule.scss';

export default function DashboardSchedule({ schedule, playerAndIdObj }) {
  const retrieveUsername = (id) => {
    if (playerAndIdObj.length > 0) {
      const player = playerAndIdObj.find((p) => p.id === id);
      return player.username;
    } return null;
  };
  return (
    <div>
      {schedule.map((round, index) => (
        <div key={index}>
          <h2>{`Game ${index + 1}`}</h2>
          <p>{`${retrieveUsername(round.player1)} vs ${retrieveUsername(round.player2)}`}</p>
          <p>{`Result Player 1: ${round.resultP1}`}</p>
        </div>
      ))}
    </div>
  );
}

const round = PropTypes.shape({
  player1: PropTypes.string.isRequired,
  player2: PropTypes.string.isRequired,
  resultP1: PropTypes.string.isRequired,
});

const nameAndId = PropTypes.shape({
  username: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
});

DashboardSchedule.propTypes = {
  schedule: PropTypes.arrayOf(round).isRequired,
  playerAndIdObj: PropTypes.arrayOf(nameAndId).isRequired,
};
