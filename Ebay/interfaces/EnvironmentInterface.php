<?php
namespace Ebay\interfaces; 

/**
 * When setting up an environment to run this app it is necessary to set an
 * environment variable called EBAY_ENVIRONMENT and set it to one of these 
 * values.
 */
interface EnvironmentInterface {
  const DEV_MODE  = 0;
  const LIVE_MODE = 1;
}