/**
 * External Dependencies
 */
import { h, FunctionalComponent } from "preact";
import { memo } from "preact/compat";
import styled from "styled-components";

const BannerWrapper = styled.div`
  display: flex;
  background-color: rgba(0, 0, 0, 0.8);
  box-sizing: border-box;
  color: #69727b;
  font-family: "Titillium Web", sans-serif;
  height: 100%;
  left: 0;
  overflow: scroll;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99999999999;
`;

const BannerContainer = styled.div`
  border-radius: 25px;
  box-sizing: border-box;
  margin: auto auto;
  background-color: white;
  height: auto;
  max-width: 800px;
  position: relative;
  text-align: center;
`;

const BannerContent = styled.div`
  align-items: center;
  padding: 1.5rem;
  background-image: url(https://order-protection-static.s3-us-west-1.amazonaws.com/widget/op-modal_texture.png);
  background-repeat: no-repeat;
  background-size: cover;
`;

const CloseButton = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  cursor: pointer;
`;

const BannerLogo = styled.div`
  justify-content: center;
  align-items: center;
  width: 100%;
  img {
    width: 60%;
    height: auto;
  }
`;

const BannerDes = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 6vh;

  span {
    width: 100%;

    img {
      width: 75%;
      margin-bottom: 3rem;
    }
  }
`;

const HassleFree = styled.div`
  color: black;
  font-size: 3vh;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Explain = styled.div`
  font-size: 2.25vh;
  line-height: 2em;
`;

const OPType = styled.div`
  margin: 2rem 0;
  color: black;
  font-size: 2vh;
  font-weight: bold;
  line-height: 2em;
`;

const InforFooter = styled.div`
  margin: 1.5rem 0;
  color: black;
  font-size: 2vh;
  font-weight: bold;
  line-height: 2em;

  img {
    width: 22%;
    position: relative;
    left: -34px;
  }

  a {
    color: black;
    font-size: 20px;
    font-weight: bold;
    margin: 0 0.5rem;
    text-decoration: none;
  }
`;

interface IProps {
  onClose: (close: boolean) => void;
}

/**
 * OrderProtection `about` popup component
 */
const OPBanner: FunctionalComponent<IProps> = ({ onClose }) => {
  return (
    <BannerWrapper>
      <BannerContainer>
        <BannerContent>
          <CloseButton>
            <span onClick={() => onClose(false)}>&#215;</span>
          </CloseButton>
          <BannerLogo>
            <img src="https://order-protection-static.s3-us-west-1.amazonaws.com/order-protection-title.png" />
          </BannerLogo>
          <BannerDes>
            <span>
              <img src="https://order-protection-static.s3-us-west-1.amazonaws.com/widget/Why+use+shipping+protection_.png" />
            </span>
            <HassleFree>Hassle-Free Resolution</HassleFree>
            <Explain>
              Within a few clicks your approved claim will get a refund or
            </Explain>
            <Explain>reshipment for the following issue:</Explain>
            <OPType>
              Stolen - Delivered Not Recieved - Damaged - Lost in Transit -
              Wrong Item
            </OPType>
          </BannerDes>
          <InforFooter>
            <img src="https://order-protection-static.s3-us-west-1.amazonaws.com/widget/op-modal-package.png" />
            <div>
              <a href="https://orderprotection.com/" target="_blank">OrderProtection.com, Inc.</a>
              <a href="https://claims.orderprotection.com/" target="_blank">File a Claim</a>
            </div>
          </InforFooter>
        </BannerContent>
      </BannerContainer>
    </BannerWrapper>
  );
};

export default memo(OPBanner);