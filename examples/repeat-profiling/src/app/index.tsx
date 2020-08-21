import React from 'react';
import { render } from 'react-dom';
import styled, { keyframes } from 'styled-components';

const amount: number = 30;

function App() {
  return (
    <Container>
      {Array.from({ length: amount }).map((_, i) => (
        <AnimateWithTransform key={'element' + i} />
      ))}
    </Container>
  );
}

const width = keyframes`
  0% { width: 100px; }
  50% { width: 500px;}
  100% { width: 100px;}
`;

export const AnimateWithWidth = styled.div`
  animation-name: ${width};
  animation-timing-function: ease-in-out;
  animation-duration: 4s;
  animation-iteration-count: infinite;

  width: 100px;
`;

const transform = keyframes`
  0% { transform: scaleX(1); }
  50% { transform: scaleX(5); }
  100% { transform: scaleX(1); }
`;

export const AnimateWithTransform = styled.div`
  animation-name: ${transform};
  animation-timing-function: ease-in-out;
  animation-duration: 4s;
  animation-iteration-count: infinite;

  width: 100px;
  transform-origin: left;
`;

const Container = styled.div`
  div {
    height: 20px;
    color: black;
  }

  div:nth-child(odd) {
    background-color: navy;
  }

  div:nth-child(even) {
    background-color: skyblue;
  }
`;

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
