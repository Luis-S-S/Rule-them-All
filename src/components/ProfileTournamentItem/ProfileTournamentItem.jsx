import PropTypes from 'prop-types';
import LinkPrimary from '../LinkPrimary/LinkPrimary';

import './ProfileTournamentItem.scss';

export default function ProfileTournamentItem({ tournament, type }) {
  const handleButtons = () => {
    switch (type) {
      case 'admin':
        return (
          <>
            <LinkPrimary path={`/tournament/admin/${tournament?.id}`}>Dashboard</LinkPrimary>
            <LinkPrimary path={`/standing/${tournament?.id}`}>Standings</LinkPrimary>
          </>
        );
      case 'participant':
        return (<LinkPrimary path={`/standing/${tournament?.id}`}>Standings</LinkPrimary>);
      case 'finished':
        return (<LinkPrimary path={`/standing/${tournament?.id}`}>Standings</LinkPrimary>);
      default:
        return null;
    }
  };

  return (
    <div className="profile-tournament__item">
      <h3 className="tournament-item__title title--generic">{tournament?.title}</h3>
      <h3 className="tournament-item__title">{tournament?.game}</h3>
      <div className="tournament-item__content">
        {tournament?.isPublic ? (
          <p className="bold--generic">Public tournament</p>
        ) : (
          <p className="bold--generic">Private tournament</p>
        )}
        <p>
          <span className="bold--generic">Type of tournament:</span>
          {' '}
          {tournament?.type}
        </p>
        <p>
          <span className="bold--generic">Tournament status:</span>
          {' '}
          {tournament?.status}
        </p>
      </div>
      <div className="tournament-item__buttons">
        {handleButtons()}
      </div>
    </div>
  );
}

ProfileTournamentItem.propTypes = {
  tournament: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    game: PropTypes.string,
    isPublic: PropTypes.bool,
    type: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
};
