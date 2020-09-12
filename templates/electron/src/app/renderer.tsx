import React from 'react';
import { render } from 'react-dom';
import { Title } from './components/Title';

if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

const text: string = hello.world();

function App() {
  return <Title text={text} />;
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
