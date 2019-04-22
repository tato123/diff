import stripe from "./stripe";
import auth from "./auth";

export default app => {
  app.use(stripe);
  app.use(auth);
};
