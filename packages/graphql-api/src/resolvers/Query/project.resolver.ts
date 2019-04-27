import { AuthenticationError } from "apollo-server-express";
import Delta from "../../aws/models/Delta";
import { Context } from "../../context/type";
import _ from "lodash";
import { requireUser } from "../utils";

interface DeltaArgs {
  id: String;
}

export default async (_parent, args: DeltaArgs, context: Context) => {
  const user = await requireUser(context);
  const result = await Delta.findById(args.id);
  return result;
};
