import { AuthenticationError } from "apollo-server-express";
import aws from "../../aws";
import { Context } from "../../context/type";
import _ from "lodash";

const { Project } = aws.models;

interface ProjectFilter {
  uid: string;
  archived: boolean;
}

const requireUser = async context => {
  const user = await context.user;

  if (!_.has(user, "sub")) {
    throw new AuthenticationError("A user was not provided");
  }

  return user;
};

export default async (_parent, args: ProjectFilter, context: Context) => {
  // verify we are logged in
  await requireUser(context);

  // if userid is provided then use that
  if (args.uid) {
    const result = await Project.query({
      creatorArchived: { eq: `${args.uid}_${_.get(args, "archived", false)}` }
    }).exec();
    return result;
  }

  const results = await Project.scan().exec();
  return results;
};
