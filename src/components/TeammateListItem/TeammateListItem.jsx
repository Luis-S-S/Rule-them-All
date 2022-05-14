import PropTypes from 'prop-types';

import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';

export default function TeammateListItem({ teammate, onRemove }) {
  return (
    <div className="teammate-list-item">
      <p className="teammate-item__name">{teammate}</p>
      <ButtonPrimary isSubmit={false} onClick={() => onRemove(teammate)}>Remove</ButtonPrimary>
    </div>
  );
}

TeammateListItem.propTypes = {
  teammate: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};
