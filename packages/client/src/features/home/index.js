import React from "react";

import Logo from "../../components/Logo";
import Icon from "../../components/Icon";
import styled from "styled-components";

const SpecialText = styled.span`
  color: #4949b1;
`;

const Page = styled.div`
  display: grid;
  grid-template-areas: "." "." "." "." ".";
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  grid-template-rows: 64px 2fr 1fr 1fr 200px;
  margin: 32px 64px 32px 64px;
  font-size: 1rem;
  line-height: 1.6;
`;

const Section = styled.div`
  margin-top: 32px;
`;

const Main = styled(Section)`
  display: flex;
  flex: 1 auto;
  justify-content: space-between;

  > div:first-child {
    margin-right: 16px;
    display: flex;
    flex: 1 auto;
    flex-direction: column;
    width: 50%;

    > div:first-child {
      margin-bottom: 64px;
    }

    > div:last-child * {
      margin-right: 16px;
    }
  }
`;

const Explain = styled(Section)`
  display: flex;
  flex: 1 auto;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 20px;
  text-transform: uppercase;
  font-size: 20px;
  outline: none;
  border-radius: 32px;
  border: none;
  padding: 10px 16px;
  box-sizing: border-box;
  cursor: pointer;
`;

const FancyPrimaryButton = styled(Button)`
  background-color: #4949b1 !important;
  color: #fff !important;
`;

const Footer = styled(Section)``;

const Banner = styled.div`
  display: block;
  width: 100%;
  border: 3px dotted #e8e8e8;
  border-radius: 8px;
  padding: 4px 16px;
  text-align: center;
  font-weight: 500;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  align-items: center;

  * {
    text-align: center;
  }
`;

const Input = styled.input`
  border-radius: 16px;
  padding: 16px;
  outline: none;
  border: 1px solid #000;
  width: 90%;
`;

const InputField = styled(Section)`
  width: 100%;
  display: grid;
  grid-template-areas: ". .";
  grid-template-columns: 1fr 200px;
`;

const Copy = styled.div``;

const Step = styled.div`
  background-color: #ccc;
  width: 64px;
  height: 64px;
  max-height: 64px;
  max-width: 64px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  flex: 1 auto;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  
`


export default () => {
  return (
    <Page>
      <div>
        <Logo size="200px" />
      </div>
      <Main>
        <div className="description">
          <div>
            <h1>Prototype and share changes to your site...with no coding</h1>
            <p>
              Make CSS changes with devtools and get a{" "}
              <SpecialText>unique URL</SpecialText> to share for review or user
              testing
            </p>
          </div>
          <div>
            <FancyPrimaryButton>See how it works</FancyPrimaryButton>
            <Button>Try it out</Button>
          </div>
        </div>
        <div>
          <Icon icon="computer" style={{ maxWidth: "100%" }} />
        </div>
      </Main>
      <Explain>
        <Column medium={3}>
          <Step>1</Step>
          <h1 style={{color: "#7172b9"}}>Enter your url</h1>
          <p>
            Go to getdiff.app and enter the URL of the website or application
            you would like to make changes to.
          </p>
        </Column>
        <Column medium={3}>
        <Step>2</Step>
          <h1 style={{color:"#5aced5"}}>Make css changes using devtools</h1>
          <p>
            Open devtools and make CSS changes. We will keep up with them until
            you are done.
          </p>
        </Column>
        <Column medium={3}>
        <Step>3</Step>
          <h1 style={{color:"#dd51b1"}}>Get a unique url</h1>
          <p>
            Click "Save changes" and a unique URL will be automatically copied
            to your clipboard
          </p>
        </Column>
      </Explain>
      <Footer>
        <Banner>
          Don't worry! This is secure and we don't make changes to your site or
          application
        </Banner>

        <InputField>
          <Input type="text" placeholder="Enter a website" />
          <Button>Prototype Changes</Button>
        </InputField>
      </Footer>
      <Copy>&copy; 2019 getDiff, Inc.</Copy>
    </Page>
  );
};
