import styled from 'styled-components';

const Space = styled.span`
  display: block;
  ${props => props.right && `margin-right: var(--df-space-${props.right});`};
  ${props => props.left && `margin-left: var(--df-space-${props.left});`};
  ${props => props.top && `margin-top: var(--df-space-${props.top});`};
  ${props => props.bottom && `margin-bottom: var(--df-space-${props.bottom});`};

  ${props => props.all && `margin: var(--df-space-${props.all});`};
`;

export default Space;
