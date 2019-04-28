import dynamoose from "dynamoose";

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

const userSchema = {
  sub: String,
  picture: String,
  email: String,
  subscription_plan: String,
  subscription_status: String
};

const User = dynamoose.model<DataSchema, KeySchema>("User", userSchema);

export default User;
