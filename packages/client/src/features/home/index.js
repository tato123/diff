import React, {useRef} from "react";

import Logo from "../../components/Logo";
import Icon from "../../components/Icon";
import styled from "styled-components";

import { useMutation } from 'react-apollo-hooks';
import { CREATE_SITE } from "../../graphql/mutations";


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

  h1 {
    text-transform: uppercase;
  }

  p {
    margin-top: 32px;
    font-size: 1.2rem;
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
  padding: 10px 32px;
  box-sizing: border-box;
  cursor: pointer;
`;

const FancyPrimaryButton = styled(Button)`
  background-color: #4949b1 !important;
  color: #fff !important;
`;

const FancySecondaryButton = styled(Button)`
  background-color: #151837;
  color: #fff;
`


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
border-radius: 24px;
outline: none;
border: 1px solid #000;
width: 90%;
max-height: 32px;
padding: 8px 16px;
`;

const InputField = styled(Section)`
  width: 100%;
  display: grid;
  grid-template-areas: ". .";
  grid-template-columns: 70% 30%;
  column-gap: 24px;
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
  
`;

const Sentence = styled.span`
  display:block;
`;

function HomePage({history}) {
  const inputEl = useRef('');
  const createSite = useMutation(CREATE_SITE)

  return (
    <Page>
      <div>
        <Logo size="200px" />
      </div>
      <Main>
        <div className="description">
          <div>
            <h1 >
              <Sentence>Prototype and share</Sentence>
              <Sentence>changes to your</Sentence>
              <Sentence>site...with no coding</Sentence>

            </h1>
            <p>
              <Sentence>Make CSS changes with devtools and</Sentence>
              <Sentence>get a <SpecialText>unique URL</SpecialText> to share for review</Sentence>
              <Sentence> or user testing</Sentence>
            </p>
          </div>
          <div>
            <FancyPrimaryButton>See how it works</FancyPrimaryButton>
            <FancySecondaryButton>Try it out</FancySecondaryButton>
          </div>
        </div>
        <div>
          <Icon icon="computer" style={{ maxWidth: "100%" }} />
        </div>
      </Main>
      <Explain>
        <Column medium={3}>
          <Step>1</Step>
          <h1 style={{ color: "#7172b9", textTransform: "uppercase" }}>Enter your url</h1>
          <p>
            Go to getdiff.app and enter the URL of the website or application
            you would like to make changes to.
          </p>
        </Column>
        <Column medium={3}>
          <Step>2</Step>
          <h1 style={{ color: "#5aced5", textTransform: "uppercase" }}>Make css changes using devtools</h1>
          <p>
            Open devtools and make CSS changes. We will keep up with them until
            you are done.
          </p>
        </Column>
        <Column medium={3}>
          <Step>3</Step>
          <h1 style={{ color: "#dd51b1", textTransform: "uppercase" }}>Get a unique url</h1>
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

        <form onSubmit={(evt) => {
          evt.preventDefault();
          
          const siteResponse = createSite({variables:{input:{url:evt.target.site.value}}});
          
          siteResponse
            .then(response => {
              
              history.push({
                pathname: "/edit",
                search: "?version=" + response.data.createSiteOrigin.prototypeUrl
              });
              console.log(response)
            }).catch(err => {
              
              console.error(err)
            });
            return false;
        }}>
        <InputField>
          <Input name="site" type="text" placeholder="Enter a website" innerRef={inputEl}/>
          <FancySecondaryButton type="submit">Prototype Changes</FancySecondaryButton>
        </InputField>
        </form>
      </Footer>
      <Copy>&copy; 2019 getDiff, Inc.</Copy>
    </Page>
  );
};


export default HomePage;