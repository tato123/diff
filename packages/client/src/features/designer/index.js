import React, { useState, useRef } from 'react';
import { Layout, Input } from 'antd';
import styled from 'styled-components';

import 'antd/dist/antd.css';


const Search = Input.Search;

const {
    Header, Content,
} = Layout;


const Iframe = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    overflow: auto;
`


const Active = styled.div`
width: 16px;
border-radius: 50%;
height: 16px;
display: inline-block;
position: absolute;
top: 24px;
left: 16px;
    background-color: ${props => !props.active ? 'red' : 'green'}
`

const Tool = styled.div`
    position: absolute;
    top: 20px;
    right: 100px;
    height: 300px;
    width: 200px;
    border-radius: 24px;
    background-color: #fff;
    border: 5px solid blue;
    padding: 16px;

`

const CSSTool = ({ iframeEl }) => {
    const changeColors = () => {
        iframeEl.current.contentWindow.postMessage({ type: 'diff:stylesheet', data: `* {color:red}` }, '*')
    }


    return (
        <Tool>
            <label>h1 .abc</label>
            <button onClick={changeColors}>change everything</button>
        </Tool>
    )
}

const Designer = () => {
    const [page, setPage] = useState();
    const [handshake, setHandshake] = useState(false);
    const iframeEl = useRef(null);

    const onLoad = () => {
        console.log('loaded')


        const interval = setInterval(() => {
            iframeEl.current.contentWindow.postMessage({ type: 'diff:handshake' }, '*')
        }, 100);

        window.addEventListener('message', evt => {
            if (evt.data && evt.data.type === 'diff:handshake:response') {
                clearInterval(interval);
                console.log('received response', evt.data.data)
                setHandshake(true)
            }
        })
    }


    return (
        <Layout style={{ height: "100vh", overflow: 'hidden' }}>
            <Header>
                <Active active={handshake} />
                <Search onSearch={val => setPage(`//${val}`)} />
            </Header>
            <Content style={{ position: "relative" }}>
                {handshake && <CSSTool iframeEl={iframeEl} />}
                {page && (
                    <Iframe innerRef={iframeEl} src={page} onLoad={onLoad} />
                )}



            </Content>
        </Layout>
    )

}

export default Designer;