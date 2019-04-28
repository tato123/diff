import { AuthenticationError } from "apollo-server-express";
import aws from "../../aws";
import { Context } from "../../context/type";
import _ from "lodash";

const { Project } = aws.models;

interface ProjectFilter {
  filter: {
    showArchived: boolean;
  };
}

const requireUser = async context => {
  const user = await context.user;

  if (!_.has(user, "sub")) {
    throw new AuthenticationError("A user was not provided");
  }

  return user;
};

export default async (_parent, args: ProjectFilter, context: Context) => {
  const user = await requireUser(context);
  const result = await Project.get({ creatorArchived: `${user.sub}_false` });
  return result;
};
