import React from 'react';
import SignUpForm from './SignUp';
import { ChirpBox, ChirpList } from './Chirps';
import firebase from 'firebase';

/**
 * Main module for Chirps App
 */
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  //Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
    /* Add a listener and callback for authentication events */
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        console.log('Auth state changed: logged in as', user.email);
        this.setState({userId:user.uid});
      }
      else{
        console.log('Auth state changed: logged out');
        this.setState({userId: null}); //null out the saved state
      }
    })
  }

  //A callback function for registering new users
  signUp(email, password, handle, avatar) {
    /* Create a new user and save their information */
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(firebaseUser) {
        //include information (for app-level content)
        var profilePromise = firebaseUser.updateProfile({
          displayName: handle,
          photoURL: avatar
        }); //return promise for chaining

        //create new entry in the Cloud DB (for others to reference)
				var userRef = firebase.database().ref('users/'+firebaseUser.uid); 
        var userData = {
          handle:handle,
          avatar:avatar
        }
        var userPromise = userRef.set(userData); //update entry in JOITC, return promise for chaining
        return Promise.all(profilePromise, userPromise); //do both at once!
      })
      .then(() => this.forceUpdate()) //bad, but helps demo
      .catch((err) => console.log(err));
  }

  //A callback function for logging in existing users
  signIn(email, password) {
    /* Sign in the user */
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((err) => console.log(err));
  }

  //A callback function for logging out the current user
  signOut(){
    /* Sign out the user, and update the state */
    firebase.auth().signOut();
  }

  render() {
    var content = null; //what main content to show

    if(!this.state.userId) { //if logged out, show signup form
      content = <SignUpForm signUpCallback={this.signUp} signInCallback={this.signIn} />;
    }
    else {
      //show the chirps!
      content = (<div><ChirpBox /><ChirpList /></div>);
    }

    return (
      <div>
        <header className="container-fluid">
          <div className="logo">
            <i className="fa fa-twitter fa-3x" aria-label="Chirper logo"></i>
          </div>
          {this.state.userId &&  /*inline conditional rendering*/
            <div className="logout">
              <button className="btn btn-warning" onClick={()=>this.signOut()}>Sign out {firebase.auth().currentUser.displayName}</button>
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
