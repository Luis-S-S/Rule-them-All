import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getDocById } from '../../services/firestore';

export default function TableWinLoss({ tournament }) {
  const [rows, setRows] = useState([]);

  const getRowDetails = (userId, schedule) => {
    const row = {
      player: userId,
      p: 0,
      w: 0,
      l: 0,
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
      }
    });

    return row;
  };

  const sortByResult = (a, b) => {
    if (b.w - a.w === 0) { return a.l - b.l; }
    return b.w - a.w;
  };

  const createTable = async (playersList, schedule) => {
    const rowsData = [];
    playersList.forEach((player) => rowsData.push(getRowDetails(player, schedule)));
    rowsData.sort(sortByResult);
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
    if (tournament) { createTable(tournament?.players, tournament?.schedule); }
  }, [tournament]);

  return (
    <>
      <h1>TableWinLoss</h1>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Player</th>
            <th>P</th>
            <th>W</th>
            <th>L</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 && (
            rows.map((row, index) => (
              <tr key={row.player}>
                <td>{index + 1}</td>
                <td>{row.player}</td>
                <td>{row.p}</td>
                <td>{row.w}</td>
                <td>{row.l}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

TableWinLoss.propTypes = {
  tournament: PropTypes.shape({
    players: PropTypes.arrayOf(PropTypes.string),
    schedule: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};
