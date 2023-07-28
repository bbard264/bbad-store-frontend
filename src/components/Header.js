import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bbadlogo from '../assets/ex_products/bbadlogo.png';
import magnifyingGlass from '../assets/icon/magnifying-glass.png';
import heartEmptyIcon from '../assets/icon/heart.png';
import heartFillIcon from '../assets/icon/heart2.png';
import cartIcon from '../assets/icon/cart.png';
import userIcon from '../assets/icon/user.png';
import '../styles/components/Header.css';
import UserDataStorage from '../config/services/UserDataStorage';
import CartStorage from '../config/services/CartStorage';

export default function Header(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({
    userImg: undefined,
    countItemsInCart: 0,
    countFavorite: 0,
  });

  useEffect(() => {
    if (props.role === 'user') {
      setState((prevState) => ({
        ...prevState,
        userImg: UserDataStorage.getUserImage(),
        countItemsInCart: CartStorage.getCountItemsInCart(),
        countFavorite: UserDataStorage.getCountUserFavorite(),
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        userImg: undefined,
        countItemsInCart: 0,
        countFavorite: 0,
      }));
    }
  }, [location, props.shareState, props.role]);

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
              {state.countFavorite === 0 ||
              !UserDataStorage.getCountUserFavorite() ? (
                <></>
              ) : (
                <div className="countFavorite">{state.countFavorite}</div>
              )}
              <img src={heartFillIcon} alt="favorite" />
            </div>
          </div>
          <div className="iconLink" onClick={() => navigate('/cart')}>
            <div className="iconBox">
              {state.countItemsInCart === 0 ||
              !CartStorage.getCountItemsInCart() ? (
                <div></div>
              ) : (
                <div className="countItemsInCart">{state.countItemsInCart}</div>
              )}
              <img src={cartIcon} alt="cart" />
            </div>
          </div>
          <div className="iconLink" onClick={() => navigate('/user')}>
            <div className="iconBox">
              {UserDataStorage.getUserImage() ? (
                <img
                  src={UserDataStorage.getUserImage()}
                  alt="userProfile"
                  className="haveProfile"
                />
              ) : state.userImg ? (
                <img
                  src={state.userImg}
                  alt="userProfile"
                  className="haveProfile"
                />
              ) : (
                <img src={userIcon} alt="guestuser" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
