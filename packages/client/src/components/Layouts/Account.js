import React from 'react';
import Header from '../Header';
import styled from 'styled-components';


const FullPage = styled.div`
  width: 100%;
  height: 100%;
  padding:0 150px;
  box-sizing: border-box;


`



const AccountLayout = ({ children }) => (
    <FullPage>
        <Header />
        <div>
            {children}
        </div>
    </FullPage>
)

export default AccountLayout;