import React from 'react';

import {  Link } from 'react-router-dom';
import { logout } from '../helpers/auth';

import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';


export default class MainMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  handleToggle = (e) =>{
    this.setState({open: !this.state.open});
  };

  signOut = () => {
    logout();
  }
  render() {
    return (
      <div>
       <IconButton onClick={this.handleToggle} ><NavigationMenu color="white" /></IconButton>
       <Drawer
         docked={false}
         width={200}
         open={this.state.open}
         onRequestChange={(open) => this.setState({open})}
         openSecondary={true}
       >  
           <Link to='/'> <MenuItem > Dashboard </MenuItem> </Link>
           <Link to='/profile'> <MenuItem> Profile </MenuItem> </Link>
           <Link to='/contact'> <MenuItem> Contact </MenuItem> </Link>
           <Link to='/about'> <MenuItem > About </MenuItem> </Link>
           <MenuItem onClick={this.signOut}> Sign Out </MenuItem>
      
       </Drawer>
     </div>
    );
  }
}
