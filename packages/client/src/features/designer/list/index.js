import React from "react";
import styled from "styled-components";
import Messanger from "./Messanger";
import { CheckBox } from "grommet";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const GET_COMPONENTS = gql`
  {
    allComponents {
      created
      name
      url
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 auto;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom: 1px solid #ccc;
`;

const HeaderRow = styled(Row)`
  border-bottom: 1px solid #ccc;
  text-transform: uppercase;
  font-size: 12px;
  padding: 8px 16px;
`;

const ContentRow = styled(Row)`
  border-bottom: 1px solid #ccc;
  min-height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const h1Delta = {
  html: `<h1 data-df="p.03" style="font-size:5rem;font-family:Arial;font-weight:100;line-height:1.5;">{{value}}</h1>`,
  css: "h1",
  id: "p.03"
};

const List = () => (
  <Container>
    <HeaderRow>Previewing changes for:</HeaderRow>
    <Query query={GET_COMPONENTS}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;

        return (
          <Messanger>
            {sendMessage =>
              data.allComponents.map(component => (
                <ContentRow>
                  <CheckBox
                    toggle
                    onChange={evt =>
                      sendMessage({
                        type: !!evt.target.checked ? "apply" : "remove",
                        ...h1Delta
                      })
                    }
                  />
                  <label>{component.name}</label>
                </ContentRow>
              ))
            }
          </Messanger>
        );
      }}
    </Query>
  </Container>
);

export default List;
