import gql from "graphql-tag";

export const CREATE_PROJECT = gql`
  mutation createProject($url: String!, $name: String!, $description: String) {
    createProject(
      input: { url: $url, name: $name, description: $description }
    ) {
      id
      hostname
      name
      description
    }
  }
`;

export const SAVE_VERSION = gql`
  mutation SaveSiteDeltas($input: SaveSiteDeltasInput!) {
    saveSiteDeltas(input: $input) {
      prototypeUrl
    }
  }
`;
