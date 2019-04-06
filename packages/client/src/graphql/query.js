import gql from "graphql-tag";


export const ORIGIN_BY_ID = gql`
  
      query origin($host:String!) {
          origin(Host:$host) {
              host
              origin
              uid
              name
              created
              protocol
          }
      }
  
`;
