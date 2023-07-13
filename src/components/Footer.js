import React from 'react';
import bbadlogo from '../assets/ex_products/bbadlogo.png';
import '../styles/components/Footer.css';
import facebookIcon from '../assets/icon/facebook.png';
import instagramIcon from '../assets/icon/instagram.png';
import twitterIcon from '../assets/icon/twitter.png';

class Navi {
  constructor(name, link) {
    this.name = name;
    this.link = link;
  }
}

function makeNavi(listNavi) {
  return listNavi.map((item, index) => (
    <div className="naviLinkFooter" key={item.name}>
      <a href={item.link}>{item.name}</a>
    </div>
  ));
}
// ------------------------------------------------ firstColumnFooter() -------------------------------
function firstColumnFooter() {
  let productsLink = new Navi('Products', '#');
  let promotionsnewsLink = new Navi('Promotions/News', '#');
  let aboutUsLink = new Navi('About Us', '#');
  let contactLink = new Navi('Contact', '#');
  let favoriteLink = new Navi('Favorite', '#');
  let cartLink = new Navi('Cart', '#');
  let accountLink = new Navi('Account', '#');

  let listMainNavi = [
    productsLink,
    promotionsnewsLink,
    aboutUsLink,
    contactLink,
    favoriteLink,
    cartLink,
    accountLink,
  ];

  return (
    <div className="firstColomnFooter">
      <div className="logo">
        <img src={bbadlogo} alt="bbadlogo"></img>
        <div className="brandname">.bbad-shop</div>
      </div>
      <div className="mainNaviFooter">{makeNavi(listMainNavi)}</div>
    </div>
  );
}
// ------------------------------------------------ secondColumnFooter()  -------------------------------
function secondColumnFooter() {
  let wearablesLink = new Navi('Wearables', '#');
  let collectiblesLink = new Navi('Collectibles', '#');
  let artBooksLink = new Navi('Art Books', '#');
  let digitalProductsLink = new Navi('Digital Products', '#');

  let listProdNavi = [
    wearablesLink,
    collectiblesLink,
    artBooksLink,
    digitalProductsLink,
  ];
  return (
    <div className="secondColomnFooter">
      <div className="hSecondColomnFooter">
        <a href="#">Products</a>
      </div>
      <div className="listProdNavi">{makeNavi(listProdNavi)}</div>
    </div>
  );
}
// ------------------------------------------------ contactFooter() -------------------------------
function contactFooter() {
  class Social {
    constructor(name, link, icon) {
      this.name = name;
      this.link = link;
      this.icon = icon;
    }
  }

  let facebookContact = new Social(
    'Facebook',
    'https://www.facebook.com',
    facebookIcon
  );
  let instagramContact = new Social(
    'Instagram',
    'https://www.instagram.com',
    instagramIcon
  );
  let twitterContact = new Social(
    'Twitter',
    'https://www.twitter.com',
    twitterIcon
  );

  let mySocial = [facebookContact, instagramContact, twitterContact];

  class Contact {
    constructor(call, email, address) {
      this.call = call;
      this.email = email;
      this.address = address;
    }
  }

  let myContact = new Contact(
    '123 456 7890',
    'contact@bbad.com',
    '123 Street, City 12345'
  );

  function socialIconLink(mySocial) {
    return mySocial.map((social, index) => (
      <a href={social.link} className="socialLink" key={social.name}>
        <img src={social.icon} alt={social.name} className="socialIcon" />
      </a>
    ));
  }
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

// ------------------------------------------------ helpButtonFooter() -------------------------------

function helpButtonFooter() {
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

export default function Footer() {
  return (
    <div className="footer">
      <div className="leftFooter">
        {firstColumnFooter()}
        {secondColumnFooter()}
      </div>
      <div className="rightFooter">
        {contactFooter()}
        {helpButtonFooter()}
      </div>
    </div>
  );
}
