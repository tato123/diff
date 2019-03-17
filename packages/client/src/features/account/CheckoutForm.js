// CheckoutForm.js
import React from 'react';
import Button from '@atlaskit/button';
import {
    injectStripe, CardElement,
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    PaymentRequestButtonElement,
    IbanElement,
    IdealBankElement,
    StripeProvider,
    Elements,
} from 'react-stripe-elements';

import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';

const CREATE_CUSTOMER_SOURCE = gql`
  mutation createCustomerSource($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
        created
    }
  }
`;

const handleBlur = () => {
    console.log('[blur]');
};
const handleChange = (change) => {
    console.log('[change]', change);
};
const handleClick = () => {
    console.log('[click]');
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


const CheckoutForm = (props) => {
    const createCustomer = useMutation(CREATE_CUSTOMER_SOURCE);

    const handleSubmit = ev => {
        // We don't want to let default form submission happen here, which would refresh the page.
        ev.preventDefault();


        props.stripe.createSource({
            type: 'card', owner: {
                name: 'Jonathan Fontanez'
            }
        }).then(({ source }) => {
            // console.log(source)

            return createCustomer({
                variables: { input: { source: source.id } },
            });
        })
            .then(val => {
                console.log('query returned', val)
            })
            .catch(err => {
                console.log(err)
            })
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
                    {...createOptions(props.fontSize)}
                />
            </label>
            <label>
                Expiration date
          <CardExpiryElement
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onReady={handleReady}
                    {...createOptions(props.fontSize)}
                />
            </label>
            <label>
                CVC
          <CardCVCElement
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onReady={handleReady}
                    {...createOptions(props.fontSize)}
                />
            </label>
            <Button type="submit">Pay</Button>
        </form>
    )
}

export default injectStripe(CheckoutForm);