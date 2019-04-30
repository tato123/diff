import dynamoose from "dynamoose";
import Tables from "./Tables";

const Schema = dynamoose.Schema;

interface KeySchema {
  id?: String;
  creatorIndex?: String;
  projectIdIndex?: String;
}

interface DataSchema {
  projectId: String;
  checksum: String;
  url: String;
  creator: String;
  created: String;
}

const deltaSchema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true
  },
  checksum: String,
  as: String,
  value: String,
  type: String,
  creator: {
    type: String,
    required: true,
    index: {
      global: true,
      name: "creatorIndex",
      project: true,
      throughput: 5
    }
  },
  created: Date,

  projectId: {
    type: String,
    required: true,
    index: {
      global: true,
      name: "projectIdIndex",
      project: true,
      throughput: 5
    }
  }
});

const Delta = dynamoose.model<DataSchema, KeySchema>(
  Tables.Delta,
  deltaSchema,
  {
    create: true,
    update: true
  }
);

export default Delta;
