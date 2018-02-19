import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { login, resetPassword, userEmailProviders } from '../helpers/auth'



function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}
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
      email: '',
      pw: ''
    };
  }

  handleEmailChange = (e) => {
      this.setState({email: e.target.value});
      let buttonMessage = 'Enter Your Email';
      if(validateEmail(e.target.value)){
        
        userEmailProviders(e.target.value)
          .then((e) => {
             buttonMessage = (e.length > 0? 'Enter Password' : `Sign Up`); 
             this.setState({buttonMessage});
           })
          .catch(() => null);      
      }else{
        this.setState({buttonMessage});
      }
  }
  handlePwChange = (e) => {
    this.setState({pw: e.target.value});
  }
  signIn = (e) => {
    e.preventDefault()
    login(this.state.email, this.state.pw)
      .catch((error) => {
          this.setState(setErrorMsg('Invalid username/password.'))
        })
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
        label={this.state.buttonMessage}
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
                id="email"
                hintText="user@email.com"
                floatingLabelText="Email"
                fullWidth={true}
                onChange={this.handleEmailChange}
              /><br />
              <TextField
                id="pw"
                hintText="super secret pass"
                floatingLabelText="Password"
                type="password"
                fullWidth={true}
                onChange={this.handlePwChange}
              />
            </Dialog>
        </div>
    );
  }
}