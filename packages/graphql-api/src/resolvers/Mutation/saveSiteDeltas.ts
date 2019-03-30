

import * as  Deltas from '../../aws/tables/Deltas';

const uniqueSlug = require("unique-slug");
const normalizeUrl = require("normalize-url");
const str = require("string-to-stream");
const sslChecker = require("ssl-checker");
const toCss = require("to-css");
import _ from 'lodash';

interface SaveSiteInput {
    input: {
        host: string;
        deltas: string;
    }
}

const saveSiteDeltas = async (_parent: Object, args: SaveSiteInput, context) => {
    const Host = args.input.host;
    const Changes = args.input.deltas;
    const CSS = toCss(JSON.parse(Changes));
    const Created = Date.now().toString();
    const user = context.user;


    return Deltas.createDelta({
        Host,
        Changes,
        CSS,
        Created,
        uid: _.get(user, 'sub', null)
    }).then(() => ({
        prototypeUrl: Host
    })).catch(() => {
        return {};
    })
};

export default saveSiteDeltas;