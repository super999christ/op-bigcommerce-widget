/**
 * External Dependencies
 */
import { h } from "preact";
import styled from "styled-components";

const LoadingWrapper = styled.div`
  display: inline-block;
  position: absolute;
  width: 40px;
  height: 40px;
  
  & div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 24px;
    height: 24px;
    margin: 8px;
    border: 3px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #3379d3 transparent transparent transparent;
  }
  
  & div:nth-child(1) {
    animation-delay: -0.45s;
  }

  & div:nth-child(2) {
    animation-delay: -0.3s; 
  }

  & div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingBar = () => {
  return (
    <LoadingWrapper>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </LoadingWrapper>
  );
};

export default LoadingBar;