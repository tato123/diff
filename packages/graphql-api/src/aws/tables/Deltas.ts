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

export interface DeltaQueryResult {
    host: string;
    changes: String;
    css: string;
    created: string;
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

export const getDelta = async (host: string): Promise<DeltaQueryResult> => {
    const params = {
        TableName: DELTAS,
        Key: {
            Host: { S: host }
        }
    };

    console.log("querying params", params);

    return new Promise((resolve, reject) => {
        // Call DynamoDB to read the item from the table
        dynamo.getItem(params, (err, data) => {
            console.log("results", data);

            // check if we get an error
            if (err || _.isEmpty(data)) {
                console.log("Error", err);
                return resolve();
            }

            const result: DeltaQueryResult = {
                host: _.get(data, 'Item.Host.S', null),
                css: _.get(data, 'Item.CSS.S', null),
                changes: _.get(data, 'Item.Changes.S', null),
                created: _.get(data, 'Item.Created.N', null),
                uid: _.get(data, 'Item.Created.S', null)
            };

            return resolve(result);
        });
    });
}