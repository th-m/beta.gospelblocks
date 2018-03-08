import React, { Component } from 'react';
import { listen } from '../helpers/database'

import {  Link } from 'react-router-dom';

import { Card } from 'material-ui/Card';

export default class Block extends Component {
  constructor(props){
    console.log(props);
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
  
  updateCompendium = (e) => {
    this.props.updateCompendium(this.props.blockId);
  }
  redirect = () => {
    this.props.redirect('/block/'+this.props.blockId);
  }
  render(){
    return (
      <div  onDoubleClick={this.redirect}  onClick={this.updateCompendium}>
        <Card className="pointer nav_item" >
            <h3>{this.state.blockTitle}</h3>
        </Card>
      </div>
    );
  }
}
