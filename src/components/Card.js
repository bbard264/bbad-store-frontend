import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import addIcon from '../assets/icon/add.png';
import xIcon from '../assets/icon/x-mark.png';
import cartIcon from '../assets/icon/cart.png';
import heartEmptyIcon from '../assets/icon/heart.png';
import heartFillIcon from '../assets/icon/heart2.png';
import CartStorage from '../config/services/CartStorage';
import ProductImage from './subcomponents/ProductImage';

import '../styles/components/Card.css';
import UserDataStorage from '../config/services/UserDataStorage';

export default function Card(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFavoritePage = props.isFavoritePage || false;

  useEffect(() => {
    const userFavorite = UserDataStorage.getUserFavorite();
    const { favorite_items: favoriteItems = [] } = userFavorite || {};
    setIsFavorite(favoriteItems.some((item) => item._id === props.product._id));
    // eslint-disable-next-line
  }, []);

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

    if (
      !props.product.option ||
      Object.keys(props.product.option).length === 0
    ) {
      option = { isSelect: true, choice: {} };
      isOption = true;
    } else {
      option = { isSelect: false, choice: props.product.option };
    }

    const newProductInCartToSave = {
      product_id: props.product._id,
      property: {
        product_name: props.product.product_name,
        thumb_photo: props.product.thumb_photo,
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

  async function onClickFavorite() {
    setIsLoading(true);
    if (isFavoritePage) {
      try {
        await UserDataStorage.removeFavorite(props.product);
        props.setShareState(props.shareState + 1);
      } catch (error) {
        setIsLoading(false);
        return;
      }
    } else {
      if (isFavorite) {
        try {
          await UserDataStorage.removeFavorite(props.product);
          setIsFavorite(!isFavorite);
          props.setShareState(props.shareState + 1);
        } catch (error) {
          setIsLoading(false);
          return;
        }
      } else if (!isFavorite) {
        try {
          await UserDataStorage.addFavorite(props.product);
          setIsFavorite(!isFavorite);
          props.setShareState(props.shareState + 1);
        } catch (error) {
          setIsLoading(false);
          return;
        }
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="card">
      <div
        className="cardImg"
        onClick={() =>
          handleOnClick({
            product_id: props.product._id,
            product_url_name: props.product.product_url_name,
          })
        }
      >
        <ProductImage
          src={props.product.card_photo}
          alt={props.product.product_name}
          type={'card_photo'}
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
        <img
          className="heartIcon"
          src={
            isFavoritePage ? xIcon : isFavorite ? heartFillIcon : heartEmptyIcon
          }
          alt={
            isFavoritePage
              ? 'xIcon'
              : isFavorite
              ? 'favoriteTure'
              : 'favoriteFalse'
          }
          onClick={isLoading ? () => {} : onClickFavorite}
        />
        <div className="addCartButton" onClick={onClickAddToCart}>
          <img src={addIcon} alt="addIcon" />
          <img src={cartIcon} alt="cartIcon" />
        </div>
      </div>
    </div>
  );
}
