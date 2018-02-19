import React, { Component } from 'react';
import { listen, update } from '../helpers/database';
import {  Link } from 'react-router-dom';
import BlockNavItem from './BlockNavItem';
import CreateBlock from './CreateBlock';
import Library from './Library';
import Compendium from './Compendium';
export default class Block extends Component {
  constructor(props){
    super(props);
    this.state = {
      editDialogOpen: false,
      blockData: {},
      children: [],
      id: this.props.match.params.blockId
    };
  }
  
  componentDidMount(){
    const path = 'blocks/'+ this.state.id;
    listen(path).on("value", this.gotData, this.errData);
  }
  
  componentWillReceiveProps(nextProps){
    //TODO ParentBlockId needs to relate to a parent not previous.
    const path = 'blocks/'+ nextProps.match.params.blockId;
    this.setState({parentBlockId: this.state.id});
    listen(path).on("value", this.gotData, this.errData);
    this.setState({id:nextProps.match.params.blockId});
  }
  
  errData = (error) => {
    console.log("errData", error);
  }
  
  gotData = (data) => {
    const blockData = data.val();
    this.setState({ blockData: blockData });
    this.setState({ children: (blockData.children ? blockData.children: [])});
    
  }
  
  
  render(){
    return (
      <div>
        {(this.state.parentBlockId?
            <Link to={'/block/'+this.state.parentBlockId}>  <h2>{this.state.blockData.title}</h2> </Link>
          : <h2>{this.state.blockData.title}</h2>
        )}
        
        <div className="nav_items">
          {this.state.children.map(childId => <BlockNavItem key={childId} blockId={childId} /> )}
          <CreateBlock parentBlockId={this.state.id} />
        </div>
        <div className="study_container">
          <Library />
          <Compendium blockId=""/>
        </div>
        
      </div>
    );
  }
}
