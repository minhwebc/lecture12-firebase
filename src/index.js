import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from 'firebase';
/* Configure firebase when page first loads */


//load CSS
import 'bootstrap/dist/css/bootstrap.css';
import './css/index.css';
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBx-a9FaVjBYDpPyoRKVPEHVNErFy1inFs",
  authDomain: "twitter-21cd2.firebaseapp.com",
  databaseURL: "https://twitter-21cd2.firebaseio.com",
  storageBucket: "twitter-21cd2.appspot.com",
  messagingSenderId: "1061409527018"
};
firebase.initializeApp(config);
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

//extraneous method call to produce error for non-configured app
firebase.auth(); 