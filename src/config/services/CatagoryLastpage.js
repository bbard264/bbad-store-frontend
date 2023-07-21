class CatgoryLastpage {
  static storage_key = 'CATEGORY&LASTPAGE';
  static setCatgoryLastpage(data) {
    const dataString = JSON.stringify(data);
    sessionStorage.setItem(this.storage_key, dataString);
  }

  static getCatgoryLastpage() {
    const dataString = sessionStorage.getItem(this.storage_key);
    return JSON.parse(dataString);
  }

  static removeCatgoryLastpage() {
    sessionStorage.removeItem(this.storage_key);
  }
}

export default CatgoryLastpage;
