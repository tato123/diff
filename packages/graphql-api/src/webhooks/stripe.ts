import aws from "../aws";
const express = require("express");
const router = express.Router();

const { User } = aws.models;

/**
 * We need to rely on our testing suite to handle these
 */

const handleCustomerSubscriptionCancelled = async event => {
  /* Do something with event_json */
  console.log("Handling cancellation for", event.data.object.customer);
  const customerId = event.data.object.customer;

  const user = await User.queryOne({ customerIdIndex: customerId }).exec();
  console.log("user", user);

  await User.update(
    { id: user.id },
    { $PUT: { subscriptionPlan: "trial", subscriptionStatus: "cancelled" } }
  );
};

// we can
router.post("/webhook/stripe", async (request, response) => {
  // Retrieve the request's body and parse it as JSON
  const event_json = request.body;

  try {
    switch (event_json.type) {
      case "customer.subscription.deleted":
        await handleCustomerSubscriptionCancelled(event_json);
    }
  } catch (err) {
    console.error(err);
  }

  // Return a response to acknowledge receipt of the event
  response.send(200);
});

export default router;
