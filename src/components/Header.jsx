import React from 'react';
import AppBar from 'material-ui/AppBar';
import Login from './Login';
import MainMenu from './MainMenu';
import {  Link } from 'react-router-dom';
  
function handleClick(e) {
  console.log("Kicked")
}

export default class Header extends React.Component {
  render() {
    return (
          <AppBar
                style={{textAlign: 'left'}}
                // TODO: make BrandIcon component
                title={ <Link to='/'> <span onClick={handleClick} style={{cursor: 'pointer'}}>Gospel Blocks</span> </Link>}
                iconElementRight={(this.props.authed? <MainMenu /> : <Login />)}
                showMenuIconButton={false}
              />
    );
  }
}