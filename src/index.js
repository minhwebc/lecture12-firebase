import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

/* Configure firebase when page first loads */


//load CSS
import 'bootstrap/dist/css/bootstrap.css';
import './css/index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

//extraneous method call to produce error for non-configured app
firebase.auth(); 