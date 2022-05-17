import PropTypes from 'prop-types';
import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';

import './ProfileTournamentItem.scss';

export default function ProfileTournamentItem({ tournament, type }) {
  const handleButtons = () => {
    switch (type) {
      case 'admin':
        return (
          <>
            <ButtonPrimary isSubmit={false}>Dashboard</ButtonPrimary>
            <ButtonPrimary isSubmit={false}>Score Card</ButtonPrimary>
          </>
        );
      case 'participant':
        return (<ButtonPrimary isSubmit={false}>Score Card</ButtonPrimary>);
      case 'finished':
        return (<ButtonPrimary isSubmit={false}>Score Card</ButtonPrimary>);
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
