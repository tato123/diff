import Project from "../../aws/models/Project";
import { Context } from "../../context/type";
import _ from "lodash";
import { requireUser } from "../utils";
import normalizeUrl = require("normalize-url");
import sslChecker = require("ssl-checker");

// pubsub
import pubsub from "../../redis/pubsub";
import { PROJECT } from "../Subscription/channels";

interface ProjectMutationInput {
  input: {
    url: string;
    name: string;
    description: string;
  };
}

const checkProtocol = async (origin: string): Promise<string> => {
  try {
    console.log("checking site", origin);
    const result = await sslChecker(origin);
    if (result.valid) {
      return "https";
    }
    return "http";
  } catch (error) {
    console.error("error");
    return "http";
  }
};

export default async (
  _parent,
  args: ProjectMutationInput,
  context: Context
) => {
  const user = await requireUser(context);

  // convert this to a url
  const { host: inputHost } = new URL(
    normalizeUrl(args.input.url, { stripWWW: false })
  );

  // get our hostname
  const projectUrl =
    inputHost.split(".").length === 2 ? `www.${inputHost}` : inputHost;

  const protocol = await checkProtocol(projectUrl);

  const project = new Project({
    // input data
    creator: user.sub,
    hostname: projectUrl,
    protocol,
    name: _.get(args.input, "name", ""),
    description: _.get(args.input, "description", "")
  });

  await project.save();

  pubsub.publish(`${PROJECT.ADDED}_${user.sub}`, {
    onAddProject: project
  });

  return project;
};
