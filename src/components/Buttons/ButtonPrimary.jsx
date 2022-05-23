import PropTypes from 'prop-types';
import './ButtonPrimary.scss';

export default function ButtonPrimary({
  children, onClick, className, isSubmit, name, dataCy,
}) {
  return (
    <button
      className={`button__primary ${className}`}
      type={isSubmit ? 'submit' : 'button'}
      onClick={onClick}
      name={name}
      data-cy={dataCy}
    >
      { children }
    </button>
  );
}

ButtonPrimary.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  isSubmit: PropTypes.bool.isRequired,
  name: PropTypes.string,
  dataCy: PropTypes.string,
};

ButtonPrimary.defaultProps = {
  onClick: () => {},
  className: '',
  name: '',
  dataCy: '',
};
