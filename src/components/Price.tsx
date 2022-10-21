import { h, FunctionalComponent } from "preact";
import { memo } from "preact/compat";
import { useWidgetContext } from "../Context";

const OPPrice: FunctionalComponent = () => {
  return (
    <div>$4.95</div>
  )
};

export default memo(OPPrice);