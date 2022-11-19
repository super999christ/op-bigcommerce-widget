/**
 * External Dependencies
 */
import axios, { AxiosResponse } from "axios";

/**
 * Internal Dependencies
 */
import {
  getBaseUrl,
  KEY_INSURANCE_DATA,
  KEY_OP_TOGGLE,
  ORDER_PROTECTION_PRODUCT,
} from "../models/constants";
import {
  ICartResponse,
  ICheckoutInsuranceResponse,
  ILineItem,
} from "../models/interface";

/**
 * Storefront API: fetches current cart information
 */
export const getCart = (): Promise<ICartResponse> => {
  return new Promise((resolve) => {
    axios.get(window.bcStoreUrl + "/api/storefront/carts").then((res) => {
      const carts = res.data;
      const cart = carts.length ? carts[0] : {};
      window.opWidget = { cart };
      resolve(cart);
    });
  });
};

/**
 * Storefront API: adds an OP item (productId & variantId) to the current cart
 */
export const addInsurance = (
  productId: number,
  variantId: number
): Promise<ICartResponse> => {
  return new Promise((resolve) => {
    axios
      .post(
        window.bcStoreUrl +
          `/api/storefront/carts/${window.opWidget.cart.id}/items`,
        {
          lineItems: [
            {
              quantity: 1,
              productId: productId,
              variantId: variantId,
            },
          ],
        }
      )
      .then((res) => {
        refreshCartItemCount(res.data);
        resolve(res.data);
      });
  });
};

/**
 * Storefront API: removes OP item from the current cart
 */
export const removeInsurance = (itemId: string): Promise<ICartResponse> => {
  return new Promise((resolve) => {
    axios
      .delete(
        window.bcStoreUrl +
          `/api/storefront/carts/${window.opWidget.cart.id}/items/${itemId}`
      )
      .then((res) => {
        refreshCartItemCount(res.data);
        resolve(res.data);
      });
  });
};

/**
 * OrderProtection API: fetches OP's dynamic pricing according to the total price of cart items
 */
export const getDynamicPrice = (
  env: string,
  currentPrice: number,
  storeUrl: string
): Promise<ICheckoutInsuranceResponse> => {
  const baseUrl = getBaseUrl(env);
  return new Promise((resolve) => {
    axios
      .get(
        `${baseUrl}/bigcommerce/dynamic-pricing?storeUrl=${storeUrl}&currentPrice=${currentPrice}`
      )
      .then((res) => {
        resolve(res.data);
      });
  });
};

/**
 * OrderProtection API: fetches store information from OP backend or cache
 */
export const getStoreInsurance = (
  env: string,
  storeUrl: string
): Promise<ICheckoutInsuranceResponse> => {
  if (window.sessionStorage) {
    const data: string = window.sessionStorage.getItem(KEY_INSURANCE_DATA);
    if (data) {
      return Promise.resolve(JSON.parse(data));
    }
  }

  const baseUrl = getBaseUrl(env);
  return new Promise((resolve) => {
    axios
      .post(`${baseUrl}/bigcommerce/checkout-insurance`, { storeUrl })
      .then((res: AxiosResponse<ICheckoutInsuranceResponse>) => {
        const insuranceData = res.data;
        resolve(insuranceData);
      });
  });
};

/**
 * Finds an OP product among cart items
 */
export const getOPProductFromCart = (cart: ICartResponse): ILineItem => {
  const opProduct = cart.lineItems?.digitalItems.find(
    (item) => item.name === ORDER_PROTECTION_PRODUCT
  );
  window.opProduct = opProduct;
  return opProduct;
};

/**
 * Gets number of items included in the current cart
 */
export const getItemCount = (cart: ICartResponse): number => {
  return (
    cart.lineItems?.customItems.length +
      cart.lineItems?.digitalItems.length +
      cart.lineItems?.giftCertificates.length +
      cart.lineItems?.physicalItems.length || 0
  );
};

/**
 * Gets quantity of items included in the current cart
 */
export const getItemQuantity = (cart: ICartResponse): number => {
  if (cart.lineItems) {
    const items = [
      ...cart.lineItems.customItems,
      ...cart.lineItems.digitalItems,
      ...cart.lineItems.giftCertificates,
      ...cart.lineItems.physicalItems,
    ];
    return items
      .map((item) => item.quantity)
      .reduce((quantity, total) => total + quantity, 0);
  }
  return 0;
};

/**
 * Calculates the total price of cart items excluding OP product
 */
export const getOriginalCartPrice = (cart: ICartResponse): number => {
  if (!cart) {
    return 0;
  }
  const opProduct = getOPProductFromCart(cart);
  return cart.baseAmount - (opProduct?.originalPrice || 0);
};

/**
 * Saves store information to the SessionStorage for caching
 */
export const saveCheckoutInsuranceLocal = (
  insuranceData: ICheckoutInsuranceResponse
): void => {
  window.sessionStorage.setItem(
    KEY_INSURANCE_DATA,
    JSON.stringify(insuranceData)
  );
};

/**
 * Saves OP Enable/Disable status to the SessionStorage
 */
export const saveOPToggleLocal = (toggle: boolean): void => {
  window.sessionStorage.setItem(KEY_OP_TOGGLE, String(toggle));
};

/**
 * Refreshes cart item count
 */
export const refreshCartItemCount = (cart: ICartResponse) => {
  const itemCount = getItemQuantity(cart);
  const quantityDom = document.getElementsByClassName(
    "cart-quantity"
  )[0] as HTMLElement;

  if (quantityDom) {
    if (itemCount > 0) {
      quantityDom.style.display = "";
      quantityDom.innerHTML = String(itemCount);
    } else {
      quantityDom.style.display = "none";
    }
  }
};
