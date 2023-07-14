import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/components/CategoryNavi.css';

function renderNavi(naviList, currentCategory) {
  return naviList.map((category) => (
    <div
      className={`categoryLink ${
        category._id === currentCategory ? 'activeCategory' : ''
      }`}
      key={category._id}
    >
      <a href={`/products/${category._id}`}>{category.category_name}</a>
    </div>
  ));
}

const fetchCategoryList = async () => {
  try {
    const resCategoryList = await axios.get('/api/categorylist');
    return resCategoryList.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

let categoryList = await fetchCategoryList();

export default function CategoryNavi({ currentCategory }) {
  return (
    <div className="categoryNavi">
      <div
        className={`categoryLink ${currentCategory ? '' : 'activeCategory'}`}
        key={`all`}
      >
        <a href={`/products/`}>All</a>
      </div>
      {renderNavi(categoryList, currentCategory)}
    </div>
  );
}
