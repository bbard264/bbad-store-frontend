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
}

export default UserDataStorage;
