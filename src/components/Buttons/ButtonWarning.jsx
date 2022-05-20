import PropTypes from 'prop-types';
import './ButtonPrimary.scss';

export default function ButtonWarning({
  children, onClick, className, isSubmit, name,
}) {
  return (
    <button
      className={`button__warning ${className}`}
      type={isSubmit ? 'submit' : 'button'}
      onClick={onClick}
      name={name}
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
};

ButtonWarning.defaultProps = {
  onClick: () => {},
  className: '',
  name: '',
};
