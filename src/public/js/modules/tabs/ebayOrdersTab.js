define(['jquery', 'modules/tabs/tab'], function(nsc, objTab) {
  
  var objOrders = {};

  objOrders.__proto__ = objTab;
  
  objOrders.sName = 'Orders';
  objOrders.sCode = 'orders';
  
  objOrders.initialize = function() {};
  
  objOrders.getPanelContent = function() {};
  
  objOrders.setListeners = function() {};
  
  return objOrders;
});