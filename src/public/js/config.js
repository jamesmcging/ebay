var require = {
  baseUrl : 'js',
  
  paths : {
    jquery : 'lib/jquery.min',
    bootstrap : 'lib/bootstrap.min'
  },
  
  shim: {
    bootstrap : {
      deps : ['jquery']
    }
  }

};