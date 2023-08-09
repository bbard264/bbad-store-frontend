import React, { useState } from 'react';
import profileTemp from '../../assets/temp_img/profile_temp.png';

function ProfileImage({ src, alt }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div>
      {imageError ? (
        <img src={profileTemp} alt={alt} />
      ) : (
        <img src={src} alt={alt} onError={handleImageError} />
      )}
    </div>
  );
}

export default ProfileImage;
