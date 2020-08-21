import React, { SVGProps } from 'react';
import { render } from 'react-dom';
import styled, { keyframes } from 'styled-components';

const amount: number = 30;
const height: number = 20;

function App() {
  return (
    <Container>
      {Array.from({ length: amount }).map((_, i) => (
        //<DivWidth key={'element' + i} />
        //<DivWidthPositionFixed style={{ top: height * (i + 1) }} key={'element' + i} />
        //<DivTransform key={'element' + i} />
        //<SvgWidth key={'element' + i} />
        <SvgTransform key={'element' + i} />
      ))}
    </Container>
  );
}

const width = keyframes`
  0% { width: 100px; }
  50% { width: 500px;}
  100% { width: 100px;}
`;

const transform = keyframes`
  0% { transform: scale(1, 1); }
  50% { transform: scale(5, 1); }
  100% { transform: scale(1, 1); }
`;

export const DivWidth = styled.div`
  animation-name: ${width};
`;

export const DivWidthPositionFixed = styled.div`
  animation-name: ${width};

  position: fixed;
  left: 10px;
`;

export const DivTransform = styled.div`
  animation-name: ${transform};

  transform-origin: left;
`;

export function Svg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props}>
      <rect />
    </svg>
  );
}

export const SvgWidth = styled(Svg)`
  rect {
    animation-name: ${width};
  }
`;

export const SvgTransform = styled(Svg)`
  rect {
    animation-name: ${transform};
  }
`;

const Container = styled.div`
  div {
    width: 100px;
    height: ${height}px;
    background-color: currentColor;

    animation-timing-function: ease-in-out;
    animation-duration: 4s;
    animation-iteration-count: infinite;
  }

  svg {
    width: 700px;
    height: ${height}px;

    rect {
      width: 100px;
      height: ${height}px;
      fill: currentColor;

      animation-timing-function: ease-in-out;
      animation-duration: 4s;
      animation-iteration-count: infinite;
    }
  }

  > :nth-child(odd) {
    color: navy;
  }

  > :nth-child(even) {
    color: skyblue;
  }
`;

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
