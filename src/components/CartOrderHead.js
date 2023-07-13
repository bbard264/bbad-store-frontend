import React from 'react';
import '../styles/components/CartOrderHead.css';

export default function CartOrderHead({ nowPage }) {
  return (
    <div className="cartOrderNaviContainer">
      <a
        className={`cartNavi ${
          nowPage === 'CartPage' ? 'isactive' : 'notActive'
        }`}
        href="/cart"
      >
        Cart
      </a>
      <a
        className={`orderNavi ${
          nowPage === 'OrderPage' ? 'isactive' : 'notActive'
        }`}
        href="/order"
      >
        Order
      </a>
    </div>
  );
}
