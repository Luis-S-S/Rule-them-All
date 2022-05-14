import PropTypes from 'prop-types';
import './DataListSearch.scss';

export default function DataListSearch(props) {
  const {
    name, labelText, onChange, options, error,
  } = props;

  return (
    <div className="datalist__container">
      <label htmlFor={name}>{labelText}</label>
      <input list={`list-${name}`} name={name} id={name} onChange={onChange} />
      <datalist id={`list-${name}`}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </datalist>
      {error && <p className="form__error">{error}</p>}
    </div>

  );
}

DataListSearch.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.string,
};

DataListSearch.defaultProps = {
  onChange: () => {},
  options: [],
  error: '',
};
