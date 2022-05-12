import { useState, useEffect } from 'react';
import { getAllDocs } from './services/firestore';
import './App.scss';

function App() {
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllDocs('users')
      .then((res) => setDocs(res))
      .catch((err) => setError(err));
  }, []);

  return (
    <div className="App">
      <h1>Hola mundo!</h1>
      {docs.map((doc) => <p key={doc.id}>{`${doc.username} ${doc.id}`}</p>)}
      {error && (<p>{error.message}</p>)}
    </div>
  );
}

export default App;
