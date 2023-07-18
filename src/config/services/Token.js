class Token {
  static setToken(token) {
    localStorage.setItem('ACCESS_TOKEN', token);
  }

  static getToken() {
    return localStorage.getItem('ACCESS_TOKEN');
  }

  static removeToken() {
    localStorage.removeItem('ACCESS_TOKEN');
  }

  static getRole() {
    if (this.getToken()) {
      return 'user';
    }
    return 'guest';
  }
}

export default Token;
