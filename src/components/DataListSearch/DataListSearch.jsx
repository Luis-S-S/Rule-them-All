import PropTypes from 'prop-types';
import './DataListSearch.scss';

export default function DataListSearch(props) {
  const {
    name, labelText, onChange, options, error, dataCy,
  } = props;

  return (
    <div className="datalist__container">
      <label htmlFor={name}>{labelText}</label>
      <input className="form__input--generic" list={`list-${name}`} name={name} id={name} onChange={onChange} data-cy={dataCy} />
      <datalist id={`list-${name}`}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </datalist>
      {error && <p className="form__error--generic">{error}</p>}
    </div>

  );
}

DataListSearch.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.string,
  dataCy: PropTypes.string,
};

DataListSearch.defaultProps = {
  onChange: () => {},
  options: [],
  error: '',
  dataCy: '',
};
