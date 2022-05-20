import PropTypes from 'prop-types';

import ButtonWarning from '../Buttons/ButtonWarning';
import './RemoveableListItem.scss';

export default function RemoveableListItem({ element, onRemove }) {
  return (
    <div className="element-list-item">
      <p className="element-item__name">{element}</p>
      <ButtonWarning isSubmit={false} onClick={() => onRemove(element)}>×</ButtonWarning>
    </div>
  );
}

RemoveableListItem.propTypes = {
  element: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};
