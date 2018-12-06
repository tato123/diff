import React, { Component } from 'react';
import Frame from './features/frame';
import List from './features/list';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-areas: ". .";
  grid-template-columns: 0.3fr 1fr;
  grid-template-rows: 1fr;
  width: 100vw;
  height: 100vh;

  > *:first-child {    
    border-right: 1px solid #ccc;
  }
`


class App extends Component {
  render() {
    return (
      <Container>
        <List/>
        <Frame/>

      </Container>
    );
  }
}

export default App;
