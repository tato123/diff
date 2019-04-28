import dynamoose from "dynamoose";

interface KeySchema {
  id?: string;
  creatorArchived?: string;
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

const projectSchema = {
  hostname: String,
  protocol: String,
  creator: String,
  created: Date,
  name: String,
  description: String,
  archived: { type: Boolean, default: false }
};

const Project = dynamoose.model<DataSchema, KeySchema>(
  "Project",
  projectSchema,
  {
    create: false
  }
);

export default Project;
