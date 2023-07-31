import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/ReviewingBox.css';
import StarRating from './subcomponents/StarRating';
import RESTapi from '../config/services/RESTapi';

function ReviewingBox({ item, setItemFocus }) {
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
    console.log('IsEdit', isEdit);

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

    if (!window.confirm('COMMIT CHANGING??')) {
      return;
    }

    try {
      if (isEdit) {
        const formData = {
          _id: item.review.review_id,
          rating: rating,
          body: e.target.elements.reviewTextArea.value,
        };
        const response = await RESTapi.modifyReview(formData);
        window.alert(`Editting Review is success? ` + response.isSuccess);
        sessionStorage.removeItem('USER_REVIEWS_LIST');
        window.location.reload();
      } else {
        const formData = {
          _id: item._id,
          rating: rating,
          body: e.target.elements.reviewTextArea.value,
        };
        console.log(formData);
        const response = await RESTapi.createNewReview(formData);
        window.alert(
          `Create New Review is success? ` +
            response.isSuccess +
            ` the review id: ` +
            response.data
        );
        sessionStorage.removeItem('USER_REVIEWS_LIST');
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

  return (
    <div className="reviewingBox">
      <div className="reviewingHeadLine">
        <div className="reviewingHeadLinePhotoCol">
          <img src={item?.product_photo} alt={item?.product_name} />
        </div>
        <div className="reviewingHeadLineNameCol">{item?.product_name}</div>
      </div>
      <div className="starInputLine">
        <StarRating rating={rating} isLetChange={true} setRating={setRating} />
      </div>
      <form
        className="bodyInputLine"
        onSubmit={onSubmitReview}
        id="bodyInputLine"
      >
        <textarea
          name="reviewTextArea"
          defaultValue={bodyText}
          ref={textareaRef} // Assign the ref to the textarea element
          placeholder="Enter your review here"
        />
      </form>
      <div className="buttonLine">
        <button onClick={() => setItemFocus({})}>CANCEL</button>
        <button onClick={onResetReview}>RESET</button>
        <button type="submit" form="bodyInputLine">
          SUBMIT
        </button>
      </div>
    </div>
  );
}

export default ReviewingBox;
