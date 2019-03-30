import React from 'react';
import AccountLayout from '../../components/Layouts/Account';
import styled from 'styled-components';
import { Route, Switch, Redirect } from 'react-router';
import { NavLink } from 'react-router-dom'
import Billing from './Billing'
import Prototypes from './Prototypes'




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

const List = styled.ul`
    list-style:none;
    margin:0;
    padding-left: 16px;
    margin-right: 16px;

    li {
        margin-top: 8px;
        min-width: 200px;
    }

    li:first-child {
        margin-top: 0px;
    }
`;

const ListLink = styled(NavLink)`
    padding: 10px;
    border-radius:8px;
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
  
    text-decoration: none;
    font-size: 18px;
    color: #a6a6a6;


    &:hover {
        background-color: #efefef;
        text-decoration: none;
    }


     

    &.active {
        color: #4648b0;
        font-weight: bold;
    }

    &:focus, &:visited {
        outline: none;
    }
`



const Account = () => (<AccountLayout>

    <MainContent>
        <div className="sidebar">
            <List>
                <li>
                    <ListLink to="/account/prototypes" activeClassName="active">Prototypes</ListLink></li>
                <li><ListLink to="/account/billing" activeClassName="active">Billing</ListLink></li>
            </List>
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