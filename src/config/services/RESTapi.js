import axios from 'axios';
import UserDataStorage from './UserDataStorage';
import Token from './Token';

class RESTapi {
  static async fetchUserInfo() {
    const apilink = '/api/user/getUserById';

    try {
      console.log('Request API:', apilink);
      const response = await axios.get(apilink);
      await UserDataStorage.setUserData(response.data.userInfo);
      await UserDataStorage.setUserImage(response.data.userInfo.photo);
    } catch (error) {
      console.error('Failed to fetch user information:', error);
    }
  }

  static async fetchCheckAuthen() {
    const apilink = '/api/user/checkAuthentication';

    try {
      console.log('Request API:', apilink);
      await axios.get(apilink);
      return { isAuthen: true, message: 'Authenticated' };
    } catch (error) {
      if (Token.getToken()) {
        Token.removeToken();
      }
      if (error.response?.status === 401) {
        return { isAuthen: false, message: 'Unauthenticated' };
      } else {
        console.error('Failed to check authen:', error);
        return { isAuthen: false, message: 'false to check Authen' };
      }
    }
  }

  static async fetchCartData() {
    const apilink = '/api/Order/getCart';

    try {
      console.log('Request API', apilink);
      const response = await axios.get(apilink);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cart data:', error);
      return { getCart: false, message: `Failed to fetch cart data` };
    }
  }

  static async addToCart(productid) {
    const apilink = '/api/Order/addToCart';
    const productId = { product_id: productid };

    try {
      console.log('Request API', apilink);
      await axios.put(apilink, productId);

      return {
        addToCart: true,
        message: `Add ${productid} To Cart Successful`,
      };
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      return {
        addToCart: false,
        message: `Failed to add product ${productid}  to cart`,
      };
    }
  }

  static async removeFromCart(productIdOrAll) {
    const apilink = '/api/Order/removeFromCart';

    try {
      console.log('Request API', apilink);
      await axios.put(apilink, productIdOrAll);
      return {
        removeFromCart: true,
        message: `Remove product ${productIdOrAll}  from cart successful`,
      };
    } catch (error) {
      console.error(
        `Failed to remove product ${productIdOrAll} from cart`,
        error
      );
      return {
        removeFromCart: false,
        message: `Failed to remove product ${productIdOrAll} from cart`,
      };
    }
  }
}

export default RESTapi;
