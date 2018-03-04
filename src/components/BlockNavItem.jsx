import React, { Component } from 'react';
import { listen } from '../helpers/database'

import {  Link } from 'react-router-dom';

// import FontAwesome  from 'react-fontawesome';
import { Card } from 'material-ui/Card';
// import FlatButton from 'material-ui/FlatButton';
// import Dialog from 'material-ui/Dialog';
// import TextField from 'material-ui/TextField';

export default class Block extends Component {
  constructor(props){
    super(props);
    this.state = {
      editDialogOpen: false,
      blockTitle: "",
    };
  }
  
  componentDidMount(){
    const path = 'blocks/'+ this.props.blockId;
    listen(path).on("value", this.gotData, this.errData);
  }
  
  errData = (error) => {
    console.log("errData", error);
  }
  
  gotData = (data) => {
    this.setState({blockTitle:data.val().title});
  }
  
  render(){
    return (
      <Link to={'/block/'+this.props.blockId}>
        <Card className="pointer nav_item" onClick={this.toggleDialog} >
            <h3>{this.state.blockTitle}</h3>
        </Card>
      </Link>
    );
  }
}
