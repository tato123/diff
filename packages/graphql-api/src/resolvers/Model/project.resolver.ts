import aws from "../../aws";
import _ from "lodash";

const { Delta } = aws.models;

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

  const result = await Delta.get({
    id: parent.id
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
  const result = await Delta.get({
    id: parent.id
  });

  // map them to users
  const ids = _.chain(result)
    .map(delta => delta.creator)
    .uniq()
    .values();

  // lookup these ids in the appropriate place

  // return result
  return null;
};

export default {
  Project: {
    changes
  }
};
