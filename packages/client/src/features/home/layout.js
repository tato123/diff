import React from 'react';
import Page from './styles/Page';
import Header from '../../components/Header';
import { Link, Router } from 'react-router-dom';
import history from '../../history';

export default ({ children }) => (
    <Page>
        <Router history={history}>
            <Header
                account={() => (
                    <Link to="/account">Dashboard</Link>

                )}
            />
            {children}
        </Router>
    </Page>
)

