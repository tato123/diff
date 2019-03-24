import React, { useState } from 'react';
import { Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import _ from 'lodash';

import styled from 'styled-components';

import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

const GET_PLAN = gql`
{
    customerSubscription(limit:{mine:true}) {
        plan
        status
    }
}`

const Field = styled.div`
    display: block;
    margin-top: 16px;

    .description {
        font-size: 1rem;
        display: block;
    }

    .value {
        font-size: 1.2rem;
        font-weight: bold;
        display: block;
    }
`

const Wrapper = ({ children }) => (
    <div>
        <h1>My Billing Information</h1>
        {children}

    </div>
)

/* eslint-disable jsx-a11y/anchor-is-valid*/
const Billing = () => {
    const [statePlan, setPlan] = useState(null);
    const [stateStatus, setStatus] = useState(null);
    const [isCheckout, setIsCheckout] = useState(false);
    const { data, error, loading } = useQuery(GET_PLAN);

    if (loading) {
        return <Wrapper>Loading...</Wrapper>;
    };
    if (error) {
        return <Wrapper>Error! {error.message}</Wrapper>;
    };

    const plan = statePlan || _.get(data, 'customerSubscription.plan');
    const status = stateStatus || _.get(data, 'customerSubscription.status')


    return (<Wrapper>
        <div>
            <Field>
                <label className="description">Plan:</label>
                <label className="value">{plan === 'full' ? 'Monthly Subscription' : 'Trial'}</label>
            </Field>

            <Field>
                <label className="description">Payment Method:</label>
                <label className="value">{plan === 'full' ? 'Credit Card' : 'None'}</label>
            </Field>
            <Field>
                <a href="#">Cancel Subscription</a>
            </Field>

        </div>
        {isCheckout && <label>checking you out</label>}
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

    </Wrapper>)
}

export default Billing;