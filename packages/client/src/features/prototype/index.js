import React from 'react';
import { Layout, Radio, Typography } from 'antd';
import { useQuery } from 'react-apollo-hooks';
import { ORIGIN_BY_ID } from '../../graphql/query';
import styled from 'styled-components';

const { Content, Header } = Layout;

const {Title } = Typography;


const Iframe = styled.iframe`
    height: 100%;
    width: 100%;
    outline: none;
    border: none;

`

const Pagelayout = styled(Layout)`
    .header {
        border-bottom: 1px solid #ebedf0;
        background: #fff;
        height: 42px;
        line-height: 42px;
    }

    .documentName {
        display: inline-block;
    }

    .right {
        float: right;
        display: inline-block;
    }
`

const Editor = styled.div`
    display: grid;
    grid-template-areas: ". .";
    grid-template-rows: 1fr;
    grid-template-columns:  1fr;
    height: 100%;
    width: 100%;
`;


const Designer = () => {
    const { data, error, loading } = useQuery(ORIGIN_BY_ID, { variables: { host: "8abd7bac" } });
    return (
        <Pagelayout style={{ height: "100vh", overflow: 'hidden' }}>
            {loading && <div>Loading page</div>}
            {!loading && (
                <React.Fragment>
                    <Header className="header" >
                        <div className="documentName"><Title level={4}>{data.origin.name}</Title></div>
                        <div className="right">
                            <Radio.Group defaultValue="a" buttonStyle="solid">
                                <Radio.Button value="a">Edit</Radio.Button>
                                <Radio.Button value="b">Preview</Radio.Button>
                            </Radio.Group>
                        </div>
                    </Header>
                    <Content style={{ position: "relative" }}>
                        <Editor>
                            <div>
                                <Iframe src={data.origin.protocol + "://" + data.origin.origin} />
                            </div>
                        </Editor>
                    </Content>
                </React.Fragment>
            )}

        </Pagelayout>
    )

}

export default Designer;