import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getDocById } from '../../services/firestore';

import './Standing.scss';

export default function Standing() {
  const [tournament, setTournament] = useState(null);
  const { id } = useParams();

  // listen realtime updates

  const getTournamentInfo = async () => {
    const response = await getDocById('tournaments', id);
    setTournament(response);
  };

  useEffect(() => {
    getTournamentInfo();
  }, []);

  return (
    <div className="standing-page">
      <h1>{tournament?.title}</h1>
    </div>
  );
}
