import dynamoose from "dynamoose";

const Schema = dynamoose.Schema;

interface KeySchema {
  id?: String;
  creator?: String; // global secondary index
}

interface DataSchema {
  projectId: String;
  checksum: String;
  url: String;
  creator: String;
  created: String;
}

const deltaSchema = new Schema({
  projectId: String,
  checksum: String,
  url: String
});

const Delta = dynamoose.model<DataSchema, KeySchema>("Delta", deltaSchema, {
  create: true,
  update: true
});

export default Delta;
