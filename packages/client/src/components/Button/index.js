
import React from "react";
import styled from "styled-components";
import {lighten, grayscale} from 'polished';

const PURPLE = '#4949b1';
const DARK_BLUE = '#151837';



const ButtonStyle = styled.button`
  padding: 20px;
  text-transform: uppercase;
  font-size: 20px;
  outline: none;
  border-radius: 32px;
  border: none;
  padding: 10px 32px;
  box-sizing: border-box;
  cursor: pointer;
  animation: all 350ms ease-in;

  &:disabled {
    background-color: ${grayscale(PURPLE)}
  }

  ${props => props.appearence === 'FancyPrimaryButton' && `
    background-color: ${PURPLE};
    color: #fff;

    &:hover {
      background-color: ${lighten(0.1, PURPLE)} ;
    }
  `}

  ${props => props.appearence === 'FancySecondaryButton' && `
    background-color: ${DARK_BLUE};
    color: #fff;

    &:hover {
      background-color: ${lighten(0.1, DARK_BLUE)};
    }
    `};

`;

const Button = ({children, loading, ...rest}) => (
  <ButtonStyle {...rest}>
    <div className="text loading" >{children}</div>
  </ButtonStyle>
)

Button.defaultProps = {
  loading: false
}
  

export default Button;