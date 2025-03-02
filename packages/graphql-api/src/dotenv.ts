import path from "path";
import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";

console.log("Environment is", env);

dotenv.config({
  path: path.resolve(__dirname, `../.env.${env}`)
});
