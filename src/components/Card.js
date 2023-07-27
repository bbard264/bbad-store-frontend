import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import addIcon from '../assets/icon/add.png';
import cartIcon from '../assets/icon/cart.png';
import heartEmptyIcon from '../assets/icon/heart.png';
import heartFillIcon from '../assets/icon/heart2.png';
import CartStorage from '../config/services/CartStorage';

import '../styles/components/Card.css';

export default function Card(props) {
  const navigate = useNavigate();
  const location = useLocation();
  let favorite = false; // come back to fix later
  function handleOnClick(productIdUrl) {
    navigate(
      `/product-detail/${
        'id=' + productIdUrl.product_id + '/' + productIdUrl.product_url_name
      }`,
      { state: { product: props.product } }
    );
  }
  async function onClickAddToCart() {
    let option;
    let isOption = false;

    if (props.product.option === null) {
      option = {};
      isOption = true;
    } else {
      option = { isSelect: false, choice: props.product.option };
    }

    const newProductInCartToSave = {
      product_id: props.product._id,
      property: {
        product_name: props.product.product_name,
        product_photo: props.product.product_photo[0],
        product_url_name: props.product.product_url_name,
        option: option,
        product_price: props.product.product_price,
        quantity: 1,
        totalPrice: 0,
        priceChange: { discount: 0 },
      },
      validator: { isStock: false, isAllOptionSelected: isOption },
      note: '',
    };

    const response = await CartStorage.addToCart(newProductInCartToSave);
    if (response.message === 'Unauthorized') {
      if (window.confirm(`You haven't login, Want to login??`)) {
        navigate('/login', { state: { from: location.pathname } });
      }
    }
    props.setShareState(props.shareState + 1);
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
            product_id: props.product._id,
            product_url_name: props.product.product_url_name,
          })
        }
      >
        <img
          className="photo"
          src={props.product.product_photo[0]}
          alt={props.product.product_name}
        />
      </div>
      <div
        className="cardInfo"
        onClick={() =>
          handleOnClick({
            product_id: props.product._id,
            product_url_name: props.product.product_url_name,
          })
        }
      >
        <div className="cardName">{props.product.product_name}</div>
      </div>
      <div className="cardTag">
        <div
          className="cardPrice"
          onClick={() =>
            handleOnClick({
              product_id: props.product._id,
              product_url_name: props.product.product_url_name,
            })
          }
        >
          ฿ {props.product.product_price}
        </div>
        <div className="addCartButton" onClick={onClickAddToCart}>
          <img src={addIcon} alt="addIcon" />
          <img src={cartIcon} alt="cartIcon" />
        </div>
      </div>
    </div>
  );
}
