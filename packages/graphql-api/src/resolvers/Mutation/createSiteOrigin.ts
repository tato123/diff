
import * as Origins from '../../aws/tables/Origins'
const uniqueSlug = require("unique-slug");
const str = require("string-to-stream");
const sslChecker = require("ssl-checker");
const toCss = require("to-css");
const normalizeUrl = require("normalize-url");



const checkProtocol = async (origin: string): Promise<string> => {
    try {
        console.log("checking site", origin);
        const result = await sslChecker(origin);
        if (result.valid) {
            return "https";
        }
        return "http";
    } catch (error) {
        console.error("error");
        return "http";
    }
};

interface SiteRequest {
    input: {
        url: string;
        name: string;
    }
}

const createSiteOrigin = async (_parent: Object, args: SiteRequest, context) => {
    console.log
    const randomSlug = uniqueSlug(args.input.url);
    const docId = `${randomSlug}`;

    // cleanup url
    const { host: inputHost } = new URL(
        normalizeUrl(args.input.url, { stripWWW: false })
    );

    // get our hostname
    const inputUrl =
        inputHost.split(".").length === 2 ? `www.${inputHost}` : inputHost;

    const originUrl = inputUrl;
    const protocol = await checkProtocol(originUrl);
    const timestamp = Date.now().toString();
    const user = context.user;
    const name = args.input.name || docId;

    console.log("host", docId);
    console.log("args", args);
    console.log("protocol", protocol);


    return Origins.createSiteOrigin(docId, originUrl, protocol, timestamp, name, user)
        .then(() => ({
            prototypeUrl: docId
        }))

};



export default createSiteOrigin;