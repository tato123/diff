import React, { useState } from 'react';
import { Steps, Typography, Row, Col } from 'antd';
import Form from './NewPrototypeForm';

const { Paragraph, Text } = Typography;

const Step = Steps.Step;

const steps = [
    {
        content: () => (
            <Row>
                <Col span={12}>
                    <Paragraph>
                        Diff is a rapid prototyping tool that you install on your website or application as a snippet. It's just as easy as using Google analytics, Segment, or any other analytics tool. To get started add the following snippet on your website.
                </Paragraph>
                    <Text code style={{ fontSize: "1rem" }}>
                        {`<script>dosomething()</script>`}
                    </Text>
                </Col>
            </Row>
        )
    },
    {
        content: () => (
            <Row>
                <Col>
                    <Form />
                </Col>
            </Row>
        )
    },
    {
        content: () => (
            <div>
                Page 3
            </div>
        )
    }
]


const Page = () => {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent(c => c + 1);
    const prev = () => setCurrent(c => c - 1);

    return (
        <React.Fragment>
            <div style={{ padding: 64 }}>
                <Row>
                    <Col span={6}>
                        <Steps current={current} direction="vertical" size="small">
                            <Step title="Install Snippet" description="Get started with a quick install." />
                            <Step title="In Progress" description="This is a description." />
                            <Step title="Waiting" description="This is a description." />
                        </Steps>
                    </Col>
                    <Col span={18}>
                        {steps[current].content()}
                    </Col>
                </Row>

            </div>
        </React.Fragment >
    )
}

export default Page;