// API Path Variables
export const BASE_PROD_URL = 'https://api.orderprotection.com/v1/prod/rest';
export const BASE_DEV_URL = 'http://localhost:8080/api';

// SessionStorage Variables
export const KEY_INSURANCE_DATA = 'checkout_insurance_data';
export const KEY_OP_TOGGLE = 'op_toggle';
export const KEY_JUST_RELOADED = 'just_reloaded';

// OrderProtection variables
export const ORDER_PROTECTION_PRODUCT = "Order Protection";

/**
 * Gets the base URL of API according to environment
 * @param env prod | dev
 * @returns Base API URL
 */
export const getBaseUrl = (env: string) => {
  // if (env === 'prod')
  //   return BASE_PROD_URL;
  return BASE_DEV_URL;
};