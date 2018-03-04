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

import { firebaseAuth } from './config/constants';
// import { PrivateRoute } from './helpers/routes';



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

  
  // componentWillReceiveProps(nextProps){
  //   //TODO ParentBlockId needs to relate to a parent not previous.
  //   // const path = 'blocks/'+ nextProps.match.params.blockId;
  //   console.log('header ',nextProps);
  //   // this.setState({parentBlockId: this.state.id});
  //   // listen(path).on("value", this.gotData, this.errData);
  //   // this.setState({id:nextProps.match.params.blockId});
  // }

  componentWillUnmount () {
    this.removeListener()
  }
  render() {
    return (
      <MuiThemeProvider>
        <Router>
          <div className="App">
            <Header ref="headerComponent" authed={this.state.authed} />
            {(this.state.user ? <Route path="/" exact render={() => (<Dashboard user={this.state.user} hideBarTitle={()=>this.refs.headerComponent.hideBarTitle()} />)} /> :  <Route path="/" exact component={About} /> )}
            {(this.state.user ? <Route path="/about" exact component={About} />  : null )}
            {(this.state.user ? <Route path="/profile" exact component={Profile} />  : null )}
            {/* <Route authed={this.state.authed} path="/block/:blockId" getCurrentBlock={this.getCurrentBlock} component={Block} /> */}
            <Route authed={this.state.authed} path="/block/:blockId" render={props => <Block getCurrentBlock={(elem)=>this.refs.headerComponent.getCurrentBlock(elem)} {...props} />} />
            <Route authed={this.state.authed} path="/user/:userId" component={User} />
            <Route path="/contact" exact component={Contact} /> 
            {/* TODO make this <Footer />  */}
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;


