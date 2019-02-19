import React from 'react';
import styled from 'styled-components';

const Main = styled.div`
    display: flex;
    flex: 1 auto;
    justify-content: space-between;

    > div:first-child {
    margin-right: 16px;
    display: flex;
    flex: 1 auto;
    flex-direction: column;
    width: 50%;

    > div:first-child {
        margin-bottom: 64px;
    }

    > div:last-child * {
        margin-right: 16px;
    }
    }

    h1 {
    text-transform: uppercase;
    }

    p {
    margin-top: 32px;
    font-size: 1.2rem;
    }
`;

export default Main;