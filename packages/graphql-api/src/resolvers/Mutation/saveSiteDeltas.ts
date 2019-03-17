

import { dynamo, DELTAS, ORIGINS } from '../../aws/dynamodb';

const uniqueSlug = require("unique-slug");
const normalizeUrl = require("normalize-url");
const str = require("string-to-stream");
const sslChecker = require("ssl-checker");
const toCss = require("to-css");

interface SaveSiteInput {
    input: {
        host: string;
        deltas: string;
    }
}

const saveSiteDeltas = async (_parent: Object, args: SaveSiteInput) => {
    const host = args.input.host;
    const deltas = args.input.deltas;
    const css = toCss(JSON.parse(deltas));
    const timestamp = Date.now().toString();

    console.log("saving site deltas", host, css);

    const params = {
        TableName: DELTAS,
        Item: {
            Host: { S: host },
            Changes: { S: deltas },
            CSS: { S: css },
            Created: { N: timestamp }
        }
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        dynamo.putItem(params, (err, data) => {
            if (err) {
                console.log("Error", err);
                return reject(err);
            }

            return resolve({
                prototypeUrl: host
            });
        });
    });
};

export default saveSiteDeltas;