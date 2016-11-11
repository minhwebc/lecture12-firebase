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
    var chirpsRef = firebase.database().ref('chirps'); //the chirps in the JOITC
    var newChirp = {
      text: this.state.post,
      userId: firebase.auth().currentUser.uid, //to look up chirper info
      time: firebase.database.ServerValue.TIMESTAMP //MAGIC
    };
    chirpsRef.push(newChirp); //upload

    this.setState({post:''}); //empty out post (controlled input)
  }

  render() {
    var currentUser = firebase.auth().currentUser; //get the curent user

    return (
      <div className="chirp-box write-chirp">
        {/* Show image of current user, who must be logged in */}
        <img className="image" src={currentUser.photoURL ? currentUser.photoURL : noUserPic} alt="user avatar" />

        <form className="chirp-input" role="form">
          <textarea placeholder="What's Happening..." name="text" value={this.state.post} className="form-control" onChange={(e) => this.updatePost(e)}></textarea>
          {/* Only show this if the post length is > 140 */}
          {this.state.post.length > 140 &&
            <p className="help-block">140 character limit!</p>
          }
          
          <div className="form-group send-chirp">
            {/* Disable if invalid post length */}
            <button className="btn btn-primary" 
                    disabled={this.state.post.length === 0 || this.state.post.length > 140}
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
    usersRef.on('value', (snapshot) => {
      this.setState({users:snapshot.val()});
    });

    /* Add a listener for changes to the chirps object, and save in the state */
    var chirpsRef = firebase.database().ref('chirps');
    chirpsRef.on('value', (snapshot) => {
      var chirpArray = []; //could also do this processing in render
      snapshot.forEach(function(child){
        var chirp = child.val();
        chirp.key = child.key; //save the unique id for later
        chirpArray.push(chirp); //make into an array
      });
      chirpArray.sort((a,b) => b.time - a.time); //reverse order
      this.setState({chirps:chirpArray});
    });
  }

  //When component will be removed
  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('users').off();
    firebase.database().ref('chirps').off();
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

    return (<div>{chirpItems}</div>);
  }
}

//A single Chirp
class ChirpItem extends React.Component {
  //A method to "like" a Chirp
  likeChirp() {
    /* Access the chirp in the firebase and add this user's name */
    var chirpLikeRef = firebase.database().ref('chirps/'+this.props.chirp.key+'/likes');

    //toggle logic
    var userId = firebase.auth().currentUser.uid
    var likeObj = this.props.chirp.likes || {};
    if(likeObj && likeObj[userId]) { //in likes list already
      likeObj[userId] = null; //remove
    }
    else { //add my like
      likeObj[userId] = true; //just make it true so we have a key
    } 

    chirpLikeRef.set(likeObj) //update the likes!
  }
 
  render() {
    //like styling, for fun!
    var iLike = false;
    var likeCount = 0; //count likes
    if(this.props.chirp.likes){
      likeCount = Object.keys(this.props.chirp.likes).length;
      if(this.props.chirp.likes[firebase.auth().currentUser.uid])
        iLike = true;
    }

    var avatar = (this.props.user.avatar !== '' ? this.props.user.avatar : noUserPic);

    return (
      <div className="chirp-box">
        <div>
          {/* This image's src should be the user's avatar */}
          <img className="image" src={avatar} role="presentation" />
          
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
          <i className={'fa fa-heart '+(iLike ? 'user-liked': '')} aria-label="like" onClick={() => this.likeChirp()} ></i>
          
          {/* Show the total number of likes */}
          <span>{/*space*/} {likeCount}</span>
        </div>
      </div>      
    );
  }
}

ChirpItem.propTypes = {
  chirp: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

export default ChirpList;