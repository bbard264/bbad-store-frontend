import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from './Card.js';
import ArrowCorner from './subcomponents/ArrowCorner.js';
import '../styles/components/RecommendationsContainter.css';
import RESTapi from '../config/services/RESTapi';
import { useMediaContext } from '../config/services/MediaContext.js';
import clickIcon from '../assets/icon/clicking.png';
import IconContainer from './subcomponents/IconContainer.js';

export default function RecomendationSection({ shareState, setShareState }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [recList, setRecList] = useState([]);
  const [showIndex, setShowIndex] = useState(0);
  const { isMobile, isTablet, isDesktop } = useMediaContext();
  useEffect(() => {
    const fetchRecList = async () => {
      try {
        const response = await RESTapi.getRecommendProduct();
        setRecList(response.data);
        setIsLoaded(true);
      } catch (error) {
        return;
      }
    };
    fetchRecList();
  }, []);
  useEffect(() => {
    if (isMobile) {
      return;
    } else {
      const recBox = document.getElementById('recBox');
      if (!recBox) {
        return;
      }
      const styles = getComputedStyle(recBox);
      const widthCardValue = styles.getPropertyValue('--width-card');
      const widthCardInt = parseInt(widthCardValue, 10);
      recBox.style.transform = `translateX(${-widthCardInt * showIndex}em)`;
    }
  }, [isMobile, showIndex]);
  const onClickCorner = (direction) => {
    if (direction === 'left' && showIndex >= 0) {
      setShowIndex((e) => (e = e - 1));
    } else if (direction === 'right' && showIndex < 7) {
      setShowIndex((e) => (e = e + 1));
    }
  };
  if (!isLoaded || recList.length === 0) {
    return <></>;
  } else if (location.pathname === '/home') {
    return (
      <div className="recHomeContainter">
        <div className="recHeader">
          <h1>Recommendations</h1>
        </div>
        <div className="recHomeBox">
          {recList.map((product, index) => {
            return (
              <div className="cardBox" key={'card' + index}>
                <Card
                  product={product}
                  index={index}
                  shareState={shareState}
                  setShareState={setShareState}
                />
              </div>
            );
          })}
          <div className="seeMoreCard" onClick={() => navigate('/products')}>
            <div className="seeMoreCardText">
              <IconContainer src={clickIcon} alt={'clikcing'} />
              SEE MORE PRODUCT
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="recHeader">
          <h1>RECOMMENDATIONS</h1>
        </div>
        <div className="recContainter">
          {isMobile ? (
            <></>
          ) : (
            <>
              <ArrowCorner
                className={showIndex <= 0 ? '' : 'show'}
                direction="left"
                onClick={onClickCorner}
              />
              <ArrowCorner
                className={showIndex >= 7 ? '' : 'show'}
                direction="right"
                onClick={onClickCorner}
              />
            </>
          )}
          <div className="recSlider">
            <div className="recBox" id="recBox">
              {recList.map((product, index) => {
                return (
                  <div className="cardBox" key={'card' + index}>
                    <Card
                      product={product}
                      index={index}
                      shareState={shareState}
                      setShareState={setShareState}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
}
