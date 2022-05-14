import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Context } from '../../store';
import './Intercept.scss';

export default function Intercept(props) {
  const {
    title, message, navigation, buttonMsg,
  } = props;
  const { dispatch } = useContext(Context);
  const navigate = useNavigate();

  const handleRemoveIntercept = () => {
    dispatch({ type: 'REMOVE_INTERCEPT' });
    navigate(navigation);
  };

  return (
    <div className="intercept__bg">
      <div className="intercept__container">
        <h1 className="intercept__title">{title}</h1>
        <p className="intercept__body">{message}</p>
        <button className="intercept__button" type="button" onClick={handleRemoveIntercept}>{buttonMsg}</button>
      </div>
    </div>
  );
}

Intercept.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  navigation: PropTypes.string.isRequired,
  buttonMsg: PropTypes.string.isRequired,
};
