import Delta from "../../aws/models/Delta";
import _ from "lodash";

interface IProjectParent {
  id: string;
}

/**
 * Resolves a nested query from project, when someone request a
 * set of changes for this project
 *
 * @param parent
 * @param args
 * @param ctx
 * @param info
 */
const changes = async (parent, _args, _ctx, _info) => {
  if (_.isNil(parent.id)) {
    return null;
  }

  const result = await Delta.find({
    projectId: { $eq: parent.id }
  });

  return result;
};

/**
 * Aggregate all the users for the changes
 *
 * @param parent
 * @param _args
 * @param _ctx
 * @param _info
 */
const contributors = async (parent, _args, _ctx, _info) => {
  if (_.isNil(parent.id)) {
    return null;
  }

  // get the array of deltas

  // map them to users

  // return result
  return null;
};

export default {
  Project: {
    changes
  }
};
