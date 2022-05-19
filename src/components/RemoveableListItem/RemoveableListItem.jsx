import PropTypes from 'prop-types';

import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';
import './RemoveableListItem.scss';

export default function RemoveableListItem({ element, onRemove }) {
  return (
    <div className="element-list-item">
      <p className="element-item__name">{element}</p>
      <ButtonPrimary isSubmit={false} onClick={() => onRemove(element)}>×</ButtonPrimary>
    </div>
  );
}

RemoveableListItem.propTypes = {
  element: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};
