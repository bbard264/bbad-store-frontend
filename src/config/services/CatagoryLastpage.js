class CatgoryLastpage {
  static setCatgoryLastpage(data) {
    const dataString = JSON.stringify(data);
    sessionStorage.setItem('CATEGORY&LASTPAGE', dataString);
  }

  static getCatgoryLastpage() {
    const dataString = sessionStorage.getItem('CATEGORY&LASTPAGE');
    return JSON.parse(dataString);
  }

  static removeCatgoryLastpage() {
    sessionStorage.removeItem('CATEGORY&LASTPAGE');
  }
}

export default CatgoryLastpage;
