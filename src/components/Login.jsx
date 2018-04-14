import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { login, userEmailProviders, auth, checkUsername } from '../helpers/auth'



// function setErrorMsg(error) {
//   return {
//     loginMessage: error
//   }
// }

function validateEmail(email){
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export default class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      authed: false,
      buttonMessage: 'Enter Your Email',
      pwError: '',
      emailError: '',
      usernameError: '', 
      email: '',
      pw: '',
      username: '',
      open: false
    };
  }
  
  
  handleKeyDown = (e) => {
    if(e.key === "Enter"){
      this.signIn();
    }
  }

  handleEmailChange = (e) => {
      this.setState({email: e.target.value});
      if(validateEmail(e.target.value)){
        
        userEmailProviders(e.target.value)
          .then((e) => {
             if(e.length > 0){
               this.setState({authed:true});
             }else{
               this.setState({authed:false});
             }
           })
          .catch(() => null);      
      }
  }
  inputChange = (e) => {
    this.setState({[e.target.id]: e.target.value});
  }

  handleErr = (msg) => {
    if( msg.includes('assword')){
      this.setState({pwError:msg});
    }
    if( msg.includes('email')){
      this.setState({emailError:msg});
    }
  }
  
  handleLogin = () => {
    login(this.state.email, this.state.pw)
    .catch((error) => {
      this.handleErr(error.message);
    })
  }
  
  
  
  checkSignUp = () => {
    if(!this.state.username){
      this.setState({usernameError:"you must choose a username"});
      return false;
    }else{
      checkUsername(this.state.username, this.signUp, this.userNameFail);
      
    }
    
  }
  
  userNameFail = () => {
    this.setState({usernameError:"a username must be unique"});
  }
  
  signUp = () => {
    auth(this.state.email, this.state.pw, this.state.username)
    .catch((error) => { 
      console.log(error);
      this.handleErr(error.message);
    })
  }
  
  signIn = (e = null) => {
    if(e){
      e.preventDefault();
    }
    
    this.setState({emailError:''});
    this.setState({pwError:''});
    
    if(this.state.authed){
      this.handleLogin();
    }else{
      this.checkSignUp();
    }
  }
  
  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render () {
    const actions = [
      <FlatButton
        style={{color:'white'}}
        label={(this.state.authed? 'Enter Password' : 'Sign Up')}
        primary={true}
        backgroundColor={'rgb(0, 188, 212)'}
        onClick={this.signIn}
        fullWidth={true}
      />
    ];
    return (
        <div>
            <FlatButton style={{color:'white', marginTop:7}} label="Login" onClick={this.handleOpen} />
            <Dialog
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
              >
              <TextField
                required
                id="username"
                hintText="awesome_thom"
                floatingLabelText="User Name"
                fullWidth={true}
                errorText={(this.state.usernameError ? this.state.usernameError : null)}
                onKeyDown={this.handleKeyDown}
                onChange={this.inputChange}
              /><br />
              <TextField
                required
                id="email"
                hintText="user@email.com"
                floatingLabelText="Email"
                errorText={(this.state.emailError ? this.state.emailError : null)}
                fullWidth={true}
                onKeyDown={this.handleKeyDown}
                onChange={this.handleEmailChange}
              /><br />
              <TextField
                required
                id="pw"
                hintText="super secret pass"
                floatingLabelText="Password"
                errorText={(this.state.pwError ? this.state.pwError : null)}
                type="password"
                fullWidth={true}
                onKeyDown={this.handleKeyDown}
                onChange={this.inputChange}
              />
            </Dialog>
        </div>
    );
  }
}
