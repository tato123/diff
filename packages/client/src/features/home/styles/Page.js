// eslint-disable-next-line no-unused-vars
import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  display: grid;
  grid-template-areas: "." "." "." "." ".";
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  grid-template-rows: 64px 0.75fr 1fr 0.3fr 100px;
  margin: 75px;

  font-size: 1rem;
  line-height: 1.6;
  grid-gap: 32px;


  @media only screen and (min-width:1024px) {
    margin: 150px;
  }

  @media only screen and (max-width:500px) {
    margin: 25px;
  }

  margin-bottom: 16px;

  
div > form button{
  height:60px;
  width:calc(100% - 20px);
}
div input{
  max-height:60px;
  border-radius:1000px;
  width:calc(100% - 30px);
}


div:nth-child(4) > div:nth-child(2){
  width:calc(100% - 60px);
  padding:15px 30px;
}
div > div:nth-child(3) > div:nth-child(1) > div{
  font-size:1.5em;
}
div:nth-child(1) > div > div:nth-child(2) > div{
  font-size:1.5em;
}
div:nth-child(1) > div > div:nth-child(3) > div{
  font-size:1.5em;
}
#root form{
  margin-top:30px;
}

`;

export default Page;