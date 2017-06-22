class instance {
  init() {
    require('./autofill.js');
    if(navigator.userAgent.indexOf('iPhone')!= -1 || navigator.userAgent.indexOf('Android')!= -1 ||
      navigator.userAgent.indexOf('iPad')!= -1) {
      require('../css/m-style.css');
    } else {
      require('../css/style.css');
    }
  }
}

let _instance = new instance();
_instance.init();

