import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/CartOrderHead.css';

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
        Cart
      </div>
      <div
        className={`orderNavi ${
          nowPage === 'OrderPage' ? 'isactive' : 'notActive'
        }`}
        onClick={() => navigate('/order')}
      >
        Order
      </div>
    </div>
  );
}
