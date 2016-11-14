/*eslint no-unused-vars: "off"*/ //don't show warnings for unused

import React from 'react';
import Time from 'react-time'
import firebase from 'firebase';
import noUserPic from './img/no-user-pic.png';

// A form the user can use to post a Chirp
export class ChirpBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {post:''};
  }

  //when the text in the form changes
  updatePost(event) {
    this.setState({post: event.target.value});
  }

  //post a new chirp to the database
  postChirp(event){
    event.preventDefault(); //don't submit
    

    /* Add a new Chirp to the database */
    var chirpData = {
      text: this.state.post,
      userId: firebase.auth().currentUser.uid,
      time: firebase.database.ServerValue.TIMESTAMP
    }

    var chirpsRef = firebase.database().ref('chirps');
    chirpsRef.push(chirpData);
    

    this.setState({post:''}); //empty out post (controlled input)
  }

  render() {    
    return (
      <div className="chirp-box write-chirp">
        {/* Show image of current user, who must be logged in */}
        <img className="image" src={firebase.auth().currentUser.photoURL} alt="user avatar" />

        <form className="chirp-input" role="form">
          <textarea placeholder="What's happening...?" name="text" value={this.state.post} className="form-control" onChange={(e) => this.updatePost(e)}></textarea>
          {/* Only show this if the post length is > 140 */}
          <p className="help-block">140 character limit!</p>
          
          <div className="form-group send-chirp">
            {/* Disable if invalid post length */}
            <button className="btn btn-primary" 
                    onClick={(e) => this.postChirp(e)} >
              <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Share
            </button> 					
          </div>
        </form>
      </div>
    );
  }
}

//A list of chirps that have been posted
export class ChirpList extends React.Component {
  constructor(props){
    super(props);
    this.state = {chirps:[]};
  }

  //Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
    /* Add a listener for changes to the user details object, and save in the state */

    var usersRef = firebase.database().ref('users');
    usersRef.on('value', (snapshot) =>{
      var newVal = snapshot.val();

      this.setState({users:newVal});
    });

    /* Add a listener for changes to the chirps object, and save in the state */

    var chirpsRef = firebase.database().ref('chirps');
    chirpsRef.on('value', (snapshot) =>{
      var chirpsArray = []; //an array to put in the state
      snapshot.forEach(function(childSnapshot){ //go through each item like an array
        var chirpObj = childSnapshot.val(); //convert this snapshot into an object
        chirpObj.key = childSnapshot.key; //save the child's unique id for later
        chirpsArray.push(chirpObj); //put into our new array
      });

      this.setState({chirps:chirpsArray}); //add to state
    });
  }

  render() {
    //don't show if don't have user data yet (to avoid partial loads)
    if(!this.state.users){
      return null;
    }

    /* Create a list of <ChirpItem /> objects */
    var chirpItems = this.state.chirps.map((chirp) => {
      return <ChirpItem chirp={chirp} 
                        user={this.state.users[chirp.userId]} 
                        key={chirp.key} />
    })

    return (<div>{chirpItems}</div>);//should return element containing the <ChirpItems/> instead!
  }
}


//A single Chirp
class ChirpItem extends React.Component { // eslint-disable-line no-alert 

  render() {
    //like styling, for fun!
    var iLike = false; //does this user like the chirp?
    var likeCount = 0; //count likes

    return (
      <div className="chirp-box">
        <div>
          {/* This image's src should be the user's avatar */}
          <img className="image" src={this.props.user.avatar} role="presentation" />
          
          {/* Show the user's handle */}
          <span className="handle">{this.props.user.handle} {/*space*/}</span>

          {/* Show the time of the chirp (use a Time component!) */}
          <span className="time"><Time value={this.props.chirp.time} relative/></span>
        </div>

        {/* Show the text of the chirp */}
        <div className="chirp">{this.props.chirp.text}</div>

        {/* Create a section for showing chirp likes */}
        <div className="likes">
          
          {/* Show a heart icon that, when clicked, calls like `likeChirp` function */}
          <i className={'fa fa-heart '+(iLike ? 'user-liked': '')} aria-label="like"></i>
          
          {/* Show the total number of likes */}
          <span>{/*space*/} {likeCount}</span>
        </div>
      </div>      
    );
  }
}

//to enforce proptype declaration
ChirpItem.propTypes = {
  chirp: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

export default ChirpList;