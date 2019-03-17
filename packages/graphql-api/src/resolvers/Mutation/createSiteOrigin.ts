
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
    url: string
    input: {
        url: string;
    }
}

const createSiteOrigin = async (_parent: Object, args: SiteRequest, context) => {
    const randomSlug = uniqueSlug(args.url);
    const host = `${randomSlug}.${process.env.PROTOTYPE_URL}`;

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
    const user = await context.getUser();

    console.log("host", host);
    console.log("args", args);
    console.log("protocol", protocol);

    return Origins.createSiteOrigin(host, originUrl, protocol, timestamp, user)
        .then(() => ({
            prototypeUrl: host
        }))

};



export default createSiteOrigin;