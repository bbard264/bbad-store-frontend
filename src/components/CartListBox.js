import React from 'react';
import '../styles/components/CartListBox.css';

function renderOption(productOptionList) {
  return productOptionList.map((option, index) => (
    <div className="option" ket={index}>
      {option}
    </div>
  ));
}

function renderCartContent(productCartList) {
  return productCartList.map((product, index) => (
    <div className="productLine" key={index}>
      <div className="productCol">
        <div className="productPhotoBox">
          <img src={product.productPhoto} alt={product.productName} />
        </div>
        <div className="NameOptionBox">
          <div className="productName">{product.productName}</div>
          <div className="optionBox">{renderOption(product.productOption)}</div>
        </div>
      </div>
      <div className="priceCol">฿{product.productPrice}</div>
      <div className="quantityCol">{product.quantity}</div>
      <div className="totalCol">
        ฿
        {(
          parseFloat(product.productPrice) * parseFloat(product.quantity)
        ).toFixed(2)}
      </div>
      <div className="deleteCol">X</div>
    </div>
  ));
}

export default function CartListBox({ productCartList }) {
  return (
    <div className="cartListBox">
      <div className="cartListHeadLine">
        <div>PRODUCT</div>
        <div>PRICE</div>
        <div>QUANTITY</div>
        <div>TOTAL</div>
      </div>
      <div className="cartContentContainer">
        {renderCartContent(productCartList)}
      </div>
    </div>
  );
}
