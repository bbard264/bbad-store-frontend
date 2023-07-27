import Token from './Token';
import RESTapi from './RESTapi';
import Favorite from './../../pages/Favorite';

class UserDataStorage {
  static checkTokenAndRun(method) {
    if (Token.getToken()) {
      return method();
    } else {
      this.removeUserData();
      return false;

      // Handle the case where the user is not authenticated, e.g., redirect to the login page.
    }
  }

  static async setUserData(data) {
    this.checkTokenAndRun(() => {
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
  }

  static async setUserImage(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = function () {
        // reader.result contains the base64 encoded image data
        localStorage.setItem('USER_IMAGE', reader.result);
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error saving image to localStorage:', error);
    }
  }

  static getUserImage() {
    return this.checkTokenAndRun(() => {
      return localStorage.getItem('USER_IMAGE'); // Corrected key from this.storage_key to 'USER_IMAGE'
    });
  }

  static async setUserFavorite(props) {
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
        const response = await RESTapi.addFavorite({
          product_id: props.product._id,
        });
        if (response.addFavorite) {
        }
        const oldData = JSON.parse(localStorage.getItem('USER_FAVORITE'));
        const newData = {
          favorite_items: [...oldData.favorite_items, props.product],
        };
        localStorage.setItem('USER_FAVORITE', JSON.stringify(newData));

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
        const response = await RESTapi.removeFavorite({
          product_id: props.product._id,
        });
        if (response.removeFavorite) {
        }
        const oldData = JSON.parse(localStorage.getItem('USER_FAVORITE'));
        const newData = {
          favorite_items: oldData.favorite_items.filter(
            (item) => item.product_id !== props.product._id
          ),
        };
        localStorage.setItem('USER_FAVORITE', JSON.stringify(newData));

        return response;
      } catch (error) {
        console.error('Error removing favorite data :', error);
        throw new Error('Failed to remove favorite. Please try again later.');
      }
    });
  }
}

export default UserDataStorage;
