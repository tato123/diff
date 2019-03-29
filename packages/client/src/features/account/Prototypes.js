import React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import styled from 'styled-components';
import { useQuery } from 'react-apollo-hooks';
import EmptyState from '@atlaskit/empty-state';

import gql from 'graphql-tag';


const GET_ORIGINS = gql`
  {
    origins(limit:{mine:true}) {
      host
      origin
    }
  }
`;


const ProtoTypeList = styled.div`
    display: flex;
    flex: 1 auto;
    flex-wrap: wrap;
`

const Prototype = styled.div`
    display: grid;
    width: 200px;
    height: 250px;
    border-radius: 16px;
    border: 1px solid #ccc;
    margin-left: 16px;
    margin-top: 8px;
    padding: 10px;
    box-sizing: border-box;
    grid-template-areas: "." "." ".";
    grid-template-rows: 3fr 1fr 1fr;
    grid-row-gap: 8px;
`



const Wrapper = ({ children }) => (
    <div>
        <h1>My Prototypes</h1>
        {children}

    </div>
)

const Prototypes = ({ history }) => {
    const { data, error, loading } = useQuery(GET_ORIGINS);
    const goTo = (url) => () => {
        history.replace(url);
    }

    if (loading) {
        return <Wrapper>Loading...</Wrapper>;
    };
    if (error) {
        return <Wrapper>Error! {error.message}</Wrapper>;
    };

    console.log(data)

    return (
        <Wrapper>
            <ProtoTypeList>
                {data.origins.length === 0 && (
                    <EmptyState
                        header={'No prototypes yet'}
                        description={`Looks like you haven't created any prototypes yet. No worries, go ahead and get started`}
                    />
                )}
                {data.origins.map(origin => (
                    <Prototype key={origin.host}>
                        <div>
                            <label>{origin.origin}</label></div>
                        <div style={{ display: "flex" }}>
                            <ButtonGroup>
                                <Button onClick={goTo("/edit?version=" + origin.host)}>Edit</Button>
                                <Button onClick={goTo(`https://${origin.host}`)}>View</Button>
                            </ButtonGroup>
                        </div>
                    </Prototype>
                ))}
            </ProtoTypeList>
        </Wrapper>

    );
}





export default Prototypes;