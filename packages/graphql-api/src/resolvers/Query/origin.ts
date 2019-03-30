
import _ from 'lodash';
import * as Origins from '../../aws/tables/Origins';

interface QueryRequest {
  limit: {
    mine: boolean;
  }
  Host: string;
}

export const origin = async (_parent, args, context) => {

  const host = _.get(args, 'Host', null);

  const fields = {
    Host: { S: host }
  }

  return await Origins.getByHost(fields)
    .catch(err => {
      console.error('error occured querying');
      return {};
    })
};

export const origins = async (_parent, args, context) => {
  const fields = {};
  const filterByUid = _.get(args, 'limit.mine', false);
  const user = context.user;

  if (filterByUid) {
    _.merge(fields, {
      uid: user.sub
    })
  }


  return await Origins.query(fields)
    .then(result => {
      // console.log('response is ', result);
      return result;
    })
    .catch(err => {
      console.error('error occured querying');
      return {};
    })
}