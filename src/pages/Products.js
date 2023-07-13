import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CategoryNavi from '../components/CategoryNavi';
import Footer from '../components/Footer';
import RecommendationsContainter from '../components/RecommendationsContainter';
import Card from '../components/Card.js';
import '../styles/pages/Products.css';
import coverpic from '../assets/ex_products/cover_ex.jpg';

import profSleeping from '../assets/ex_products/Prof,sleeping.jpg';
import whiteItem from '../assets/ex_products/WhiteItem.jpg';
import wizhogFull from '../assets/ex_products/wizhog-full.jpg';
import zangooseday from '../assets/ex_products/zangooseday.jpg';
import burni from '../assets/ex_products/Burni.jpg';
import chalee from '../assets/ex_products/chalee.jpg';
import faChalee3 from '../assets/ex_products/FA_chalee3.jpg';
import face from '../assets/ex_products/face.png';
import fizri from '../assets/ex_products/fizri.jpg';
import hugMoment from '../assets/ex_products/HugMoment.jpg';
import illustration7 from '../assets/ex_products/Illustration7.jpg';
import kuri from '../assets/ex_products/kuri.jpg';
import mmHotcho from '../assets/ex_products/mm_hotcho.jpg';

//create mock products
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
    this.favorite = favorite;
    this.salesValue = salesValue;
    this.promotion = promotion;
    this.promName = promName;
    this.promPrice = promPrice;
    this.promDayleft = promDayleft;
  }
}

//#region mock products
let wearableProduct1 = new Product(
    'Fitness Tracker',
    profSleeping,
    79.99,
    true,
    0,
    false
  ),
  wearableProduct2 = new Product(
    'Wireless Earbuds',
    whiteItem,
    129.99,
    true,
    0,
    true,
    'Premium Noise-Canceling Earbuds',
    99.99,
    7
  ),
  wearableProduct3 = new Product(
    'Smart Glasses',
    wizhogFull,
    299.99,
    false,
    0,
    false
  ),
  wearableProduct4 = new Product(
    'Smartwatch Pro',
    mmHotcho,
    249.99,
    true,
    0,
    true,
    'Limited Edition Smartwatch Pro',
    199.99,
    3
  ),
  wearableProduct5 = new Product(
    'Fitness Band',
    faChalee3,
    49.99,
    false,
    0,
    false
  ),
  wearableProduct6 = new Product(
    'Bluetooth Headphones',
    whiteItem,
    89.99,
    true,
    0,
    true,
    'Wireless Noise-Canceling Headphones',
    79.99,
    5
  ),
  wearableProduct7 = new Product(
    'Fitness Watch',
    profSleeping,
    69.99,
    false,
    0,
    true,
    'Slim Design Fitness Watch',
    59.99,
    5
  ),
  wearableProduct8 = new Product('Smart Ring', fizri, 149.99, true, 0, false),
  wearableProduct9 = new Product(
    'Sports Headband',
    whiteItem,
    19.99,
    false,
    0,
    false
  ),
  wearableProduct10 = new Product(
    'Sleep Tracker',
    mmHotcho,
    99.99,
    true,
    0,
    true,
    'Advanced Sleep Monitoring',
    89.99,
    4
  ),
  wearableProduct11 = new Product(
    'Wireless Sport Earphones',
    wizhogFull,
    79.99,
    true,
    0,
    false
  ),
  wearableProduct12 = new Product(
    'Fitness Smart Scale',
    face,
    49.99,
    false,
    0,
    true,
    'Body Composition Analyzer',
    39.99,
    6
  ),
  collectibleProduct1 = new Product(
    'Funko Pop! Figure',
    zangooseday,
    19.99,
    true,
    0,
    true,
    'Limited Edition Funko Pop!',
    14.99,
    2
  ),
  collectibleProduct2 = new Product(
    'Trading Card Set',
    burni,
    49.99,
    false,
    0,
    false
  ),
  collectibleProduct3 = new Product(
    'Comic Book',
    chalee,
    9.99,
    true,
    0,
    true,
    'First Edition Comic',
    7.99,
    6
  ),
  collectibleProduct4 = new Product(
    'Marvel Action Figure Set',
    profSleeping,
    79.99,
    false,
    0,
    false
  ),
  collectibleProduct5 = new Product(
    'Sports Memorabilia',
    face,
    149.99,
    true,
    0,
    true,
    'Signed Jersey Collection',
    129.99,
    4
  ),
  collectibleProduct6 = new Product(
    'Movie Poster',
    burni,
    9.99,
    true,
    0,
    true,
    'Limited Edition Movie Poster',
    7.99,
    7
  ),
  collectibleProduct7 = new Product(
    'Limited Edition Art Print',
    chalee,
    29.99,
    true,
    0,
    true,
    'Signed by the Artist',
    24.99,
    3
  ),
  collectibleProduct8 = new Product(
    'Antique Coin Set',
    zangooseday,
    99.99,
    false,
    0,
    false
  ),
  collectibleProduct9 = new Product(
    'Pop Culture Figurine',
    hugMoment,
    14.99,
    true,
    0,
    false
  ),
  collectibleProduct10 = new Product(
    'Movie Prop Replica',
    burni,
    249.99,
    false,
    0,
    true,
    'Premium Quality Reproduction',
    199.99,
    2
  ),
  collectibleProduct11 = new Product(
    'Sports Trading Card Collection',
    faChalee3,
    39.99,
    true,
    0,
    false
  ),
  collectibleProduct12 = new Product(
    'Vintage Vinyl Record',
    profSleeping,
    24.99,
    false,
    0,
    false
  ),
  artBookProduct1 = new Product(
    'Art Book: The Abstract Collection',
    faChalee3,
    29.99,
    false,
    0,
    false
  ),
  artBookProduct2 = new Product(
    'Art Book: Famous Paintings',
    face,
    39.99,
    true,
    0,
    true,
    'Deluxe Edition Art Book',
    34.99,
    4
  ),
  artBookProduct3 = new Product(
    'Art Book: The Sculpture Gallery',
    fizri,
    24.99,
    false,
    0,
    false
  ),
  artBookProduct4 = new Product(
    'Art Book: Modern Masters',
    zangooseday,
    34.99,
    false,
    0,
    false
  ),
  artBookProduct5 = new Product(
    'Art Book: Landscape Paintings',
    fizri,
    29.99,
    true,
    0,
    true,
    'Deluxe Edition Art Book',
    24.99,
    2
  ),
  artBookProduct6 = new Product(
    'Art Book: Portraits',
    illustration7,
    19.99,
    false,
    0,
    false
  ),
  artBookProduct7 = new Product(
    'Art Book: Abstract Expressionism',
    illustration7,
    39.99,
    true,
    0,
    false
  ),
  artBookProduct8 = new Product(
    'Art Book: Modern Sculpture',
    kuri,
    29.99,
    false,
    0,
    true,
    'In-depth Analysis and Photos',
    24.99,
    5
  ),
  artBookProduct9 = new Product(
    'Art Book: Street Art',
    faChalee3,
    19.99,
    true,
    0,
    false
  ),
  artBookProduct10 = new Product(
    'Art Book: Watercolor Painting',
    face,
    34.99,
    false,
    0,
    true,
    'Step-by-Step Tutorials',
    29.99,
    3
  ),
  artBookProduct11 = new Product(
    'Art Book: Calligraphy Techniques',
    fizri,
    24.99,
    true,
    0,
    false
  ),
  artBookProduct12 = new Product(
    'Art Book: Famous Illustrators',
    mmHotcho,
    29.99,
    false,
    0,
    false
  ),
  digitalProduct1 = new Product(
    'Game: Virtual Reality Adventure',
    hugMoment,
    29.99,
    true,
    0,
    false
  ),
  digitalProduct2 = new Product(
    'Music Album Download',
    illustration7,
    12.99,
    false,
    0,
    false
  ),
  digitalProduct3 = new Product(
    'Software: Photo Editing Suite',
    kuri,
    49.99,
    true,
    0,
    true,
    'Professional Edition Software',
    39.99,
    5
  ),
  digitalProduct4 = new Product(
    'Video Game Download',
    wizhogFull,
    49.99,
    true,
    0,
    false
  ),
  digitalProduct5 = new Product(
    'Ebook: Thriller Novel',
    profSleeping,
    7.99,
    false,
    0,
    false
  ),
  digitalProduct6 = new Product(
    'Software: Video Editing Suite',
    chalee,
    99.99,
    true,
    0,
    true,
    'Professional Edition Software',
    89.99,
    6
  ),
  digitalProduct7 = new Product(
    'Software: Graphic Design Suite',
    whiteItem,
    79.99,
    true,
    0,
    false
  ),
  digitalProduct8 = new Product(
    'Online Course: Photography Masterclass',
    illustration7,
    49.99,
    false,
    0,
    true,
    'Learn from Industry Experts',
    39.99,
    4
  ),
  digitalProduct9 = new Product(
    'Ebook: Fantasy Novel',
    kuri,
    7.99,
    true,
    0,
    false
  ),
  digitalProduct10 = new Product(
    'Mobile App: Language Learning',
    profSleeping,
    19.99,
    false,
    0,
    false
  ),
  digitalProduct11 = new Product(
    'Music Production Software',
    chalee,
    149.99,
    true,
    0,
    true,
    'Pro Edition with Advanced Features',
    129.99,
    6
  ),
  digitalProduct12 = new Product(
    'Video Game: Adventure RPG',
    zangooseday,
    59.99,
    false,
    0,
    false
  );

// List of Wearable Products
let wearableProducts = [
  wearableProduct1,
  wearableProduct2,
  wearableProduct3,
  wearableProduct4,
  wearableProduct5,
  wearableProduct6,
  wearableProduct7,
  wearableProduct8,
  wearableProduct9,
  wearableProduct10,
  wearableProduct11,
  wearableProduct12,
];

// List of Collectible Products
let collectibleProducts = [
  collectibleProduct1,
  collectibleProduct2,
  collectibleProduct3,
  collectibleProduct4,
  collectibleProduct5,
  collectibleProduct6,
  collectibleProduct7,
  collectibleProduct8,
  collectibleProduct9,
  collectibleProduct10,
  collectibleProduct11,
  collectibleProduct12,
];

// List of Art Book Products
let artBookProducts = [
  artBookProduct1,
  artBookProduct2,
  artBookProduct3,
  artBookProduct4,
  artBookProduct5,
  artBookProduct6,
  artBookProduct7,
  artBookProduct8,
  artBookProduct9,
  artBookProduct10,
  artBookProduct11,
  artBookProduct12,
];

// List of Digital Products
let digitalProducts = [
  digitalProduct1,
  digitalProduct2,
  digitalProduct3,
  digitalProduct4,
  digitalProduct5,
  digitalProduct6,
  digitalProduct7,
  digitalProduct8,
  digitalProduct9,
  digitalProduct10,
  digitalProduct11,
  digitalProduct12,
];

// List of All Products
// let allProducts = [
//   ...wearableProducts,
//   ...collectibleProducts,
//   ...artBookProducts,
//   ...digitalProducts,
// ];

//#endregion mock products

function MainContent({ listofProducts, numPage, handleFavoriteChange }) {
  function renderProductCards(products, numPage) {
    function coverCardBox() {
      return (
        <div className="cardBox cover" key="cover">
          <div>
            <img src={coverpic} alt="coverpicforproducts"></img>
          </div>
        </div>
      );
    }
    const productCards = products.map((product, index) => (
      <div className="cardBox" key={index}>
        <Card
          product={product}
          index={index}
          onFavoriteChange={handleFavoriteChange}
        />
      </div>
    ));
    if (numPage === 1) {
      return [coverCardBox(), ...productCards];
    }
    return [...productCards];
  }

  return (
    <div className="mainContent productsPage">
      {renderProductCards(listofProducts, numPage)}
    </div>
  );
}

function PageNavi({ numPage, lastNumPage, onPageChange }) {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastNumPage) {
      onPageChange(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Generate the page number links
    for (let page = 1; page <= lastNumPage; page++) {
      const isCurrentPage = page === numPage;
      const pageNumber = (
        <button
          key={page}
          className={isCurrentPage ? 'active' : ''}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      );
      pageNumbers.push(pageNumber);
    }

    return pageNumbers;
  };

  return (
    <div className="pageNavi">
      <button
        disabled={numPage === 1}
        onClick={() => handlePageChange(numPage - 1)}
      >
        <div className="triangle left"></div>
      </button>
      {renderPageNumbers()}
      <button
        disabled={numPage === lastNumPage}
        onClick={() => handlePageChange(numPage + 1)}
      >
        <div className="triangle right"></div>
      </button>
    </div>
  );
}

export default function Products() {
  let allProducts = [
    ...wearableProducts,
    ...collectibleProducts,
    ...artBookProducts,
    ...digitalProducts,
  ];

  let lastNumPage = Math.ceil((allProducts.length - 10) / 12) + 1;

  function getProductsByPage(numPage) {
    if (numPage === 1) {
      return allProducts.slice(0, 10);
    }
    const productsPerPage = 12;
    const startIndex = (numPage - 1) * productsPerPage - 1;
    const endIndex = startIndex + productsPerPage;
    return allProducts.slice(startIndex, endIndex);
  }

  const [numPage, setNumPage] = useState(1);
  const [products, setProducts] = useState(getProductsByPage(1));

  function handlePageChange(newPage) {
    setNumPage(newPage);
    setProducts(getProductsByPage(newPage));
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [numPage]);

  const handleFavoriteChange = (index, updatedFavorite) => {
    const updatedProducts = [...products];
    updatedProducts[index].favorite = updatedFavorite;
    // Update the products array
    setProducts(updatedProducts);
  };

  return (
    <div className="ProductsPage">
      <Header />
      <CategoryNavi />
      <PageNavi
        numPage={numPage}
        lastNumPage={lastNumPage}
        onPageChange={handlePageChange}
      />
      <MainContent
        listofProducts={products}
        numPage={numPage}
        handleFavoriteChange={handleFavoriteChange}
      />
      <PageNavi
        numPage={numPage}
        lastNumPage={lastNumPage}
        onPageChange={handlePageChange}
      />
      <RecommendationsContainter />
      <Footer />
    </div>
  );
}
