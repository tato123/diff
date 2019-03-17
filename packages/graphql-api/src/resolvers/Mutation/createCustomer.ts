import _ from 'lodash';

const stripe = require("stripe")(process.env.STRIPE_KEY);
const ManagementClient = require('auth0').ManagementClient;

const management = new ManagementClient({
    domain: process.env.AUTH0_MANAGEMENT_DOMAIN,
    clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
    clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
    scope: 'read:users update:users'
});

interface CustomerInput {
    input: {
        source: string;
    }

}

const addStripeCustomerData = async (customer, user) => {
    const params = { id: user.sub };
    const metadata = {
        plan: 'paid',
        stripe: customer
    };

    return management.updateAppMetadata(params, metadata)
}


const createCustomer = async (_parent, args: CustomerInput, context) => {
    const user = await context.getUser();
    console.log('user is ', user)
    console.log('args are', args)
    console.log('has', _)

    // cant do anything
    if (!_.has(args, 'input.source') || !_.isString(args.input.source)) {
        return null;
    }

    try {
        // get the customer from stripe
        const customer = await stripe.customers.create({
            email: user.email,
            source: args.input.source,
        });


        // store the information against their 
        console.log('customer created', customer);
        await addStripeCustomerData(customer, user)

        console.log('succesfully updated')
        return { created: customer.created };
    } catch (err) {
        console.error(err);
        return { created: null }
    }


}


export default createCustomer;