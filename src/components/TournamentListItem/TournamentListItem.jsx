import PropTypes from 'prop-types';

import LinkPrimary from '../LinkPrimary/LinkPrimary';
import './TournamentListItem.scss';

export default function TournamentListItem({ tournament }) {
  return (
    <div key={tournament?.id} id={tournament?.id} name={tournament?.title} className="tournament-list-item__card">
      <div className="tournament-list-card__header">
        <h2 className="tournament-list-card__title title--generic">{tournament?.title}</h2>
        <p className="tournament-list-card__title">
          <span className="bold--generic">Game:</span>
          {' '}
          {tournament?.title}
        </p>
      </div>
      <div className="invite__buttons">
        {tournament?.isPublic && (
          <>
            <LinkPrimary path={`/tournament/join/${tournament?.id}`}>Join tournament</LinkPrimary>
            <LinkPrimary path={`/standing/${tournament?.id}`}>Standings</LinkPrimary>
          </>
        )}
        {!tournament?.isPublic && (<LinkPrimary path={`/standing/${tournament?.id}`}>Standings</LinkPrimary>)}
      </div>
    </div>
  );
}

TournamentListItem.propTypes = {
  tournament: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isPublic: PropTypes.bool.isRequired,
    schedule: PropTypes.string.isRequired,
  }).isRequired,
};
