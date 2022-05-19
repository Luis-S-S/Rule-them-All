import PropTypes from 'prop-types';

/**
 *
 * @param {Props} props receives the following
 * type, name, labelText, onChange[opt], placeholder[opt], disabled[opt], format[opt], error[opt]
 * @returns Styled input component
 */
export default function Input(props) {
  const {
    type, name, labelText, onChange, error, placeholder, disabled, format,
  } = props;

  const style = disabled ? 'form__input--generic disabled--generic' : 'form__input--generic';
  const formatting = format === 'inline' ? 'form__control--generic_input_inline' : 'form__control--generic_input';

  return (
    <div className={formatting}>
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
  labelText: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.string,
};

Input.defaultProps = {
  labelText: '',
  onChange: () => {},
  error: '',
  placeholder: '',
  disabled: false,
  format: '',
};
