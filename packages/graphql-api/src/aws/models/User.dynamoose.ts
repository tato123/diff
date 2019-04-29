import dynamoose from "dynamoose";

const Schema = dynamoose.Schema;

interface KeySchema {
  id?: string;
}

interface DataSchema {
  id: string;
  sub: string;
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
  sub: String,
  picture: String,
  email: String,
  subscription_plan: String,
  subscription_status: String,
  customerId: {
    type: String,
    required: false,
    index: {
      global: true,
      name: "customerIdIndex",
      project: true,
      throughput: 5
    }
  }
});

const User = dynamoose.model<DataSchema, KeySchema>("User", userSchema);

export default User;
