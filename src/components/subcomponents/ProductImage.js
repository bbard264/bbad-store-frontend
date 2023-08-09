import React, { useState } from 'react';
import product_temp_100100 from '../../assets/temp_img/product_temp_100100.jpg';
import product_temp_400600 from '../../assets/temp_img/product_temp_400600.jpg';
import product_temp_800600 from '../../assets/temp_img/product_temp_800600.jpg';

function ProductImage({ src, alt, type }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };
  let img;
  if (type === 'thum_photo') {
    img = product_temp_100100;
  } else if (type === 'card_photo') {
    img = product_temp_400600;
  } else if (type === 'product_photo') {
    img = product_temp_800600;
  } else {
  }
  return (
    <div>
      {imageError ? (
        <img src={img} alt={alt} />
      ) : (
        <img src={src} alt={alt} onError={handleImageError} />
      )}
    </div>
  );
}

export default ProductImage;
