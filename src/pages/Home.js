import React, { useState } from 'react';
import Header from '../components/Header';
import CategoryNavi from '../components/CategoryNavi';
import Footer from '../components/Footer';
import '../styles/pages/Home.css';
// --------------------- CoverContent import --------------------------------------------
import ArrowCorner from '../components/subcomponents/ArrowCorner.js';
import coverpic from '../assets/ex_products/cover_ex.jpg';
import not169 from '../assets/ex_products/OC_vince.jpg';
import testimg1691 from '../assets/ex_products/16-9test2.jpg';
import testimg1692 from '../assets/ex_products/16-9test3.jpg';
import testimg1693 from '../assets/ex_products/16-9test5.jpg';
// --------------------- MainContent import ------------------------------------------
import Card from '../components/Card.js';
import product1 from '../assets/ex_products/OC_vince.jpg';
import product2 from '../assets/ex_products/very hot.jpg';

console.log('OnTop');
// ---------------------------- CoverContent()--------------------------------------------

function centerPoint(imgChoosingIndex, numCircle, onClick) {
  return (
    <div className="centerPoint">
      {(() => {
        let allCircle = [];
        for (let i = 0; i < numCircle; i++) {
          if (i === imgChoosingIndex) {
            allCircle.push(
              <div key={i} className="circle circle-choosing"></div>
            );
            continue;
          }
          allCircle.push(
            <div key={i} className="circle" onClick={() => onClick(i)}></div>
          );
        }
        return allCircle;
      })()}
    </div>
  );
}

function getImgCover() {
  return [coverpic, testimg1691, testimg1692, testimg1693, not169];
}

const imgCoverList = getImgCover();

function renderImgCover(imgList, topImg, lastImg) {
  return imgList.map((img, index) => {
    if (topImg === index) {
      return (
        <img
          className="img-cover onTop"
          key={index}
          src={img}
          alt={`Image ${index}`}
        />
      );
    } else if (lastImg === index) {
      return (
        <img
          className="img-cover previous"
          key={index}
          src={img}
          alt={`Image ${index}`}
        />
      );
    } else {
      return (
        <img
          className="img-cover"
          key={index}
          src={img}
          alt={`Image ${index}`}
        />
      );
    }
  });
}
function CoverContent() {
  const [topImg, setTopImg] = useState(0);
  const [lastImg, setLastImg] = useState(imgCoverList.length);

  function handleCornerClick(direction) {
    let indexImg;
    if (direction === 'left') {
      indexImg = topImg - 1;
      if (indexImg === -1) {
        indexImg = imgCoverList.length - 1;
      }
    } else if (direction === 'right') {
      indexImg = topImg + 1;
      if (indexImg === imgCoverList.length) {
        indexImg = 0;
      }
    }

    setTopImg(() => {
      setLastImg(topImg);
      return indexImg;
    });
  }

  function onCircleClick(index) {
    setTopImg(() => {
      setLastImg(topImg);
      return index;
    });
  }

  return (
    <div className="cover-container">
      <div className="cover-img-container">
        <ArrowCorner
          direction="left"
          onClick={() => handleCornerClick('left')}
        />
        {centerPoint(topImg, imgCoverList.length, onCircleClick)}
        <ArrowCorner
          direction="right"
          onClick={() => handleCornerClick('right')}
        />
        {renderImgCover(imgCoverList, topImg, lastImg)}
      </div>
    </div>
  );
}

// ---------------------------- CoverContent()--------------------------------------------

// ----------------------------- MainContent()----------------------------------------------------

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

function SeeMoreCard() {
  return (
    <div className="seeMoreCard">
      <div>
        <div>SEE MORE</div>
        <div>PRODUCTS</div>
      </div>
    </div>
  );
}

function renderProductCards(products, handleFavoriteChange) {
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

function MainContent() {
  function handleFavoriteChange(index, updatedFavorite) {
    const updatedProducts = [...products];
    updatedProducts[index].favorite = updatedFavorite;
    setProducts(updatedProducts);
  }

  const [products, setProducts] = useState([
    testProd,
    promTestProd,
    testProd,
    promTestProd,
    testProd,
    testProd,
    testProd,
    testProd,
  ]);

  return (
    <div className="mainContent">
      {renderProductCards(products, handleFavoriteChange)}
      <div className="cardBox">
        <SeeMoreCard />
      </div>
    </div>
  );
}

// --------------------- MainContent()------------------------------------------

class Home extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <CoverContent />
        <CategoryNavi />
        {/* <MainContent /> */}
        <Footer />
      </div>
    );
  }
}

export default Home;
