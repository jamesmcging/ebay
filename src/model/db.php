<?php
class db {
  const DB_HOST = 'localhost';
  const DB_NAME = 'store_599';
  const DB_USER = 'jamesmcg';
  const DB_PASS = 'password';
  
	private static $instance = NULL;

	/**
	 * Return DB instance or create intitial connection
	 * @return object (PDO)
	 * @access public
	 */
	public static function getInstance() {
		if (!self::$instance)
		{
			self::$instance = new PDO('mysql:host='.self::DB_HOST.';dbname='.self::DB_NAME, self::DB_USER, self::DB_PASS);
			self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			self::$instance->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
		}
    
		return self::$instance;
	}

  private function __construct() {}
  private function __clone(){

  }
}