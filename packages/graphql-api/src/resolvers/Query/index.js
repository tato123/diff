const AWS = require("aws-sdk");
// Create the DynamoDB service object
const dynamo = new AWS.DynamoDB({
  apiVersion: "2012-10-08",
  region: "us-east-1"
});
const _  = require('lodash')

const ORIGINS = process.env.ORIGINS;

const noop = () => {
  return [{}];
};

const originQuery = (parent, args) => {


  if (!args.Host) {
    return Promist.reject("no address found");
  }



  const host = args.Host;

  var params = {
    TableName: ORIGINS,
    Key: {
      Host: { S: host }
    }
  };

  console.log('querying params', params)

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    dynamo.getItem(params, (err, data) => {

      console.log('results', data)

      // check if we get an error
      if (err || _.isEmpty(data)) {
        console.log("Error", err);
        return resolve();
      }

      

      return resolve({
        host: data.Item.Host.S,
        origin: data.Item.Origin.S,
        protocol: data.Item.Proto.S
      });

    });
  });
};

module.exports = {
  origin: originQuery
};
