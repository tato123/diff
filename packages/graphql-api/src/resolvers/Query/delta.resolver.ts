import { AuthenticationError } from "apollo-server-express";
import aws from "../../aws";
import { Context } from "../../context/type";
import _ from "lodash";
import { requireUser } from "../utils";

const { Delta } = aws.models;

interface ProjectFilter {
  id: String;
}

export default async (_parent, args: ProjectFilter, context: Context) => {
  const user = await requireUser(context);
  const result = await Delta.get({ id: args.id });
  return result;
};
