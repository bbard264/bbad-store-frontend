import UserDataStorage from './UserDataStorage';

class Token {
  static storage_key = 'ACCESS_TOKEN';
  static setToken(token) {
    localStorage.setItem(this.storage_key, token);
  }

  static getToken() {
    return localStorage.getItem(this.storage_key);
  }

  static removeToken() {
    localStorage.removeItem(this.storage_key);
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
