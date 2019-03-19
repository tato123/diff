import React from 'react';
import AccountLayout from '../../components/Layouts/Account';
import { Elements } from 'react-stripe-elements';
import InjectedCheckoutForm from './CheckoutForm';
import styled from 'styled-components';
import { Route, Switch, Redirect } from 'react-router';
import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';


const GET_ORIGINS = gql`
  {
    origins(limit:{mine:true}) {
      host
      origin
    }
  }
`;


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

const Prototypes = () => {
    const { data, error, loading } = useQuery(GET_ORIGINS);
    if (loading) {
        return <div>Loading...</div>;
    };
    if (error) {
        return <div>Error! {error.message}</div>;
    };

    return (
        <ul>
            {data.origins.map(origin => (
                <li key={origin.origin}>
                    <Link to={"/edit?version=" + origin.host}>
                        {origin.host}
                    </Link></li>
            ))}
        </ul>
    );
}


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