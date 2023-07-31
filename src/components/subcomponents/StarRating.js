import React, { useState } from 'react';
import '../../styles/components/subcomponents/StarRating.css';
import emptyStarIcon from '../../assets/icon/star.png';
import fullStarIcon from '../../assets/icon/star2.png';

function StarRating({ rating, isLetChange, setRating }) {
  const maxRating = 5;
  const percentRating = (rating / maxRating) * 100 + '%';

  function onClickStar(e) {
    if (!isLetChange) {
      return;
    } else {
      setRating(parseInt(e.target.id));
    }
  }

  let emptyStars = [];
  let fullStars = [];
  for (let i = 0; i < maxRating; i++) {
    emptyStars.push(
      <img
        key={i}
        id={i + 1}
        src={emptyStarIcon}
        alt=""
        onClick={onClickStar}
      ></img>
    );
    fullStars.push(
      <img
        key={i}
        id={i + 1}
        src={fullStarIcon}
        alt=""
        onClick={onClickStar}
      ></img>
    );
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

export default StarRating;
