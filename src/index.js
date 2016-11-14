import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from 'firebase';

/* Configure firebase when page first loads */
var config = {
  apiKey: "AIzaSyDfnJxm7l49B7uAKoFYDK9k6Xy0GjhBIQo",
  authDomain: "chirper-2016a.firebaseapp.com",
  databaseURL: "https://chirper-2016a.firebaseio.com",
  storageBucket: "chirper-2016a.appspot.com",
  messagingSenderId: "526960426843"
};
firebase.initializeApp(config);

//load CSS
import 'bootstrap/dist/css/bootstrap.css';
import './css/index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

//extraneous method call to produce error for non-configured app
firebase.auth(); 