import { h, FunctionalComponent } from "preact";
import { useState } from "react";
import { WidgetContext } from "./Context";

interface IProps {
  env?: string;
  storeURL?: string;
  text?: string;
  activeColor?: string;
}

const WidgetContainer: FunctionalComponent<IProps> = ({
  env = 'prod',
  storeURL,
  text = 'Protects from Loss/Damage/Theft & More!',
  activeColor
}) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <WidgetContext.Provider value={{}}>

    </WidgetContext.Provider>
  );
};

export default WidgetContainer;