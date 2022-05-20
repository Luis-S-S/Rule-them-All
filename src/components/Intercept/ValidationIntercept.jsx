/* eslint-disable react/forbid-prop-types */
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Context } from '../../store';
import { removeValidationIntercept } from '../../store/actions';

import ButtonPrimary from '../Buttons/ButtonPrimary';

import './Intercept.scss';

export default function ValidationIntercept(props) {
  const {
    title, message, navigationOnCancel, executableFunction, parameters,
  } = props;
  const { dispatch } = useContext(Context);
  const navigate = useNavigate();

  const handleRemoveValidationIntercept = () => {
    dispatch(removeValidationIntercept());
    navigate(navigationOnCancel);
  };

  const handleExecuteFunction = () => {
    if (parameters) {
      executableFunction(...parameters);
    } else {
      executableFunction();
    }
    handleRemoveValidationIntercept();
  };

  return (
    <div className="intercept__bg">
      <div className="intercept__container">
        <h1 className="intercept__title">{title}</h1>
        <p className="intercept__body">{message}</p>
        <div className="intercept--buttons__container">
          <ButtonPrimary isSubmit={false} onClick={handleRemoveValidationIntercept}>
            Cancel
          </ButtonPrimary>
          <ButtonPrimary isSubmit={false} onClick={handleExecuteFunction}>
            Continue
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

ValidationIntercept.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  navigationOnCancel: PropTypes.string.isRequired,
  executableFunction: PropTypes.func.isRequired,
  parameters: PropTypes.array,
};

ValidationIntercept.defaultProps = {
  parameters: [],
};
