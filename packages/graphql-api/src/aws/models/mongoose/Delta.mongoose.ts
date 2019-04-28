import { Document, model, Model, Schema } from "mongoose";

interface IDeltaSchema extends Document {
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

const Delta: Model<IDeltaSchema> = model<IDeltaSchema>("Delta", deltaSchema);

export default Delta;
