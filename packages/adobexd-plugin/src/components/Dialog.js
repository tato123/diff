import React from "react";
import styled from "styled-components";
import logo from "./diff-logo.png";

const Container = styled.div`
  width: 250px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;

  font-size: 16px;
  .logo {
    margin-bottom: 32px;
  }
`;

const Strong = styled.span`
  font-weight: bold !important;
`;

const P = styled.p``;

const SB = styled.span`
  margin-bottom: 16px;
`;

const Button = styled.button`
  width: 90%;
`;

const Dialog = ({ history }) => (
  <Container>
    <div>
      <img className="logo" src={logo} alt="logo" />
    </div>
    <div>
      <SB>
        <Strong>Streamlined Build, Measure, Learn</Strong>
      </SB>
      <P>Design in XD</P>
    </div>
    <div>
      <button>Sign up</button>
    </div>
    <div>
      <button onClick={() => history.push("/login")}>Log in</button>
    </div>
  </Container>
);

export default Dialog;
