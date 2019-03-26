import React, { useState } from 'react';
import { Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import Form from '@atlaskit/form';
import Button from '@atlaskit/button';

import _ from 'lodash';
import ModalDialog, { ModalTransition, ModalFooter } from '@atlaskit/modal-dialog';


import styled from 'styled-components';

import { useQuery, useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';

const GET_PLAN = gql`
{
    customerSubscription(limit:{mine:true}) {
        plan
        status
    }
}`

const CANCEL_CUSTOMER_PLAN = gql`
  mutation  {
    cancelSubscription {
        plan
        status
    }
  }
`;

const CField = styled.div`
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

const Warning = styled.div`
    background-color: #e34fb6;
    padding: 10px;
    border-radius: 8px;
    color: #fff;
    
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
    const [isOpen, setOpen] = useState(false)
    const { data, error, loading } = useQuery(GET_PLAN);
    const cancelPlan = useMutation(CANCEL_CUSTOMER_PLAN);


    const onClose = () => {
        setOpen(false)
    }

    const onFormSubmit = async () => {
        const { data } = await cancelPlan();
        setStatus(data.cancelSubscription.status);
        setOpen(false)
    }

    if (loading) {
        return <Wrapper>Loading...</Wrapper>;
    };
    if (error) {
        return <Wrapper>Error! {error.message}</Wrapper>;
    };

    const plan = statePlan || _.get(data, 'customerSubscription.plan');
    const status = stateStatus || _.get(data, 'customerSubscription.status');
    const CANCEL_TYPE = 'cancel_at_period_end';

    const footer = props => (
        <ModalFooter showKeyline={props.showKeyline}>
            <span />
            <Button appearance="subtle" onClick={() => setOpen(false)}>Cancel</Button>

            <Button appearance="danger" type="submit">
                Cancel Subscription
          </Button>
        </ModalFooter>
    );

    return (<Wrapper>
        <div>
            {status === CANCEL_TYPE && (
                <Warning>Your plan is cancelled and will expire after the current billing period</Warning>
            )}
            <CField>
                <label className="description">Plan:</label>
                <label className="value">{plan === 'full' ? 'Monthly Subscription' : 'Trial'}</label>
            </CField>

            <CField>
                <label className="description">Payment Method:</label>
                <label className="value">{plan === 'full' ? 'Credit Card' : 'None'}</label>
            </CField>
            {plan === 'full' && status !== CANCEL_TYPE && (
                <CField>
                    <a href="#" onClick={() => setOpen(true)}>Cancel Subscription</a>
                </CField>
            )}


        </div>
        {isCheckout && <label>checking you out</label>}
        {plan === 'trial' && (
            <Elements>
                <CheckoutForm
                    onStartCheckout={() => setIsCheckout(true)}
                    onEndCheckout={() => setIsCheckout(false)}
                    onChange={({ plan, status }) => {
                        setPlan(plan);
                    }}
                />
            </Elements>
        )}

        <ModalTransition>
            {isOpen &&
                <ModalDialog height={300} heading="Cancel your subscription" onClose={onClose} components={{
                    Container: ({ children, className }) => (
                        <Form onSubmit={onFormSubmit}>
                            {({ formProps }) => (
                                <form {...formProps} className={className}>
                                    {children}
                                </form>
                            )}
                        </Form>
                    ),
                    Footer: footer
                }}>
                    <p style={{ fontSize: '1rem' }}>
                        Please confirm that you would like to confirm your subscription of Diff. Cancelling your subscription
                        will stop billing for Diff at the end of your current billing period
                    </p>
                </ModalDialog>}
        </ModalTransition>

    </Wrapper>)
}

export default Billing;