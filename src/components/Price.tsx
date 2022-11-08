/**
 * External Dependencies
 */
import { h, FunctionalComponent } from "preact";
import { memo } from "preact/compat";

/**
 * Internal Dependencies
 */
import { useWidgetContext } from "../Context";

/**
 * OrderProtection price label component
 */
const OPPrice: FunctionalComponent = () => {
  const { insuranceData } = useWidgetContext();
  return (
    <div>${Number((insuranceData?.variantPrice / 100).toFixed(2)) || "0.00"}</div>
  )
};

export default memo(OPPrice);