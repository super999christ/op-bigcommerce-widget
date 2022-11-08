/**
 * External Dependencies
 */
import { h, FunctionalComponent } from "preact";
import styled from 'styled-components';

/**
 * Internal Dependencies
 */
import { useWidgetContext } from '../Context';

/**
 * Define styled components
 */
const ToggleIconSize = 15;
const PaddingSize = 2;

const CheckBoxLabel = styled.label`
  border-radius: 100px;
  transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  position: absolute;
  top: 0;
  left: -${ToggleIconSize}px;
  width: ${((ToggleIconSize + PaddingSize) * 2)}px;
  height: ${ToggleIconSize + (2 * PaddingSize)}px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: ${ToggleIconSize}px;
    height: ${ToggleIconSize}px;
    margin: ${PaddingSize}px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;

interface ICheckboxInputProps {
  activeColor: string;
}

const CheckBox = styled.input<ICheckboxInputProps>`
  opacity: 0;
  z-index: 1;
  border-radius: ${ToggleIconSize}px;
  width: ${ToggleIconSize + (PaddingSize * 2)}px;
  height: ${ToggleIconSize + PaddingSize}px;
  margin: 0;
  display: block;
  vertical-align: middle;

  &:checked + ${CheckBoxLabel} {
    background: ${(props: ICheckboxInputProps) => props.activeColor};

    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: ${ToggleIconSize}px;
      height: ${ToggleIconSize}px;
      margin-left: 50%;
      transition: 0.2s;
    }
  }
`;

interface ICheckboxWrapperProps {
  disabled: boolean
}

const CheckBoxWrapper = styled.div<ICheckboxWrapperProps>`
  position: relative;
  margin-left: ${ToggleIconSize + 10}px;
  ${props => props.disabled && 'cursor: not-allowed;'}
`;

interface IProps {
  activeColor?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

/**
 * OrderProtection Enable/Disable toggle button component
 */
const OPToggle: FunctionalComponent<IProps> = ({
  activeColor = "#222",
  checked = false,
  onChange
}) => {
  const { isLoading } = useWidgetContext();

  return (
    <CheckBoxWrapper onClick={() => isLoading ? {} : onChange(!checked)} disabled={isLoading}>
      <CheckBox type="checkbox" activeColor={activeColor} checked={checked} />
      <CheckBoxLabel htmlFor="checkbox" />
    </CheckBoxWrapper>
  )
};

export default OPToggle;