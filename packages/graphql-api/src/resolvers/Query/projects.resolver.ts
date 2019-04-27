import { AuthenticationError } from "apollo-server-express";
import Project from "../../aws/models/Project";
import { Context } from "../../context/type";
import _ from "lodash";

interface ProjectFilter {
  filter: {
    showArchived: Boolean;
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

  const result = await Project.find({
    creator: { $eq: user.sub },
    archived: { $eq: _.get(args.filter, "showArchived", false) }
  });

  console.log("data received", result);
  return result;
};
