// Project queries
import project from "./project.resolver";
import projects from "./projects.resolver";

// Delta Queries
import deltas from "./deltas.resolver";
import delta from "./delta.resolver";

// user queries
import user from "./user.resolver";

export default {
  project,
  projects,
  deltas,
  delta,
  user
};
