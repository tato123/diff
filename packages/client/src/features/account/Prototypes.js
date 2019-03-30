import React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import styled from 'styled-components';
import { useQuery } from 'react-apollo-hooks';
import EmptyState from '@atlaskit/empty-state';
import { darken } from 'polished';

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
    margin-top: 16px;
`

const Prototype = styled.div`
    display: grid;
    padding: 0;
    margin: 0 15px 30px 15px;
   


    
`

const Card = styled.div`
    width: 220px;
    height: 190px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    overflow: hidden;
    display: grid;
    grid-template-areas:
        "cover"
        "footer";
    grid-template-rows:1fr 40px;
    grid-template-columns: 1fr;
`

const gray = '#efefef';
const gray1 = darken(0.15, gray);
const Cover = styled.div`
  background:${gray};
  grid-area: cover;
  color: ${gray1};
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  
  label {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 16px;
  }
  
`

const Footer = styled.div`
  grid-area: footer;
  padding: 4px;

  > div {
      width: 100%;
  }
  
`;


const Wrapper = ({ children }) => (
    <div>
        <h1>My Prototypes</h1>
        {children}

    </div>
)

const SubTitle = styled.label`
    display: block;
    font-size:12px;
    margin-top: 4px;
    margin-left: 8px;
    color: #70757a;
`

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
                        <Card>
                            <Cover>
                                <label>prototype</label>
                            </Cover>
                            <Footer>
                                <ButtonGroup >
                                    <Button onClick={goTo("/edit?version=" + origin.host)} shouldFitContainer>Edit</Button>
                                    <Button appearance="link" href={`https://${origin.host}`} shouldFitContainer>View</Button>
                                </ButtonGroup>
                            </Footer>
                        </Card>
                        <SubTitle>{origin.origin}</SubTitle>

                    </Prototype>
                ))}
            </ProtoTypeList>
        </Wrapper>

    );
}





export default Prototypes;