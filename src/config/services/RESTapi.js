import axios from 'axios';
import UserDataStorage from './UserDataStorage';

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
      const response = await axios.get(apilink);
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        return false;
      } else {
        console.error('Failed to fetch user information:', error);
      }
    }
  }
}

export default RESTapi;
