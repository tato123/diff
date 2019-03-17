// const str = require("string-to-stream");

// const processUpload = async (upload, metaData) => {
//     console.log("received upload design request", metaData);

//     const id = Math.floor(Math.random() * 100000);
//     const file = myBucket.file(`${id}-design`);

//     // from our file
//     const result = await upload;

//     return new Promise((resolve, reject) => {
//         str(result)
//             .pipe(
//                 file.createWriteStream({
//                     metadata: {
//                         contentType: "image/svg+xml",
//                         metadata: {
//                             custom: "metadata"
//                         }
//                     }
//                 })
//             )
//             .on("error", err => {
//                 console.error("could not upload file", err);
//                 reject({
//                     status: "error"
//                 });
//             })
//             .on("finish", () => {
//                 resolve({
//                     status: "done"
//                 });
//             });
//     });
// };

// const uploadDesign = (obj, { file, metaData }) => processUpload(file, metaData);

export default () => { }