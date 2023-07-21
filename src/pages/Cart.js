import React, { useReducer, useEffect } from 'react';
import CartOrderHeader from '../components/CartOrderHead.js';
import '../styles/pages/Cart.css';

import wizhogFullImage from '../assets/ex_products/wizhog-full.jpg';
import faChalee3Image from '../assets/ex_products/FA_chalee3.jpg';
import chaleeImage from '../assets/ex_products/chalee.jpg';
import hugMomentImage from '../assets/ex_products/HugMoment.jpg';
import CartStorage from './../config/services/CartStorage';

function renderOption(productOptionList) {
  const options = [];

  for (const key in productOptionList) {
    if (Array.isArray(productOptionList[key])) {
      options.push(
        <div className="option needOption" key={key}>
          {`...`}
        </div>
      );
    } else if (productOptionList.hasOwnProperty(key)) {
      options.push(
        <div className="option" key={key}>
          {productOptionList[key]}
        </div>
      );
    }
  }

  return options;
}

function renderCartContent(items) {
  return items.map((item, index) => (
    <div className="productLine" key={index}>
      <div className="productCol">
        <div className="productPhotoBox">
          <img
            src={item.property.product_photo}
            alt={item.property.product_name}
          />
        </div>
        <div className="NameOptionBox">
          <div className="productName">{item.property.product_name}</div>
          <div className="optionBox">{renderOption(item.property.option)}</div>
        </div>
      </div>
      <div className="priceCol">฿{item.property.product_price}</div>
      <div className="quantityCol">1</div>
      <div className="totalCol">
        ฿{(parseFloat(item.property.product_price) * parseFloat(1)).toFixed(2)}
      </div>
      <div className="deleteCol">X</div>
    </div>
  ));
}

function CartListBox({ items }) {
  return (
    <div className="cartListBox">
      <div className="cartListHeadLine">
        <div>PRODUCT</div>
        <div>PRICE</div>
        <div>QUANTITY</div>
        <div>TOTAL</div>
      </div>
      <div className="cartContentContainer">{renderCartContent(items)}</div>
    </div>
  );
}

function renderCartDetail(summaryCart) {
  return (
    <div className="cartDetailLine">
      <div className="cartDetailName">subtotal</div>
      <div className="cartDetailValue">฿2323</div>
    </div>
  );
}

function CartSumBox(summaryCart) {
  return (
    <div className="cartSumBox">
      <div className="cartSumLine">
        <div className="cartSumHeadLine">ORDER SUMMARY</div>
        <div className="cartSumBodyLine">
          {renderCartDetail(summaryCart)}
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

// const emptyCart = {
//   items: [],
//   summary: {
//     subtotal: 0,
//     priceChange: { shipping: 0, TAX: 0 },
//     net: 0,
//   },
//   userId: '',
//   errorMessage: '',
//   IsPassValidate: false,
//   note: '',
// };

// const ProductInCartFromStorage = {
//   item: {
//     product_id: cartState.productId,
//     product_name: cartState.productName,
//     product_photo: cartState.productPhoto,
//     option: cartState.option,
//     product_price: cartState.unitPrice,
//     quantity: cartState.quantity,
//     totalPrice: cartState.unitPrice * cartState.quantity,
//     priceChange: { discount: 0 },
//   },
//   validator: { isStock: false },
//   note: '',
// };

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      const fromStorage = CartStorage.getCart();

      return {
        items: fromStorage,
        summary: {
          subtotal: 0,
          priceChange: { shipping: 0, TAX: 0, discount: 0 },
          net: 0,
        },
        errorMessage: '',
        IsPassValidate: false,
        note: '',
      };

    // case 'UPDATE_QUANTITY_INCREMENT':
    //   return { ...state, quantity: state.quantity + 1 };
    // case 'UPDATE_QUANTITY_DECREMENT':
    //   if (state.quantity <= 1) {
    //     return { ...state, quantity: 1 };
    //   } else {
    //     return { ...state, quantity: state.quantity - 1 };
    //   }
    default:
      return state;
  }
}

export default function Cart() {
  const [cartState, dispatch] = useReducer(reducer, {});
  useEffect(() => {
    dispatch({ type: 'SET_CART' });
  }, []);

  return (
    <div className="cart">
      <CartOrderHeader nowPage="CartPage" />
      <div className="contentContainer">
        <div className="cartPage">
          <div className="cartListContainer">
            {Object.keys(cartState).length === 0 ? (
              <p>loading....</p>
            ) : (
              <CartListBox items={cartState.items} />
            )}
          </div>
          <div className="cartSumContainer">
            {cartState === {} ? (
              <p>loading....</p>
            ) : (
              <p>loading....</p>
              // <CartSumBox summaryCart={cartState.summary} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
