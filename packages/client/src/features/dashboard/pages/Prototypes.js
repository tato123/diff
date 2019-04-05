import React from 'react';
import Prototypes from '../components/prototypes';
import styled from 'styled-components';
import {
    Layout, Avatar, PageHeader, Menu, Button
} from 'antd';
import { Route } from 'react-router';


const Page = ({ history }) => (
    <React.Fragment>
        <PageHeader style={{ paddingLeft: 64, paddingRight: 64 }}
            extra={[
                <Button onClick={() => history.push('/dashboard/prototypes/new')} type="primary" size="large" style={{ top: -10, right: 44 }}>+ New Prototype</Button>
            ]}
        />
        <div style={{ padding: 64 }}>
            <Prototypes />
        </div>
    </React.Fragment>
)
export default Page;