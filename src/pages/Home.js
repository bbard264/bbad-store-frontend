import React, { useState } from 'react';
import CategoryNavi from '../components/CategoryNavi';
import '../styles/pages/Home.css';
import ArrowCorner from '../components/subcomponents/ArrowCorner.js';
import coverpic from '../assets/ex_products/cover_ex.jpg';
import not169 from '../assets/ex_products/OC_vince.jpg';
import testimg1691 from '../assets/ex_products/16-9test2.jpg';
import testimg1692 from '../assets/ex_products/16-9test3.jpg';
import testimg1693 from '../assets/ex_products/16-9test5.jpg';
import { useMediaContext } from '../config/services/MediaContext';

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
          alt={`${index}`}
        />
      );
    } else if (lastImg === index) {
      return (
        <img
          className="img-cover previous"
          key={index}
          src={img}
          alt={`${index}`}
        />
      );
    } else {
      return (
        <img className="img-cover" key={index} src={img} alt={`${index}`} />
      );
    }
  });
}
function CoverContent({ isMobile = false, isTablet = false }) {
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
  let startX = 0;

  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
    console.log(startX);
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    console.log(endX);
    const diff = endX - startX;

    if (diff > 50) {
      handleCornerClick('left');
    } else if (diff < -50) {
      handleCornerClick('right');
    }
  };
  if (isMobile || isTablet) {
    return (
      <div className="cover-container">
        <div className="cover-img-container">
          {centerPoint(topImg, imgCoverList.length, onCircleClick)}
          <div
            className="imgCoverContainer"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {renderImgCover(imgCoverList, topImg, lastImg)}
          </div>
        </div>
      </div>
    );
  } else {
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
}

export default function Home() {
  const { isTablet, isMobile } = useMediaContext();
  return (
    <div className="HomeContainer">
      <CoverContent isMobile={isMobile} isTablet={isTablet} />
      <CategoryNavi currentPage={'home'} />
    </div>
  );
}
