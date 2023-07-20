import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bbadlogo from '../assets/ex_products/bbadlogo.png';
import magnifyingGlass from '../assets/icon/magnifying-glass.png';
import heart2 from '../assets/icon/heart2.png';
import cart from '../assets/icon/cart.png';
import user from '../assets/icon/user.png';
import '../styles/components/Header.css';
import UserDataStorage from '../config/services/UserDataStorage';

export default function Header() {
  const navigate = useNavigate();
  const [forceUpdate, setForceUpdate] = useState();
  useEffect(() => {
    setForceUpdate(UserDataStorage.getUserImage());
  }, []);

  return (
    <div className="header">
      <div className="fixedHeader white noShadow"></div>
      <div className="fixedHeader white"></div>
      <div className="fixedHeader">
        <div className="leftHeader">
          <div className="logo" onClick={() => navigate('/home')}>
            <img src={bbadlogo} alt="bbadlogo"></img>
            <div className="brandname">.bbad-shop</div>
          </div>
          <div className="search">
            <input placeholder="Search..."></input>
            <img src={magnifyingGlass} alt=""></img>
          </div>
        </div>

        <div className="navigation">
          <div className="naviLink" onClick={() => navigate('/products')}>
            <div>Products</div>
          </div>
          <div className="naviLink" onClick={() => navigate('/order')}>
            <div>Order</div>
          </div>
          <div className="iconLink" onClick={() => navigate('/favorite')}>
            <img src={heart2} alt="favorite"></img>
          </div>
          <div className="iconLink" onClick={() => navigate('/cart')}>
            <img src={cart} alt="cart"></img>
          </div>
          <div className="iconLink" onClick={() => navigate('/user')}>
            <img
              src={
                UserDataStorage.getUserImage() ?? forceUpdate
                  ? forceUpdate
                  : user
              }
              alt="user"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
}
