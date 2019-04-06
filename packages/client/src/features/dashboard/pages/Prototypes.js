import React from 'react';
import Prototypes from '../components/prototypes';
import styled from 'styled-components';
import {
    Layout, Avatar, PageHeader, Menu, Button, Input
} from 'antd';
import { Route } from 'react-router';


const { Search } = Input;

const Page = ({ history }) => (
    <React.Fragment>
        <PageHeader style={{ paddingLeft: 64, paddingRight: 64, background: 'transparent' }}
            title={<Search
                placeholder="Prototype Name"
                onSearch={value => console.log(value)}
                style={{ width: '100%' }}
            />}
            extra={[
                <Button onClick={() => history.push('/dashboard/prototypes/new')} type="primary" size="large" style={{ top: -10, right: 44 }}>+ New Prototype</Button>
            ]}
        >

        </PageHeader>
        <div style={{ padding: 64 }}>
            <Prototypes />
        </div>
    </React.Fragment>
)
export default Page;