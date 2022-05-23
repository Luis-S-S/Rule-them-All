import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './LinkPrimary.scss';

export default function LinkPrimary({ path, children, dataCy }) {
  return (
    <Link to={path} className="link__primary" data-cy={dataCy}>{children}</Link>
  );
}

LinkPrimary.propTypes = {
  path: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  dataCy: PropTypes.string,
};

LinkPrimary.defaultProps = {
  dataCy: '',
};
