<?php
namespace ebay\model;
use ebay\config\Credentials as Credentials;
use PDO;

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
      self::$instance = new PDO('mysql:host='.Credentials::DB_HOST.';dbname='.Credentials::DB_NAME, Credentials::DB_USER, Credentials::DB_PASS);
			self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			self::$instance->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
		}
    
		return self::$instance;
	}

  private function __construct() {}
  private function __clone(){

  }
}