import { dynamo, DELTAS } from '../dynamodb';
import _ from 'lodash';

interface User {
    sub: string;
}

export interface Delta {
    Host: string;
    Changes: String;
    CSS: string;
    Created: string;
    uid: string;
}

export const createDelta = (delta: Delta): Promise<void | object> => {

    const params = {
        TableName: DELTAS,
        Item: {
            Host: { S: delta.Host },
            Changes: { S: delta.Changes },
            CSS: { S: delta.CSS },
            Created: { N: delta.Created }
        }
    };

    if (_.has(delta, 'uid')) {
        params.Item['uid'] = { S: delta.uid };
    }

    console.log('[AWS putItem] [Table: Deltas]\n', JSON.stringify(params, null, 4))

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        dynamo.putItem(params, (err, data) => {
            if (err) {
                console.log("Error", err);
                return reject(err);
            }

            return resolve();
        });
    });
} 