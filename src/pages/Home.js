import React, { useState } from 'react';
import CategoryNavi from '../components/CategoryNavi';
import '../styles/pages/Home.css';
import ArrowCorner from '../components/subcomponents/ArrowCorner.js';
import { SlideTouchHorizontal } from '../components/subcomponents/SlideTouch';
import RecommendationSection from '../components/RecommendationSection';

import cover1 from '../assets/cover/homepageCover/cover1.jpg';
import cover2 from '../assets/cover/homepageCover/cover2.jpg';
import cover3 from '../assets/cover/homepageCover/cover3.jpg';
import cover4 from '../assets/cover/homepageCover/cover4.jpg';
import cover5 from '../assets/cover/homepageCover/cover5.jpg';

import { useMediaContext } from '../config/services/MediaContext';

function CenterPoint({ imgChoosingIndex, numCircle, onClick }) {
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

const imgCoverList = [cover1, cover2, cover3, cover4, cover5];

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

  if (isMobile) {
    return (
      <div className="cover-container">
        <div className="cover-img-container">
          <CenterPoint
            imgChoosingIndex={topImg}
            numCircle={imgCoverList.length}
            onClick={onCircleClick}
          />
          <SlideTouchHorizontal onSlide={handleCornerClick}>
            <div className="imgCoverContainer">
              {renderImgCover(imgCoverList, topImg, lastImg)}
            </div>
          </SlideTouchHorizontal>
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
          <CenterPoint
            imgChoosingIndex={topImg}
            numCircle={imgCoverList.length}
            onClick={onCircleClick}
          />
          <ArrowCorner
            direction="right"
            onClick={() => handleCornerClick('right')}
          />
          <SlideTouchHorizontal onSlide={handleCornerClick}>
            <div className="imgCoverContainer">
              {renderImgCover(imgCoverList, topImg, lastImg)}
            </div>
          </SlideTouchHorizontal>
        </div>
      </div>
    );
  }
}

export default function Home({ setRole, shareState, setShareState }) {
  const { isTablet, isMobile } = useMediaContext();
  return (
    <div className="HomeContainer">
      <CoverContent isMobile={isMobile} isTablet={isTablet} />
      <CategoryNavi currentPage={'home'} />
      <RecommendationSection
        shareState={shareState}
        setShareState={setShareState}
      />
    </div>
  );
}
