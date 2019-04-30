import dynamoose from "dynamoose";

const createDynamooseInstance = (): void => {
  // dynamoose.AWS.config.update({
  //   accessKeyId: "fakeMyKeyId",
  //   secretAccessKey: "fakeSecretAccessKey",
  //   region: "us-east-1"
  // });

  dynamoose.local("http://localhost:8000");
};

const DELTAS = process.env.DELTAS || "";
const ORIGINS = process.env.ORIGINS || "";
const USERS = process.env.USERS || "";

export default {
  tables: {
    DELTAS,
    ORIGINS,
    USERS
  },
  connect: createDynamooseInstance
};
