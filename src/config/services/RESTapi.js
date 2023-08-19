import axios from '../axios';
import UserDataStorage from './UserDataStorage';
import Token from './Token';
import CartStorage from './CartStorage';

class RESTapi {
  static backendAPI = 'https://bbad-store-backend.onrender.com';

  static async fetchUserInfo() {
    const apilink = this.backendAPI + '/api/user/getUserById';

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

  static async login(loginData) {
    const apilink = this.backendAPI + '/api/user/login';
    try {
      const response = await axios.post(apilink, loginData);
      return response.data;
    } catch (error) {
      if (error.response.status === 500) {
        return {
          canLogin: false,
          message: "Can't Login, Please try again later",
        };
      }
      return error.response.data;
    }
  }

  static async postRegisterUser(registerData) {
    const apilink = this.backendAPI + '/api/user/register';
    try {
      const response = await axios.post(apilink, registerData);
      return response.data;
    } catch (error) {
      window.alert(error.response.data.message);
      return error.response.data;
    }
  }

  static async fetchUpdateUser(props) {
    const { userId, newImg, newInfo } = props;
    const apilink = this.backendAPI + '/api/user/updateUser';

    try {
      if (newImg && !newInfo) {
        // If newImg exists but newInfo is null, send only the image data
        const imageResponse = await axios.get(newImg, { responseType: 'blob' });
        const imageBlob = imageResponse.data;

        // Create a new FormData object and append the image blob as a file
        const formData = new FormData();
        formData.append('img', imageBlob, `${userId}-profile100x100.jpg`);
        formData.append('photo', `${userId}-profile100x100.jpg`);

        await axios.put(apilink, formData);
        UserDataStorage.setUserImage(newImg);
        window.location.reload();
      } else if (newImg && newInfo) {
        // If both newImg and newInfo exist, send both image and other data

        // Fetch the image using Axios to get the image blob data
        const imageResponse = await axios.get(newImg, { responseType: 'blob' });
        const imageBlob = imageResponse.data;

        // Create a new FormData object and append the image blob as a file
        const formData = new FormData();
        formData.append('img', imageBlob, `${userId}-profile100x100.jpg`); // Set the image name to the value of newInfo.photo

        // Append other data from newInfo as fields
        formData.append('photo', `${userId}-profile100x100.jpg`);
        formData.append('displayname', newInfo.displayname);
        formData.append('email', newInfo.email);
        formData.append('phone', newInfo.phone);
        formData.append('gender', newInfo.gender);
        formData.append('birthdate', newInfo.birthdate);
        formData.append('address[address1]', newInfo.address.address1);
        formData.append('address[address2]', newInfo.address.address2);
        formData.append('address[district]', newInfo.address.district);
        formData.append('address[province]', newInfo.address.province);
        formData.append('address[postcode]', newInfo.address.postcode);

        const response = await axios.put(apilink, formData);
        UserDataStorage.setUserImage(newImg);
        if (response.data.updateResult) {
          await RESTapi.fetchUserInfo();
          window.location.reload();
        }
      } else if (!newImg && newInfo) {
        // If newImg is null, send only newInfo
        const response = await axios.put(apilink, newInfo);
        if (response.data.updateResult) {
          await RESTapi.fetchUserInfo();
          window.location.reload();
        }
      }
      window.alert('Update your profile complete...');
    } catch (error) {
      window.alert(`Error updating data: ${error.response.data.message}`);
      console.error('Error updating data:', error);
    }
  }

  static async fetchChangeUserPassword(props) {
    const apilink = this.backendAPI + '/api/user/changePassword';
    try {
      const response = await axios.put(apilink, props);
      return response.data;
    } catch (error) {
      window.alert(`Can't change password, Please try again later`);
      window.location.reload();
      console.error('Failed to fetch user information:', error);
    }
  }

  static async fetchCheckAuthen() {
    const apilink = this.backendAPI + '/api/user/checkAuthentication';
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

  static async fetchProductList(category, page) {
    const apilink =
      this.backendAPI +
      `/api/product/getProductsList/${category ? category : 'all'}${
        page ? '/' + page : ''
      }`;

    try {
      const resProductList = await axios.get(apilink);
      return resProductList.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  static async fetchProduct(productId) {
    const apilink =
      this.backendAPI + `/api/product/getProductById/${productId}`;
    try {
      const response = await axios.get(apilink);
      const product = response.data;
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async fetchCartData() {
    const apilink = this.backendAPI + '/api/Order/getCart';

    try {
      const response = await axios.get(apilink);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cart data:', error);
      return { getCart: false, message: `Failed to fetch cart data` };
    }
  }

  static async addToCart(props) {
    const apilink = this.backendAPI + '/api/Order/addToCart';
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
    const apilink = this.backendAPI + '/api/Order/removeFromCart';

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
    const apilink = this.backendAPI + '/api/Order/createOrder'; // Assuming this is the correct API endpoint for creating orders
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
    const apilink = this.backendAPI + '/api/Order/getOrders'; // Update the endpoint URL accordingly
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
    const apilink = this.backendAPI + '/api/Order/getOrderStatus'; // Update the endpoint URL accordingly
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
    const apilink = this.backendAPI + '/api/User/getFavorite';

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
    const apilink = this.backendAPI + '/api/User/addFavorite';
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
    const apilink = this.backendAPI + '/api/User/removeFavorite';
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
    const apilink = this.backendAPI + '/api/review/createNewReview';

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
    const apilink = this.backendAPI + '/api/review/getReviewsByUser';

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
    const apilink = this.backendAPI + '/api/review/getReviewsByProduct';

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
    const apilink = this.backendAPI + '/api/review/removeReview';
    try {
      const response = await axios.delete(apilink, {
        params: props,
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
    const apilink = this.backendAPI + '/api/review/modifyReview';

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
    const apilink = this.backendAPI + '/api/product/getRecommendProduct';

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
