import PropTypes from 'prop-types';

export default function Checkbox({
  name, labelText, onChecked, error, dataCy,
}) {
  return (
    <div className="form__control--generic__checkbox">
      <label htmlFor={name}>
        {labelText}
      </label>
      <input type="checkbox" name={name} id={name} onChange={onChecked} data-cy={dataCy} />
      {error && <p className="form__error--generic">{error}</p>}
    </div>
  );
}

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  onChecked: PropTypes.func,
  error: PropTypes.string,
  dataCy: PropTypes.string,
};

Checkbox.defaultProps = {
  onChecked: () => {},
  error: '',
  dataCy: '',
};
