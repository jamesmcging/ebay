define(['jquery', 'modules/tabs/tab'], function(nsc, objTab) {
  
  var objEbayListings = {};

  objEbayListings.__proto__ = objTab;
  
  objEbayListings.sName = 'eBay Listings';
  objEbayListings.sCode = 'ebayListings';
  
  objEbayListings.initialize = function() {};
  
  objEbayListings.getPanelContent = function() {};
  
  objEbayListings.setListeners = function() {};
  
  return objEbayListings;
});