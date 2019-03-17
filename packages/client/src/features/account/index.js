import React from 'react';
import AccountLayout from '../../components/Layouts/Account';
import { Elements } from 'react-stripe-elements';
import InjectedCheckoutForm from './CheckoutForm';


const Account = () => (<AccountLayout>
    <Elements>
        <InjectedCheckoutForm />
    </Elements>
</AccountLayout>
)



export default Account;