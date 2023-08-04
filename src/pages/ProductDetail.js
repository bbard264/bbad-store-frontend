import React, { useState, useEffect, useReducer } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import Token from '../config/services/Token';
import '../styles/pages/ProductDetail.css';

import ArrowCorner from '../components/subcomponents/ArrowCorner';
import StarRating from '../components/subcomponents/StarRating';

// import RecommendationsContainter from '../components/RecommendationsContainter';
import emptyHeartIcon from '../assets/icon/heart.png';
import fullHeartIcon from '../assets/icon/heart2.png';
import addIcon from '../assets/icon/add.png';
import cartIcon from '../assets/icon/cart.png';
import profileTemp from '../assets/temp_img/profile_temp.png';

import fullStarIcon from '../assets/icon/star2.png';

import CartStorage from '../config/services/CartStorage';
import UserDataStorage from '../config/services/UserDataStorage';
import RESTapi from '../config/services/RESTapi';
import { formatDatetoSTR } from '../config/services/General';
import Button from './../components/subcomponents/Button';
import Backdrop from '../components/subcomponents/Backdrop';
import ReviewingBox from '../components/ReviewingBox';

function ReviewSection({ reviews, product_id }) {
  const columnLength = Math.ceil(reviews.length / 2) - 1;
  const [columnNow, setColumnNow] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  console.log(product_id);
  const checkUserReviewProduct =
    UserDataStorage.checkUserReviewProduct(product_id);
  console.log(checkUserReviewProduct);

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
    reviewsRight.style.cursor = columnNow === columnLength ? 'auto' : 'pointer';

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
  }, [reviews]);

  const getColumnNum = (index) => {
    let moveto = Math.ceil((index + 1) / 2) - 1;
    setColumnNow(moveto);
  };
  return (
    <div className="reviewLine">
      {isReviewing ? (
        <Backdrop onCancel={() => setIsReviewing(false)}>
          <div className="ReviewingContainerProductDetail">
            <ReviewingBox
              item={UserDataStorage.getUserReview(product_id)}
              wantReset={false}
              letNavigate={false}
              onCancel={() => setIsReviewing(false)}
            />
          </div>
        </Backdrop>
      ) : (
        <></>
      )}
      <h1 className="headSection">
        REVIEWS
        {checkUserReviewProduct === 'NaverBuy' ? (
          <></>
        ) : checkUserReviewProduct === 'HaveReview' ? (
          <Button onClick={() => setIsReviewing(true)}>EDIT YOUR REVIEW</Button>
        ) : checkUserReviewProduct === 'HaveBuy' ? (
          <Button onClick={() => setIsReviewing(true)}>REVIEW PRODUCT</Button>
        ) : (
          <></>
        )}
      </h1>
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
      <div
        className={`reviewContainers${reviews.length === 1 ? ' isOne' : ''}`}
        id="reviewContainers"
      >
        {reviews.map((review, index) => (
          <div
            className="reviewsBox"
            key={index}
            onClick={() => getColumnNum(index)}
          >
            <div className="reviewsCard">
              <div className="reviewsCardHeader">
                <div className="userImg">
                  <img
                    src={review.user_photo ? review.user_photo : profileTemp}
                    alt={review.user_display_name}
                  />
                </div>
                <div className="userNameRank">
                  <div className="userName">{review.user_display_name}</div>
                </div>
                <div className="reviewsRate">
                  <img src={fullStarIcon} alt="fullStarIcon" />
                  <div>{review.rating}/5</div>
                </div>
              </div>
              <div className="reviewsDetails">{review.body}</div>
              <div className="postDate">
                {review.modify
                  ? `Edited:` + formatDatetoSTR(review.updated_at)
                  : formatDatetoSTR(review.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function DetailSection({ product, reviews }) {
  const listPhoto = product.product_photo;
  const [showIndex, setShowIndex] = useState(0);
  const [widthPhoto, setWidthPhoto] = useState(0);
  const checkUserReviewProduct = UserDataStorage.checkUserReviewProduct(
    product._id
  );
  const [isReviewing, setIsReviewing] = useState(false);

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
        widthPhoto * product.product_photo.length
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
  }, [product]);

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
    if (listPhoto === undefined) {
      return;
    }
    return listPhoto.map((photo, index) => (
      <div className="photoBox" key={index}>
        <img src={photo} alt={photo} />
      </div>
    ));
  }

  function renderThumPhotoBoxes() {
    if (listPhoto === undefined) {
      return;
    }
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
        <div className="fullDetailSection">{product.full_detail}</div>
      </div>
      {reviews.length > 0 ? (
        <ReviewSection reviews={reviews} product_id={product._id} />
      ) : (
        checkUserReviewProduct !== 'NeverBuy' &&
        checkUserReviewProduct !== 'HaveReview' &&
        checkUserReviewProduct === 'HaveBuy' && (
          <>
            {isReviewing && (
              <Backdrop onCancel={() => setIsReviewing(false)}>
                <div className="ReviewingContainerProductDetail">
                  <ReviewingBox
                    item={UserDataStorage.getUserReview(product._id)}
                    wantReset={false}
                    letNavigate={false}
                    onCancel={() => setIsReviewing(false)}
                  />
                </div>
              </Backdrop>
            )}
            <div className="reviewThisProductButton">
              <Button onClick={() => setIsReviewing(true)} type="submit">
                REVIEW THIS PRODUCT
              </Button>
            </div>
          </>
        )
      )}

      {/* <div className="recommendationsLine">
        <h1 className="headSection">Recommendations</h1>
        <RecommendationsContainter />
      </div> */}
    </div>
  );
}

// const emptyProductToCart = {
//   productId: '',
//   productName: '',
//   productPhoto: '',
//   option: {},
//   unitPrice: 0, // Numeric data type instead of 0
//   quantity: 0, // Numeric data type instead of 0
//   priceChange: { discount: 0 },
// };

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_OPTION':
      return {
        ...state,
        property: { ...state.property, option: action.payload },
      };

    case 'UPDATE_QUANTITY_INCREMENT':
      return {
        ...state,
        property: { ...state.property, quantity: state.property.quantity + 1 },
      };
    case 'UPDATE_QUANTITY_DECREMENT':
      if (state.property.quantity <= 1) {
        return { ...state, property: { ...state.property, quantity: 1 } };
      } else {
        return {
          ...state,
          property: {
            ...state.property,
            quantity: state.property.quantity - 1,
          },
        };
      }
    default:
      return state;
  }
}

//#region CommonSection
function CommonSection({ product, shareState, setShareState, reviewScore }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const [cartState, dispatch] = useReducer(reducer, {
    product_id: product._id,
    property: {
      product_name: product.product_name,
      product_photo: [product.product_photo[0]],
      product_url_name: product.product_url_name,
      option: product.option
        ? {
            isSelect: false,
            choice: {
              ...Object.fromEntries(
                Object.entries(product.option).map(([key, value]) =>
                  value.length === 1 ? [key, value] : [key, undefined]
                )
              ),
            },
          }
        : {},
      product_price: product.product_price,
      quantity: 1,
    },
  });

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

  function renderOption(options, handleOnRadioChange) {
    if (!options || Object.entries(options).length === 0) {
      return null;
    } else {
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
                    defaultChecked={options.length === 1}
                  />
                  <div className="radioName">{value}</div>
                </label>
              ))}
            </div>
          </div>
        );
      }

      return (
        <div className="optionsLine">
          {Object.entries(options).map(([key, values]) =>
            renderRadioChoices(values, key)
          )}
        </div>
      );
    }
  }

  function handleOnRadioChange(e) {
    const { name, value } = e.target;
    cartState.property.option.isSelect = true;
    cartState.property.option.choice[name] = [
      value,
      ...product.option[name].filter((item) => item !== value),
    ];
  }
  function addToCartButton() {
    async function handleOnClickAddToCart() {
      if (Token.getRole() === 'guest') {
        if (window.confirm(`You haven't login yet, go to Login?`)) {
          navigate('/login', { state: { from: location.pathname } });
          return;
        } else {
          setErrorMessage('Please Login first');
          return;
        }
      }
      const isOptionAllSelected = (option) => {
        if (!option || Object.keys(option).length === 0) {
          return true;
        }

        for (const key in option) {
          if (
            option.hasOwnProperty(key) &&
            (option[key] === undefined || option[key] === null)
          ) {
            return false;
          }
        }

        return true;
      };

      if (isOptionAllSelected(cartState.property.option.choice)) {
        if (window.confirm('Add to Cart?')) {
          console.log(cartState.property.product_photo);
          try {
            const newProductInCartToSave = {
              product_id: cartState.product_id,
              property: {
                product_name: cartState.property.product_name,
                product_photo: cartState.property.product_photo[0],
                product_url_name: cartState.property.product_url_name,
                option: cartState.property.option,
                product_price: cartState.property.product_price,
                quantity: cartState.property.quantity,
                totalPrice: 0,
                priceChange: { discount: 0 },
              },
              validator: { isStock: false, isAllOptionSelected: true },
              note: '',
            };
            const response = await CartStorage.addToCart(
              newProductInCartToSave
            );

            // Handle the response
            if (response.addToCart) {
              setShareState(shareState + 1);
              setErrorMessage('');
            } else {
              console.error(response.message);
              setErrorMessage(response.message);
            }
          } catch (error) {
            console.error('Error:', error.message);
            setErrorMessage(error.message);
          }
        }
      } else {
        setErrorMessage('Please select at least one each option');
      }
    }

    return (
      <div className="addToCartButton" onClick={handleOnClickAddToCart}>
        <div className="atcContainer">
          <img src={addIcon} alt="addIcon" />
          <img src={cartIcon} alt="cartIcon" />
        </div>
      </div>
    );
  }

  function FavoriteButton() {
    const userFavorite = UserDataStorage.getUserFavorite();
    const { favorite_items: favoriteItems = [] } = userFavorite || {};
    const [isFavorite, setIsFavorite] = useState(
      favoriteItems.some((item) => item._id === product._id)
    );

    async function onClickFavorite() {
      console.log(product);
      if (isFavorite) {
        try {
          await UserDataStorage.removeFavorite(product);
          setIsFavorite(!isFavorite);
        } catch (error) {
          return;
        }
      } else if (!isFavorite) {
        try {
          await UserDataStorage.addFavorite(product);
          setIsFavorite(!isFavorite);
        } catch (error) {
          return;
        }
      }
      setShareState(shareState + 1);
    }

    return (
      <div className="favoriteButton">
        <img
          src={isFavorite ? fullHeartIcon : emptyHeartIcon}
          alt={isFavorite ? `truefavorite` : `falsefavorite`}
          onClick={onClickFavorite}
        />
      </div>
    );
  }

  return (
    <div className="commonSection">
      <div className="FixedCommonSection" id="FixedCommonSection">
        <div className="nameLine">
          <h2>{product.category_id.toUpperCase()}</h2>
          <h1>{product.product_name}</h1>
        </div>
        <div className="rateLine">
          <StarRating rating={reviewScore.avgRating} />
          <div className="numReviews">{reviewScore.reviewNum} reviews</div>
        </div>
        <div className="priceLine">
          <div>฿ {product.product_price}</div>
        </div>
        <div className="shortDetailLine">
          <div>{product.short_details}</div>
        </div>
        {renderOption(product.option, handleOnRadioChange)}
        <div className="functionLine">
          <div className="plusMinusButton">
            <div
              className="minus"
              onClick={() => dispatch({ type: 'UPDATE_QUANTITY_DECREMENT' })}
            >
              <div>-</div>
            </div>
            <div className="numAmount">
              <div>{cartState.property.quantity}</div>
            </div>
            <div
              className="plus"
              onClick={() => dispatch({ type: 'UPDATE_QUANTITY_INCREMENT' })}
            >
              <div>+</div>
            </div>
          </div>
          {addToCartButton()}
          <FavoriteButton />
        </div>
        <div className="warningMessage">{errorMessage}</div>
      </div>
    </div>
  );
}

//#endregion CommonSection

async function fetchProduct(productId) {
  let requestAPI = `/api/product/getProductById/${productId}`;
  console.log('requestAPI', requestAPI);
  try {
    const response = await axios.get(requestAPI);
    const product = response.data;
    return product;
  } catch (error) {
    throw error;
  }
}

function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) {
    return 0; // Handle the case when there are no reviews to avoid division by zero.
  }

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  return averageRating;
}

export default function ProductDetail(props) {
  const { productId } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    async function getProduct() {
      try {
        if (location.state) {
          setProduct(location.state.product);
        } else {
          const fetchedProduct = await fetchProduct(productId.slice(3));
          setProduct(fetchedProduct);
        }
      } catch (error) {
        console.error(error);
      }
    }
    async function getReview() {
      try {
        const fetchedReviews = await RESTapi.getReviewsByProduct({
          _id: productId.slice(3),
        });
        if (fetchedReviews.isSuccess) {
          setReviews(fetchedReviews.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getReview();
    getProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!product || !reviews) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {product ? (
        <div className="contentContainer" id="contentContainer">
          <DetailSection product={product} reviews={reviews} />
          <CommonSection
            product={product}
            shareState={props.shareState}
            setShareState={props.setShareState}
            reviewScore={{
              reviewNum: reviews ? reviews.length : 0,
              avgRating: calculateAverageRating(reviews),
            }}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
