import { dynamo, ORIGINS } from '../dynamodb';
import _ from 'lodash';

interface User {
    sub: string;
}

export interface Origin {
    Host: string;
    Origin: String;
    Proto: string;
    Created: string;
    uid: string | undefined;
}


export const createSiteOrigin = (host: string, origin: string, protocol: string, created: string, user: User | undefined): Promise<boolean> => {
    const params = {
        TableName: ORIGINS,
        Item: {
            Host: { S: host },
            Origin: { S: origin },
            Proto: { S: protocol },
            Created: { N: created },

        }
    };

    if (_.has(user, 'sub')) {
        params.Item['uid'] = { S: user.sub };
    }


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