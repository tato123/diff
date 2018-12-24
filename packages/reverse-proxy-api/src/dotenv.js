const path = require("path");
const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "development";

console.log("Environment is", env);

dotenv.config({
  path: path.resolve(__dirname, `../.env.${env}`)
});

console.log("running dotenv", process.env.IS_PRESENT);
