const AWS = require('aws-sdk');
// Create the DynamoDB service object
const dynamo = new AWS.DynamoDB({ apiVersion: '2012-10-08', region: 'us-east-1' });




const noop = () => {
    return [{}];
}

const originQuery = async (parent, args, {user})  => {
    const account = await user;

    
    var params = {
        TableName: 'Origins',
        Key: {
            'Host': { S: args.Host },
        }
    }; 

    // Call DynamoDB to read the item from the table
    return new Promise((resolve,reject) => {
        dynamo.getItem(params,  (err, data) => {
            if (err) {
                console.log("Error", err);
                return reject(err)
            } else {
                return resolve({
                    host: data.Item.Host.S,
                    origin: data.Item.Origin.S
                })
            }
        });
    })
    
}


module.exports = {
    allInvites: noop,
    allUsers: noop,
    allComponents: noop,
    origin: originQuery
}