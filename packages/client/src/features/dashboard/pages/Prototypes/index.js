import React, { useState } from 'react';
import Prototypes from './PrototypeList';
import {
    PageHeader, Button, Input
} from 'antd';
import Create from './CreateForm';




const Page = ({ history }) => {
    const [searchVal, setSearchVal] = useState('');
    const [createVisible, setSearchVisible] = useState(false)




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
                    <Button onClick={() => setSearchVisible(true)} type="primary" size="large" style={{ right: 44 }}>Create New Prototype</Button>
                ]}
            >

            </PageHeader>
            <div style={{ padding: 64 }}>
                <Prototypes filter={searchVal} />
            </div>

            <Create visible={createVisible} onClose={() => setSearchVisible(false)} />
        </React.Fragment>
    )
}


export default Page;