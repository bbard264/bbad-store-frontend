import React from 'react';
import UserDataStorage from '../config/services/UserDataStorage';
import '../styles/pages/Favorite.css';
import Card from '../components/Card.js';
import Button from '../components/subcomponents/Button';

export default function Favorite(props) {
  const favoriteList = UserDataStorage.getUserFavorite();
  async function onClickRemoveAll() {
    if (favoriteList.favorite_items.length === 0) {
      return;
    }
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
        {favoriteList.favorite_items.length === 0 ? (
          <></>
        ) : (
          <Button
            className="removeAllButton"
            onClick={onClickRemoveAll}
            type="warning"
          >
            REMOVE ALL ITEMS
          </Button>
        )}
      </div>
      <div className="mainContent favoritePage">
        {favoriteList.favorite_items.length === 0 ? (
          <div className="emptyFavorite">Empty Favorite</div>
        ) : (
          favoriteList.favorite_items.map((product, index) => (
            <div className="cardBox" key={index}>
              <Card
                product={product}
                index={index}
                shareState={props.shareState}
                setShareState={props.setShareState}
                isFavoritePage={true}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
