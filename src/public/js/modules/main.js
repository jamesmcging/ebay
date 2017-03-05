// Start the main app logic.
requirejs(['jquery', 'modules/interface', 'bootstrap'], function(nsc, objInterface) {
  
  objInterface.render();
  objInterface.setListeners();
  objInterface.initialize();
  
  /* Will eventually have to allow passing of app state but for now we'll just 
   * start with the dashboard selected. */
  nsc('#main-nav a[href="#dashboard-panel"]').tab('show');
});