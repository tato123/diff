import dynamoose from "dynamoose";
import Tables from "./Tables";

const Schema = dynamoose.Schema;

interface KeySchema {
  id?: string;
}

interface DataSchema {
  id: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  customerId?: string;
  created?: String;
  updated?: String;
  planId?: string;
}

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true
  },
  subscriptionPlan: String,
  subscriptionStatus: String,
  created: String,
  updated: String,
  customerId: String,
  planId: String
});

const User = dynamoose.model<DataSchema, KeySchema>(Tables.User, userSchema, {
  create: true,
  update: true
});

export default User;
