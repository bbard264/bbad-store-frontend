import React from 'react';
import bbadlogo from '../assets/ex_products/bbadlogo.png';
import magnifyingGlass from '../assets/icon/magnifying-glass.png';
import heart2 from '../assets/icon/heart2.png';
import cart from '../assets/icon/cart.png';
import user from '../assets/icon/user.png';
import '../styles/components/Header.css';

export default function Header() {
  return (
    <div className="header">
      <div className="fixedHeader white noShadow"></div>
      <div className="fixedHeader white"></div>
      <div className="fixedHeader">
        <div className="leftHeader">
          <a className="logo" href="/">
            <img src={bbadlogo} alt="bbadlogo"></img>
            <div className="brandname">.bbad-shop</div>
          </a>
          <div className="search">
            <input placeholder="Search..."></input>
            <img src={magnifyingGlass} alt=""></img>
          </div>
        </div>

        <div className="navigation">
          <div className="naviLink">
            <a href="/products">Products</a>
          </div>
          {/* <div className="naviLink">
            <a href="#">Promotions/News</a>
          </div> */}
          <div className="naviLink">
            <a href="/order">Order</a>
          </div>
          {/* <div className="naviLink">
            <a href="#">Contact</a>
          </div> */}
          <a className="iconLink" href="/favorite">
            <img src={heart2} alt="favorite"></img>
          </a>
          <a className="iconLink" href="cart">
            <img src={cart} alt="cart"></img>
          </a>
          <a className="iconLink" href="user">
            <img src={user} alt="user"></img>
          </a>
        </div>
      </div>
    </div>
  );
}
