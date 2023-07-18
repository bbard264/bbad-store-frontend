import React from 'react';
import { useNavigate } from 'react-router-dom';
import addIcon from '../assets/icon/add.png';
import cartIcon from '../assets/icon/cart.png';
import heartEmptyIcon from '../assets/icon/heart.png';
import heartFillIcon from '../assets/icon/heart2.png';

import '../styles/components/Card.css';

export default function Card({ product }) {
  const navigate = useNavigate();
  let favorite = false; // come back to fix later
  function handleOnClick(productIdUrl) {
    navigate(
      `/product-detail/${
        'id=' + productIdUrl.product_id + '/' + productIdUrl.product_url_name
      }`,
      { state: { product: product } }
    );
  }

  return (
    <div className="card">
      <img
        className="heartIcon"
        src={favorite ? heartFillIcon : heartEmptyIcon}
        alt={favorite ? 'favoriteTure' : 'favoriteFalse'}
      />
      <div
        className="cardImg"
        onClick={() =>
          handleOnClick({
            product_id: product._id,
            product_url_name: product.product_url_name,
          })
        }
      >
        <img
          className="photo"
          src={product.product_photo[0]}
          alt={product.product_name}
        />
      </div>
      <div
        className="cardInfo"
        onClick={() =>
          handleOnClick({
            product_id: product._id,
            product_url_name: product.product_url_name,
          })
        }
      >
        <div className="cardName">{product.product_name}</div>
      </div>
      <div className="cardTag">
        <div
          className="cardPrice"
          onClick={() =>
            handleOnClick({
              product_id: product._id,
              product_url_name: product.product_url_name,
            })
          }
        >
          ฿ {product.product_price}
        </div>
        <div className="addCartButton">
          <img src={addIcon} alt="addIcon" />
          <img src={cartIcon} alt="cartIcon" />
        </div>
      </div>
    </div>
  );
}
