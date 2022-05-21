import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getDocById } from '../../services/firestore';

import './Table.scss';

export default function TablePoint({ tournament }) {
  const [rows, setRows] = useState([]);

  const getRowDetails = (userId, schedule, pointSystem) => {
    const row = {
      player: userId,
      p: 0,
      w: 0,
      t: 0,
      l: 0,
      points: 0,
    };

    schedule.forEach((game) => {
      if (game.resultP1 === 'TBD') return;
      if (game.player1 === userId) {
        if (game.resultP1 === 'Win') {
          row.p += 1;
          row.w += 1;
        }
        if (game.resultP1 === 'Loss') {
          row.p += 1;
          row.l += 1;
        }
        if (game.resultP1 === 'Tie') {
          row.p += 1;
          row.t += 1;
        }
      }
      if (game.player2 === userId) {
        if (game.resultP1 === 'Win') {
          row.p += 1;
          row.l += 1;
        }
        if (game.resultP1 === 'Loss') {
          row.p += 1;
          row.w += 1;
        }
        if (game.resultP1 === 'Tie') {
          row.p += 1;
          row.t += 1;
        }
      }
    });

    row.points = (row.w * pointSystem.win) + (row.t * pointSystem.tie) + (row.l * pointSystem.loss);

    return row;
  };

  const createTable = async (playersList, schedule, pointSystem) => {
    const rowsData = [];
    playersList.forEach((player) => rowsData.push(getRowDetails(player, schedule, pointSystem)));
    rowsData.sort((a, b) => b.points - a.points);
    const promises = rowsData.map((row) => getDocById('users', row.player));
    const promisesResponse = await Promise.all(promises);
    const names = promisesResponse.map((user) => user.username);
    const newRows = rowsData.map((row, index) => ({
      ...row,
      player: names[index],
    }));
    setRows(newRows);
  };

  useEffect(() => {
    if (tournament) {
      createTable(tournament?.players, tournament?.schedule, tournament?.pointSystem);
    }
  }, [tournament]);

  return (
    <table className="table__container">
      <thead className="table__header">
        <tr>
          <th>Pos</th>
          <th>Player</th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody className="table__body">
        {rows.length > 0 && (
          rows.map((row, index) => (
            <tr key={row.player}>
              <td>{index + 1}</td>
              <td>{row.player}</td>
              <td>{row.p}</td>
              <td>{row.w}</td>
              <td>{row.t}</td>
              <td>{row.l}</td>
              <td>{row.points}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

TablePoint.propTypes = {
  tournament: PropTypes.shape({
    players: PropTypes.arrayOf(PropTypes.string),
    schedule: PropTypes.arrayOf(PropTypes.shape({})),
    pointSystem: PropTypes.shape({}),
  }).isRequired,
};
