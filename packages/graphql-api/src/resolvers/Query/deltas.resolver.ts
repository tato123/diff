import aws from "../../aws";
import { Context } from "../../context/type";
import { requireUser } from "../utils";

const { Delta } = aws.models;

interface DeltaFilterArgs {}

export default async (_parent, args: DeltaFilterArgs, context: Context) => {
  const user = await requireUser(context);
  const result = await Delta.scan().all();
  return result;
};
