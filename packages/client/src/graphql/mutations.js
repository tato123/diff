import gql from "graphql-tag";

export const CREATE_SITE = gql`
  mutation CreateSiteOrigin($input: CreateSiteOriginInput!) {
    createSiteOrigin(input: $input) {
      prototypeUrl
    }
  }
`;

export const ALL_ORIGINS = gql`
  {
    allOrigins {
      host
      origin
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
