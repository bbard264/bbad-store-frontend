import UserDataStorage from './UserDataStorage';

class Token {
  static setToken(token) {
    localStorage.setItem('ACCESS_TOKEN', token);
  }

  static getToken() {
    return localStorage.getItem('ACCESS_TOKEN');
  }

  static removeToken() {
    localStorage.removeItem('ACCESS_TOKEN');
    // Also remove user data when removing the token
    UserDataStorage.removeUserData();
  }

  static getRole() {
    if (this.getToken()) {
      return 'user';
    }
    UserDataStorage.removeUserData();
    return 'guest';
  }
}

export default Token;
