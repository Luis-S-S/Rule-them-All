import { useContext } from 'react';
import { Context } from '../../store';

import LinkPrimary from '../../components/LinkPrimary/LinkPrimary';
import './Tournaments.scss';

export default function Tournaments() {
  const { state } = useContext(Context);
  const { user } = state;
  return (
    <div className="tournaments-page">
      <h1>Welcome to the Arena!</h1>
      {user?.username && (<LinkPrimary path="/create_tournament">Create new tournament</LinkPrimary>)}
      <section className="tournaments-page__container">All tournaments</section>
    </div>
  );
}
