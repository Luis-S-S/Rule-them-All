import PropTypes from 'prop-types';

import './Input.scss';

/**
 *
 * @param {Props} props receives type, name, labelText, onChange[opt]
 * @returns Styled input component
 */
export default function Input(props) {
  const {
    type, name, labelText, onChange, error,
  } = props;
  return (
    <div className="form__control">
      <label htmlFor={name}>
        {labelText}
      </label>
      <input className="form__input--generic" type={type} name={name} id={name} onChange={onChange} />
      {error && <p className="form__error">{error}</p>}
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
};

Input.defaultProps = {
  onChange: () => {},
  error: '',
};
