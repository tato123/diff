import { AuthenticationError } from "apollo-server-express";
import aws from "../../aws";
import { Context } from "../../context/type";
import _ from "lodash";
import { requireUser } from "../utils";

const { User } = aws.models;

interface UserArgs {
  id: string;
}

export default async (_parent, args: UserArgs, context: Context) => {
  const user = await requireUser(context);
  const result = await User.get({ id: args.id });
  return result;
};
