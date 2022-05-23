import PropTypes from 'prop-types';
import './ButtonPrimary.scss';

export default function ButtonSuccess({
  children, onClick, className, isSubmit, name, dataCy,
}) {
  return (
    <button
      className={`button__success ${className}`}
      type={isSubmit ? 'submit' : 'button'}
      onClick={onClick}
      name={name}
      data-cy={dataCy}
    >
      { children }
    </button>
  );
}

ButtonSuccess.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  isSubmit: PropTypes.bool.isRequired,
  name: PropTypes.string,
  dataCy: PropTypes.string,
};

ButtonSuccess.defaultProps = {
  onClick: () => {},
  className: '',
  name: '',
  dataCy: '',
};
