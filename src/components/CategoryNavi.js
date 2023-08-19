import React from 'react';
import { useNavigate } from 'react-router-dom';
import RESTapi from '../config/services/RESTapi';
import '../styles/components/CategoryNavi.css';
import CatgoryLastpage from '../config/services/CatagoryLastpage';

function renderNavi(naviObj, currentCategory, navigate, currentPage) {
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
      <div className={currentPage}>{category.value.category_name}</div>
    </div>
  ));
}

export default function CategoryNavi({ currentCategory, currentPage }) {
  const navigate = useNavigate();
  if (!CatgoryLastpage.getCatgoryLastpage()) {
    RESTapi.fetchCategoryList();
  }
  const categoryMap = CatgoryLastpage.getCatgoryLastpage();

  return (
    <div className="categoryNavi">
      {categoryMap === null || categoryMap === undefined ? (
        <></>
      ) : (
        <>
          <div
            className={`categoryLink ${
              currentCategory || currentPage === 'home' ? '' : 'activeCategory'
            }`}
            key={`all`}
            onClick={() => navigate('/products')}
          >
            <div className={currentPage}>All</div>
          </div>
          {renderNavi(categoryMap, currentCategory, navigate, currentPage)}
        </>
      )}
    </div>
  );
}
