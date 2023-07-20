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
            <div className="iconBox">
              <img src={heart2} alt="favorite" />
            </div>
          </div>
          <div className="iconLink" onClick={() => navigate('/cart')}>
            <div className="iconBox">
              <img src={cart} alt="cart" />
            </div>
          </div>
          <div className="iconLink" onClick={() => navigate('/user')}>
            <div className="iconBox">
              {UserDataStorage.getUserImage() ? (
                <img
                  src={UserDataStorage.getUserImage()}
                  alt="user"
                  className="haveProfile"
                />
              ) : forceUpdate ? (
                <img src={forceUpdate} alt="user" className="haveProfile" />
              ) : (
                <img src={user} alt="user" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
