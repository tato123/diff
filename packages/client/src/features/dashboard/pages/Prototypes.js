import React, { useState } from 'react';
import Prototypes from '../components/prototypes';
import {
    PageHeader, Button, Input
} from 'antd';



const { Search } = Input;

const Page = ({ history }) => {
    const [searchVal, setSearchVal] = useState('');

    return (
        <React.Fragment>
            <PageHeader style={{ paddingLeft: 64, paddingRight: 64, background: 'transparent' }}
                title={<Input
                    placeholder="Prototype Name"
                    size="large"
                    onChange={e => {
                        const value = e.target.value;
                        console.log(value)
                        setSearchVal(value)
                    }}
                    style={{ width: '100%' }}
                />}
                extra={[
                    <Button onClick={() => history.push('/prototype/new')} type="primary" size="large" style={{ right: 44 }}>Create New Prototype</Button>
                ]}
            >

            </PageHeader>
            <div style={{ padding: 64 }}>
                <Prototypes filter={searchVal} />
            </div>
        </React.Fragment>
    )
}


export default Page;