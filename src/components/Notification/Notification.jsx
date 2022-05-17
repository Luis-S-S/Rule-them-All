import PropTypes from 'prop-types';

import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';
import LinkPrimary from '../LinkPrimary/LinkPrimary';
import './Notification.scss';

export default function Notification({ className, notification, setNotification }) {
  console.log(notification);

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <div className={`notification__container ${className}`}>
      {/* <p><strong>{notification?.title}</strong></p>
      <p>{notification?.msg}</p> */}
      <p className="notification__text"><strong>Practice title</strong></p>
      <p className="notification__text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Amet corrupti obcaecati magni ipsum autem fugit.
      </p>
      <div className="notification-button__container">
        <ButtonPrimary isSubmit={false} onClick={handleClose}>Close</ButtonPrimary>
        <LinkPrimary path="/invitations">Go to invites</LinkPrimary>
      </div>
    </div>
  );
}

Notification.propTypes = {
  notification: PropTypes.shape({
    title: PropTypes.string,
    msg: PropTypes.string,
  }).isRequired,
  setNotification: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};
