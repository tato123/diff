const AWS = require("aws-sdk");
// Create the DynamoDB service object
const dynamo = new AWS.DynamoDB({
  apiVersion: "2012-10-08",
  region: "us-east-1"
});

const ORIGINS = process.env.ORIGINS;

const noop = () => {
  return [{}];
};

const originQuery = async (parent, args, { user }) => {
  const account = await user;
  const host = args.Host;

  var params = {
    TableName: ORIGINS,
    Key: {
      Host: { S: host }
    }
  };

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    dynamo.getItem(params, (err, data) => {
      if (err) {
        console.log("Error", err);
        return reject(err);
      } else {
        return resolve({
          host: data.Item.Host.S,
          origin: data.Item.Origin.S,
          protocol: data.Item.Proto.S
        });
      }
    });
  });
};

const allOrigins = async () => {
  const params = {
    TableName: ORIGINS
  };

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    dynamo.scan(params, (err, data) => {
      if (err) {
        console.log("Error", err);
        return reject(err);
      }
      return resolve(
        data.Items.map(item => ({
          host: item.Host.S,
          origin: item.Origin.S
        }))
      );
    });
  });
};

module.exports = {
  origin: originQuery,
  allOrigins
};
