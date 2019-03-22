
import { dynamo, USERS } from '../dynamodb';
import _ from 'lodash';

export const createUidIfNotExists = (uid: string): Promise<boolean> => {
    const timestamp = Date.now().toString();
    const params: any = {
        TableName: USERS,
        Item: {
            uid: { S: uid },
            plan: { S: 'trial' },
            created: { N: timestamp },
            updated: { N: timestamp }
        },
        "ConditionExpression":
            "attribute_not_exists(#u)",
        "ExpressionAttributeNames": { "#u": "uid" },
    };



    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        dynamo.putItem(params, (err: any) => {
            console.log(JSON.stringify(err, null, 4))
            if (err && err.code === 'ConditionalCheckFailedException') {
                // user already exists
                return resolve();
            }
            else if (err) {
                console.log("Error", err);
                return reject(err);
            }

            return resolve();
        });
    });
}

export const updateByUid = (uid: string, key: string, value: string): Promise<void> => {

    const params: any = {
        TableName: USERS,
        Key: {
            "uid": { S: uid }
        },
        UpdateExpression: "set #MyVariable = :y",
        ExpressionAttributeNames: {
            "#MyVariable": key
        },
        ExpressionAttributeValues: {
            ":y": { S: value }
        }
    };



    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        dynamo.updateItem(params, (err: Object) => {
            if (err) {
                console.log("Error", err);
                return reject(err);
            }

            return resolve();
        });
    });
}