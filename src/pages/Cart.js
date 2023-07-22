import React, { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartOrderHeader from '../components/CartOrderHead.js';
import '../styles/pages/Cart.css';

import CartStorage from './../config/services/CartStorage';

// {
//   items: [...items,{
//   product_id: cartState.product_id,
//   property: {
//     product_name: cartState.property.product_name,
//     product_photo: cartState.property.product_photo,
//     product_url_name: cartState.property.product_url_name,
//     option: cartState.property.option,
//     product_price: cartState.property.product_price,
//     quantity: cartState.property.quantity,
//     totalPrice: 0,
//     priceChange: { discount: 0 },
//   },
//   validator: { isStock: false },
//   note: '',
// }],
//   summary: {
//     subtotal: 0,
//     priceChange: { shipping: 0, TAX: 0, discount: 0 },
//     net: 0,
//   },
//   errorMessage: '',
//   IsPassValidate: false,
//   note: '',
// };

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_QUANTITY':
      const { index, newQuantity } = action;
      const updatedItemsQuantity = [...state.items];
      if (newQuantity >= 1 && newQuantity <= 100) {
        updatedItemsQuantity[index].property.quantity = newQuantity;
        updatedItemsQuantity[index].property.totalPrice = (
          parseFloat(newQuantity) *
          parseFloat(updatedItemsQuantity[index].property.product_price)
        ).toFixed(2);
      }

      const newSubtotal = updatedItemsQuantity.reduce(
        (accumulator, item) =>
          accumulator + parseFloat(item.property.totalPrice),
        0
      );

      const newNet =
        newSubtotal +
        state.summary.priceChange.shipping +
        state.summary.priceChange.TAX -
        state.summary.priceChange.discount;

      return {
        ...state,
        items: updatedItemsQuantity,
        summary: {
          ...state.summary,
          subtotal: newSubtotal.toFixed(2),
          net: newNet.toFixed(2),
        },
      };
    case 'SET_CART':
      return {
        ...state,
        items: action.items,
        summary: {
          ...state.summary,
          subtotal: action.subtotal,
          net: action.net,
        },
      };
    default:
      return state;
  }
}

function renderOption(productOptionList) {
  const options = [];

  for (const key in productOptionList) {
    if (
      Array.isArray(productOptionList[key]) &&
      productOptionList[key].length > 1
    ) {
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

const initialState = {
  items: CartStorage.getCart(),
  summary: {
    subtotal: 0,
    priceChange: { shipping: 0, TAX: 0, discount: 0 },
    net: 0,
  },
  errorMessage: '',
  IsPassValidate: false,
  note: '',
};

export default function Cart() {
  const navigate = useNavigate();
  const [cartState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const updatedItems = cartState.items.map((item) => {
      const newTotalPrice = (
        parseFloat(item.property.quantity) *
        parseFloat(item.property.product_price)
      ).toFixed(2);

      return {
        ...item,
        property: {
          ...item.property,
          totalPrice: newTotalPrice,
        },
      };
    });

    const subtotal = updatedItems.reduce(
      (accumulator, item) => accumulator + parseFloat(item.property.totalPrice),
      0
    );

    const net =
      subtotal +
      cartState.summary.priceChange.shipping +
      cartState.summary.priceChange.TAX -
      cartState.summary.priceChange.discount;

    // Dispatch the action with type "SET_CART" and the updated items, subtotal, and net
    dispatch({
      type: 'SET_CART',
      items: updatedItems,
      subtotal: subtotal.toFixed(2),
      net: net.toFixed(2),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickNaviagate = (product_id, product_url_name) => {
    const sendto = `/product-detail/${
      'id=' + product_id + '/' + product_url_name
    }`;
    navigate(sendto);
  };

  const onClickQuantity = (e) => {
    const id = e.target.id;
    const [action, indexStr] = id.split('_');
    const index = parseInt(indexStr, 10);

    // Calculate the new quantity based on the action (PLUS or MINUS)
    let newQuantity;
    if (action === 'PLUS') {
      newQuantity = cartState.items[index].property.quantity + 1;
    } else if (action === 'MINUS') {
      newQuantity = cartState.items[index].property.quantity - 1;
    }

    dispatch({ type: 'UPDATE_QUANTITY', index, newQuantity });
  };

  function renderCartContent(items) {
    return items.map((item, index) => (
      <div className="productLine" key={index}>
        <div className="productCol">
          <div
            className="productPhotoBox pointer"
            onClick={() =>
              onClickNaviagate(item.product_id, item.property.product_url_name)
            }
          >
            <img
              src={item.property.product_photo}
              alt={item.property.product_name}
            />
          </div>
          <div className="nameOptionBox">
            <div
              className="productName pointer"
              onClick={() =>
                onClickNaviagate(
                  item.product_id,
                  item.property.product_url_name
                )
              }
            >
              {item.property.product_name}
            </div>
            <div className="optionBox">
              {renderOption(item.property.option)}
            </div>
          </div>
        </div>
        <div className="priceCol">฿{item.property.product_price}</div>
        <div className="quantityCol">
          <div className="plusMinusButton">
            <div
              className="minus"
              onClick={(e) => onClickQuantity(e)}
              id={`MINUS_${index}`}
            >
              <div id={`MINUS_${index}`}>-</div>
            </div>
            <div className="numAmount">
              <div>{item.property.quantity}</div>
            </div>
            <div
              className="plus"
              onClick={(e) => onClickQuantity(e)}
              id={`PLUS_${index}`}
            >
              <div id={`PLUS_${index}`}>+</div>
            </div>
          </div>
        </div>
        <div className="totalCol">฿{item.property.totalPrice}</div>
        <div className="deleteCol">X</div>
      </div>
    ));
  }

  return (
    <div className="cart">
      <CartOrderHeader nowPage="CartPage" />
      <div className="contentContainer">
        <div className="cartPage">
          <div className="cartListContainer">
            {Object.keys(cartState).length === 0 ? (
              <p>loading....</p>
            ) : (
              <div className="cartListBox">
                <div className="cartListHeadLine">
                  <div>PRODUCT</div>
                  <div>PRICE</div>
                  <div>QUANTITY</div>
                  <div>TOTAL</div>
                </div>
                <div className="cartContentContainer">
                  {cartState.items.length === 0 ||
                  cartState.items === null ||
                  cartState.items === undefined ? (
                    <div className="productLine">
                      <p>... empty cart ...</p>
                    </div>
                  ) : (
                    renderCartContent(cartState.items)
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="cartSumContainer">
            {Object.keys(cartState).length === 0 ? (
              <p>loading....</p>
            ) : (
              <div className="cartSumBox">
                <div className="cartSumLine">
                  <div className="cartSumHeadLine">ORDER SUMMARY</div>
                  <div className="cartSumBodyLine">
                    <div className="cartDetailLine">
                      <div className="cartDetailName">subtotal</div>
                      <div className="cartDetailValue">
                        {cartState.summary.subtotal}
                      </div>
                    </div>
                    {Object.entries(cartState.summary.priceChange).map(
                      ([key, value]) =>
                        // Check if the value is 0, and return null to skip rendering the div
                        value !== 0 ? (
                          <div key={key} className="cartDetailLine">
                            <div className="cartDetailName">{key}</div>
                            <div className="cartDetailValue">{value}</div>
                          </div>
                        ) : null
                    )}
                  </div>
                  <div className="emptyBox">
                    <div>.</div>
                    <div>.</div>
                  </div>
                </div>
                <div className="cartSumNetTotalLine">
                  <div>NET</div>
                  <div>{cartState.summary.net}</div>
                </div>
                <div className="cartSumCheckOutLine">CHECK OUT</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
