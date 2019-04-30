import dynamoose from "dynamoose";

const Schema = dynamoose.Schema;

interface KeySchema {
  id?: string;
}

interface DataSchema {
  id: string;
  picture?: string;
  email?: string;
  subscription_plan?: string;
  subscription_status?: string;
  customerId?: string;
}

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true
  },
  picture: String,
  email: String,
  subscription_plan: String,
  subscription_status: String
});

const User = dynamoose.model<DataSchema, KeySchema>("User", userSchema, {
  create: true,
  update: true,
  waitForActive: false
});

export default User;
