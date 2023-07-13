import React, { useEffect, useState } from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import CartOrderHeader from '../components/CartOrderHead.js';
import CartListBox from '../components/CartListBox.js';
import '../styles/pages/Cart.css';

import wizhogFullImage from '../assets/ex_products/wizhog-full.jpg';
import faChalee3Image from '../assets/ex_products/FA_chalee3.jpg';
import chaleeImage from '../assets/ex_products/chalee.jpg';
import hugMomentImage from '../assets/ex_products/HugMoment.jpg';

//#region mock product

class ProductCart {
  constructor(
    userid,
    cartid,
    productid,
    productName = '',
    productOption = [],
    quantity = 1,
    productPhoto = '',
    productPrice = 0
  ) {
    this.userid = userid;
    this.cartid = cartid;
    this.productid = productid;
    this.productName = productName;
    this.productOption = productOption; // example [optionid1, optionid2 optionid3]
    this.quantity = quantity;
    this.productPhoto = productPhoto;
    this.productPrice = productPrice;
  }
}

const product1 = new ProductCart(
  'user123',
  'cart1',
  'product1',
  'Fitness Tracker',
  ['XL', 'RED'],
  2,
  wizhogFullImage,
  59.99
);

const product2 = new ProductCart(
  'user123',
  'cart1',
  'product2',
  'Smartwatch',
  ['PRO', 'Cyan'],
  1,
  chaleeImage,
  199.99
);

const product3 = new ProductCart(
  'user123',
  'cart1',
  'product3',
  'Wireless Earbuds',
  [],
  3,
  faChalee3Image,
  79.99
);

const product4 = new ProductCart(
  'user123',
  'cart1',
  'product4',
  'T-Shirt',
  ['XXL', 'BLUE'],
  1,
  hugMomentImage,
  129.99
);

const productCartList = [product1, product2, product3, product4];

//#endregion

function CartSumBox() {
  function renderCartDetail() {
    return (
      <div className="cartDetailLine">
        <div className="cartDetailName">subtotal</div>
        <div className="cartDetailValue">฿2323</div>
      </div>
    );
  }
  return (
    <div className="cartSumBox">
      <div className="cartSumLine">
        <div className="cartSumHeadLine">ORDER SUMMARY</div>
        <div className="cartSumBodyLine">
          {renderCartDetail()}
          <div className="cartDetailLine">
            <div className="cartDetailName">shipping</div>
            <div className="cartDetailValue">FREE</div>
          </div>
          <div className="cartDetailLine">
            <div className="cartDetailName">TAX</div>
            <div className="cartDetailValue">฿230(+10%)</div>
          </div>
        </div>
        <div className="emptyBox">
          <div>.</div>
          <div>.</div>
        </div>
      </div>
      <div className="cartSumNetTotalLine">
        <div>NET</div>
        <div>฿2323</div>
      </div>
      <div className="cartSumCheckOutLine">CHECK OUT</div>
    </div>
  );
}

export default function Cart() {
  return (
    <div className="cart">
      <Header />
      <CartOrderHeader nowPage="CartPage" />
      <div className="contentContainer">
        <div className="cartPage">
          <div className="cartListContainer">
            <CartListBox productCartList={productCartList} />
          </div>
          <div className="cartSumContainer">{CartSumBox()}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
