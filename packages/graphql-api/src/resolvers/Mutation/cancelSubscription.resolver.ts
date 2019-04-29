const stripe = require("stripe")(process.env.STRIPE_KEY);
import aws from "../../aws";
import _ from "lodash";

const { User } = aws.models;

const cancelSubscription = async (_parent, args, context) => {
  console.log("[resolver][mutation] - cancelSubscription");
  const user = context.user;
  const sub = _.get(user, "sub");
  if (!sub) {
    return null;
  }

  try {
    const CANCEL_TYPE = "cancel_at_period_end";
    const dbUser = await User.get({ id: sub });

    // when we have no value return immediately
    if (!dbUser) {
      return null;
    }

    stripe.subscriptions.update(dbUser.subscription_plan, {
      cancel_at_period_end: true
    });

    // update with the cancellation value
    await User.update(
      { id: user.sub },
      { $PUT: { subscription_plan: CANCEL_TYPE } }
    );

    return {
      plan: dbUser.subscription_plan,
      status: CANCEL_TYPE
    };
  } catch (err) {
    console.error("An error occured", err.message);
    return null;
  }
};

export default cancelSubscription;
