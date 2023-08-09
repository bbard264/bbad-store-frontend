import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/CartOrderHead.css';
import cartIcon from '../assets/icon/cart.png';
import orderIcon from '../assets/icon/order.png';
import IconContainer from './subcomponents/IconContainer';

export default function CartOrderHead({ nowPage }) {
  const navigate = useNavigate();
  return (
    <div className="cartOrderNaviContainer">
      <div
        className={`cartNavi ${
          nowPage === 'CartPage' ? 'isactive' : 'notActive'
        }`}
        onClick={() => navigate('/cart')}
      >
        <IconContainer
          className={`cartOrderIcon ${
            nowPage === 'CartPage' ? 'isactive' : 'notActive'
          }`}
          src={cartIcon}
          alt={'cart'}
        />
        Cart
      </div>
      <div
        className={`orderNavi ${
          nowPage === 'OrderPage' ? 'isactive' : 'notActive'
        }`}
        onClick={() => navigate('/order')}
      >
        <IconContainer
          className={`cartOrderIcon ${
            nowPage === 'OrderPage' ? 'isactive' : 'notActive'
          }`}
          src={orderIcon}
          alt={'order'}
        />
        Order
      </div>
    </div>
  );
}
