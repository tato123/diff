import { Document, model, Model, Schema } from "mongoose";

export interface IProjectSchema extends Document {
  hostname: String;
  protocol: String;
  creator: String;
  created: Date;
  name: String;
  description: String;
  archived: Boolean;
}

const projectSchema = new Schema({
  hostname: String,
  protocol: String,
  creator: String,
  created: Date,
  name: String,
  description: String,
  archived: { type: Boolean, default: false }
});

const Project: Model<IProjectSchema> = model<IProjectSchema>(
  "Project",
  projectSchema
);

export default Project;
