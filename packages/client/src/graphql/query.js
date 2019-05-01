import gql from "graphql-tag";

export const PROJECT_BY_ID = gql`
  query projects($id: String!) {
    project(id: $id) {
      hostname
      id
      name
      created
      protocol
    }
  }
`;
