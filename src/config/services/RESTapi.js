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
      await UserDataStorage.setUserFavorite();
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

  static async addToCart(props) {
    const apilink = '/api/Order/addToCart';
    try {
      console.log('Request API', apilink);
      await axios.put(apilink, props);
      return {
        addToCart: true,
        message: `Add ${props.product_id} To Cart Successful`,
      };
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      if (error.response.status === 401) {
        return {
          addToCart: false,
          message: `Unauthorized`,
        };
      }
      return {
        addToCart: false,
        message: `Failed to add product to cart`,
      };
    }
  }

  static async removeFromCart(productIdOrAll) {
    const apilink = '/api/Order/removeFromCart';

    try {
      console.log('Request API', apilink);
      await axios.delete(apilink, productIdOrAll);
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

  static async createOrder(props) {
    const apilink = '/api/Order/createOrder'; // Assuming this is the correct API endpoint for creating orders
    try {
      console.log('Request API', apilink);
      const response = await axios.post(apilink, props); // Use axios.post for POST requests
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      if (error.response && error.response.status === 401) {
        return {
          createOrder: false,
          message: `Unauthorized`,
        };
      }
      return {
        createOrder: false,
        message: `Failed to create order`,
      };
    }
  }

  static async getOrders() {
    const apilink = '/api/Order/getOrders'; // Update the endpoint URL accordingly
    try {
      console.log('Request API', apilink);
      const response = await axios.get(apilink); // Use axios.get for GET requests
      return response.data;
    } catch (error) {
      console.error('Failed to get orders:', error);
      return {
        getOrders: false,
        message: `Failed to get orders`,
      };
    }
  }

  static async getOrderStatus() {
    const apilink = '/api/Order/getOrderStatus'; // Update the endpoint URL accordingly
    try {
      console.log('Request API', apilink);
      const response = await axios.get(apilink); // Use axios.get for GET requests
      return response.data;
    } catch (error) {
      console.error('Failed to get orders:', error);
      return {
        getOrders: false,
        message: `Failed to get orders`,
      };
    }
  }

  static async getFavorite() {
    const apilink = '/api/User/getFavorite';

    try {
      console.log('Request API', apilink);
      const response = await axios.get(apilink);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user favorite data:', error);
      return {
        getFavorite: false,
        message: `Failed to fetch user favorite data`,
      };
    }
  }

  static async addFavorite(props) {
    const apilink = '/api/User/addFavorite';
    try {
      console.log('Request API', apilink);
      const response = await axios.put(apilink, props);
      return response.data;
    } catch (error) {
      console.error(`Failed to add favorite`, error);
      if (error.response.status === 401) {
        return {
          addFavorite: false,
          message: `Unauthorized`,
        };
      }
      return {
        addFavorite: false,
        message: `Failed to add favorite`,
      };
    }
  }

  static async removeFavorite(props) {
    const apilink = '/api/User/removeFavorite';

    try {
      console.log('Request API', apilink);
      const response = await axios.delete(apilink, props);
      return response.data;
    } catch (error) {
      console.error(`Failed to remove favorite`, error);
      return {
        removeFavorite: false,
        message: `Failed to remove favorite`,
      };
    }
  }

  static async createNewReview(props) {
    const apilink = '/api/review/createNewReview';

    try {
      console.log('Request API', apilink);
      const response = await axios.post(apilink, {
        product_id: props._id,
        rating: props.rating,
        body: props.body,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create new review:', error);
      return {
        createNewReview: false,
        message: 'Failed to create new review',
      };
    }
  }

  static async getReviewsByUser() {
    const apilink = '/api/review/getReviewsByUser';

    try {
      console.log('Request API', apilink);
      const response = await axios.get(apilink, { params: { from: 'user' } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user reviews data:', error);
      return {
        getReviewsByUser: false,
        message: 'Failed to fetch user reviews data',
      };
    }
  }

  static async getReviewsByProduct(props) {
    const apilink = '/api/review/getReviewsByProduct';

    try {
      console.log('Request API', apilink);
      const response = await axios.get(apilink, {
        from: 'product',
        _id: props._id,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product reviews data:', error);
      return {
        getReviewsByProduct: false,
        message: 'Failed to fetch product reviews data',
      };
    }
  }

  static async removeReview(props) {
    const apilink = '/api/review/removeReview';

    try {
      console.log('Request API', apilink);
      const response = await axios.delete(apilink, {
        review_id: props.review_id,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to remove review:', error);
      return {
        removeReview: false,
        message: 'Failed to remove review',
      };
    }
  }

  static async modifyReview(props) {
    const apilink = '/api/review/modifyReview';
    console.log(props);
    try {
      console.log('Request API', apilink);
      const response = await axios.put(apilink, {
        _id: props._id,
        rating: props.rating,
        body: props.body,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to modify review:', error);
      return {
        modifyReview: false,
        message: 'Failed to modify review',
      };
    }
  }
}

export default RESTapi;
