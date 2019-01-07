import React from "react";
import PropTypes from "prop-types";
import Textfield from "@atlaskit/textfield";
import styled from "styled-components";
import EmptyState from "../../components/Empty";
import { Mutation, Query } from "react-apollo";
import { CREATE_SITE, ALL_ORIGINS } from "../../graphql/mutations";

const Page = styled.div`
  margin: 0 15%;
  margin-top: 16px;
`;

const CardContainer = styled.div`
  display: flex;
  flex: 1 auto;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Card = styled.div`
  width: 390px;
  height: 330px;
  border: 2px solid #dfe1e6;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 16px 16px 0px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  &:hover {
    background-color: #ebecf0;
  }
`;

export default class Designer extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    })
  };

  onSubmit = mutation => evt => {
    evt.preventDefault();
    const site = evt.target.website.value;
    mutation({ variables: { input: { url: site } } });

    return false;
  };

  render() {
    const {
      props: { history }
    } = this;
    return (
      <Page>
        <Mutation mutation={CREATE_SITE}>
          {(createSiteOrigin, { data }) => (
            <form onSubmit={this.onSubmit(createSiteOrigin)}>
              <label htmlFor="auto-focus">Add a site to prototype</label>
              <Textfield
                name="website"
                autoFocus
                placeholder="Enter a website URL"
              />
            </form>
          )}
        </Mutation>
        <Query query={ALL_ORIGINS}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return <EmptyState />;

            return (
              <CardContainer>
                {data.allOrigins.map(origin => (
                  <Card
                    key={origin.host}
                    onClick={() =>
                      history.push({
                        pathname: "/edit",
                        search: `?version=${encodeURIComponent(origin.host)}`
                      })
                    }
                  >
                    <label>{origin.origin}</label>
                  </Card>
                ))}
              </CardContainer>
            );
          }}
        </Query>
      </Page>
    );
  }
}
