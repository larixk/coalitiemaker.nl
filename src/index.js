import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';

window.addEventListener('touchstart', function() {
  window.hasTouched = true;
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
