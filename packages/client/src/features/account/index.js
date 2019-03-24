import React from 'react';
import AccountLayout from '../../components/Layouts/Account';
import styled from 'styled-components';
import { Route, Switch, Redirect } from 'react-router';
import { Link, NavLink } from 'react-router-dom'
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Billing from './Billing'
import { lighten } from 'polished';


const purple = '#4648b0';
const purple1 = lighten(0.2, purple);
const blue = '#00c9d8';
const blue1 = lighten(0.55, blue);


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

const List = styled.ul`
    list-style:none;
    margin:0;
    padding-left: 16px;
    margin-right: 16px;

    li {
        padding: 10px;
        border-radius:8px;
        min-width: 200px;
        margin-top: 8px;

        &:hover {
            background-color: #efefef;
            
        }

        a {
            text-decoration: none;
            font-size: 18px;
            color: #a6a6a6;
        }

        a.active {
            color: #4648b0;
            font-weight: bold;
        }

        a:focus, a:visited {
            outline: none;
        }
    }

    li:first-child {
        margin-top: 0px;
    }
`

const ProtoTypeList = styled.div`
    display: flex;
    flex: 1 auto;
    flex-wrap: wrap;
`

const Prototype = styled.div`
    display: grid;
    width: 200px;
    height: 250px;
    border-radius: 16px;
    border: 1px solid #ccc;
    margin-left: 16px;
    margin-top: 8px;
    padding: 10px;
    box-sizing: border-box;
    grid-template-areas: "." "." ".";
    grid-template-rows: 3fr 1fr 1fr;
    grid-row-gap: 8px;
`



const EditLink = styled(Link)`
    width: 100%;
    background: ${purple1};
    color: #fff;
    text-decoration: none;
    padding: 16px;
    display: block;
    box-sizing: border-box;
    border-radius: 4px;
    text-align:center;
    font-weight: 500;
    font-size: 1.2rem;
    transition: all 250ms;

    &:hover {
        text-decoration: none;
        background: ${purple};
        color: #fff;
    }
`;

const ViewLink = styled.a`
    width: 100%;
    background: ${blue1};
    padding: 16px;
    display: block;
    box-sizing: border-box;
    border-radius: 4px;
    text-align:center;
    font-weight: 500;
    font-size: 1.2rem;
    transition: all 250ms;

    &:hover {
        text-decoration: none;
        background: ${blue};
    }
`;

const Prototypes = () => {
    const { data, error, loading } = useQuery(GET_ORIGINS);
    if (loading) {
        return <div>Loading...</div>;
    };
    if (error) {
        return <div>Error! {error.message}</div>;
    };

    return (
        <div>
            <h1>My Prototypes</h1>
            <ProtoTypeList>
                {data.origins.map(origin => (
                    <Prototype key={origin.host}>
                        <label>{origin.origin}</label>
                        <EditLink to={"/edit?version=" + origin.host}>

                            Edit
                        </EditLink>
                        <ViewLink href={`https://${origin.host}`}>

                            View
                       </ViewLink></Prototype>
                ))}
            </ProtoTypeList>
        </div>

    );
}


const Account = () => (<AccountLayout>

    <MainContent>
        <div className="sidebar">
            <List>
                <li>
                    <NavLink to="/account/prototypes" activeClassName="active">Prototypes</NavLink></li>
                <li><NavLink to="/account/billing" activeClassName="active">Billing</NavLink></li>
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