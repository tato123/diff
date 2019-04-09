import React from 'react';
import ReactWebComponent from 'react-web-component';

import Toolbar from './components/toolbar';
import Box from './components/selection/box';

import SelectionContext from './context/Selection';
import CSSInsepctor from './components/inspectors/CSSInspector';

import './index.css';



class App extends React.Component {
    state = {
        sel: '',
        elm: null
    }

    onChange = (val) => {
        this.setState({ sel: val })
    }

    render() {
        const { state: { sel, elm } } = this;

        return (
            <SelectionContext.Provider value={elm}>
                <Box active={sel === 'css'} onSelect={elment => this.setState({ elm: elment })} />
                <Toolbar onChange={this.onChange} />
                <CSSInsepctor />
            </SelectionContext.Provider>
        )
    }
}

ReactWebComponent.create(<App />, 'my-component');