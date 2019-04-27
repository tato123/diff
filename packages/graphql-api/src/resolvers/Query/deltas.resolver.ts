import Delta from "../../aws/models/Delta";
import { Context } from "../../context/type";
import { requireUser } from "../utils";

interface DeltaFilterArgs {}

export default async (_parent, args: DeltaFilterArgs, context: Context) => {
  const user = await requireUser(context);
  const result = await Delta.find({
    creator: { $eq: user.sub }
  });

  return result;
};
