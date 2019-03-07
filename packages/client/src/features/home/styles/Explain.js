import React from 'react';
import styled from 'styled-components';

const Explain = styled.div`
  display: flex;
  flex: 1 auto;
  justify-content: space-between;
  align-items: center;

  @media only screen and (max-width: 900px) {
    flex-direction: column;
    align-items: initial;
    justify-content: initial;

    #step1, #step2, #step3 {
      width: 100%;
  
    }

  
  
  }


  #step1 > h1, #step2 > h1, #step3 > h1 {
    text-transform:uppercase;
    font-weight:900;
  }

  #step1 > h1 {
    color:rgb(73, 73, 177);

  }

  #step2 > h1 {
    color:rgb(90, 206, 213);
  }

  #step3 > h1 {
    color:rgb(221, 81, 177);
  }


  

`;

export default Explain;