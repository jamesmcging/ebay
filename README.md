# ebay-service-ebay

### Masters in Software Development @ CIT 2017

### Overview
This service is charged with providing the interface between the app and eBay. As the eBay APIs do not provide jsonP or CORS support as of May 2017, all calls from the app must go through a server capable of making curl requests. The resources this API provides can be found at ebay.alaname.com 
### Authentication with eBay
In order to use the app, the user has to log into an eBay account and authorize the application to act on their behalf. This is done using the eBay OAuth workflow. The tokens that result from this process are stored server side and used by the app to make rest calls to the eBay APIs. Making calls to the eBay API without the app having already authorized will result in eBay rejecting the calls.
