import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';
import './Notification.scss';

export default function Notification({ className, notification, setNotification }) {
  const navigate = useNavigate();

  const handleClose = () => {
    setNotification(null);
  };

  const handleRedirect = () => {
    setNotification(null);
    navigate('/invitations');
  };

  return (
    <div className={`notification__container ${className}`}>
      <p className="notification__text"><strong>{notification?.title}</strong></p>
      <p className="notification__text">{notification?.msg}</p>
      <div className="notification-button__container">
        <ButtonPrimary isSubmit={false} onClick={handleClose}>Close</ButtonPrimary>
        <ButtonPrimary isSubmit={false} onClick={handleRedirect}>Go to invites</ButtonPrimary>
      </div>
    </div>
  );
}

Notification.propTypes = {
  notification: PropTypes.shape({
    title: PropTypes.string,
    msg: PropTypes.string,
  }),
  setNotification: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

Notification.defaultProps = {
  notification: null,
};
