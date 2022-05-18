/* eslint-disable react/forbid-prop-types */
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import { Context } from '../../store';

import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';

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
        {false && (
          <ButtonPrimary isSubmit={false} onClick={handleRemoveIntercept}>Cancel</ButtonPrimary>
        )}
        <ButtonPrimary
          isSubmit={false}
          onClick={handleRemoveIntercept}
        >
          {buttonMsg}
        </ButtonPrimary>
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
