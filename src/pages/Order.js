import React, { useEffect, useState } from 'react';
import CartOrderHeader from '../components/CartOrderHead.js';
import copyIcon from '../assets/icon/copy.png';
import '../styles/pages/Order.css';

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

function renderOrderDetail(productCartList) {
  function renderCircle(stage, maxStage) {
    let circleElements = [];

    for (let i = 1; i <= maxStage; i++) {
      let isStage = stage >= i ? 'currentStage' : '';
      let lineAfterClass = stage >= i + 1 ? 'currentStage' : '';

      circleElements.push(
        <div className={`circleRow col${i}`}>
          {i === 1 ? null : <div className={`lineBefore ${isStage}`} />}
          <div className={`circleTimeLine ${isStage}`} />
          {i === 6 ? null : <div className={`lineAfter ${lineAfterClass}`} />}
        </div>
      );
    }

    return circleElements;
  }

  return (
    <div className="orderDetailBox">
      <div className="orderHeadLine">
        <h1>Order Detail</h1>
        <div className="orderDetail">
          <div className="orderIDCol">
            <h2 className="orderIDHead">ID</h2>
            <div className="orderIDValue">#1223131323</div>
          </div>
          <div className="dateCol">
            <h2 className="dateHead">Date</h2>
            <div className="dateValue"> 12/3/2023</div>
          </div>
          <div className="statusCol">
            <h2 className="statusHead">STATUS</h2>
            <div className="statusValue">Packed</div>
          </div>
        </div>
      </div>
      <div className="orderTimeLine">
        <div className="gridTimeLine">
          <div className="orderPlaceStage col1">
            <div className="nameTimeLine">
              <div>Order</div>
              <div>Place</div>
            </div>
          </div>
          <div className="orderConfirmStage col2">
            <div className="nameTimeLine">
              <div>Order</div>
              <div>Confirm</div>
            </div>
          </div>
          <div className="paymentConfirmStage col3">
            <div className="nameTimeLine">
              <div>Payment</div>
              <div>Confirm</div>
            </div>
          </div>
          <div className="packedStage col4">
            <div className="nameTimeLine">
              <div>Packed</div>
            </div>
          </div>
          <div className="shippingStage col5">
            <div className="nameTimeLine">
              <div>Shipping</div>
              <div className="expressName">BBadExpress</div>
              <div className="trackNum">
                EF582621151TH
                <img className="copyIcon" src={copyIcon} alt="copy" />
              </div>
            </div>
          </div>
          <div className="deleveredStage col6">
            <div className="nameTimeLine">
              <div>Delivered</div>
            </div>
          </div>
          {renderCircle(4, 6)}
        </div>
      </div>
      <div className="addressOrderSumLine">
        <div className="addressContainer">
          <h2 className="addressHead">ADDRESS</h2>
          <div className="addressBox">
            <p>
              111 Room 11, BBad condo, BBad Road, BBad Head, BBard Heart,
              Bangkok 00000
            </p>
          </div>
        </div>
        <div className="orderSumContainer">
          <h2 className="orderSumHead">ORDER SUMMARY</h2>
          <div className="orderSumBox">
            <div className="orderSumLine">
              <div className="orderSumName">subtotal</div>
              <div className="orderSumValue">฿2300</div>
            </div>
            <div className="orderSumLine">
              <div className="orderSumName">shipping</div>
              <div className="orderSumValue">FREE</div>
            </div>
            <div className="orderSumLine">
              <div className="orderSumName">TAX</div>
              <div className="orderSumValue">฿230(+10%)</div>
            </div>
            <div className="orderSumLine netLine">
              <div className="orderSumName">NET</div>
              <div className="orderSumValue">฿2323</div>
            </div>
          </div>
        </div>
      </div>
      <div className="thisOrderCartLine">
        <h2 className="thisOrderHead">ORDER CART</h2>
        <div className="thisOrderBox">
          {/* <CartListBox productCartList={productCartList} /> */}
        </div>
      </div>
    </div>
  );
}

function renderOrderList() {
  return (
    <div className="orderList">
      <div className="dateHCol">
        <div className="date">12/3/2023</div>
        <div className="orderID">#1223131323</div>
      </div>
      <div className="statusHCol">
        <div className="statusHHead">STATUS:</div>
        <div className="statusHValue">Payment Confirm</div>
      </div>
    </div>
  );
}

export default function Order() {
  return (
    <div className="order">
      <CartOrderHeader nowPage="OrderPage" />
      <div className="contentContainer">
        <div className="orderPage">
          <div className="orderListContainer">
            <div className="orderHeadLine">
              <h1>Order History</h1>
            </div>
            {renderOrderList()}
            {renderOrderList()}
            {renderOrderList()}
          </div>
          <div className="orderDetailContainer">
            {renderOrderDetail(productCartList)}
          </div>
        </div>
      </div>
    </div>
  );
}
