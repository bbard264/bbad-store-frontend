import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/components/CategoryNavi.css';

function renderNavi(naviList, currentCategory, navigate) {
  return naviList.map((category) => (
    <div
      className={`categoryLink ${
        category._id === currentCategory ? 'activeCategory' : ''
      }`}
      key={category._id}
      onClick={() => navigate(`/products/${category._id}`)}
    >
      <div>{category.category_name}</div>
    </div>
  ));
}

const fetchCategoryList = async () => {
  try {
    const resCategoryList = await axios.get('/api/category/getcategorylist');
    return resCategoryList.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

let categoryList = await fetchCategoryList();

export default function CategoryNavi({ currentCategory }) {
  const navigate = useNavigate();
  return (
    <div className="categoryNavi">
      {categoryList !== undefined ? (
        <>
          <div
            className={`categoryLink ${
              currentCategory ? '' : 'activeCategory'
            }`}
            key={`all`}
            onClick={() => navigate('/products')}
          >
            <div>All</div>
          </div>
          {renderNavi(categoryList, currentCategory, navigate)}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
