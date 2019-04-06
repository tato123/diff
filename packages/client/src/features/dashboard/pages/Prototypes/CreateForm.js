import React, { useState } from 'react';
import {
    Button, Input, Typography, Row, Col
} from 'antd';
import styled from 'styled-components';
import { useFormState } from 'react-use-form-state';

import { config, animated, useTransition } from 'react-spring'
import _ from 'lodash';

import { CREATE_SITE } from "../../../../graphql/mutations";
import { useMutation } from 'react-apollo-hooks';


const { Title, Text } = Typography;


const Backdrop = styled(animated.div)`
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index:100001;
    background: #f0f2f5;
    top: 0px;
    left: 0px;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 64px;
    flex-direction: column;

    > div {
        width: 100%;
    }

    .close {
       float:right;
    }

    .title {
        height: 64px;
    }

    .closeGroup {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex: 1 auto;
        height: 64px;

    }

    .code {
        font-size: 16px;
        display: block;
        width: 100%;

        code {
            padding: 16px;

            display: inline-block;
            width: calc(100% - 30px);
        }
    }
`

const Field = styled.div`
    margin-top: 64px;

    label {
        font-size: 22px;
        margin-bottom: 16px;
        display: block;
    }

    input[type="text"] {
        width: 100%;
        padding: 22px;
    }
`


const Create = ({ visible, onClose }) => {
    const createSite = useMutation(CREATE_SITE)


    const [formState, { text }] = useFormState();
    const [loading, setLoading] = useState(false);

    const transitions = useTransition(visible, null, {
        config: { ...config.default, velocity: 20 },
        from: { position: 'absolute', opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })
    const onCreate = (form) => {
        const website = form.values.website;
        const siteResponse = createSite({ variables: { input: { url: website } } });
        setLoading(true);
        siteResponse
            .then(response => {
                setLoading(false);
                // history.push({
                //     pathname: "/prototype",
                //     search: "?version=" + response.data.createSiteOrigin.prototypeUrl
                // });
                onClose();
                console.log(response)
            }).catch(err => {
                setLoading(false);
                console.error(err)
            });
        return false;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!_.isEmpty(formState.values.website)) {
            onCreate(formState);

        }

        return false;
    }



    return transitions.map(({ item, key, props }) =>
        item && <Backdrop style={props} >
            <form onSubmit={handleSubmit}>
                <div>


                    <Row>
                        <Col span={18} className="title">
                            <Title>Setup your new Prototype</Title>

                        </Col>
                        <Col span={6} className="title closeGroup">
                            <Button type="secondary" shape="circle" icon="close" size={"large"} onClick={onClose} className="close" />

                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Field>
                                <label>Enter your website url</label>
                                <Input {...text('website', {
                                    validate: (value) => !_.isEmpty(value),

                                })} />
                            </Field>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Field>
                                <label>Add the following Snippet to your website (only needed when adding a new website)</label>
                                <Text copyable code className="code">{`<script src="http://localhost:10001/diff.js?API_KEY=123" />`}</Text>
                            </Field>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 64 }}>
                        <Col>
                            <Button type="primary" size="large" style={{ width: "100%" }} loading={loading} disabled={_.isEmpty(formState.values.website)}>Create Prototype</Button>
                        </Col>
                    </Row>
                </div>
            </form>
        </Backdrop>
    )


}



export default Create;