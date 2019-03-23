// CheckoutForm.js
import React, { useContext } from 'react';
import Button from '@atlaskit/button';
import {
    injectStripe,
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,

} from 'react-stripe-elements';

import { useMutation } from 'react-apollo-hooks';
import AuthContext from '../../utils/context'
import gql from 'graphql-tag';

const CREATE_CUSTOMER_SOURCE = gql`
  mutation createCustomerSource($input: CreateCustomerInput!) {
    subscribeCustomerToPlan(input: $input) {
        plan
        status
    }
  }
`;



const handleBlur = () => {
    console.log('[blur]');
};
const handleChange = (change) => {
    console.log('[change]', change);
};

const handleFocus = () => {
    console.log('[focus]');
};
const handleReady = () => {
    console.log('[ready]');
};

const createOptions = (fontSize, padding) => {
    return {
        style: {
            base: {
                fontSize,
                color: '#424770',
                letterSpacing: '0.025em',
                fontFamily: 'Source Code Pro, monospace',
                '::placeholder': {
                    color: '#aab7c4',
                },
                ...(padding ? { padding } : {}),
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };
};


const CheckoutForm = ({ stripe, fontSize, onStartCheckout, onEndCheckout, onChange }) => {
    const subscribeToPlan = useMutation(CREATE_CUSTOMER_SOURCE);
    const auth = useContext(AuthContext);
    const profile = auth.getProfile();


    const handleSubmit = async ev => {
        // We don't want to let default form submission happen here, which would refresh the page.
        ev.preventDefault();


        try {
            onStartCheckout();

            const { source } = await stripe.createSource({
                type: 'card',
                owner: {
                    name: profile.name,
                    email: profile.email
                }
            })
            console.log('source id is', source.id)

            const { data } = await subscribeToPlan({
                variables: { input: { source: source.id } },
            });


            onChange(data.subscribeCustomerToPlan)

            onEndCheckout();
        } catch (err) {
            console.error('Unable to create customer subscription', err)
            onEndCheckout();
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Card number
          <CardNumberElement
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onReady={handleReady}
                    {...createOptions(fontSize)}
                />
            </label>
            <label>
                Expiration date
          <CardExpiryElement
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onReady={handleReady}
                    {...createOptions(fontSize)}
                />
            </label>
            <label>
                CVC
          <CardCVCElement
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onReady={handleReady}
                    {...createOptions(fontSize)}
                />
            </label>
            <Button type="submit">Pay</Button>
        </form>
    )
}

export default injectStripe(CheckoutForm);