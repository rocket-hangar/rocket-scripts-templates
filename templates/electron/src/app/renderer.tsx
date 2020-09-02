import * as Sentry from '@sentry/electron';
import React from 'react';
import { render } from 'react-dom';
import { Title } from './components/Title';

if (process.env.NODE_ENV !== 'development' && process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const text: string = window.hello.world();

function App() {
  return <Title text={text} />;
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
