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

    .description {
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
    margin-top: 16px;
`

const StyledBox = styled.div`
border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
    margin-top: 16px;
`

const InnerDiv = styled(StyledBox)`
    display: grid;
    grid-template-areas: ". .";
    grid-column-gap: 16px;
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
        <div style={{
            margin: '32px 0'
        }}>
            <h2>Your current plan</h2>
            {status === CANCEL_TYPE && (
                <Warning>Your plan is cancelled and will expire after the current billing period</Warning>
            )}
            <InnerDiv>

                <div>

                    <CField>
                        <label className="description">Plan:</label>
                        <label className="value">{plan === 'full' ? 'Monthly Subscription' : 'Trial'}</label>
                    </CField>

                    <CField style={{ marginTop: '16px' }}>
                        <label className="description">Payment Method:</label>
                        <label className="value">{plan === 'full' ? 'Credit Card' : 'None'}</label>
                    </CField>
                    {plan === 'full' && status !== CANCEL_TYPE && (
                        <CField style={{ marginTop: '16px' }}>
                            <a href="#" onClick={() => setOpen(true)}>Cancel Subscription</a>
                        </CField>
                    )}


                </div>
                <div>
                    {plan === 'trial' && (
                        <label>Sign up for a Diff subscription to get the following features</label>
                    )}
                    {plan === 'full' && (
                        <label>Thanks for Signing up for Diff, you get the following benefits</label>
                    )}
                    <ul>
                        <li>Prototypes can be viewed and shared after 48 hours</li>
                    </ul>
                    <div style={{ marginTop: "16px", marginLeft: "48px" }}>

                        <label style={{ fontSize: "2rem" }}>$5 / month</label>
                    </div>

                </div>

            </InnerDiv>
        </div>
        <div>
            <h2>Upgrade your plan</h2>
            <StyledBox>
                {plan === 'full' && <label>You're signed up for Diff!</label>}
                {isCheckout && <label>checking you out</label>}
                {plan === 'trial' && (
                    <Elements>
                        <CheckoutForm
                            fontSize={'18px'}
                            onStartCheckout={() => setIsCheckout(true)}
                            onEndCheckout={() => setIsCheckout(false)}
                            onChange={({ plan, status }) => {
                                setPlan(plan);
                            }}
                        />
                    </Elements>
                )}
            </StyledBox>
        </div>


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