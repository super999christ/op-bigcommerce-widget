import { h, FunctionalComponent } from "preact";

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
  return (
    <div></div>
  );
};

export default WidgetContainer;