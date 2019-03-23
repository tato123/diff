import React, { useState } from 'react';
import { Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import _ from 'lodash';

import { useQuery, useSubscription } from 'react-apollo-hooks';
import gql from 'graphql-tag';

const GET_PLAN = gql`
{
    customerSubscription(limit:{mine:true}) {
        plan
        status
    }
}`

const PLAN_CHANGE = gql`
    subscription {
        customerSubscriptionChange {
            plan
            status
        }
    }
`

const Billing = () => {
    const [statePlan, setPlan] = useState(null);
    const [stateStatus, setStatus] = useState(null);
    const [isCheckout, setIsCheckout] = useState(false);
    const { data, error, loading } = useQuery(GET_PLAN);

    if (loading) {
        return <div>Loading...</div>;
    };
    if (error) {
        return <div>Error! {error.message}</div>;
    };

    const plan = statePlan || _.get(data, 'customerSubscription.plan');
    const status = stateStatus || _.get(data, 'customerSubscription.status')


    return (<div>
        <h1>My Billing Information</h1>
        <div>
            <label>Plan: {plan}</label>
            <div>{status}</div>
        </div>
        {isCheckout && <label>checking you out</label>}
        {plan === 'full' && status === 'active' && (
            <label>Paying Customer, thanks!</label>
        )}
        {plan === 'trial' && (
            <Elements>
                <CheckoutForm
                    onStartCheckout={() => setIsCheckout(true)}
                    onEndCheckout={() => setIsCheckout(false)}
                    onChange={({ plan, status }) => {
                        setPlan(plan);
                        setStatus(status);
                    }}
                />
            </Elements>
        )}

    </div>)
}

export default Billing;