import { AuthenticationError } from "apollo-server-express";
import _ from "lodash";

export default async context => {
  const user = await context.user;

  if (!_.has(user, "sub")) {
    throw new AuthenticationError("A user was not provided");
  }

  return user;
};
