import PropTypes from 'prop-types';

import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';

export default function CloudinaryWidget({ children, folderName, setNewUrl }) {
  const Clodinary = window.cloudinary;
  const widgetConfig = {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.REACT_APP_CLOUDINARY_PRESET_NAME,
    multiple: false,
    maxImageWidth: 200,
    maxImageHeight: 200,
    resourceType: 'image',
    folder: folderName,
  };

  const widget = Clodinary.createUploadWidget(widgetConfig, (error, result) => {
    if (result) {
      if (result.event === 'success') {
        setNewUrl(result.info.url);
      }
    }
  });

  const handleCloudinaryWidget = () => {
    widget.open();
  };

  return (
    <ButtonPrimary isSubmit={false} onClick={handleCloudinaryWidget}>
      {children}
    </ButtonPrimary>
  );
}

CloudinaryWidget.propTypes = {
  children: PropTypes.node.isRequired,
  folderName: PropTypes.string.isRequired,
  setNewUrl: PropTypes.func,
};

CloudinaryWidget.defaultProps = {
  setNewUrl: () => {},
};
