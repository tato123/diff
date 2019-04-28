import { AuthenticationError } from "apollo-server-express";
import aws from "../../aws";
import { Context } from "../../context/type";
import _ from "lodash";
import { requireUser } from "../utils";

const { Project } = aws.models;

interface DeltaArgs {
  id: string;
}

export default async (_parent, args: DeltaArgs, context: Context) => {
  const user = await requireUser(context);
  const result = await Project.get({ id: args.id });
  return result;
};
