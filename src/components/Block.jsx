import React, { Component } from 'react';
import { listen } from '../helpers/database';
// import {  Link } from 'react-router-dom';
import BlockNavItem from './BlockNavItem';
import CreateBlock from './CreateBlock';
import Library from './Library';
import Compendium from './Compendium';
export default class Block extends Component {
  constructor(props){
    // console.log('this thing happened \n\n',props, props.location.search);
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
    // console.log('nextprops', nextProps);
    const path = 'blocks/'+ nextProps.match.params.blockId;
    this.setState({parentBlockId: this.state.id});
    listen(path).on("value", this.gotData, this.errData);
    this.setState({id:nextProps.match.params.blockId});
    // this.props.getCurrentBlock(nextProps.match.params.blockId);
  }
  
  // componentWillUpdate(){
  //   console.log('this.props', this.props);
  // }
  errData = (error) => {
    console.log("errData", error);
  }
  
  gotData = (data) => {
    const blockData = data.val();
    this.setState({ blockData: blockData });
    this.setState({ children: (blockData.children ? blockData.children: [])});
    this.props.getCurrentBlock(blockData.id);
    
  }
  
  
  render(){
    return (
      <div>
        <div className="nav_items">
          {this.state.children.map(childId => <BlockNavItem key={childId} blockId={childId} /> )}
          <CreateBlock parentBlockId={this.state.id} />
        </div>
        <div className="study_container">
          <Library />
          <Compendium blockId={this.state.id}/>
        </div>
        
      </div>
    );
  }
}
