import Token from './Token';

class UserDataStorage {
  static checkTokenAndRun(method) {
    if (Token.getToken()) {
      return method();
    } else {
      this.removeUserData();
      // Handle the case where the user is not authenticated, e.g., redirect to login page.
    }
  }

  static async setUserData(data) {
    this.checkTokenAndRun(() => {
      const dataString = JSON.stringify(data);
      localStorage.setItem('USER_DATA', dataString);
    });
  }

  static getUserData() {
    return this.checkTokenAndRun(() => {
      const dataString = localStorage.getItem('USER_DATA');
      return JSON.parse(dataString);
    });
  }

  static removeUserData() {
    localStorage.removeItem('USER_DATA');
    localStorage.removeItem('USER_IMAGE');
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
      return localStorage.getItem('USER_IMAGE');
    });
  }
}

export default UserDataStorage;
