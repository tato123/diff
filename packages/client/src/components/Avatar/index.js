import React from 'react';
import styled from 'styled-components';


const AvatarImage = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
`;

const AvatarPlaceholder = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: inline-block;
    background-color: #ccc;
`

const Avatar = ({ src, ...rest }) => {
    if (!src) {
        return <AvatarPlaceholder {...rest} />
    }

    return <AvatarImage src={src} {...rest} />
}

export default Avatar;