import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import About from './static/About';
import Contact from './static/Contact';
import Profile from './static/Profile';
import User from './static/User';

import Block from './components/Block'
import Dashboard from './components/Dashboard'
import Header from './components/Header';
// import Footer from './components/Footer';

import { firebaseAuth } from './config/constants';
// import { PrivateRoute } from './helpers/routes';
// import {Context, DataStore} from './Context'

import './styles/App.css';



class App extends Component {
  constructor(){
    super();
    this.state = {
      authed: false,
      loading: false,
      user: '',
    };
  }
  
  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      this.setState({
        authed: (user ? true : false),
        loading: false,
        user: user
      })
    })
  }


  componentWillUnmount () {
    this.removeListener()
  }
  
  updateCompendiumId = (e) => {
    this.setState({compendiumId:e});
  }
  render() {
    return (
      <MuiThemeProvider>
          <Router>
            <div className="App">
              <div className="AppHeader">
                {["/", "/about", "/profile", "/contact", "/block/:blockId", "/user/:userId"].map((path, index) => 
                    <Route path={path} exact render={props => <Header authed={this.state.authed} updateCompendium={ this.updateCompendiumId } {...props}/> } />
                )}
              </div>
              <div className="AppBody">
                {(this.state.user ? <Route path="/" exact render={ () => (<Dashboard user={this.state.user} />)} /> :  <Route path="/" exact component={About} /> )}
                
                {(this.state.user ? <Route path="/about" exact component={About} />  : null )}
                
                {(this.state.user ? <Route path="/profile" exact component={Profile} />  : null )}
            
                <Route authed={this.state.authed} path="/block/:blockId" render={props => <Block ref="blockComponent" user={this.state.user} forceCompendium={this.state.compendiumId} {...props} />} />
                
                <Route authed={this.state.authed} path="/user/:userId" component={User} />
                
                <Route path="/contact" exact component={Contact} /> 
              </div>
              {/* <div className="AppFooter">
                <Footer authed={this.state.authed} />
              </div> */}
            </div>
          </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;


