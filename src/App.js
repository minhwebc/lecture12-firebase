import React from 'react';
import SignUpForm from './SignUp';
import firebase from 'firebase';
import { ChirpBox, ChirpList } from './Chirps';
/**
 * Main module for Chirps App
 */
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};

    //temporary
    this.signUp = this.signUp.bind(this);
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if(firebaseUser){
        console.log('logged in');
        this.setState({userId: firebaseUser.uid});
      }
      else{
        console.log('logged out');
        this.setState({userId: null});
      }
    });
  }

  //A callback function for registering new users
  signUp(email, password, handle, avatar) {
    /* Create a new user and save their information */
    console.log('hello');
    var thisComponent = this;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((firebaseUser) => {
      console.log('user created: '+firebaseUser.uid);

      var userData = {
        displayName: handle, 
        photoURL: avatar
      }

      var profilePromise = firebaseUser.updateProfile(userData);

      //add to the JITC 
      //jsonObjectInTheCloud['users'].push(userData)
      var newUserRef = firebase.database().ref('users/'+firebaseUser.uid);
      newUserRef.set(userData);
      return profilePromise;
    })
    .catch((error) => {
      console.log(error);
    });
  }

  //A callback function for logging in existing users
  signIn(email, password) {
    /* Sign in the user */
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(err => console.log(err)); //log any errors for debugging
  }

  //A callback function for logging out the current user
  signOut(){
    /* Sign out the user, and update the state */
    firebase.auth().signOut()
  }

  render() {
    var content = null; //what main content to show

    if(!this.state.userId) { //if not logged in, show signup form
      /* Assign a <SignUpForm> element to the content variable */
      content = <SignUpForm 
                            signUpCallback={this.signUp} 
                            signInCallback={this.signIn} 
                            />
    }
    else { //if the user is logged in
      /* Show a <ChirpBox> and a <ChirpList> */
      content = <div><ChirpBox /><ChirpList /></div>;
    }

    return (
      <div>
        <header className="container-fluid">
          <div className="logo">
            <i className="fa fa-twitter fa-3x" aria-label="Chirper logo"></i>
          </div>
          {this.state.userId &&  /*inline conditional rendering*/
            <div className="logout">
              <button className="btn btn-warning" onClick={()=>this.signOut()}>
                {/* Show user name on sign out button */}
                Sign out { firebase.auth().currentUser.displayName }
              </button>
            </div>
          }
        </header>

        <main className="container">        
          {content}
        </main>
      </div>      
    );
  }
}

export default App;
