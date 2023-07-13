import React from 'react';
import '../styles/components/CategoryNavi.css';

export default function CategoryNavi() {
  return (
    <div className="catagory">
      <div className="catagoryLink">
        <a href="#">All</a>
      </div>
      <div className="catagoryLink">
        <a href="#">Wearables</a>
      </div>
      <div className="catagoryLink">
        <a href="#">Collectibles</a>
      </div>
      <div className="catagoryLink">
        <a href="#">Art Books</a>
      </div>
      <div className="catagoryLink">
        <a href="#">Digital Products</a>
      </div>
    </div>
  );
}
