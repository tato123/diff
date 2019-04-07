import React from 'react';
import ReactWebComponent from 'react-web-component';

import CSSInspector from './components/CSSInspector';

import 'antd/dist/antd.css'
import './index.css';

class App extends React.Component {
    render() {
        return <div>
            <CSSInspector />
        </div>;
    }
}

ReactWebComponent.create(<App />, 'my-component');