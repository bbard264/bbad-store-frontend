import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/ReviewingBox.css';
import StarRating from './subcomponents/StarRating';
import Button from './subcomponents/Button';
import UserDataStorage from '../config/services/UserDataStorage';
import { useNavigate } from 'react-router-dom';

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

  if (!item || Object.keys(item).length === 0) {
    return (
      <div className="reviewingBox empty">... SELECT PRODUCT TO REVIEW ...</div>
    );
  }

  async function onSubmitReview(e) {
    e.preventDefault();
    if (rating === 0 || rating === null || rating === undefined) {
      window.alert(`Can't leave blank star`);
      return;
    }

    if (isEdit) {
      if (
        item.review.rating === rating &&
        item.review.body === e.target.elements.reviewTextArea.value
      ) {
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
          body: e.target.elements.reviewTextArea.value,
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
        return;
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
          <img src={item?.thumb_photo} alt={item?.product_name} />
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
          ref={textareaRef} // Assign the ref to the textarea element
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
    </div>
  );
}

export default ReviewingBox;
