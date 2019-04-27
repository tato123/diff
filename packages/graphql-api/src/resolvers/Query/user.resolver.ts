import { AuthenticationError } from "apollo-server-express";
import User from "../../aws/models/User";
import { Context } from "../../context/type";
import _ from "lodash";
import { requireUser } from "../utils";

interface UserArgs {
  id: String;
}

export default async (_parent, args: UserArgs, context: Context) => {
  const user = await requireUser(context);
  const result = await User.findById(args.id);
  return result;
};
