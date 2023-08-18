import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/ReviewingBox.css';
import StarRating from './subcomponents/StarRating';
import Button from './subcomponents/Button';
import UserDataStorage from '../config/services/UserDataStorage';
import { useNavigate } from 'react-router-dom';
import ProductImage from './subcomponents/ProductImage';

function ReviewingBox({
  item,
  wantReset = true,
  letNavigate = true,
  onCancel,
}) {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [bodyText, setBodyText] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [errorM, setErrorM] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (item && item.review && Object.keys(item.review).length > 0) {
      setRating(item.review.rating);
      setBodyText(item.review.body);
      setIsEdit(true);
      if (textareaRef.current) {
        textareaRef.current.value = item.review.body;
      }
    } else {
      setRating(0);
      setBodyText('');
      setIsEdit(false);
      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
    }
  }, [item]);

  useEffect(() => {
    if (!item || Object.keys(item).length === 0) {
      return;
    } else {
      const textarea = document.getElementById('reviewTextArea'); // Replace with the actual ID of your textarea element
      textarea.addEventListener('focus', () => setErrorM(''));

      return () => {
        textarea.removeEventListener('focus', () => setErrorM(''));
      };
    }
  }, []);

  useEffect(() => {
    if (errorM === '') {
      return;
    } else {
      setErrorM('');
    }
    // eslint-disable-next-line
  }, [textareaRef.current, rating]);

  if (!item || Object.keys(item).length === 0) {
    return (
      <div className="reviewingBox empty">... SELECT PRODUCT TO REVIEW ...</div>
    );
  }

  async function onSubmitReview(e) {
    e.preventDefault();
    const finalBody = e.target.elements.reviewTextArea.value;
    if (rating === 0 || rating === null || rating === undefined) {
      setErrorM('Please give us rating score before commit review or edit');
      return;
    }
    if (!(typeof finalBody === 'string' && finalBody.trim() !== '')) {
      setErrorM('Please leave some text before commit review or edit');
      return;
    }

    if (isEdit) {
      if (item.review.rating === rating && item.review.body === finalBody) {
        window.alert('Nothing change');
        return;
      }
    }

    try {
      if (isEdit) {
        if (!window.confirm('COMMIT CHANGING??')) {
          return;
        }
        const formData = {
          _id: item.review._id,
          rating: rating,
          body: finalBody,
        };

        const response = await UserDataStorage.modifyReview(formData);
        window.alert(`Editting Review is success? ` + response.isSuccess);

        window.location.reload();
      } else {
        if (!window.confirm('COMMIT REVIEW??')) {
          return;
        }
        const formData = {
          product_id: item.product_id,
          rating: rating,
          body: e.target.elements.reviewTextArea.value,
        };
        const response = await UserDataStorage.createNewReview(formData);
        window.alert(`Create New Review is success? ` + response.isSuccess);

        window.location.reload();
      }
    } catch (error) {
      window.alert('false to create/edit review');
    }
  }

  function onResetReview() {
    if (Object.keys(item.review).length > 0) {
      setRating(item.review.rating);
      setBodyText(item.review.body);
    } else {
      setRating(0);
      setBodyText('');
    }

    if (textareaRef.current) {
      textareaRef.current.value = bodyText;
    }
  }

  async function onRemoveReview() {
    if (window.confirm('ARE YOU SURE TO REMOVE THIS REVIEW?')) {
      try {
        UserDataStorage.removeReview(item);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  }
  function onClickNavigate() {
    if (letNavigate) {
      navigate(`/product-detail/${'id=' + item?.product_id}`);
    }
  }
  return (
    <div className="reviewingBox">
      <div className="reviewingHeadLine">
        <div
          className={`reviewingHeadLinePhotoCol${
            letNavigate ? ' letNavigate' : ''
          }`}
          onClick={onClickNavigate}
        >
          <ProductImage
            src={item?.thumb_photo}
            alt={item?.product_name}
            type={'thumb_photo'}
          />
        </div>
        <div
          className={`reviewingHeadLineNameCol${
            letNavigate ? ' letNavigate' : ''
          }`}
          onClick={onClickNavigate}
        >
          {item?.product_name}
        </div>
        <div className="starInputLine">
          <StarRating
            rating={rating}
            isLetChange={true}
            setRating={setRating}
          />
        </div>
      </div>

      <form
        className="bodyInputLine"
        onSubmit={onSubmitReview}
        id="bodyInputLine"
      >
        <textarea
          name="reviewTextArea"
          className="reviewTextArea"
          defaultValue={bodyText}
          ref={textareaRef}
          id={'reviewTextArea'}
          placeholder="Enter your review here"
        />
      </form>
      <div className="buttonLine">
        <Button onClick={onCancel}>CANCEL</Button>
        {isEdit ? (
          <Button type="warning" onClick={onRemoveReview}>
            REMOVE
          </Button>
        ) : wantReset ? (
          <Button type="warning" onClick={onResetReview}>
            RESET
          </Button>
        ) : (
          <></>
        )}

        <Button type={'submit'} form={'bodyInputLine'}>
          SUBMIT
        </Button>
      </div>
      <div className="errorMessage">{errorM}</div>
    </div>
  );
}

export default ReviewingBox;
