import React, { useState, useEffect } from 'react';
import addIcon from '../assets/icon/add.png';
import cartIcon from '../assets/icon/cart.png';
import heartEmptyIcon from '../assets/icon/heart.png';
import heartFillIcon from '../assets/icon/heart2.png';

import '../styles/components/Card.css';

export default function Card({ product, index, onFavoriteChange }) {
  const [favorite, setFavorite] = useState(product.favorite);

  const handleToggleFavorite = () => {
    const updatedFavorite = !favorite;
    setFavorite(updatedFavorite);
    onFavoriteChange(index, updatedFavorite);
  };

  useEffect(() => {
    setFavorite(product.favorite);
  }, [product.favorite]);

  return (
    <div className="card">
      <img
        className="heartIcon"
        src={favorite ? heartFillIcon : heartEmptyIcon}
        alt={favorite ? 'favoriteTure' : 'favoriteFalse'}
        onClick={handleToggleFavorite}
      />
      <div className="cardImg">
        <img className="photo" src={product.photo} alt={product.name} />
      </div>
      <div className="cardInfo">
        <div className="cardName">{product.name}</div>
      </div>
      <div className="cardTag">
        <div className="cardPrice">฿ {product.price}</div>
        <div className="addCartButton">
          <img src={addIcon} alt="addIcon" />
          <img src={cartIcon} alt="cartIcon" />
        </div>
      </div>
    </div>
  );
}
