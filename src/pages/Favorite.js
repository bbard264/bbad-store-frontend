import React, { useState } from 'react';
import UserDataStorage from '../config/services/UserDataStorage';
import '../styles/pages/Favorite.css';
import Card from '../components/Card.js';

export default function Favorite(props) {
  const favoriteList = UserDataStorage.getUserFavorite();
  const [thisState, setThisState] = useState(props.shareState);
  async function onClickRemoveAll() {
    if (window.confirm('Remove all items from your favorite?')) {
      try {
        await UserDataStorage.removeFavorite({ _id: 'all' });
        window.alert('Removed all items from your favorite');
        window.location.reload();
      } catch (error) {
        console.error('error ot remove items in favorite', error);
      }
    } else {
      return;
    }
  }

  return (
    <div className="favoritePageContainer">
      <div className="favoriteHeader">
        <h1>Your Favorite Items</h1>
        <div className="removeAllButton" onClick={onClickRemoveAll}>
          REMOVE ALL ITEMS
        </div>
      </div>
      <div className="mainContent favoritePage">
        {favoriteList.favorite_items.map((product, index) => (
          <div className="cardBox" key={index}>
            <Card
              product={product}
              index={index}
              shareState={props.shareState}
              setShareState={props.setShareState}
              isFavoritePage={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
