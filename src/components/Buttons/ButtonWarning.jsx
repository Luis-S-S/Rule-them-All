import PropTypes from 'prop-types';
import './ButtonPrimary.scss';

export default function ButtonWarning({
  children, onClick, className, isSubmit, name, dataCy,
}) {
  return (
    <button
      className={`button__warning ${className}`}
      type={isSubmit ? 'submit' : 'button'}
      onClick={onClick}
      name={name}
      data-cy={dataCy}
    >
      { children }
    </button>
  );
}

ButtonWarning.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  isSubmit: PropTypes.bool.isRequired,
  name: PropTypes.string,
  dataCy: PropTypes.string,
};

ButtonWarning.defaultProps = {
  onClick: () => {},
  className: '',
  name: '',
  dataCy: '',
};
