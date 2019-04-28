import dynamoose from "dynamoose";

const Schema = dynamoose.Schema;

interface KeySchema {
  id?: String;
}

interface DataSchema {
  sub: String;
  picture?: String;
  email?: String;
  subscription_plan: string;
  subscription_status: string;
}

const userSchema = new Schema({
  sub: String,
  picture: String,
  email: String,
  subscription_plan: String,
  subscription_status: String
});

const User = dynamoose.model<DataSchema, KeySchema>("User", userSchema);

export default User;
