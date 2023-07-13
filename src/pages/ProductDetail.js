import React, { useState, useEffect } from 'react';
import '../styles/pages/ProductDetail.css';
import Header from '../components/Header';
import ArrowCorner from '../components/subcomponents/ArrowCorner';
import Footer from '../components/Footer';
import RecommendationsContainter from '../components/RecommendationsContainter';
import emptyHeartIcon from '../assets/icon/heart.png';
import fullHeartIcon from '../assets/icon/heart2.png';
import addIcon from '../assets/icon/add.png';
import cartIcon from '../assets/icon/cart.png';

import emptyStarIcon from '../assets/icon/star.png';
import fullStarIcon from '../assets/icon/star2.png';

import kuri from '../assets/ex_products/kuri.jpg';
import fizri from '../assets/ex_products/fizri.jpg';
import burni from '../assets/ex_products/Burni.jpg';

import wizhogFullImage from '../assets/ex_products/wizhog-full.jpg';
import faChalee3Image from '../assets/ex_products/FA_chalee3.jpg';
import chaleeImage from '../assets/ex_products/chalee.jpg';
import hugMomentImage from '../assets/ex_products/HugMoment.jpg';

// have product.id then request the product class
// have productdetail

//#region mock userReview

class UserReview {
  constructor(
    userImg = '',
    userName = '',
    userRank = '',
    reviewsRate = 0,
    reviewsDetails = '',
    postDate = ''
  ) {
    this.userImg = userImg;
    this.userName = userName;
    this.userRank = userRank;
    this.reviewsRate = reviewsRate;
    this.reviewsDetails = reviewsDetails;
    this.postDate = postDate;
  }
}

const userReviews = [];

const userReview1 = new UserReview(
  wizhogFullImage,
  'John Doe',
  'Tech Enthusiast',
  4.2,
  "I've been using this product for a while now, and it has exceeded my expectations. The design is sleek, and the performance is top-notch. I highly recommend it. I've been using this product for a while now, and it has exceeded my expectations. The design is sleek, and the performance is top-notch. I highly recommend it.",
  '7/1/2023'
);
userReviews.push(userReview1);

const userReview2 = new UserReview(
  faChalee3Image,
  'Jane Smith',
  'Fitness Enthusiast',
  3.8,
  'As someone who enjoys staying active, I found this product to be a great companion. It helps me track my workouts and stay motivated. However, I wish it had more advanced features for advanced users.',
  '6/30/2023'
);
userReviews.push(userReview2);

const userReview3 = new UserReview(
  chaleeImage,
  'Michael Johnson',
  'Outdoor Adventurer',
  4.5,
  "I take this product with me on all my outdoor adventures. It is rugged, waterproof, and withstands tough conditions. It's an essential tool for any outdoor enthusiast.",
  '6/29/2023'
);
userReviews.push(userReview3);

const userReview4 = new UserReview(
  hugMomentImage,
  'Emily Davis',
  'Photography Lover',
  4.7,
  "Being a photography enthusiast, this product has enhanced my skills and creativity. The image quality is outstanding, and the controls are intuitive. I'm extremely satisfied with my purchase.",
  '6/28/2023'
);
userReviews.push(userReview4);

const userReview5 = new UserReview(
  kuri,
  'David Thompson',
  'Gaming Enthusiast',
  3.2,
  "I bought this product mainly for gaming, and it performs decently. The graphics are good, but I've experienced occasional lag during intensive gaming sessions.",
  '6/27/2023'
);
userReviews.push(userReview5);

const userReview6 = new UserReview(
  fizri,
  'Sarah Wilson',
  'Fashionista',
  4.9,
  'This product is not only functional but also stylish. It complements my outfits perfectly and has become a fashion statement for me. I receive compliments wherever I go.',
  '6/26/2023'
);
userReviews.push(userReview6);

const userReviewsB = [];

const userReviewB1 = new UserReview(
  burni,
  'Alex Johnson',
  'Foodie',
  4.6,
  'I love this product! It has made cooking so much easier and enjoyable. The various features and settings allow me to experiment with different recipes and techniques. Highly recommended for any food lover.',
  '7/2/2023'
);
userReviewsB.push(userReviewB1);

const userReviewB2 = new UserReview(
  wizhogFullImage,
  'Sophia Davis',
  'Bookworm',
  4.4,
  'This product has become my favorite companion for reading. The display is crisp, and the adjustable brightness makes it comfortable for long reading sessions. The battery life is impressive too!',
  '7/1/2023'
);
userReviewsB.push(userReviewB2);

//#endregion mock userReview

//#region mock product [ProductObjects] class and artBookProduct8 product
class ProductObjects {
  constructor(
    id,
    name = '',
    category = '',
    mainPhoto = '',
    listAddPhoto = [],
    price = 0,
    rating = 0,
    shortDetail = '',
    fullDetail = '',
    options = {},
    favorite = false,
    userReviews = [],
    salesValue = 0,
    promotion = false,
    promName = '',
    promPrice = 0,
    promDayleft = 0
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.mainPhoto = mainPhoto;
    this.listAddPhoto = listAddPhoto;
    this.price = price;
    this.rating = rating;
    this.shortDetail = shortDetail;
    this.fullDetail = fullDetail;
    this.options = options;
    this.favorite = favorite;
    this.userReviews = userReviews;
    this.salesValue = salesValue;
    this.promotion = promotion;
    this.promName = promName;
    this.promPrice = promPrice;
    this.promDayleft = promDayleft;
  }
}

const obja = new ProductObjects(
  'AB08',
  'Modern Sculpture',
  'Art books',
  kuri,
  [fizri, burni],
  29.99,
  4.7,
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras auctor lectus id elit tristique tristique.',
  `Discover the world of modern sculpture with this comprehensive art book. Featuring stunning photographs and in-depth analysis, "Art Book: Modern Sculpture" takes you on a journey through the works of renowned sculptors from around the globe.
  
  Product Details:
  - Brand: Lorem Ipsum
  - Model: Ipsum 5000
  - Color: Midnight Black
  - Material: Premium stainless steel
  - Dimensions: 10" (H) x 6" (W) x 4" (D)
  - Weight: 1.5 lbs
  - Features: High-quality stainless steel, sleek design, ergonomic handle, non-stick surface, heat-resistant up to 500°F, dishwasher safe.
  - Package Includes: 1 x Lorem Ipsum Ipsum 5000 Cookware Set, 3 x Stainless steel lids, 1 x User manual.
  
  Whether you're an art enthusiast or a professional sculptor, this art book is a must-have addition to your collection. Immerse yourself in the world of modern sculpture and gain a deeper understanding of the artistic techniques, inspirations, and cultural contexts behind each masterpiece.
  
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam justo ante, non placerat felis consequat nec. Nunc et odio efficitur, aliquam nisl a, vehicula lorem. Nullam ac vulputate turpis.`,
  {
    Size: ['Small', 'Medium', 'Large'],
    Color: ['Red', 'Blue', 'Green'],
    Material: ['Cotton', 'Polyester', 'Silk'],
    Style: ['Casual', 'Formal', 'Sporty'],
  },
  true,
  userReviews,
  0,
  true,
  'Limited-time promotion',
  24.99,
  5
);

const objb = new ProductObjects(
  'TS001', // id
  'BBad T-Shirt', // name
  'Wearables', // category
  wizhogFullImage, // mainPhoto
  [
    faChalee3Image,
    chaleeImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
    hugMomentImage,
  ], // listAddPhoto
  19.99, // price
  4.5, // rating
  'A stylish T-shirt featuring the iconic character BBad.', // shortDetail
  'The BBad T-shirt is made from high-quality cotton and designed for comfort and durability. It showcases the popular character BBad in vibrant colors, making it a must-have for fans and collectors. Express your love for BBad with this unique and trendy T-shirt.', // fullDetail
  { Size: ['S', 'M', 'L'], Color: ['Black', 'White', 'Red'] }, // options
  true, // favorite
  [
    ...userReviewsB,
    ...userReviews,
    ...userReviews,
    ...userReviews,
    ...userReviews,
    ...userReviews,
    ...userReviews,
    ...userReviews,
    ...userReviews,
    ...userReviews,
    ...userReviews,
    ...userReviews,
  ], // listReviews
  15, // salesValue
  false, // promotion
  '', // promName
  0, // promPrice
  0 // promDayleft
);
//#endregion

function DetailSection({ product, widthPhoto }) {
  //#region HANDLE ALL IMG PRODUCT
  const listPhoto = [product.mainPhoto, ...product.listAddPhoto];
  const [showIndex, setShowIndex] = useState(0);

  const getIndexList = (index) => {
    setShowIndex(index);
  };

  const handleCornerClick = (direction) => {
    if (direction === 'right') {
      if (showIndex === listPhoto.length - 1) {
        return;
      }
      setShowIndex(showIndex + 1);
    } else if (direction === 'left') {
      if (showIndex === 0) {
        return;
      }
      setShowIndex(showIndex - 1);
    }
  };

  useEffect(() => {
    const photoContainers = document.getElementById('photoContainers');
    const leftCorner = document.getElementById('leftMainPhoto');
    const rightCorner = document.getElementById('rightMainPhoto');
    const thumPhotoContainers = document.getElementById('thumPhotoContainers');

    thumPhotoContainers.style.transform = `translate(-${
      showIndex * 8
    }em, -50%)`;
    photoContainers.style.transform = `translate(-${
      showIndex * widthPhoto
    }px, 0)`;

    leftCorner.style.opacity = showIndex === 0 ? '0' : '';
    rightCorner.style.opacity = showIndex === listPhoto.length - 1 ? '0' : '';
    leftCorner.style.cursor = showIndex === 0 ? 'auto' : 'pointer';
    rightCorner.style.cursor =
      showIndex === listPhoto.length - 1 ? 'auto' : 'pointer';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIndex]);

  function renderPhotoBoxes() {
    return listPhoto.map((photo, index) => (
      <div className="photoBox" key={index}>
        <img src={photo} alt={photo} />
      </div>
    ));
  }

  function renderThumPhotoBoxes() {
    return listPhoto.map((photo, index) => (
      <div
        className={`thumPhotoBox ${showIndex === index ? 'isShow' : ''}`}
        key={index}
        onClick={() => getIndexList(index)}
      >
        <img src={photo} alt={photo} />
      </div>
    ));
  }
  //#endregion HANDLE ALL IMG PRODUCT

  function ReviewSection({ userReviews }) {
    const columnLength = Math.ceil(userReviews.length / 2) - 1;
    const [columnNow, setColumnNow] = useState(0);

    const handleReviewCornerClick = (direction) => {
      if (direction === 'right') {
        if (columnNow === columnLength) {
          return;
        }
        setColumnNow(columnNow + 1);
      } else if (direction === 'left') {
        if (columnNow === 0) {
          return;
        }
        setColumnNow(columnNow - 1);
      }
    };

    useEffect(() => {
      const reviewContainers = document.getElementById('reviewContainers');
      const reviewsLeft = document.getElementById('reviewsLeft');
      const reviewsRight = document.getElementById('reviewsRight');
      const reviewsBox = document.querySelector('.reviewsBox');

      const reviewsBoxStyle = getComputedStyle(reviewsBox);
      const reviewsBoxWidth =
        +reviewsBox.offsetWidth +
        parseFloat(reviewsBoxStyle.marginLeft) +
        parseFloat(reviewsBoxStyle.marginRight);

      reviewContainers.style.transform = `translate(-${
        columnNow * reviewsBoxWidth
      }px, 0)`;

      reviewsLeft.style.opacity = columnNow === 0 ? '0' : '';
      reviewsLeft.style.cursor = columnNow === 0 ? 'auto' : 'pointer';

      reviewsRight.style.opacity = columnNow === columnLength ? '0' : '';
      reviewsRight.style.cursor =
        columnNow === columnLength ? 'auto' : 'pointer';

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnNow]);

    useEffect(() => {
      const adjustReviewLineHeight = () => {
        const reviewLine = document.querySelector('.reviewLine');
        const reviewContainers = document.getElementById('reviewContainers');
        const headSection = document.querySelector('.headSection');

        if (reviewLine && reviewContainers && headSection) {
          const reviewContainersStyles = getComputedStyle(reviewContainers);
          const headSectionStyles = getComputedStyle(headSection);
          const reviewContainersMarginTop = parseInt(
            reviewContainersStyles.marginTop
          );
          const reviewContainersMarginBottom = parseInt(
            reviewContainersStyles.marginBottom
          );
          const headSectionMarginTop = parseInt(headSectionStyles.marginTop);
          const headSectionMarginBottom = parseInt(
            headSectionStyles.marginBottom
          );

          const combinedHeight =
            reviewContainers.offsetHeight +
            reviewContainersMarginTop +
            reviewContainersMarginBottom +
            headSection.offsetHeight +
            headSectionMarginTop +
            headSectionMarginBottom;

          reviewLine.style.height = `${combinedHeight}px`;
        }
      };

      // Call the function initially and on window resize
      adjustReviewLineHeight();
      window.addEventListener('resize', adjustReviewLineHeight);

      // Clean up event listener on component unmount
      return () => {
        window.removeEventListener('resize', adjustReviewLineHeight);
      };
    }, [userReviews]);

    const getColumnNum = (index) => {
      let moveto = Math.ceil((index + 1) / 2) - 1;
      setColumnNow(moveto);
    };

    function renderUserReviews(userReviews) {
      return userReviews.map((userReview, index) => (
        <div
          className="reviewsBox"
          key={index}
          onClick={() => getColumnNum(index)}
        >
          <div className="reviewsCard">
            <div className="reviewsCardHeader">
              <div className="userImg">
                <img src={userReview.userImg} alt={userReview.userImg} />
              </div>
              <div className="userNameRank">
                <div className="userName">{userReview.userName}</div>
                <div className="userRank">{userReview.userRank}</div>
              </div>
              <div className="reviewsRate">
                <img src={fullStarIcon} alt="fullStarIcon" />
                <div>{userReview.reviewsRate}/5</div>
              </div>
            </div>
            <div className="reviewsDetails">{userReview.reviewsDetails}</div>
            <div className="postDate">{userReview.postDate}</div>
          </div>
        </div>
      ));
    }

    return (
      <div className="reviewLine">
        <h1 className="headSection">REVIEWS</h1>
        <ArrowCorner
          direction="left"
          onClick={() => handleReviewCornerClick('left')}
          id={'reviewsLeft'}
        />
        <ArrowCorner
          direction="right"
          onClick={() => handleReviewCornerClick('right')}
          id={'reviewsRight'}
        />
        <div className="reviewContainers" id="reviewContainers">
          {renderUserReviews(userReviews)}
        </div>
      </div>
    );
  }

  return (
    <div className="detailSection">
      <div className="photoLine" id="photoLine">
        <ArrowCorner
          direction="left"
          onClick={() => handleCornerClick('left')}
          id={'leftMainPhoto'}
        />
        <ArrowCorner
          direction="right"
          onClick={() => handleCornerClick('right')}
          id={'rightMainPhoto'}
        />
        <div
          className="photoFilter"
          id="photoFilter"
          onClick={() => handleCornerClick('right')}
        ></div>
        <div className="photoContainers" id="photoContainers">
          {renderPhotoBoxes()}
        </div>
      </div>
      <div className="thumPhotoLine">
        <div className="thumPhotoContainers" id="thumPhotoContainers">
          {renderThumPhotoBoxes()}
        </div>
      </div>
      <div className="fullDetailLine">
        <h1 className="headSection">DETAIL</h1>
        <div className="fullDetailSection">{product.fullDetail}</div>
      </div>
      <ReviewSection userReviews={product.userReviews} />
      <div className="recommendationsLine">
        <h1 className="headSection">Recommendations</h1>
        <RecommendationsContainter />
      </div>
    </div>
  );
}

//#region CommonSection
function CommonSection({ product }) {
  function renderStarRating(rating) {
    let maxRating = 5;
    let percentRating = (rating / 5) * 100 + '%';
    let emptyStars = [];
    let fullStars = [];
    for (let i = 0; i < maxRating; i++) {
      emptyStars.push(<img key={i} src={emptyStarIcon} alt=""></img>);
      fullStars.push(<img key={i} src={fullStarIcon} alt=""></img>);
    }

    return (
      <div className="star">
        <div className="nowRating" style={{ width: percentRating }}>
          {fullStars}
        </div>
        <div className="emptyRating">{emptyStars}</div>
      </div>
    );
  }

  function renderOption(options) {
    if (Object.entries(options).length === 0) {
      return null;
    } else {
      function renderChoices(options) {
        return Object.entries(options).map(([key, values]) => (
          <div className="optionContainer" key={key}>
            <div className="choiceName">{key}</div>
            <div className="choice">
              {values.map((value, index) => (
                <div key={`${key}-${index}`}>{value}</div>
              ))}
            </div>
          </div>
        ));
      }

      return <div className="optionsLine">{renderChoices(options)}</div>;
    }
  }

  function PlusMinusButton() {
    let [numAmount, setNumAmount] = useState(1);
    function minusNumAmount() {
      if (numAmount === 1) {
        return;
      } else {
        setNumAmount(numAmount - 1);
      }
    }
    function plusNumAmount() {
      setNumAmount(numAmount + 1);
    }
    return (
      <div className="plusMinusButton">
        <div className="minus" onClick={minusNumAmount}>
          <div>-</div>
        </div>
        <div className="numAmount">
          <div>{numAmount}</div>
        </div>
        <div className="plus" onClick={plusNumAmount}>
          <div>+</div>
        </div>
      </div>
    );
  }

  function addToCartButton() {
    return (
      <div className="addToCartButton">
        <div className="atcContainer">
          <img src={addIcon} alt="addIcon" />
          <img src={cartIcon} alt="cartIcon" />
        </div>
      </div>
    );
  }

  function favoriteButton(favorite) {
    function checkFavorite(favorite) {
      if (favorite) {
        return <img src={fullHeartIcon} alt="truefavorite"></img>;
      } else {
        return <img src={emptyHeartIcon} alt="falsefavorite"></img>;
      }
    }
    return <div className="favoriteButton">{checkFavorite(favorite)}</div>;
  }

  return (
    <div className="commonSection">
      <div className="FixedCommonSection" id="FixedCommonSection">
        <div className="nameLine">
          <h2>{product.category}</h2>
          <h1>{product.name}</h1>
        </div>
        <div className="rateLine">
          {renderStarRating(product.rating)}
          <div className="numReviews">{product.userReviews.length} reviews</div>
        </div>
        <div className="priceLine">
          <div>฿ {product.price}</div>
        </div>
        <div className="shortDetailLine">
          <div>{product.shortDetail}</div>
        </div>
        {renderOption(product.options)}
        <div className="functionLine">
          {PlusMinusButton()}
          {addToCartButton()}
          {favoriteButton(product.favorite)}
        </div>
      </div>
    </div>
  );
}

//#endregion CommonSection

export default function ProductDetail() {
  let testProduct = objb;

  const [widthPhoto, setWidthPhoto] = useState(0);

  useEffect(() => {
    const ratio = 4 / 3;
    const heightPhoto = 600;
    const widthPhoto = heightPhoto * ratio;
    setWidthPhoto(widthPhoto);
    const updateWidth = () => {
      const photoLine = document.getElementById('photoLine');
      const contentContainer = document.getElementById('contentContainer');
      photoLine.style.width = `${contentContainer.offsetWidth}px`;
      photoLine.style.height = `${heightPhoto}px`;
    };

    const updatePhotoStyles = () => {
      const photoContainers = document.getElementById('photoContainers');
      const photoFilter = document.getElementById('photoFilter');
      const photoBoxes = document.getElementsByClassName('photoBox');

      for (let i = 0; i < photoBoxes.length; i++) {
        const photoBox = photoBoxes[i];
        photoBox.style.height = `${heightPhoto}px`;
        photoBox.style.width = `${widthPhoto}px`;
      }

      photoFilter.style.width = `${widthPhoto}px`;
      photoFilter.style.left = `${widthPhoto}px`;
      photoContainers.style.height = `${heightPhoto}px`;
      photoContainers.style.width = `${
        widthPhoto * (testProduct.listAddPhoto.length + 1)
      }px`;
    };

    // Initial width update
    updateWidth();
    updatePhotoStyles();

    // Event listener for window resize
    window.addEventListener('resize', updateWidth);

    // Clean up event listener for window resize
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, [testProduct]);

  useEffect(() => {
    const applyStageStyles = (stage) => {
      const FixedCommonSection = document.getElementById('FixedCommonSection');
      if (stage === 1) {
        FixedCommonSection.style.top = '';
        FixedCommonSection.style.position = '';
        FixedCommonSection.style.alignItems = '';
        FixedCommonSection.style.justifyContent = '';
      } else if (stage === 2) {
        FixedCommonSection.style.top = '12%';
        FixedCommonSection.style.position = 'fixed';
        FixedCommonSection.style.bottom = '';
      } else if (stage === 3) {
        FixedCommonSection.style.top = 'auto';
        FixedCommonSection.style.bottom = '0%';
        FixedCommonSection.style.position = 'absolute';
        FixedCommonSection.style.alignItems = 'flex-start';
        FixedCommonSection.style.justifyContent = 'flex-end';
      }
    };

    let stage = 1;

    const handleScroll = () => {
      const nowPosition = document.documentElement.scrollTop;
      const nowPositionBot =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight -
        document.documentElement.scrollTop;
      let oldStage = stage;
      if (nowPosition <= 40 && nowPositionBot >= 120) {
        stage = 1;
      }
      if (nowPosition > 40 && nowPositionBot >= 120) {
        stage = 2;
      }
      if (nowPosition >= 40 && nowPositionBot < 120) {
        stage = 3;
      }
      if (oldStage === stage) {
        return;
      } else {
        applyStageStyles(stage);
      }
    };

    // Event listener for window scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up event listener for window scroll
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  //#endregion

  return (
    <div>
      <Header />
      <div className="contentContainer" id="contentContainer">
        <DetailSection product={testProduct} widthPhoto={widthPhoto} />
        <CommonSection product={testProduct} />
      </div>
      <Footer />
    </div>
  );
}
