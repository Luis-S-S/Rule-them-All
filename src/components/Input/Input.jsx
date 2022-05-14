import PropTypes from 'prop-types';

import './Input.scss';

/**
 *
 * @param {Props} props receives the following
 * type, name, labelText, onChange[opt], placeholder[opt], disabled[opt]
 * @returns Styled input component
 */
export default function Input(props) {
  const {
    type, name, labelText, onChange, error, placeholder, disabled,
  } = props;

  const style = disabled ? 'form__input--generic disabled--generic' : 'form__input--generic';

  return (
    <div className="form__control">
      <label htmlFor={name}>
        {labelText}
      </label>
      <input
        className={style}
        type={type}
        name={name}
        id={name}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <p className="form__error--generic">{error}</p>}
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

Input.defaultProps = {
  onChange: () => {},
  error: '',
  placeholder: '',
  disabled: false,
};
