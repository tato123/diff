import React from "react";
import styled from "styled-components";
import logo from "./diff-logo.png";

const Container = styled.div`
  width: 400px;
  height: 150px;
  display: flex;
  flex-direction: column;
  font-size: 13px;

  .logo {
    margin-bottom: 32px;
  }

  hr {
    margin-top: 16px
    border-bottom: 2px solid #ccc;
  }
`;

const Layout = ({ children }) => (
  <Container>
    <div>
      <img src={logo} alt="logo" />
      <hr />
    </div>

    {children}
  </Container>
);

export default Layout;
