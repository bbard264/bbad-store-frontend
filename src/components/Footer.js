import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import bbadlogo from '../assets/ex_products/bbadlogo.png';
import '../styles/components/Footer.css';
import facebookIcon from '../assets/icon/facebook.png';
import instagramIcon from '../assets/icon/instagram.png';
import twitterIcon from '../assets/icon/twitter.png';

import CatgoryLastpage from '../config/services/CatagoryLastpage';

function FirstColumnFooter() {
  const navigate = useNavigate();
  let listMainNavi = [
    { name: 'Prouducts', navi: '/products' },
    { name: 'Order', navi: '/order' },
    { name: 'Favorite', navi: '/favorite' },
    { name: 'Cart', navi: '/cart' },
    { name: 'Account', navi: '/user' },
  ];

  return (
    <div className="firstColomnFooter">
      <div className="logo">
        <img src={bbadlogo} alt="bbadlogo"></img>
        <div className="brandname">.bbad-shop</div>
      </div>
      <div className="mainNaviFooter">
        {listMainNavi.map((item, index) => (
          <div
            className="naviLinkFooter"
            key={item.name}
            onClick={() => navigate(item.navi)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function SecondColumnFooter() {
  const navigate = useNavigate();
  let listMainNavi = [
    { name: 'Wearables', navi: '/products/wearables' },
    { name: 'Collectibles', navi: '/products/collectibles' },
    { name: 'Art Books', navi: '/products/art-books' },
    { name: 'Digital Products', navi: '/products/digital-products' },
  ];
  return (
    <div className="secondColomnFooter">
      <div className="hSecondColomnFooter">
        <div
          className="naviLinkFooter hFooter"
          onClick={() => navigate('/products')}
        >
          Products
        </div>
      </div>
      <div className="listProdNavi">
        {listMainNavi.map((item, index) => (
          <div
            className="naviLinkFooter"
            key={item.name}
            onClick={() => navigate(item.navi)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactFooter({ isMobile = false }) {
  const navigate = useNavigate();
  const myContact = {
    call: '099 999 9999',
    email: 'contact@bbad.com',
    address: '123 Street, City 12345',
  };
  const mySocial = {
    facebook: {
      link: 'https://www.facebook.com',
      icon: facebookIcon,
    },
    instagram: {
      link: 'https://www.instagram.com',
      icon: instagramIcon,
    },
    twitter: {
      link: 'https://www.twitter.com',
      icon: twitterIcon,
    },
  };

  function socialIconLink(mySocial) {
    return Object.keys(mySocial).map((socialKey) => {
      const social = mySocial[socialKey];
      return (
        <a href={social.link} className="socialLink" key={socialKey}>
          <img src={social.icon} alt={socialKey} className="socialIcon" />
        </a>
      );
    });
  }

  if (isMobile === true) {
    return (
      <div className="contactFooter">
        <div className="socialList">
          <div className="logo" onClick={() => navigate('/home')}>
            <img src={bbadlogo} alt="bbadlogo"></img>
            <div className="brandname">.bbad-shop</div>
          </div>
          <div className="socialMediaBox">{socialIconLink(mySocial)}</div>
        </div>
        <div className="textContact">
          <a href="#" className="contactLink">
            {myContact.call}
          </a>
          <a href="#" className="contactLink">
            {myContact.email}
          </a>
          <a href="#" className="contactLink">
            {myContact.address}
          </a>
        </div>
      </div>
    );
  } else {
    return (
      <div className="contactFooter">
        <div className="socialList">{socialIconLink(mySocial)}</div>
        <div className="textContact">
          <a href="#" className="contactLink">
            {myContact.call}
          </a>
          <a href="#" className="contactLink">
            {myContact.email}
          </a>
          <a href="#" className="contactLink">
            {myContact.address}
          </a>
        </div>
      </div>
    );
  }
}

function HelpButtonFooter() {
  let setting = { language: 'English' };
  let listLanguage = ['English', 'Thai'];

  function changeLanguage(newLanguage) {
    setting.language = newLanguage;
    console.log(setting.language);
  }

  function makeListLanguage(listLanguage) {
    return listLanguage.map((language, index) => (
      <div
        onClick={() => changeLanguage(language)}
        className="dropupList"
        key={language}
      >
        {language}
      </div>
    ));
  }

  return (
    <div className="helpButtonFooter">
      <div>
        <div className="changeLaguagedropup">
          <button className="button-dropup">
            <div>{setting.language}</div>
            <div className="triangleButton"></div>
          </button>
          <div className="dropup-content">{makeListLanguage(listLanguage)}</div>
        </div>
      </div>
      <div>
        <a href="#" className="buttonFooter">
          <button className="button">Contact</button>
        </a>
      </div>
      <div>
        <a href="#" className="buttonFooter">
          <button className="button">Help</button>
        </a>
      </div>
    </div>
  );
}

function OneColumnFooter() {
  const navigate = useNavigate();
  const [isShowCate, setIsShowCate] = useState(false);
  let listMainNavi = [
    { name: 'ORDER', navi: '/order' },
    { name: 'FAVORITE', navi: '/favorite' },
    { name: 'CART', navi: '/cart' },
    { name: 'ACCOUNT', navi: '/user' },
  ];
  let listCateNavi = [
    { name: 'All', navi: '/products/all' },
    { name: 'Wearables', navi: '/products/wearables' },
    { name: 'Collectibles', navi: '/products/collectibles' },
    { name: 'Art Books', navi: '/products/art-books' },
    { name: 'Digital Products', navi: '/products/digital-products' },
  ];
  return (
    <>
      <div
        className="naviLinkFooterMobile first"
        key={'product_line'}
        onClick={() => setIsShowCate(!isShowCate)}
      >
        PRODUCTS
      </div>
      <div className="cateFooterToogle">
        <div className={`cateFooterContainer${isShowCate ? ' show' : ''}`}>
          {listCateNavi.map((item, index) => (
            <div
              className={`naviProdFooterMobile${isShowCate ? ' show' : ''}`}
              key={item.name}
              onClick={() => navigate(item.navi)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
      {listMainNavi.map((item, index) => (
        <div
          className={`naviLinkFooterMobile ${
            index === listMainNavi.length - 1 ? 'last' : ''
          }`}
          key={item.name}
          onClick={() => navigate(item.navi)}
        >
          {item.name}
        </div>
      ))}
      <ContactFooter isMobile={true} />
    </>
  );
}

export default function Footer() {
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1279px)',
  });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  if (isDesktop) {
    return (
      <div className="footer">
        <div className="leftFooter">
          <FirstColumnFooter />
          <SecondColumnFooter />
        </div>
        <div className="rightFooter">
          <ContactFooter />
          {/* <HelpButtonFooter /> */}
        </div>
      </div>
    );
  } else if (isTablet) {
    return (
      <div className="footer">
        <div className="leftFooter">
          <FirstColumnFooter />
          <SecondColumnFooter />
        </div>
        <div className="rightFooter">
          <ContactFooter />
          {/* <HelpButtonFooter /> */}
        </div>
      </div>
    );
  } else if (isMobile) {
    return (
      <div className="footer moblie">
        <OneColumnFooter />
      </div>
    );
  } else {
    return <></>;
  }
}
