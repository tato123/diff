import aws from "../../aws";
import { Context } from "../../context/type";
import _ from "lodash";
import { requireUser } from "../utils";

const { Delta } = aws.models;
// pubsub
import pubsub from "../../redis/pubsub";
import { DELTA } from "../Subscription/channels";

enum DeltaType {
  file,
  base64
}

interface ProjectMutationInput {
  input: {
    projectId: String;
    value: String;
    type: DeltaType;
    as: String;
  };
}

export default async (
  _parent,
  args: ProjectMutationInput,
  context: Context
) => {
  // require our user
  const user = await requireUser(context);

  switch (args.input.type) {
    case DeltaType.file:
      // if a url is provided then move the content
      // to s3 with a checksum
      break;

    case DeltaType.base64:
    default:
      // if data field is provided then
      // write this record to s3 and return a url
      break;
  }

  const checksum = "";

  const delta = new Delta({
    checksum,
    projectId: args.input.projectId
  });

  await delta.save();

  pubsub.publish(`${DELTA.ADDED}_${user.sub}`, {
    onAddDelta: delta
  });

  return delta;
};
