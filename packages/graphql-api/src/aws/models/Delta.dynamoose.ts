import dynamoose from "dynamoose";

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

const deltaSchema = {
  projectId: String,
  checksum: String,
  url: String
};

const Delta = dynamoose.model<DataSchema, KeySchema>("Delta", deltaSchema, {
  create: false
});

export default Delta;
