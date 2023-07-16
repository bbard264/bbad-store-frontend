import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/Products.css';

import Header from '../components/Header';
import CategoryNavi from '../components/CategoryNavi';
import Footer from '../components/Footer';
import RecommendationsContainter from '../components/RecommendationsContainter';
import Card from '../components/Card.js';

import coverpic from '../assets/ex_products/cover_ex.jpg';

function mainContent(listofProducts, numPage) {
  // console.log('listofProducts', listofProducts);
  if (!listofProducts) {
    return;
  }
  function renderProductCards(products, numPage) {
    function coverCardBox() {
      return (
        <div className="cardBox cover" key="cover">
          <div>
            <img src={coverpic} alt="coverpicforproducts"></img>
          </div>
        </div>
      );
    }
    const productCards = products.map((product, index) => (
      <div className="cardBox" key={index}>
        <Card product={product} index={index} />
      </div>
    ));
    if (numPage === 1) {
      return [coverCardBox(), ...productCards];
    }
    return [...productCards];
  }

  return (
    <div className="mainContent productsPage">
      {renderProductCards(listofProducts, numPage)}
    </div>
  );
}

function pageNavi(numPage, lastNumPage, handlePageChange) {
  if (lastNumPage === 1) {
    return;
  }
  const handlePageOnClick = (newPage) => {
    if (newPage >= 1 && newPage <= lastNumPage) {
      handlePageChange(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Generate the page number links
    for (let page = 1; page <= lastNumPage; page++) {
      const isCurrentPage = page === numPage;
      const pageNumber = (
        <button
          key={page}
          className={isCurrentPage ? 'active' : ''}
          onClick={() => handlePageOnClick(page)}
        >
          {page}
        </button>
      );
      pageNumbers.push(pageNumber);
    }

    return pageNumbers;
  };

  return (
    <div className="pageNavi">
      <button
        disabled={numPage === 1}
        onClick={() => handlePageOnClick(numPage - 1)}
      >
        <div className="triangle left"></div>
      </button>
      {renderPageNumbers()}
      <button
        disabled={numPage === lastNumPage}
        onClick={() => handlePageOnClick(numPage + 1)}
      >
        <div className="triangle right"></div>
      </button>
    </div>
  );
}

const fetchProductList = async (category, page, setProductList) => {
  let apilink = `/api/product/getProductsList/${category ? category : 'all'}${
    page ? '/' + page : ''
  }`;

  try {
    const resProductList = await axios.get(apilink);
    setProductList(resProductList.data);
    return true;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return false;
  }
};

const fetchLastPage = async (category, setLastPage) => {
  let apilink = `/api/product/getLastPage${category ? '/' + category : ''}`;

  try {
    const resLastPage = await axios.get(apilink);
    setLastPage(resLastPage.data);
    return true;
  } catch (error) {
    console.error('Failed to fetch last page num:', error);
    return false;
  }
};

export default function Products() {
  const { routeParameter, routeParameter2 } = useParams();
  let numPage = 1;
  let category = '';

  if (!routeParameter) {
  } else if (!routeParameter2) {
    if (parseInt(routeParameter)) {
      numPage = parseInt(routeParameter);
    } else {
      category = routeParameter;
    }
  } else {
    category = routeParameter;
    numPage = parseInt(routeParameter2);
  }

  const navigate = useNavigate();
  const [productList, setProductList] = useState(null);
  const [lastPage, setLastPage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const lastPageFetchSuccessful = await fetchLastPage(
        category,
        setLastPage
      );

      if (!lastPageFetchSuccessful) {
        navigate('/404'); // Redirect to the 404 page if any fetch fails
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const productListFetchSuccessful = await fetchProductList(
        category,
        numPage,
        setProductList
      );

      if (!productListFetchSuccessful) {
        navigate('/404'); // Redirect to the 404 page if any fetch fails
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [numPage]);

  function handlePageChange(newPage) {
    if (category === '') {
      navigate(`/products/${newPage}`);
    } else {
      navigate(`/products/${category}/${newPage}`);
    }
  }

  return (
    <div className="ProductsPage">
      <Header />
      <CategoryNavi currentCategory={category} />
      {productList && lastPage ? (
        <React.Fragment>
          {pageNavi(numPage, lastPage, handlePageChange)}
          {mainContent(productList, numPage)}
          {pageNavi(numPage, lastPage, handlePageChange)}
          {/* <RecommendationsContainter /> */}
        </React.Fragment>
      ) : (
        <p>Loading...</p>
      )}

      <Footer />
    </div>
  );
}
