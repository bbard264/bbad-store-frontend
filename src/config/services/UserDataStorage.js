import Token from './Token';
import RESTapi from './RESTapi';
import profileTemp from '../../assets/temp_img/profile_temp.png';

class UserDataStorage {
  static checkTokenAndRun(method) {
    if (Token.getToken()) {
      return method();
    } else {
      this.removeUserData();
      return false;
    }
  }

  static async setUserData(data) {
    await this.checkTokenAndRun(() => {
      localStorage.setItem('USER_DATA', JSON.stringify(data));
    });
  }

  static getUserData() {
    return this.checkTokenAndRun(() => {
      return JSON.parse(localStorage.getItem('USER_DATA'));
    });
  }

  static removeUserData() {
    localStorage.removeItem('USER_DATA');
    localStorage.removeItem('USER_IMAGE');
    localStorage.removeItem('USER_CART');
    localStorage.removeItem('USER_FAVORITE');
    localStorage.removeItem('USER_REVIEWS_LIST');
  }

  static async setUserImage(imageUrl) {
    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(
          'Failed to fetch image. Response status: ' + response.status
        );
      }

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = function () {
        localStorage.setItem('USER_IMAGE', reader.result);
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error fetching image:', error);
      const tempResponse = await fetch(profileTemp);
      const tempBlob = await tempResponse.blob();
      const tempReader = new FileReader();

      tempReader.onloadend = function () {
        localStorage.setItem('USER_IMAGE', tempReader.result);
      };

      tempReader.readAsDataURL(tempBlob);
    }
  }

  static getUserImage() {
    return this.checkTokenAndRun(() => {
      return localStorage.getItem('USER_IMAGE');
    });
  }

  static async setUserFavorite() {
    return this.checkTokenAndRun(async () => {
      try {
        const response = await RESTapi.getFavorite();
        if (response.getFavorite && response.data !== undefined) {
          localStorage.setItem('USER_FAVORITE', JSON.stringify(response.data));
        }
        return response;
      } catch (error) {
        console.error('Error setting favorite data :', error);
        throw new Error('Failed to retrieve favorite. Please try again later.');
      }
    });
  }

  static async addFavorite(props) {
    return this.checkTokenAndRun(async () => {
      try {
        const oldData = JSON.parse(localStorage.getItem('USER_FAVORITE'));

        const newData = {
          favorite_items: [...oldData.favorite_items, props],
        };

        localStorage.setItem('USER_FAVORITE', JSON.stringify(newData));
        const response = await RESTapi.addFavorite({
          product_id: props._id,
        });
        return response;
      } catch (error) {
        console.error('Error add new favorite data :', error);
        throw new Error('Failed to add new favorite. Please try again later.');
      }
    });
  }

  static async removeFavorite(props) {
    return this.checkTokenAndRun(async () => {
      try {
        if (props._id !== 'all') {
          const userFavorite = JSON.parse(
            localStorage.getItem('USER_FAVORITE')
          );
          userFavorite.favorite_items = userFavorite.favorite_items.filter(
            (item) => item._id !== props._id
          );
          localStorage.setItem('USER_FAVORITE', JSON.stringify(userFavorite));
        } else {
          localStorage.removeItem('USER_FAVORITE');
          localStorage.setItem(
            'USER_FAVORITE',
            JSON.stringify({ favorite_items: [] })
          );
        }
        const response = await RESTapi.removeFavorite({
          product_id: props._id,
        });

        return response;
      } catch (error) {
        console.error('Error removing favorite data :', error);
        throw new Error('Failed to remove favorite. Please try again later.');
      }
    });
  }

  static getUserFavorite() {
    return this.checkTokenAndRun(() => {
      return JSON.parse(localStorage.getItem('USER_FAVORITE')); // Corrected key from this.storage_key to 'USER_IMAGE'
    });
  }

  static getCountUserFavorite() {
    const userFavorite = JSON.parse(localStorage.getItem('USER_FAVORITE'));
    if (userFavorite?.favorite_items) {
      const itemsLength = userFavorite.favorite_items.length;
      return itemsLength;
    } else {
      return 0;
    }
  }

  static async setUserReviews() {
    return this.checkTokenAndRun(async () => {
      try {
        const response = await RESTapi.getReviewsByUser();
        if (response.isSuccess) {
          localStorage.removeItem('USER_REVIEWS_LIST');
          localStorage.setItem(
            'USER_REVIEWS_LIST',
            JSON.stringify(response.data)
          );
          return response.data;
        }
      } catch (error) {
        console.error('Error setting user reviews data :', error);
        throw new Error(
          'Failed to retrieve user reviews data. Please try again later.'
        );
      }
    });
  }

  static async removeReview(props) {
    this.checkTokenAndRun(async () => {
      try {
        const response = await RESTapi.removeReview({
          review_id: props.review._id,
        });
        this.setUserReviews();
        return response;
      } catch (error) {
        console.error('Error Removing reviews data :', error);
        throw new Error(
          'Failed to remove user reviews data. Please try again later.'
        );
      }
    });
  }

  static async createNewReview(props) {
    return this.checkTokenAndRun(async () => {
      try {
        const response = await RESTapi.createNewReview(props);
        this.setUserReviews();
        return response;
      } catch (error) {
        console.error('Error create new review:', error);
        throw new Error('Failed to create new review. Please try again later.');
      }
    });
  }

  static async modifyReview(props) {
    return this.checkTokenAndRun(async () => {
      try {
        const response = await RESTapi.modifyReview(props);

        this.setUserReviews();
        return response;
      } catch (error) {
        console.error('Error modify review:', error);
        throw new Error('Failed to modify review. Please try again later.');
      }
    });
  }

  static getUserReviews() {
    return this.checkTokenAndRun(() => {
      return JSON.parse(localStorage.getItem('USER_REVIEWS_LIST'));
    });
  }

  static getUserReview(product_id) {
    return this.checkTokenAndRun(() => {
      const reviews = JSON.parse(localStorage.getItem('USER_REVIEWS_LIST'));
      const targetReview = reviews.find(
        (review) => review.product_id === product_id
      );
      return targetReview;
    });
  }

  static checkUserReviewProduct(product_id) {
    return this.checkTokenAndRun(() => {
      const targetReview = this.getUserReview(product_id);
      if (targetReview) {
        if (Object.keys(targetReview.review).length === 0) {
          return 'HaveBuy';
        }
        return 'HaveReview';
      } else {
        return 'NaverBuy';
      }
    });
  }
}

export default UserDataStorage;
