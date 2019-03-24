import React from 'react';
import styled from 'styled-components';
import Logo from "../Logo";



const Container = styled.div`
  color: #231c47;
  display: flex;
  flex: 1 auto;
  justify-content: center;
  width: 100%;
  align-items: center;
  height: 100%;
  align-content: center;
  align-self: center;
  background-color: #ebebeb;


  .content {
    border-radius: 8px;

    background-color: #fff;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    overflow: hidden;
    margin-top: 32px;
    min-width: 500px;
    min-height: 500px;
    padding: 32px;
    box-sizing: border-box;
  }
 

  .right {
    background-color: #fff;
  }

  label,
  span {
    color: #231c47;
  }

  a {
    color: #5ccada;
    text-decoration: underline;
  }

  .leftIcon {
    position: absolute;
    left: 16px;
  }
  input[type='email'] {
    padding: 16px !important;
    border-radius: 4px;
  }

  .text span {
    color: #fff;
  }
`;



const AuthenticationLayout = ({ children }) => (
  <Container className="container">
    <div className="row content" >
      <div className="logo">
        <Logo size="64px" />
      </div>
      {children}
    </div>
  </Container>
)

export default AuthenticationLayout;