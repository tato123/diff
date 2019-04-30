import React, { useContext } from "react";
import styled from "styled-components";

import AuthContext from "../../utils/context";
import GoogleButton from "react-google-button";

import { Layout, Typography } from "antd";

import { Router } from "react-router-dom";

const { Title } = Typography;

const FormWrapper = styled.div`
  max-width: 600px;
  padding: 32px;
`;

const Login = ({ history }) => {
  const auth = useContext(AuthContext);

  if (auth.isAuthenticated()) {
    auth.handleRedirect();
  }

  return (
    <Router history={history}>
      <Layout style={{ height: "100vh" }}>
        <Layout.Content
          style={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center"
          }}
        >
          <FormWrapper style={{ width: 500 }}>
            <Title>Login to Diff</Title>
            <GoogleButton
              style={{ width: "100%", fontSize: 14 }}
              type="light" // can also be written as disabled={true} for clarity
              onClick={auth.loginWithGoogle}
            />
          </FormWrapper>
        </Layout.Content>
      </Layout>
    </Router>
  );
};

export default Login;
