import React from 'react';


/**
 * Main module for Chirps App
 */
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }


  //A callback function for registering new users
  signUp(email, password, handle, avatar) {
    /* Create a new user and save their information */

  }

  //A callback function for logging in existing users
  signIn(email, password) {
    /* Sign in the user */

  }

  //A callback function for logging out the current user
  signOut(){
    /* Sign out the user, and update the state */

  }

  render() {
    var content = null; //what main content to show

    if(!this.state.userId) { //if not logged in, show signup form
      /* Assign a <SignUpForm> element to the content variable */

    }
    else { //if the user is logged in
      /* Show a <ChirpBox> and a <ChirpList> */

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
                Sign out "User Name"
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
