import { h, FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { WidgetContext } from "./Context";
import styled from 'styled-components';
import OPPrice from './components/Price';
import OPToggle from './components/Toggle';
import OPBanner from './components/Banner';
interface IProps {
  env?: string;
  storeURL?: string;
  text?: string;
  activeColor?: string;
}

const SideCard = styled.div`
  font-family: "Titillium Web", sans-serif;
  line-height: 1.5;
  margin: 0 auto;
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

const OPintro = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
`;

const OPIns = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  flex-direction: row;
  margin-left: 20px;
`;

const WidgetContainer: FunctionalComponent<IProps> = ({
  env = 'prod',
  storeURL,
  text = 'Protects from Loss/Damage/Theft & More!',
  activeColor
}) => {
  const [isLoading, setLoading] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  return (
    <WidgetContext.Provider value={{ isLoading }}>
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
              width="200px"
            ></object>
            <span onClick={() => setShowPopup(true)}>i</span>
          </OPlogo>
          <OPintro>
            <span>{text}</span>
          </OPintro>
        </div>
        <OPIns>
          <OPPrice />
          <OPToggle
            activeColor={activeColor}
            checked={isChecked}
            onChange={(value) => setChecked(value)}
          />
        </OPIns>
      </SideCard>
      { showPopup && <OPBanner onClose={(close) => setShowPopup(close)} /> }
    </WidgetContext.Provider>
  );
};

export default WidgetContainer;