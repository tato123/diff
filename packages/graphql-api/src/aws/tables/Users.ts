
import { dynamo, USERS } from '../dynamodb';
import _ from 'lodash';

export const createUid = (uid: string): Promise<boolean> => {
    const params = {
        TableName: USERS,
        Item: {
            uid: { S: uid },
            plan: { S: 'trial' }
        }
    };



    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        dynamo.putItem(params, (err: Object) => {
            if (err) {
                console.log("Error", err);
                return reject(err);
            }

            return resolve();
        });
    });
}