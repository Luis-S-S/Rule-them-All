/* eslint-disable no-new, no-undef */
import { useState } from 'react';
import PropTypes from 'prop-types';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonPrimary from '../Buttons/ButtonPrimary';

import './CopyToClipboard.scss';

export default function CopyToClipboards({ buttonText, textToCopy }) {
  const [copiedClass, setCopiedClass] = useState('copy__note');

  const handleCopy = () => {
    setCopiedClass('copy__note copy__note--active');
    setTimeout(() => {
      setCopiedClass('copy__note');
    }, 2000);
  };

  return (
    <>
      <CopyToClipboard text={textToCopy} onCopy={handleCopy}>
        <ButtonPrimary isSubmit={false}>{buttonText}</ButtonPrimary>
      </CopyToClipboard>
      <p className={copiedClass}>Copied!</p>
    </>
  );
}

CopyToClipboards.propTypes = {
  buttonText: PropTypes.string.isRequired,
  textToCopy: PropTypes.string.isRequired,
};
