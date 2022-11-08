/**
 * External Dependencies
 */
import habitat from "preact-habitat";

/**
 * Internal Dependencies
 */
import Container from './Container';

// Make plugging-in of OPWidget to BigCommerce storefront
const _habitat = habitat(Container);

const rendering = () => _habitat.render({
  selector: '[data-widget-host="bc-op-widget"]'
});

window.renderWidget = rendering;

const opWidgetWrapper = document.querySelector("[data-widget-host=bc-op-widget]");

if (opWidgetWrapper) {
  // Initialize rendering(: add OPWidget to the storefront DOM)
  rendering();
} else {
  const timerId = setInterval(() => {
    const checkoutForm = document.querySelector(".checkout-form");
    if (checkoutForm && checkoutForm.querySelector("label")) {
      const opWrapperDom: any = document.createElement("div");
      opWrapperDom.setAttribute('data-widget-host', 'bc-op-widget');
      checkoutForm.prepend(opWrapperDom);
      clearInterval(timerId);

      rendering();
    }
  }, 300);
}