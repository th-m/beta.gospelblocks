import React, { Component } from 'react';
import FontAwesome  from 'react-fontawesome';
// import {  Link } from 'react-router-dom';
// import { listen } from '../helpers/database';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

export default class Footer extends Component {
  render() {
    return (
      <div className="Toolbar">
        <Toolbar>
          <ToolbarGroup>
            <FontAwesome name='search' size='2x' />
          </ToolbarGroup>
          <ToolbarGroup>
            <FontAwesome name='cube' size='2x' />
          </ToolbarGroup>
          <ToolbarGroup>
            <FontAwesome name='user' size='2x' />
          </ToolbarGroup>
        </Toolbar>
      </div>
        
    );
  }
}
