import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from 'firebase';

//Configure firebase on page start
var config = {
  apiKey: "AIzaSyDNdiwRcBtg3HNl8EAxX13gmoGqIUPx86U",
  authDomain: "chirper3-master-f1c82.firebaseapp.com",
  databaseURL: "https://chirper3-master-f1c82.firebaseio.com",
  storageBucket: "chirper3-master-f1c82.appspot.com",
};
firebase.initializeApp(config);

//load CSS
import 'bootstrap/dist/css/bootstrap.css';
import './css/index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
