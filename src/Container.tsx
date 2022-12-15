/**
 * External Dependencies
 */
import { h, FunctionalComponent } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import styled from 'styled-components';

/**
 * Internal Dependencies
 */
import { WidgetContext } from "./Context";
import OPPrice from './components/Price';
import OPToggle from './components/Toggle';
import OPBanner from './components/Banner';
import { ICartResponse, ICheckoutInsuranceResponse, ILineItem } from "./models/interface";
import { KEY_OP_TOGGLE, PAGE_CHECKOUT, PAGE_SIDECART } from "./models/constants";
import { addInsurance, getCart, getCurrentPage, getDynamicPrice, getItemCount, getOPProductFromCart, getOriginalCartPrice, getStoreInsurance, removeInsurance, saveCheckoutInsuranceLocal, saveOPToggleLocal } from "./helpers/api";
import LoadingBar from "./components/LoadingBar";

/**
 * Define styled components
 */
const SideCard = styled.div`
  font-family: "Titillium Web", sans-serif;
  line-height: 1.5;
  margin: 10px auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const OPlogo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  span {
    margin-left: 10px;
    font-size: 11px;
    border-radius: 50%;
    border: 1px solid #757575;
    height: 13px;
    width: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #757575;
  }
`;

interface IPageProps {
  page?: number;
};

const OPintro = styled.div<IPageProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${props => props.page === PAGE_CHECKOUT ? '14px' : '11px'};
`;

const OPIns = styled.div<IPageProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: ${props => props.page === PAGE_CHECKOUT ? '18px' : '14px'};
  flex-direction: row;
  margin-left: 10px;
`;

interface IProps {
  env?: string;
  storeURL?: string;
  text?: string;
  activeColor?: string;
}

/**
 * Main OrderProtection widget component
 */
const WidgetContainer: FunctionalComponent<IProps> = ({
  env = 'prod',
  storeURL,
  text = 'Protects from Loss/Damage/Theft & More!',
  activeColor
}) => {
  // State variables
  const [isLoading, setLoading] = useState(true);          // Loading status of widget
  const [isChecked, setChecked] = useState(false);          // Check status of OPToggle button
  const [showPopup, setShowPopup] = useState(false);        // Visibility of OP Popup
  const [cart, setCart] = useState<ICartResponse>(null);    // Cart information from storefront
  const [insuranceData, setInsuranceData] = useState<ICheckoutInsuranceResponse>(null);   // Store information from OP database

  // Global Storefront URL
  const finalStoreURL = storeURL || window.location.origin;
  window.bcStoreUrl = finalStoreURL;

  const currentPage = getCurrentPage();

  /**
   * Initialize cart according to the storefront information( :default_op & dynamic_pricing)
   */
  const initializeRunWidget = useCallback(() => {
    setLoading(true);
    getStoreInsurance(env, finalStoreURL)
      .then(storeInsurance => {
        const { store } = storeInsurance;             // Store metadata
        const { default_op, dynamic_price } = store;  // Store setting variables

        /* --- Callback for processing after fetching store information from OP database ---*/
        const onDoneInsuranceGettingData = (insuranceResponse: ICheckoutInsuranceResponse, opProduct: ILineItem) => {
          setInsuranceData(insuranceResponse);

          // OP Enable/Disable status saved in the SessionStorage
          const opToggleFromStorage = window.sessionStorage.getItem(KEY_OP_TOGGLE);
          if (opToggleFromStorage === undefined)
            setChecked(default_op);
          else if (opProduct)
            setChecked(true);
          else setChecked(false);
          setLoading(false);
        };

        getCart().then((cart: ICartResponse) => {
          const opProduct = getOPProductFromCart(cart);
          if (dynamic_price) {
            // If dynamic pricing is applied based on total price of items in the cart, then update OP price
            const originalPrice = getOriginalCartPrice(cart);
            getDynamicPrice(env, originalPrice, finalStoreURL)
              .then((insuranceResponse: ICheckoutInsuranceResponse) => {
                onDoneInsuranceGettingData({ ...storeInsurance, ...insuranceResponse }, opProduct);
              });
          } else {
            // If static pricing, then go on with default
            onDoneInsuranceGettingData(storeInsurance, opProduct);
          }
        });
      });
  }, []);

  /**
   * Refreshes the ViewCart page for updating cart items
   */
  const refreshForViewcartPage = useCallback(() => {
    if (document.querySelector("[data-cart-update]") || document.querySelector(".cartDrawer-items") || document.querySelector(".checkoutHeader")) {
      // If ViewCart page, then refresh it
      window.location.reload();
    }
  }, []);

  /**
   * Adds an OrderProtection product (: identified by productId & variantId) to the current cart by calling storefront APIs
   */
  const addOPToCart = useCallback((cart: ICartResponse, productId: number, variantId: number): void => {
    /*--- Adds a new OP item to the cart ---*/
    const onAddNew = () => {
      addInsurance(productId, variantId).then((cartResponse: ICartResponse) => {
        setCart(cartResponse);
        setLoading(false);
        saveOPToggleLocal(true);
        refreshForViewcartPage();
      });
    };

    const opProduct = getOPProductFromCart(cart);   // Check whether OP exists in the current cart
    if (opProduct) {
      if (opProduct.productId != productId || opProduct.variantId != variantId) { // Needs to compare without types
        // Current OP item needs to be updated with new one
        removeInsurance(opProduct.id).then(onAddNew);
      } else {
        setLoading(false);
      }
    } else {
      // Adds a new OP item
      onAddNew();
    }
  }, []);

  /**
   * Process initialization of cart
   */
  useEffect(() => {
    getCart().then((cart: ICartResponse) => {
      const itemCount = getItemCount(cart);
      const opProduct = getOPProductFromCart(cart);
      if (itemCount === 1 && opProduct) {
        // If cart has only OP, then remove it
        removeInsurance(opProduct.id);
      } else if (itemCount > 0) {
        // If cart has several items, then initialize it based on the store setting
        initializeRunWidget();
      }
    });
  }, []);

  /**
   * Save insuranceData to the SessionStorage for caching
   */
  useEffect(() => {
    if (insuranceData) {
      saveCheckoutInsuranceLocal(insuranceData);
    }
  }, [insuranceData]);

  /**
   * Handles whenever the OP Enable/Disable status is toggled
   */
  useEffect(() => {
    if (insuranceData) {
      setLoading(true);

      getCart().then((cart: ICartResponse) => {
        const itemCount = getItemCount(cart);
        const opProduct = getOPProductFromCart(cart);
        if (!itemCount || itemCount === 1 && opProduct) {
          // If there's no item or only OP item, then ignore it
          setLoading(false);
        } else {
          if (isChecked) {
            // If OP is enabled
            if (insuranceData.store.dynamic_price) {
              // If dynamic pricing, then fetch the corresponding OP price and add it to the cart
              getDynamicPrice(env, getOriginalCartPrice(cart), finalStoreURL)
                .then((insuranceResponse: ICheckoutInsuranceResponse) => {
                  const newInsuranceData = { ...insuranceData, ...insuranceResponse };
                  setInsuranceData(newInsuranceData);
                  addOPToCart(cart, newInsuranceData.productId, newInsuranceData.variantId);
                });
            } else {
              // If static pricing, just add it to the cart
              addOPToCart(cart, insuranceData.productId, insuranceData.variantId);
            }
          } else {
            // If OP is disabled
            if (opProduct) {
              // If OP exists in the current cart, then remove it
              removeInsurance(opProduct.id)
                .then((cartResponse: ICartResponse) => {
                  setCart(cartResponse);
                  setLoading(false);
                  saveOPToggleLocal(false);
                  refreshForViewcartPage();
                });
            } else {
              // If OP doesn't exist, then continue
              setCart(cart);
              setLoading(false);
              saveOPToggleLocal(false);
            }
          }
        }
      });
    }
  }, [isChecked]);

  const onOPToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, value: boolean) => {
    setChecked(value);
    event.stopPropagation();
  };

  return (
    <WidgetContext.Provider value={{ isLoading, insuranceData }}>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;700&amp;display=swap"
        rel="stylesheet"
      />
      <SideCard>
        <div>
          <OPlogo>
            <object
              data="https://order-protection-static.s3.us-west-1.amazonaws.com/order-protection.svg"
              width={`${currentPage === PAGE_CHECKOUT ? 250 : 180}px`}
            ></object>
            <span onClick={() => setShowPopup(true)}>i</span>
          </OPlogo>
          <OPintro page={currentPage}>
            <span>{text}</span>
          </OPintro>
        </div>
        <OPIns page={currentPage}>
          {isLoading && <LoadingBar />}
          <OPPrice />
          <OPToggle
            activeColor={activeColor}
            checked={isChecked}
            onChange={onOPToggle}
          />
        </OPIns>
      </SideCard>
      {showPopup && <OPBanner onClose={(close) => setShowPopup(close)} />}
    </WidgetContext.Provider>
  );
};

export default WidgetContainer;