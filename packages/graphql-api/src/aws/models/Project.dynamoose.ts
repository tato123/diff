import dynamoose from "dynamoose";

const Schema = dynamoose.Schema;
interface KeySchema {
  id: string;
  creatorArchivedIndex?: string;
}

interface DataSchema {
  hostname?: string;
  protocol?: string;
  creator?: string;
  created?: Date;
  name?: string;
  description?: string;
  archived?: boolean;
}

const projectSchema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true
  },
  hostname: String,
  protocol: String,
  creator: String,
  created: Date,
  name: String,
  description: String,
  archived: { type: Boolean, default: false },
  creatorArchived: {
    type: String,
    required: true,
    index: {
      global: true,
      rangeKey: "id",
      name: "creatorArchivedIndex",
      project: true, // ProjectionType: ALL
      throughput: 5 // read and write are both 5
    }
  }
});

const Project = dynamoose.model<DataSchema, KeySchema>(
  "Project",
  projectSchema,
  {
    create: true,
    update: true
  }
);

export default Project;
