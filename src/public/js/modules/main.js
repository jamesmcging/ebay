// Start the main app logic.
requirejs(['jquery', 
  'modules/models/ebayAuthorizationModel', 
  'modules/models/locationsModel',
  'modules/models/datamappingModel',
  'modules/interface', 
  'bootstrap'],
  function(
    nsc, 
    objEbayAuthorizationModel,
    objLocationsModel,
    objDataMappingModel,
    objInterface
  ) {
  
  app = {};
  
  app.objModel = {};
  app.objModel.objEbayAuthorization = objEbayAuthorizationModel;
  app.objModel.objLocations         = objLocationsModel;
  app.objModel.objDataMappings      = objDataMappingModel;
  
  app.objInterface = objInterface;
  app.objInterface.render();
  app.objInterface.setListeners();
  app.objInterface.initialize();
  
  /* Will eventually have to allow passing of app state but for now we'll just 
   * start with the dashboard selected. */
  nsc('#main-nav a[href="#dashboard-panel"]').tab('show');
});