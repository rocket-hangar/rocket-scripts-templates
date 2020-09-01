import { Message } from '@myorg/api-types';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Title } from './components/Title';
import { hello } from './services/hello';

function App() {
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    hello().then(setMessage);
  }, []);

  return message ? <Title text="Hello World!" /> : <div>Loading...</div>;
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
