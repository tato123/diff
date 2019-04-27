import { Document, model, Model, Schema } from "mongoose";

interface IUserSchema extends Document {
  sub: String;
  picture?: String;
  email?: String;
  subscription: {
    plan: String;
    status: String;
  };
}

const userSchema = new Schema({
  sub: String,
  picture: String,
  email: String,
  subscription: {
    plan: String,
    status: String
  }
});

const User: Model<IUserSchema> = model<IUserSchema>("User", userSchema);

export default User;
