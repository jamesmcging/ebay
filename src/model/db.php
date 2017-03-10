<?php
namespace ebay\model;
use ebay\config\Credentials as Credentials;
use PDO;

/**
 * Command to alter the marketplace table
 * alter table marketplace change marketplace_type marketplace_type enum('google','affiliatefuture','googletxt','affiliatewindow','allurentondemand','optimum7','rockandsnow','tadashop','linkshare','amazon','ebay');
 */
class db {

	private static $instance = NULL;

	/**
	 * Return DB instance or create intitial connection
	 * @return object (PDO)
	 * @access public
	 */
	public static function getInstance() {
		if (!self::$instance)
		{
      // If we are on AWS then these server variables should exist
      if (!empty($_SERVER['RDS_HOSTNAME'])) {
        $dbhost = $_SERVER['RDS_HOSTNAME'];
        $dbport = $_SERVER['RDS_PORT'];
        $dbname = 'store_599';//$_SERVER['RDS_DB_NAME'];
        $charset = 'utf8' ;

        $dsn = "mysql:host={$dbhost};port={$dbport};dbname={$dbname};charset={$charset}";
        $username = $_SERVER['RDS_USERNAME'];
        $password = $_SERVER['RDS_PASSWORD'];

        self::$instance = new PDO($dsn, $username, $password);

      // Otherwise we are in development locally
      } else {
        self::$instance = new PDO('mysql:host='.Credentials::DB_HOST.';dbname='.Credentials::DB_NAME, Credentials::DB_USER, Credentials::DB_PASS);
        self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        self::$instance->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
      }
		}
    
		return self::$instance;
	}

  private function __construct() {}
  private function __clone(){

  }
}