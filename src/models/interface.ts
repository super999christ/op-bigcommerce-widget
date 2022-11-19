// Extended interface of window
declare global {
  interface Window {
    opWidget: {
      cart?: ICartResponse;     // Cart information
    },
    opProduct?: ILineItem;      // OrderProtection Product
    bcStoreUrl: string;         // URL of the current BigCommerce store
    renderWidget: () => void;   // Embeds OP Widget to BigCommerce storefront
  }
}

// Interface of ContextAPI
export type IAppContext = {
  isLoading: boolean,
  insuranceData: ICheckoutInsuranceResponse
};

// Interface of cart item included in the cart
export type ILineItem = {
  id: string;
  name: string;
  brand: string;
  couponAmount: number;
  discountAmount: number;
  discounts: [];
  extendedListPrice: number;
  extendedSalePrice: number;
  imageUrl: string;
  isMutable: boolean;
  isShippingRequired: boolean;
  isTaxable: boolean;
  listPrice: number;
  originalPrice: number;
  productId: number;
  quantity: number;
  salePrice: number;
  sku: string;
  type: string;
  url: string;
  variantId: number;
};

// Interface of cart information from the storefront API
export type ICartResponse = {
  id: string;
  baseAmount: number;
  cartAmount: number;
  coupons: [];
  createdTime: Date;
  currency: {
    code: string;
    decimalPlaces: number;
    name: string;
    symbol: string;
  };
  customerId: number;
  discountAmount: number;
  discounts: [
    {
      discountAmount: number;
      id: string;
    }
  ];
  email: string;
  isTaxIncluded: boolean;
  locale: string;
  updatedTime: Date;
  lineItems: {                      // Items included in the cart
    customItems: [ILineItem];
    digitalItems: [ILineItem];
    giftCertificates: [ILineItem];
    physicalItems: [ILineItem]
  }
};

// Interface of store information from the OP backend
export type ICheckoutInsuranceResponse = {
  productId: number;          // OP product ID
  variantId: number;          // OP product variant ID
  variantPrice: number;       // OP product variant price
  variantTier: string;
  store: {
    id: number;
    merchant_id: number;
    store_name: string;
    revenue_share: number;
    variant_id: number;
    dynamic_price: boolean;   // Dynamic pricing flag (: saved in the store_setting)
    default_op: boolean;      // Default OP Enable / Disable status (: saved in the store_setting)
  }
};