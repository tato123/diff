import React from 'react';
import AccountLayout from '../../components/Layouts/Account';
import { Elements } from 'react-stripe-elements';
import InjectedCheckoutForm from './CheckoutForm';
import styled from 'styled-components';
import { Route, Switch, Redirect } from 'react-router';
import { Link } from 'react-router-dom'


const MainContent = styled.div`
    display: flex;
    flex: 1 auto;
    margin-top: 16px;
    

    .sidebar {
        flex: 1;
    }

    .content {
        flex: 5;
    }
`

const Billing = () => (
    <Elements>
        <InjectedCheckoutForm />
    </Elements>
)

const Prototypes = () => (
    <div>nothing to see yet</div>
)

const Account = () => (<AccountLayout>

    <MainContent>
        <div className="sidebar">
            <ul>
                <li>
                    <Link to="/account/prototypes">Prototypes</Link></li>
                <li><Link to="/account/billing">Billing</Link></li>
            </ul>
        </div>
        <div className="content">
            <Switch>
                <Route path="/account/billing" component={Billing} />
                <Route path="/account/prototypes" component={Prototypes} />
                <Redirect to="/account/prototypes" />
            </Switch>

        </div>
    </MainContent>

</AccountLayout>
)



export default Account;