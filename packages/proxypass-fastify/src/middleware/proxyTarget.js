"use strict";
const { request } = require("graphql-request");
const url = require("url");
const moment = require('moment');
const _ = require('lodash');

const MAX_EXPIRY = 24.0;

const calculateIsExpired = (createdTimestamp) => {
  const initialUtc = createdTimestamp ? parseInt(createdTimestamp) : 1552845566051;
  const created = moment.utc(initialUtc);
  const end = moment.utc();
  const duration = moment.duration(end.diff(created)).asHours();
  console.log('it has been', duration)

  if (duration > MAX_EXPIRY) {
    return true
  }

  return false

}

const middleware = opts => async (req, res, next) => {
  console.log("[proxyTarget] executing middleware");

  const query = `
    query getOrigin($host: String!) {
      origin(Host: $host) {
        host
        origin
        protocol
        created
        customerSubscription {
          plan
          status
        }
      }
    }
  `;

  const variables = {
    host: req.headers.host
  };


  try {
    console.log("Querying with variables", variables);
    const data = await request(process.env.GRAPHQL_ENDPOINT, query, variables);
    const isExpired = calculateIsExpired(_.get(data, 'origin.created', Date.now().toString()));
    const isTrial = _.get(data, 'origin.customerSubscription.plan', 'trial') === 'trial'


    if (data.origin == null) {
      return next("no data found");
    }

    // expired check
    if (isTrial && isExpired) {
      console.error('this link is expired')
      return next({ expired: true })
    }

    req.proxyTarget = `${data.origin.protocol}://${data.origin.origin}`;
    req.proxyHostname = data.origin.origin;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  id: "Get the middleware target",
  route: "",
  handle: middleware
};
