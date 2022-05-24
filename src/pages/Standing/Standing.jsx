import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { listenDocById } from '../../services/firestore';
// import { getDocById } from '../../services/firestore';

import TablePoint from '../../sections/Table/TablePoint';
import TableWinLoss from '../../sections/Table/TableWinLoss';

import './Standing.scss';

export default function Standing() {
  const [tournament, setTournament] = useState(null);
  const { id } = useParams();

  const drawTable = () => {
    switch (tournament?.scaleSystem) {
      case 'Points':
        return <TablePoint tournament={tournament} />;
      case 'Win/Loss':
        return <TableWinLoss tournament={tournament} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    listenDocById('tournaments', id, setTournament);
  }, []);

  return (
    tournament?.status !== 'Scheduled'
      ? (
        <main className="standing-page">
          <h1 className="title-white page-title--generic">{tournament?.title}</h1>
          <h1
            className={`title--generic ${tournament?.status === 'Finished' ? 'standing__finished' : 'standing__active'}`}
          >
            {tournament?.status}
          </h1>
          {drawTable()}
        </main>
      )
      : (
        <main className="standing-page__error">
          <h2 className="page-title--generic standing__error">Tournament hasn&apos;t started yet</h2>
        </main>
      )
  );
}
