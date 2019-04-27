// projects
import createProject from "./createProject.resolver";

// changes as deltas
import createDelta from "./createDelta.resolver";

// customer subscriptions
import subscribeCustomerToPlan from "./subscribeCustomerToPlan.resolver";
import cancelSubscription from "./cancelSubscription.resolver";

export default {
  createProject,
  createDelta,
  subscribeCustomerToPlan,
  cancelSubscription
};
