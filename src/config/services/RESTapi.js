import axios from 'axios';
import UserDataStorage from './UserDataStorage';
import Token from './Token';
import CartStorage from './CartStorage';

class RESTapi {
  static async fetchUserInfo() {
    const apilink = '/api/user/getUserById';

    try {
      const response = await axios.get(apilink);
      await UserDataStorage.setUserData(response.data.userInfo);
      await UserDataStorage.setUserImage(response.data.userInfo.photo);
      await UserDataStorage.setUserFavorite();
      await UserDataStorage.setUserReviews();
      await CartStorage.setCartStorage();
    } catch (error) {
      console.error('Failed to fetch user information:', error);
    }
  }

  static async fetchCheckAuthen() {
    const apilink = '/api/user/checkAuthentication';
    if (Token.getRole() === 'guest') {
      return;
    }
    try {
      const response = await axios.get(apilink);
      return response.data;
    } catch (error) {
      Token.removeToken();
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

  static async removeFromCart(props) {
    const apilink = '/api/Order/removeFromCart';
    console.log(props);

    try {
      await axios.delete(apilink, {
        params: props,
      });
      return {
        removeFromCart: true,
        message: `Remove product ${props.product_id}  from cart successful`,
      };
    } catch (error) {
      console.error(
        `Failed to remove product ${props.product_id} from cart`,
        error
      );
      return {
        removeFromCart: false,
        message: `Failed to remove product ${props.product_id} from cart`,
      };
    }
  }

  static async createOrder(props) {
    const apilink = '/api/Order/createOrder'; // Assuming this is the correct API endpoint for creating orders
    try {
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
      const response = await axios.delete(apilink, {
        params: props,
      });
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
      const response = await axios.post(apilink, props);
      return response.data;
    } catch (error) {
      console.error('Failed to create new review:', error);
      return {
        isSuccess: false,
        message: 'Failed to create new review',
      };
    }
  }

  static async getReviewsByUser() {
    const apilink = '/api/review/getReviewsByUser';

    try {
      const response = await axios.get(apilink, { params: { from: 'user' } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user reviews data:', error);
      return {
        isSuccess: false,
        message: 'Failed to fetch user reviews data',
      };
    }
  }

  static async getReviewsByProduct(props) {
    const apilink = '/api/review/getReviewsByProduct';

    try {
      const response = await axios.get(apilink, {
        params: {
          from: 'product',
          _id: props._id,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product reviews data:', error);
      return {
        isSuccess: false,
        message: 'Failed to fetch product reviews data',
      };
    }
  }

  static async removeReview(props) {
    const apilink = '/api/review/removeReview';
    try {
      const response = await axios.delete(apilink, {
        params: {
          review_id: props.review_id,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to remove review:', error);
      return {
        isSuccess: false,
        message: 'Failed to remove review',
      };
    }
  }

  static async modifyReview(props) {
    const apilink = '/api/review/modifyReview';

    try {
      const response = await axios.put(apilink, props);
      return response.data;
    } catch (error) {
      console.error('Failed to modify review:', error);
      return {
        isSuccess: false,
        message: 'Failed to modify review',
      };
    }
  }

  static async getRecommendProduct() {
    const apilink = '/api/product/getRecommendProduct';

    try {
      const response = await axios.get(apilink);
      return response.data;
    } catch (error) {
      console.error('Failed toget Recommend Product:', error);
      return {
        isSuccess: false,
        message: 'Failed to get Recommend Product',
      };
    }
  }
}

export default RESTapi;
