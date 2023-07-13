import React, { useState, useEffect } from 'react';
import product1 from '../assets/ex_products/OC_vince.jpg';
import product2 from '../assets/ex_products/very hot.jpg';
import Card from './Card.js';
import ArrowCorner from './subcomponents/ArrowCorner.js';
import '../styles/components/RecommendationsContainter.css';

class Product {
  constructor(
    name,
    photo,
    price,
    favorite = false,
    salesValue = 0,
    promotion = false,
    promName = '',
    promPrice = 0,
    promDayleft = 0
  ) {
    this.name = name;
    this.photo = photo;
    this.price = price;
    this.favorite = favorite; // true or false // get from user
    this.salesValue = salesValue;
    this.promotion = promotion; // true or false only // get from admin
    this.promName = promName; // if promotion = false, this should be empty
    this.promPrice = promPrice; // if promotion = false, this should be empty
    this.promDayleft = promDayleft; // if promotion = false, this should be empty
  }
}

let promTestProd = new Product(
  'promTestProd',
  product1,
  '4999',
  true,
  300,
  true,
  'TestProm',
  '300',
  '24'
);
let testProd = new Product(
  'testProd',
  product2,
  '3000',
  false,
  300,
  false,
  '',
  '',
  ''
);

let myProducts = [
  testProd,
  promTestProd,
  testProd,
  promTestProd,
  testProd,
  testProd,
  testProd,
  testProd,
];

export default function RecomendationsContainter() {
  const [products, setProducts] = useState(myProducts);
  const [recState, setRecState] = useState(0);
  let recLength = myProducts.length - 2;
  const handleRecCornerClick = (direction) => {
    if (direction === 'right') {
      if (recState === recLength) {
        return;
      }
      setRecState(recState + 1);
    } else if (direction === 'left') {
      if (recState === 0) {
        return;
      }
      setRecState(recState - 1);
    }
  };

  useEffect(() => {
    const recommendationsBox = document.getElementById('recommendationsBox');
    const leftRecPhoto = document.getElementById('leftRecPhoto');
    const rightRecPhoto = document.getElementById('rightRecPhoto');
    recommendationsBox.style.transform = `translate(-${recState * 16}em, 0)`;

    leftRecPhoto.style.opacity = recState === 0 ? '0' : '';
    leftRecPhoto.style.cursor = recState === 0 ? 'auto' : 'pointer';

    rightRecPhoto.style.opacity = recState === recLength ? '0' : '';
    rightRecPhoto.style.cursor = recState === recLength ? 'auto' : 'pointer';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recState]);

  const handleFavoriteChange = (index, updatedFavorite) => {
    const updatedProducts = [...products];
    updatedProducts[index].favorite = updatedFavorite;
    setProducts(updatedProducts);
  };

  function renderProductCards(products) {
    return products.map((product, index) => (
      <div className="cardBox" key={index}>
        <Card
          product={product}
          index={index}
          onFavoriteChange={handleFavoriteChange}
        />
      </div>
    ));
  }

  return (
    <div className="recomendationsContainter">
      <ArrowCorner
        direction="left"
        onClick={() => handleRecCornerClick('left')}
        id={'leftRecPhoto'}
      />
      <ArrowCorner
        direction="right"
        onClick={() => handleRecCornerClick('right')}
        id={'rightRecPhoto'}
      />
      <div className="recommendationsBox" id="recommendationsBox">
        {renderProductCards(products)}
      </div>
    </div>
  );
}
