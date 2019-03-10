// eslint-disable-next-line no-unused-vars
import React from 'react';
import styled from 'styled-components';

const Main = styled.div`
    
    display: grid;
    grid-template-areas: "d l";
    grid-template-rows: minmax(0, 1fr);
    grid-template-columns: 1fr 1fr;

    .description {
        grid-area: d;

        .button-group{
            margin-top: 64px;
        }

        .button-group > button:first-child {
            margin-right: 16px;
        }
    }

    .logo {
        grid-area: l;
    }

    @media only screen and (max-width:1024px) {
        grid-template-areas: "l" "d";
        grid-template-rows: 220px 1fr;
        grid-template-columns: 1fr;
        grid-row-gap: 24px;

        .description {
            text-align: center;

            .button-group {
                margin-top: 16px;
            }

            .button-group button {
                width: 100%;
                margin-top: 24px;
                height: 50px;
                max-height: 50px;
            }
        }

        .logo > img {
            max-height: 200px;
            width: 100%;
            object-fit: contain;
        }
    }

   

    h1 {
        text-transform: uppercase;
    }

    .description h1{
        font-weight:900;
    }

    p {
        margin-top: 32px;
        font-size: 1.2rem;
    }
`;

export default Main;