import React, { useRef, useState } from "react";
import { useMutation } from 'react-apollo-hooks';
import Button from '../../components/Button';
import Icon from "../../components/Icon";
import { CREATE_SITE } from "../../graphql/mutations";
import Banner from './styles/Banner';
import Column from './styles/Column';
import Copy from './styles/Copy';
import Explain from './styles/Explain';
import Footer from './styles/Footer';
import Input from './styles/Input';
import InputField from './styles/InputField';
import Main from './styles/Main';
import Page from './styles/Page';
import Sentence from './styles/Sentence';
import SpecialText from './styles/SpecialText';
import Step from './styles/Step';
import { scroller, Element } from 'react-scroll';
import { isMobile } from 'react-device-detect';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';



const HomePage = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const inputEl = useRef('');
  const createSite = useMutation(CREATE_SITE)

  const onSubmit = (evt) => {
    evt.preventDefault();


    const siteResponse = createSite({ variables: { input: { url: inputEl.current.value } } });
    setLoading(true);
    siteResponse
      .then(response => {
        setLoading(false);
        history.push({
          pathname: "/edit",
          search: "?version=" + response.data.createSiteOrigin.prototypeUrl
        });
        console.log(response)
      }).catch(err => {
        setLoading(false);
        console.error(err)
      });
    return false;
  }

  return (
    <Page>
      <Header
        account={() => (
          <Link to="/account">Dashboard</Link>

        )}
      />

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
          <div className="button-group">
            {/* <Button appearence="FancyPrimaryButton" >See how it works</Button> */}
            <Button appearence="FancySecondaryButton" onClick={() => scroller.scrollTo('myScrollToElement', { duration: 650, delay: 0, smooth: "easeIn" })}> Try it out</Button>
          </div>
        </div>
        <div className="logo">
          <Icon icon="computer" style={{ maxWidth: "100%" }} />
        </div>
      </Main>
      <Explain>
        <Column id="step1">
          <Step>1</Step>
          <h1 style={{ color: "#4949b1", textTransform: "uppercase" }}>Enter your url</h1>
          <p>
            Go to getdiff.app and enter the URL of the website or application
            you would like to make changes to.
          </p>
        </Column>
        <Column id="step2">
          <Step>2</Step>
          <h1 style={{ color: "#5aced5", textTransform: "uppercase" }}>Make css changes using devtools</h1>
          <p>
            Open devtools and make CSS changes. We will keep up with them until
            you are done.
          </p>
        </Column>
        <Column id="step3">
          <Step>3</Step>
          <h1 style={{ color: "#dd51b1", textTransform: "uppercase" }}>Get a unique url</h1>
          <p>
            Click "Save changes" and a unique URL will be automatically copied
            to your clipboard
          </p>
        </Column>
      </Explain>
      <Footer>
        <Element name="myScrollToElement"></Element>


        {!isMobile && (
          <React.Fragment>
            <Banner>
              Don't worry! This is secure and we don't make changes to your site or
              application
         </Banner>
            <form autoComplete="off" onSubmit={onSubmit}>
              <InputField>
                <Input autoComplete="off" name="site" type="text" placeholder="Enter a website" innerRef={inputEl} />
                <Button onClick={onSubmit} loading={loading} disabled={loading} appearence="FancySecondaryButton" type="submit">Prototype Changes</Button>
              </InputField>
            </form>
          </React.Fragment>
        )}
        {isMobile && (
          <div style={{ fontSize: "2rem", fontWeight: "200", textAlign: "center", color: "red" }}>
            Oh no, it looks like you're on mobile. You can however try Diff on a non-mobile browser.
          </div>
        )}


      </Footer>
      <Copy>&copy; 2019 getDiff, Inc.</Copy>
    </Page>
  );
};


export default HomePage;