import React from 'react';
import { render } from 'react-snapshot';
import WebExtension from './extension/App';
// import App from './App';

render(<WebExtension />, document.getElementById('root'));
