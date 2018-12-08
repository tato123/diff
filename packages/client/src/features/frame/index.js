import React from 'react';
import styled from 'styled-components';


const Container = styled.div`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #eee;
    padding: 10px;

    iframe {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
    }
`;

const Frame = () => (
    <Container>
        <iframe src="http://localhost:8000" />
    </Container>
)

export default Frame;