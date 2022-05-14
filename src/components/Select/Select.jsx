import PropTypes from 'prop-types';
import './Select.scss';

export default function Select(props) {
  const {
    name, labelText, onChange, options, error,
  } = props;
  return (
    <div className="form__control">
      <label htmlFor={name}>
        {labelText}
      </label>
      <select className="form__select--generic" name={name} id={name} onChange={onChange}>
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p className="form__error--generic">{error}</p>}
    </div>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  error: PropTypes.string,
};

Select.defaultProps = {
  onChange: () => {},
  error: '',
};
