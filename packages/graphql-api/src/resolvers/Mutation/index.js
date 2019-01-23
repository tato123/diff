const AWS = require("aws-sdk");
const toCss = require('to-css');

// Create the DynamoDB service object
const dynamo = new AWS.DynamoDB({
  apiVersion: "2012-10-08",
  region: "us-east-1"
});

const uniqueSlug = require("unique-slug");
const normalizeUrl = require("normalize-url");
const str = require("string-to-stream");
const sslChecker = require("ssl-checker")

const processUpload = async (upload, metaData) => {
  console.log("received upload design request", metaData);

  const id = Math.floor(Math.random() * 100000);
  const file = myBucket.file(`${id}-design`);

  // from our file
  const result = await upload;

  return new Promise((resolve, reject) => {
    str(result)
      .pipe(
        file.createWriteStream({
          metadata: {
            contentType: "image/svg+xml",
            metadata: {
              custom: "metadata"
            }
          }
        })
      )
      .on("error", err => {
        console.error("could not upload file", err);
        reject({
          status: "error"
        });
      })
      .on("finish", () => {
        resolve({
          status: "done"
        });
      });
  });
};

const createSiteChange = async (parent, args, context) => {
  return {
    status: "failed"
  };
};

const checkProtocol = async (origin) => {
  try {
    console.log('checking site', origin)
    const result = await sslChecker(origin);
    if (result.valid) {
      return 'https'
    }
    return 'http'
  } catch (error) {
    console.error('error')
    return 'http'
  }
}

const createSiteOrigin = async (parent, args, context) => {
  const randomSlug = uniqueSlug(args.url);
  const host = `${randomSlug}.site.stage-getdiff.app`;
  const inputUrl = new URL(normalizeUrl(args.input.url, {stripWWW: false}));
  const originUrl = inputUrl.host;
  const protocol = await checkProtocol(originUrl)

  console.log("host", host);
  console.log("args", args);
  console.log('protocol', protocol)

  const params = {
    TableName: "Origins",
    Item: {
      Host: { S: host },
      Origin: { S: originUrl },
      Proto: {S: protocol}
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

const saveSiteDeltas = async (parent, args, context) => {
  const versionUrl = args.input.versionUrl;
  const deltas = args.input.deltas;
  const css = toCss(JSON.parse(deltas));

  console.log("saving site deltas", versionUrl, css);

  const params = {
    TableName: "Deltas",
    Item: {
      VersionUrl: { S: versionUrl },
      Changes: { S: deltas },
      CSS: {S: css}
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
        prototypeUrl: versionUrl
      });
    });
  });
};

module.exports = {
  uploadDesign: (obj, { file, metaData }) => processUpload(file, metaData),
  createSiteChange,
  createSiteOrigin,
  saveSiteDeltas
};
