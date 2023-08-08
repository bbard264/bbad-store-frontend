import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bbadlogo from '../assets/ex_products/bbadlogo.png';
import heartFillIcon from '../assets/icon/heart2.png';
import cartIcon from '../assets/icon/cart.png';
import userIcon from '../assets/icon/user.png';
import xIcon from '../assets/icon/x-mark.png';
import '../styles/components/Header.css';
import UserDataStorage from '../config/services/UserDataStorage';
import CartStorage from '../config/services/CartStorage';
import hamburgerMenuIcon from '../assets/icon/menus.png';
import Token from '../config/services/Token';
import { useMediaContext } from '../config/services/MediaContext';

export default function Header(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const userProfileImg = UserDataStorage.getUserImage();
  const [state, setState] = useState({
    userImg: userProfileImg ? userIcon : undefined,
    countItemsInCart: 0,
    countFavorite: 0,
    showUserMenu: false,
  });
  const [showMenu, setShowMenu] = useState(false);
  const { isDesktop, isTablet, isMobile } = useMediaContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hamburgerHeight, setHamburgerHeight] = useState(0);

  useEffect(() => {
    if (props.role === 'user') {
      setState({
        userImg: userProfileImg,
        countItemsInCart: CartStorage.getCountItemsInCart(),
        countFavorite: UserDataStorage.getCountUserFavorite(),
        showUserMenu: true,
      });
    } else if (!userProfileImg || props.role === 'guest') {
      Token.removeToken();
      setState({
        userImg: userIcon,
        countItemsInCart: 0,
        countFavorite: 0,
        showUserMenu: false,
      });
    }
  }, [location, props.shareState, props.role]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  useEffect(() => {
    const hamburgerDiv = document.getElementById('hambergurToggle');
    if (hamburgerDiv) {
      const height = hamburgerDiv.clientHeight;
      setHamburgerHeight(height);
    }
    const handleClickOutside = (event) => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchmove', handleClickOutside);
      window.addEventListener('scroll', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchmove', handleClickOutside);
      window.removeEventListener('scroll', handleClickOutside);
    };
  }, [showMenu]);

  if (isDesktop) {
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
                  <div className="countItemsInCart">
                    {state.countItemsInCart}
                  </div>
                )}
                <img src={cartIcon} alt="cart" />
              </div>
            </div>
            <div className="iconLink" onClick={() => navigate('/user')}>
              <div className={`iconBox${userProfileImg ? ' haveProfile' : ''}`}>
                <img
                  src={userProfileImg ? state.userImg : userIcon}
                  alt="userProfile"
                  className={`userProfile`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isTablet) {
    return (
      <div className="header">
        <div className="fixedHeader tablet">
          <div className="leftHeader">
            <div className="logo" onClick={() => navigate('/home')}>
              <img src={bbadlogo} alt="bbadlogo"></img>
              <div className="brandname">.bbad-shop</div>
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
                  <div className="countItemsInCart">
                    {state.countItemsInCart}
                  </div>
                )}
                <img src={cartIcon} alt="cart" />
              </div>
            </div>
            <div className="iconLink" onClick={() => navigate('/user')}>
              <div className={`iconBox${userProfileImg ? ' haveProfile' : ''}`}>
                <img
                  src={userProfileImg ? state.userImg : userIcon}
                  alt="userProfile"
                  className={`userProfile`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isMobile) {
    return (
      <div className="header mobile">
        <div className="headerStatic">
          <div className="logo" onClick={() => navigate('/home')}>
            <img src={bbadlogo} alt="bbadlogo"></img>
            <div className="brandname">.bbad-shop</div>
          </div>
          {props.role === 'user' ? (
            <div
              className={`naviLink hambergur user${showMenu ? ' show' : ''}`}
              onClick={() => navigate('/user')}
            >
              <div>User Setting</div>
            </div>
          ) : (
            <></>
          )}
          <div className="iconLink moblie">
            <div
              className={`iconBox mobile${
                userProfileImg ? ' haveProfile' : ''
              }`}
            >
              <img
                src={userProfileImg ? state.userImg : userIcon}
                alt="userProfile"
                className={`userProfile`}
                onClick={() => navigate('/user')}
              />
            </div>
            <div className={`iconBox mobile hamburgerIcon`}>
              {state.countItemsInCart === 0 ||
              !CartStorage.getCountItemsInCart() ||
              showMenu ? (
                <div></div>
              ) : (
                <div className="countItemsInCart">{state.countItemsInCart}</div>
              )}
              <img
                src={showMenu ? xIcon : hamburgerMenuIcon}
                alt={'hamburgerMenuIcon'}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              />
            </div>
          </div>
        </div>
        <div
          className={`hambergurToggleContainer${showMenu ? '' : ' hide'}`}
          style={{ height: hamburgerHeight }}
        >
          <div className={`hambergurToggle`} id="hambergurToggle">
            <div
              className="naviLink hambergur"
              onClick={() => navigate('/products')}
            >
              <div>Products</div>
            </div>
            {state.showUserMenu ? (
              <>
                <div
                  className="naviLink hambergur"
                  onClick={() => navigate('/favorite')}
                >
                  <div className="iconBoxMobile">
                    {state.countFavorite === 0 ||
                    !UserDataStorage.getCountUserFavorite() ? (
                      <></>
                    ) : (
                      <div className="countFavoriteMobile">
                        {state.countFavorite}
                      </div>
                    )}
                    <img src={heartFillIcon} alt="favorite" />
                  </div>
                  <div>Favorite</div>
                </div>
                <div
                  className="naviLink hambergur"
                  onClick={() => navigate('/cart')}
                >
                  {state.countItemsInCart === 0 ||
                  !CartStorage.getCountItemsInCart() ? (
                    <div></div>
                  ) : (
                    <div className="countItemsInCartMobile">
                      {state.countItemsInCart}
                    </div>
                  )}
                  <div>Cart</div>
                </div>
                <div
                  className="naviLink hambergur"
                  onClick={() => navigate('/order')}
                >
                  <div>Order</div>
                </div>
              </>
            ) : (
              <></>
            )}

            {props.role === 'user' ? (
              <div
                className="naviLink hambergur logout"
                onClick={() => {
                  Token.removeToken();
                  window.location.reload();
                }}
              >
                <div>Log Out</div>
              </div>
            ) : (
              <div
                className="naviLink hambergur login"
                onClick={() => {
                  navigate('/login');
                }}
              >
                <div>Log In</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
