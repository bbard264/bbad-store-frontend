import React, { useReducer, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaContext } from '../config/services/MediaContext';
import CartOrderHeader from '../components/CartOrderHead.js';
import '../styles/pages/Cart.css';
import Backdrop from '../components/subcomponents/Backdrop.js';
import CartStorage from './../config/services/CartStorage';
import UserDataStorage from './../config/services/UserDataStorage';
import RESTapi from './../config/services/RESTapi';
import Button from '../components/subcomponents/Button.js';
import ProductImage from '../components/subcomponents/ProductImage';
import IconContainer from '../components/subcomponents/IconContainer';
import checkOutIcon from '../assets/icon/check-it-out.png';
import RecommendationSection from '../components/RecommendationSection';
import LoadingScene from '../components/LoadingScene';

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_QUANTITY':
      const { index, newQuantity } = action;
      const updatedItemsQuantity = [...state.items];
      if (newQuantity >= 1 && newQuantity <= 100) {
        updatedItemsQuantity[index].property.quantity = parseInt(newQuantity);
        updatedItemsQuantity[index].property.totalPrice = parseFloat(
          (
            parseFloat(newQuantity) *
            parseFloat(updatedItemsQuantity[index].property.product_price)
          ).toFixed(2)
        );
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
      CartStorage.modifyCart(updatedItemsQuantity);
      return {
        ...state,
        items: updatedItemsQuantity,
        summary: {
          ...state.summary,
          subtotal: parseFloat(newSubtotal.toFixed(2)),
          net: parseFloat(newNet.toFixed(2)),
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
    case 'MODIFY_OPTION':
      const { indexModified, productModified } = action.payload;
      const modifyState = { ...state };
      modifyState.items[indexModified] = productModified;
      return modifyState;
    case 'RESET':
      return initialState;
    case 'RE_RENDER':
      return state;
    default:
      return state;
  }
}

function RenderOption({
  product,
  setModifyOptionState,
  index,
  isLetModify = true,
}) {
  if (Object.keys(product.property.option).length === 0) {
    product.validator.isAllOptionSelected = true;
    return;
  } else if (product.property.option.isSelect) {
    const options = [];
    product.validator.isAllOptionSelected = true;
    for (const key in product.property.option.choice) {
      if (
        product.property.option.choice.hasOwnProperty(key) &&
        product.property.option.isSelect
      ) {
        options.push(
          <div
            className={`option ${isLetModify ? '' : 'notLetModify'}`}
            key={key}
            onClick={
              isLetModify
                ? () =>
                    setModifyOptionState({
                      index: index,
                      productToModify: product.property,
                      state: true,
                    })
                : null
            }
          >
            {product.property.option.choice[key][0]}
          </div>
        );
      }
    }
    return options;
  } else {
    product.validator.isAllOptionSelected = false;
    return (
      <div
        className="option needOption"
        key={`needOption`}
        onClick={() =>
          setModifyOptionState({
            index: index,
            productToModify: product.property,
            state: true,
          })
        }
      >
        {`...`}
        <div className="NEED">! Please Select option</div>
      </div>
    );
  }
}

function RenderModifyOption({
  modifyOptionState,
  setModifyOptionState,
  cartState,
}) {
  const index = modifyOptionState.index;
  const product = JSON.parse(JSON.stringify(modifyOptionState.productToModify));

  function handleOnRadioChange(e) {
    const { name, value } = e.target;

    product.option.isSelect = true;
    product.option.choice[name] = [
      value,
      ...product.option.choice[name].filter((item) => item !== value),
    ];
  }

  function renderRadioChoices(options, name) {
    return (
      <div className="optionContainer" key={name}>
        <div className="choiceName">{name}</div>
        <div className="choice">
          {options.map((value, index) => (
            <label key={`${name}-${index}`}>
              <input
                type="radio"
                name={name}
                value={value}
                onChange={handleOnRadioChange}
                className="radioProduct"
                defaultChecked={
                  product.option.isSelect
                    ? options.length === 1 || index === 0
                    : options.length === 1
                }
              />
              <div className="radioName">{value}</div>
            </label>
          ))}
        </div>
      </div>
    );
  }

  function onClickCancel() {
    setModifyOptionState({
      index: 0,
      productToModify: {},
      state: false,
    });
  }

  function onSumbitModifyOption(e) {
    e.preventDefault();

    const checkAllChoiceIsSelected = () => {
      // Pass the event 'e' as a parameter
      const form = e.target;
      const inputGroups = {};
      const inputs = form.querySelectorAll('input[type="radio"]'); // Corrected method name
      inputs.forEach((input) => {
        const name = input.name;
        if (!inputGroups[name]) {
          inputGroups[name] = [];
        }
        inputGroups[name].push(input);
      });
      let isValid = true;
      for (const groupName in inputGroups) {
        const group = inputGroups[groupName];
        const checkedInputs = group.filter((input) => input.checked);
        if (checkedInputs.length === 0) {
          isValid = false;
          break;
        }
      }

      return isValid; // Simply return the result of validation
    };

    if (!product.option.isSelect) {
      window.alert('Please Select all option');

      return;
    }

    if (!checkAllChoiceIsSelected()) {
      window.alert('Please select at least one each option');
      product.option.isSelect = false;
      return;
    }

    if (window.confirm('Confirm this option')) {
      cartState.items[index].property.option = product.option;
      CartStorage.modifyCart(cartState.items);

      setModifyOptionState({
        index: 0,
        productToModify: {},
        state: false,
      });
      return;
    }
  }

  if (
    !product.option.choice ||
    Object.entries(product.option.choice).length === 0
  ) {
    return null;
  } else {
    return (
      <div className="modifyOptionBox">
        <div className="productCol modifyOption">
          <div className="productPhotoBox modifyOption">
            <ProductImage
              src={product.thumb_photo}
              alt={product.product_name}
              type={'thumb_photo'}
            />
          </div>
          <div className="nameOptionBox modifyOption">
            <div className="textHeader modifyOption">Select Options for:</div>
            <div className="productName modifyOption">
              {product.product_name}
            </div>
          </div>
        </div>
        <form
          className="optionsLine modifyOption"
          id="modifyOptionLine"
          onSubmit={onSumbitModifyOption}
        >
          {Object.entries(product.option.choice).map(([key, values]) =>
            renderRadioChoices(values, key)
          )}
        </form>
        <div className="SubmitLine">
          <Button onClick={onClickCancel}>CANCEL</Button>
          <Button type="submit" form="modifyOptionLine">
            SUBMIT
          </Button>
        </div>
      </div>
    );
  }
}

function ReviewCheckOut({ cartState, onCalcelReviewCheckOut, media }) {
  const navigate = useNavigate();
  const userInfo = UserDataStorage.getUserData();
  function renderReviewProductList(items) {
    return items.map((item, index) => (
      <div className="reviewProductRow" key={index}>
        <div className="productCol">
          <div className="productPhotoBox inReview">
            <ProductImage
              src={item.property.thumb_photo}
              alt={item.property.product_name}
              type={'thumb_photo'}
            />
          </div>
          <div className="nameOptionBox">
            <div className="productName inReview">
              {item.property.product_name}
            </div>
            <div className="optionBox">
              <RenderOption product={item} index={index} isLetModify={false} />
            </div>
          </div>
        </div>
        {media === 'mobile' ? (
          <></>
        ) : (
          <div className="priceCol">฿{item.property.product_price}</div>
        )}
        <div className="quantityCol">
          <div className="numAmount inReview">
            <div>{item.property.quantity}</div>
          </div>
        </div>
        <div className="totalCol">฿{item.property.totalPrice}</div>
      </div>
    ));
  }

  async function onSubmitReviewCheck(e) {
    e.preventDefault();
    const form = document.getElementById('reviewCheckOutForm');
    const formData = new FormData(form);
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    function checkEmptyValues(obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === '') {
          return false;
        }
      }
      return true;
    }
    if (!checkEmptyValues(formDataObj)) {
      window.alert('Please Fill All Information');
      return;
    } else if (window.confirm('Confirm your information?')) {
      const newOrder = {
        user_id: '',
        items: cartState.items.map((item) => ({
          product_id: item.product_id,
          property: {
            product_name: item.property.product_name,
            thumb_photo: item.property.thumb_photo,
            option: item.property.option.choice,
            product_price: item.property.product_price,
            quantity: item.property.quantity,
            totalPrice: item.property.totalPrice,
            priceChange: item.property.priceChange,
          },
          note: item.note,
        })),
        summary: cartState.summary,
        status_id: 'stage1',
        contact_info: {
          real_name: formDataObj.realname,
          phone: formDataObj.phone,
          address: {
            adress1: formDataObj.address1,
            adress2: formDataObj.address2,
            district: formDataObj.district,
            province: formDataObj.province,
            postcode: formDataObj.postcode,
          },
        },
        shipping_Info: { shipping_company: '', shipping_track: '' },
        payment_info: { payment_id: '', payment_status: '' },
        order_note: cartState.note,
      };
      const response = await RESTapi.createOrder(newOrder);
      if (response.createOrder) {
        await CartStorage.removeFromCart({ all: true });
        window.alert(response.message);
        onCalcelReviewCheckOut();
        UserDataStorage.setUserReviews();
        navigate('/order');
      } else {
        window.alert('False to place order, please try again later');
        return;
      }
    } else {
      return;
    }
  }

  return (
    <div className="reviewCheckContainer">
      {media === 'mobile' ? (
        <></>
      ) : (
        <div className="reviewOut" onClick={onCalcelReviewCheckOut}>
          <div>X</div>
        </div>
      )}
      <div className="reviewCheckBox">
        <div className="reviewProductHeadLine">
          <div>PRODUCT</div>
          {media === 'mobile' ? <></> : <div>PRICE</div>}
          <div>QUANTITY</div>
          <div>TOTAL</div>
        </div>
        <div className="reviewProductList">
          <div className="reviewProductListContent">
            {renderReviewProductList(cartState.items)}
          </div>
        </div>
        {media === 'mobile' ? (
          <>
            <div className="cartSumBox reviewCheckSection">
              <div className="cartSumLine reviewCheckSection">
                <div className="cartSumHeadLine">ORDER SUMMARY</div>
                <div className="cartSumBodyLine">
                  <div className="cartDetailLine">
                    <div className="cartDetailName">subtotal</div>
                    <div className="cartDetailValue">
                      ฿{cartState.summary.subtotal}
                    </div>
                  </div>
                  {Object.entries(cartState.summary.priceChange).map(
                    ([key, value]) =>
                      value !== 0 ? (
                        <div key={key} className="cartDetailLine">
                          <div className="cartDetailName">{key}</div>
                          <div className="cartDetailValue">฿{value}</div>
                        </div>
                      ) : null
                  )}
                </div>
              </div>
              <div className="cartSumNetTotalLine reviewCheckSection">
                <div>NET</div>
                <div>฿{cartState.summary.net}</div>
              </div>
            </div>
            <form
              className="reviewSummaryPersonalContainer"
              id="reviewCheckOutForm"
              onSubmit={onSubmitReviewCheck}
            >
              <div className="reviewSummaryPersonalBox">
                <h2 className="reviewHead">CONTACT FOR SHIPPING</h2>
                <div className="reviewNamePhoneBox">
                  <div className="reviewNameBox">
                    <label htmlFor="realname" />
                    <input
                      className="reviewCheckinput"
                      type="text"
                      name="realname"
                      id="realname"
                      placeholder="your real name...."
                    />
                  </div>
                  <div className="reviewPhoneBox">
                    <label htmlFor="phone" />
                    <input
                      className="reviewCheckinput"
                      type="tel"
                      name="phone"
                      id="phone"
                      defaultValue={
                        userInfo ? userInfo.phone ?? userInfo.phone : null
                      }
                      placeholder="your phone...."
                    />
                  </div>
                </div>
                <div className="reviewAddressBox">
                  <div className="reviewAddressInputContainer">
                    <div className="labelInput">
                      <label htmlFor="address1">address</label>
                      <input
                        className="reviewCheckinput reviewaddress"
                        type="text"
                        name="address1"
                        id="address1"
                        defaultValue={userInfo?.address?.address1 ?? null}
                        placeholder="your address...."
                      />
                    </div>
                    <div className="labelInput">
                      <label htmlFor="address2">address</label>
                      <input
                        className="reviewCheckinput reviewaddress"
                        type="text"
                        name="address2"
                        id="address2"
                        defaultValue={userInfo?.address?.address2 ?? null}
                        placeholder="your address...."
                      />
                    </div>
                    <div className="labelInput">
                      <label htmlFor="district">district</label>
                      <input
                        className="reviewCheckinput reviewaddress"
                        type="text"
                        name="district"
                        id="district"
                        defaultValue={userInfo?.address?.district ?? null}
                        placeholder="district...."
                      />
                    </div>
                    <div className="labelInput">
                      <label htmlFor="province">province</label>
                      <input
                        className="reviewCheckinput reviewaddress"
                        type="text"
                        name="province"
                        id="province"
                        defaultValue={userInfo?.address?.province ?? null}
                        placeholder="province...."
                      />
                    </div>
                    <div className="labelInput">
                      <label htmlFor="postcode">postcode</label>
                      <input
                        className="reviewCheckinput reviewaddress"
                        type="num"
                        name="postcode"
                        id="postcode"
                        defaultValue={userInfo?.address?.postcode ?? null}
                        placeholder="postcode...."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="buttonLineReviewCheckMobile">
              <Button
                className="cartSumCheckOutLine checkOut reviewCheckSection"
                type="warning"
                onClick={onCalcelReviewCheckOut}
              >
                Cancel
              </Button>
              <Button
                className="cartSumCheckOutLine checkOut reviewCheckSection"
                type="submit&green"
                form="reviewCheckOutForm"
              >
                <IconContainer
                  className="checkOutIcon"
                  src={checkOutIcon}
                  alt={'checkOutIcon'}
                />
                PLACE ORDER
              </Button>
            </div>
          </>
        ) : (
          <div className="reviewSummary">
            <form
              className="reviewSummaryLine"
              id="reviewCheckOutForm"
              onSubmit={onSubmitReviewCheck}
            >
              <div className="reviewSummaryPersonalContainer">
                <div className="reviewSummaryPersonalBox">
                  <div className="reviewNamePhoneBox">
                    <div className="reviewNameBox">
                      <h2 className="reviewHead">NAME</h2>
                      <label htmlFor="realname" />
                      <input
                        className="reviewCheckinput"
                        type="text"
                        name="realname"
                        id="realname"
                        placeholder="your real name...."
                      />
                    </div>
                    <div className="reviewPhoneBox">
                      <h2 className="reviewHead">PHONE</h2>
                      <label htmlFor="phone" />
                      <input
                        className="reviewCheckinput"
                        type="tel"
                        name="phone"
                        id="phone"
                        defaultValue={
                          userInfo ? userInfo.phone ?? userInfo.phone : null
                        }
                        placeholder="your phone...."
                      />
                    </div>
                  </div>
                  <div className="reviewAddressBox">
                    <h2 className="reviewHead">ADDRESS FOR SHIPPING</h2>
                    <div className="reviewAddressInputContainer">
                      <div className="labelInput">
                        <label htmlFor="address1">address</label>
                        <input
                          className="reviewCheckinput reviewaddress"
                          type="text"
                          name="address1"
                          id="address1"
                          defaultValue={userInfo?.address?.address1 ?? null}
                          placeholder="your address...."
                        />
                      </div>
                      <div className="labelInput">
                        <label htmlFor="address2">address</label>
                        <input
                          className="reviewCheckinput reviewaddress"
                          type="text"
                          name="address2"
                          id="address2"
                          defaultValue={userInfo?.address?.address2 ?? null}
                          placeholder="your address...."
                        />
                      </div>
                      <div className="labelInput">
                        <label htmlFor="district">district</label>
                        <input
                          className="reviewCheckinput reviewaddress"
                          type="text"
                          name="district"
                          id="district"
                          defaultValue={userInfo?.address?.district ?? null}
                          placeholder="district...."
                        />
                      </div>
                      <div className="labelInput">
                        <label htmlFor="province">province</label>
                        <input
                          className="reviewCheckinput reviewaddress"
                          type="text"
                          name="province"
                          id="province"
                          defaultValue={userInfo?.address?.province ?? null}
                          placeholder="province...."
                        />
                      </div>
                      <div className="labelInput">
                        <label htmlFor="postcode">postcode</label>
                        <input
                          className="reviewCheckinput reviewaddress"
                          type="num"
                          name="postcode"
                          id="postcode"
                          defaultValue={userInfo?.address?.postcode ?? null}
                          placeholder="postcode...."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cartSumBox reviewCheckSection">
                <div className="cartSumLine reviewCheckSection">
                  <div className="cartSumHeadLine">ORDER SUMMARY</div>
                  <div className="cartSumBodyLine">
                    <div className="cartDetailLine">
                      <div className="cartDetailName">subtotal</div>
                      <div className="cartDetailValue">
                        ฿{cartState.summary.subtotal}
                      </div>
                    </div>
                    {Object.entries(cartState.summary.priceChange).map(
                      ([key, value]) =>
                        value !== 0 ? (
                          <div key={key} className="cartDetailLine">
                            <div className="cartDetailName">{key}</div>
                            <div className="cartDetailValue">฿{value}</div>
                          </div>
                        ) : null
                    )}
                  </div>
                  <div className="emptyBox">
                    <div>.</div>
                    <div>.</div>
                  </div>
                </div>
                <div className="cartSumNetTotalLine reviewCheckSection">
                  <div>NET</div>
                  <div>฿{cartState.summary.net}</div>
                </div>
                <Button
                  className="cartSumCheckOutLine checkOut reviewCheckSection"
                  type="submit&green"
                >
                  PLACE ORDER
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function CartList({
  cartState,
  onClickRemoveAll,
  onClickQuantity,
  onClickToRemove,
  onClickNaviagate,
  onClickCopyThisProduct,
  setModifyOptionState,
  media,
}) {
  return (
    <div className="cartListContainer">
      {Object.keys(cartState).length === 0 ? (
        <></>
      ) : (
        <div className="cartListBox">
          <div className="cartListHeadLine">
            <div>PRODUCT</div>
            {media === 'mobile' ? <></> : <div>PRICE</div>}
            <div>QUANTITY</div>
            {media === 'mobile' ? <></> : <div>TOTAL</div>}
          </div>
          <div className="cartContentContainer">
            {cartState.items === null ||
            cartState.items === undefined ||
            cartState.items.length === 0 ? (
              <div className="emptyCart">EMPTY CART</div>
            ) : (
              <>
                <CartContent
                  items={cartState.items}
                  setModifyOptionState={setModifyOptionState}
                  onClickQuantity={onClickQuantity}
                  onClickToRemove={onClickToRemove}
                  onClickNaviagate={onClickNaviagate}
                  onClickCopyThisProduct={onClickCopyThisProduct}
                  media={media}
                />
                <Button
                  type="warning"
                  className="cartSumCheckOutLine removeCart"
                  onClick={onClickRemoveAll}
                >
                  REMOVE ALL ITEMS IN CART
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CartContent({
  items,
  setModifyOptionState,
  onClickQuantity,
  onClickToRemove,
  onClickNaviagate,
  onClickCopyThisProduct,
  media,
}) {
  return (
    <>
      {items.map((item, index) => (
        <div
          className={`productLine${index % 2 === 1 ? ' odd' : ''}`}
          key={index}
        >
          {item.property.option.isSelect &&
          Object.keys(item.property.option.choice).length === 0 ? (
            <></>
          ) : (
            <div
              className="copyThisProduct"
              onClick={() => onClickCopyThisProduct(index)}
            >
              <div>+</div>
            </div>
          )}
          <div className="productCol">
            <div
              className="productPhotoBox pointer"
              onClick={() =>
                onClickNaviagate(
                  item.product_id,
                  item.property.product_url_name
                )
              }
            >
              <ProductImage
                src={item.property.thumb_photo}
                alt={item.property.product_name}
                type={'thumb_photo'}
              />
            </div>
            <div className="nameOptionBox">
              <div
                className={`productName${media === 'mobile' ? '' : ' pointer'}`}
                onClick={
                  media === 'mobile'
                    ? undefined
                    : () =>
                        onClickNaviagate(
                          item.product_id,
                          item.property.product_url_name
                        )
                }
              >
                {item.property.product_name}
              </div>

              <div className="optionBox">
                <RenderOption
                  product={item}
                  setModifyOptionState={setModifyOptionState}
                  index={index}
                />
              </div>
            </div>
          </div>
          {media === 'mobile' ? (
            <></>
          ) : (
            <div className="priceCol">฿{item.property.product_price}</div>
          )}
          {media === 'mobile' ? (
            <div className="quantityTotalPriceCol">
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
            </div>
          ) : (
            <>
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
            </>
          )}

          <div className="deleteCol" onClick={() => onClickToRemove(index)}>
            <div>X</div>
          </div>
        </div>
      ))}
    </>
  );
}

function CartSummaryBox({ cartState, onClickCheckOut, media }) {
  if (cartState.items !== null) {
    cartState.IsPassValidate = true;
    for (const item of cartState.items) {
      if (!item.validator.isAllOptionSelected) {
        cartState.IsPassValidate = false;
      }
    }
  }

  return (
    <div className="cartSumContainer">
      {Object.keys(cartState).length === 0 ? (
        <>
          <LoadingScene />
        </>
      ) : (
        <div className="cartSumBox">
          <div className="cartSumLine">
            <div className="cartSumHeadLine">CART SUMMARY</div>
            <div className="cartSumBodyLine">
              <div className="cartDetailLine">
                <div className="cartDetailName">subtotal</div>
                <div className="cartDetailValue">
                  ฿{cartState.summary.subtotal}
                </div>
              </div>
              {Object.entries(cartState.summary.priceChange).map(
                ([key, value]) =>
                  // Check if the value is 0, and return null to skip rendering the div
                  value !== 0 ? (
                    <div key={key} className="cartDetailLine">
                      <div className="cartDetailName">{key}</div>
                      <div className="cartDetailValue">฿{value}</div>
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
            <div>฿{cartState.summary.net}</div>
          </div>
          {cartState.items === null ||
          cartState.items === undefined ||
          cartState.items.length === 0 ||
          cartState.IsPassValidate === false ? (
            <Button
              type="green"
              className="cartSumCheckOutLine"
              isDisabled={true}
            >
              <IconContainer
                className="checkOutIcon"
                src={checkOutIcon}
                alt={'checkOutIcon'}
              />
              CHECK OUT
            </Button>
          ) : (
            <Button
              type="green"
              className="cartSumCheckOutLine"
              onClick={onClickCheckOut}
            >
              <IconContainer
                className="checkOutIcon"
                src={checkOutIcon}
                alt={'checkOutIcon'}
              />
              CHECK OUT
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

const initialState = {
  items: [],
  summary: {
    subtotal: 0,
    priceChange: { shipping: 0, TAX: 0, discount: 0 },
    net: 0,
  },
  errorMessage: '',
  IsPassValidate: false,
  note: '',
};

export default function Cart(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartState, dispatch] = useReducer(reducer, initialState);
  const [modifyOptionState, setModifyOptionState] = useState({
    index: 0,
    productToModify: {},
    state: false,
  });
  const [reviewCheck, setReviewCheck] = useState(false);
  const [rerender, setRerender] = useState(0);
  const { isDesktop, isTablet, isMobile } = useMediaContext();

  useEffect(() => {
    cartState.items = CartStorage.getCart();

    if (!cartState.items) {
      return;
    }
    const updatedItems = cartState.items.map((item) => {
      const newTotalPrice = parseFloat(
        (
          parseFloat(item.property.quantity) *
          parseFloat(item.property.product_price)
        ).toFixed(2)
      );

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
    const priceChangeValues = Object.values(cartState.summary.priceChange);
    const net =
      subtotal + priceChangeValues.reduce((total, value) => total + value, 0);
    // Dispatch the action with type "SET_CART" and the updated items, subtotal, and net
    dispatch({
      type: 'SET_CART',
      items: updatedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      net: parseFloat(net.toFixed(2)),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender]);
  useEffect(() => {
    if (location.pathname === '/cart') {
      setReviewCheck(false);
    }
    setRerender((e) => e + 1);
  }, [location]);

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

  const onClickToRemove = async (index) => {
    if (window.confirm('Confirm to Remove')) {
      await CartStorage.removeFromCart({
        all: false,
        index: index,
        product_id: cartState.items[index].product_id,
      });
      cartState.items.splice(index, 1);
      setRerender(rerender + 1);
      props.setShareState(props.shareState + 1);
    }
  };

  const onClickRemoveAll = async () => {
    if (window.confirm('Confirm to Remove All of Product In Cart????')) {
      const response = await CartStorage.removeFromCart({
        all: true,
      });
      if (response.success) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    }
  };

  const onClickCopyThisProduct = (index) => {
    const updatedItems = [...cartState.items];
    updatedItems.splice(index + 1, 0, updatedItems[index]);
    cartState.items = updatedItems;
    CartStorage.modifyCart(cartState.items);
    setRerender(rerender + 1);
    props.setShareState(props.shareState + 1);
  };

  const onCalcelReviewCheckOut = () => {
    navigate('/cart');
    setReviewCheck(false);
  };

  const onClickCheckOut = () => {
    if (cartState.items === null) {
      window.alert('No items in cart');
      return;
    }
    cartState.IsPassValidate = true;
    for (const item of cartState.items) {
      if (!item.validator.isAllOptionSelected) {
        cartState.IsPassValidate = false;
      }
    }
    if (cartState.IsPassValidate) {
      if (window.confirm('PLEASE REVIEW YOUR ORDER BEFORE CHECKOUT')) {
        navigate('/cart/reviewCheckOut');
        setReviewCheck(true);
      }
    } else {
      window.alert('Please select option');
    }
  };

  if (isMobile || isTablet) {
    return (
      <div className="cart">
        <CartOrderHeader nowPage="CartPage" />
        <div className="cartOrderContainerMobile">
          <CartList
            cartState={cartState}
            setModifyOptionState={setModifyOptionState}
            onClickNaviagate={onClickNaviagate}
            onClickQuantity={onClickQuantity}
            onClickToRemove={onClickToRemove}
            onClickCopyThisProduct={onClickCopyThisProduct}
            onClickRemoveAll={onClickRemoveAll}
            media={'mobile'}
          />
          {modifyOptionState.state ? (
            <Backdrop
              onCancel={() =>
                setModifyOptionState({
                  index: 0,
                  productToModify: {},
                  state: false,
                })
              }
            >
              <RenderModifyOption
                modifyOptionState={modifyOptionState}
                setModifyOptionState={setModifyOptionState}
                cartState={cartState}
              />
            </Backdrop>
          ) : (
            <></>
          )}
          <CartSummaryBox
            cartState={cartState}
            onClickCheckOut={onClickCheckOut}
            media={'mobile'}
          />
          {reviewCheck ? (
            <Backdrop onCancel={onCalcelReviewCheckOut}>
              <ReviewCheckOut
                cartState={cartState}
                onCalcelReviewCheckOut={onCalcelReviewCheckOut}
                media={'mobile'}
              />
            </Backdrop>
          ) : (
            <></>
          )}
        </div>
        <RecommendationSection />
      </div>
    );
  } else if (isDesktop || isTablet) {
    return (
      <div className="cart">
        <CartOrderHeader nowPage="CartPage" />
        <div className="cartOrederContainer">
          <div className="cartPage">
            <CartList
              cartState={cartState}
              setModifyOptionState={setModifyOptionState}
              onClickNaviagate={onClickNaviagate}
              onClickQuantity={onClickQuantity}
              onClickToRemove={onClickToRemove}
              onClickCopyThisProduct={onClickCopyThisProduct}
              onClickRemoveAll={onClickRemoveAll}
              media={'desktop'}
            />
            {modifyOptionState.state ? (
              <Backdrop
                onCancel={() =>
                  setModifyOptionState({
                    index: 0,
                    productToModify: {},
                    state: false,
                  })
                }
              >
                <RenderModifyOption
                  modifyOptionState={modifyOptionState}
                  setModifyOptionState={setModifyOptionState}
                  cartState={cartState}
                />
              </Backdrop>
            ) : (
              <></>
            )}
            <CartSummaryBox
              cartState={cartState}
              onClickCheckOut={onClickCheckOut}
              media={'desktop'}
            />
            {reviewCheck ? (
              <Backdrop onCancel={onCalcelReviewCheckOut}>
                <ReviewCheckOut
                  cartState={cartState}
                  onCalcelReviewCheckOut={onCalcelReviewCheckOut}
                  media={'desktop'}
                />
              </Backdrop>
            ) : (
              <></>
            )}
          </div>
        </div>
        <RecommendationSection />
      </div>
    );
  } else {
    return <></>;
  }
}
