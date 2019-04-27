import { AuthenticationError } from "apollo-server-express";
import Project from "../../aws/models/Project";
import { Context } from "../../context/type";
import _ from "lodash";
import { requireUser } from "../utils";

interface ProjectFilter {
  id: String;
}

export default async (_parent, args: ProjectFilter, context: Context) => {
  const user = await requireUser(context);
  const result = await Project.findById(args.id);
  return result;
};
