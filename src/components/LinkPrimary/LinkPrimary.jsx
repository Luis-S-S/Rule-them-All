import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './LinkPrimary.scss';

export default function LinkPrimary({ path, children }) {
  return (
    <Link to={path} className="link__primary">{children}</Link>
  );
}

LinkPrimary.propTypes = {
  path: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
