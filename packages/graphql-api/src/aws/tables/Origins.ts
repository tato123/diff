import { dynamo, ORIGINS } from '../dynamodb';
import _ from 'lodash';
import { client } from '../../resolvers/Subscription/pubsub'

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


export const createSiteOrigin = (host: string, origin: string, protocol: string, created: string, name: string, user: User | undefined): Promise<boolean> => {
    const params = {
        TableName: ORIGINS,
        Item: {
            Host: { S: host },
            Origin: { S: origin },
            Proto: { S: protocol },
            Created: { N: created },
            Name: { S: name }

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

interface FieldsQuery {
    Host: {
        S: string;
    };
}

export const getByHost = (fields: FieldsQuery) => {
    const host = fields.Host.S;
    const REDIS_KEY = `origin::${host}`;


    const params: any = {
        TableName: ORIGINS,
        Key: fields
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

            const result = {
                host: _.get(data, 'Item.Host.S', null),
                origin: _.get(data, 'Item.Origin.S', null),
                protocol: _.get(data, 'Item.Proto.S', null),
                created: _.get(data, 'Item.Created.N', null),
                uid: _.get(data, 'Item.uid.S', null),
                name: _.get(data, 'Item.Name.S', null)
            };

            return resolve(result);
        });
    });

}

export const getByFields = async (fields) => {


    const params = {
        TableName: ORIGINS,
        ExpressionAttributeNames: {
            "#uid": "uid"
        },
        ExpressionAttributeValues: {
            ":uid": { S: fields.uid }
        },
        FilterExpression: '#uid = :uid'
    };

    console.log("[getByFields]", params);
    console.log('\n\n');

    return new Promise((resolve, reject) => {
        // Call DynamoDB to read the item from the table
        dynamo.scan(params, (err, data) => {

            // check if we get an error
            if (err || _.isEmpty(data)) {
                console.log("Error", err.message);
                return resolve();
            }

            const result = data.Items.map(item => ({
                host: _.get(item, 'Host.S', null),
                origin: _.get(item, 'Origin.S', null),
                protocol: _.get(item, 'Proto.S', null),
                created: _.get(item, 'Created.N', null),
                uid: _.get(item, 'uid.S', null),
                name: _.get(item, 'Name.S', null)
            }));

            console.log("input results", JSON.stringify(data, null, 4));


            console.log("output results", JSON.stringify(result, null, 4));


            return resolve(result)
        });
    })



}

export const query = async (fields) => {
    if (_.has(fields, 'host')) {
        return getByHost(fields.Host)
    }

    return getByFields(fields)


}