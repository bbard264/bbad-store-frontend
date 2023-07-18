import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/components/CategoryNavi.css';
import CatgoryLastpage from '../config/services/CatagoryLastpage';

function renderNavi(naviObj, currentCategory, navigate) {
  const naviList = Object.values(naviObj);
  naviList.pop();
  return naviList.map((category) => (
    <div
      className={`categoryLink ${
        category.value._id === currentCategory ? 'activeCategory' : ''
      }`}
      key={category.value._id}
      onClick={() => navigate(`/products/${category.value._id}`)}
    >
      <div>{category.value.category_name}</div>
    </div>
  ));
}

const fetchCategoryList = async () => {
  try {
    const apilink = '/api/category/getCategoryList&Lastpage';
    console.log('requestAPI', apilink);
    const response = await axios.get(apilink);
    await CatgoryLastpage.setCatgoryLastpage(response.data);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

if (!CatgoryLastpage.getCatgoryLastpage()) {
  await fetchCategoryList();
}

export default function CategoryNavi({ currentCategory }) {
  const navigate = useNavigate();
  const categoryMap = CatgoryLastpage.getCatgoryLastpage();

  return (
    <div className="categoryNavi">
      {categoryMap !== undefined ? (
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
          {renderNavi(categoryMap, currentCategory, navigate)}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
