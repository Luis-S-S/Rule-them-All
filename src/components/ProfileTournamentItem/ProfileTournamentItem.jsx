import PropTypes from 'prop-types';
import LinkPrimary from '../LinkPrimary/LinkPrimary';

import './ProfileTournamentItem.scss';

export default function ProfileTournamentItem({ tournament, type }) {
  const handleButtons = () => {
    switch (type) {
      case 'admin':
        return (
          <>
            <LinkPrimary path="/tournament/admin/:id">Dashboard</LinkPrimary>
            <LinkPrimary path="/standing/:id">Standings</LinkPrimary>
          </>
        );
      case 'participant':
        return (<LinkPrimary path="/standing/:id">Standings</LinkPrimary>);
      case 'finished':
        return (<LinkPrimary path="/standing/:id">Standings</LinkPrimary>);
      default:
        return null;
    }
  };

  return (
    <div className="profile-tournament__item">
      <h3 className="tournament-item__title">{tournament?.title}</h3>
      <p>{`Type of tournament: ${tournament?.type}`}</p>
      <p>{`Tournament status: ${tournament?.status}`}</p>
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
    type: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
};
