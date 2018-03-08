import React, { Component } from 'react';
import { listen } from '../helpers/database';

import BlockNavItem from './BlockNavItem';
import CreateBlock from './CreateBlock';
import Library from './Library';
import Compendium from './Compendium';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement(({value}) => {
  return (
    <li>
      <BlockNavItem key={value.id} blockId={value.id} redirect={value.redirect} updateCompendium={value.updateCompendium} />
    </li>
  );
});

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

export default class Block extends Component {
  constructor(props){
    console.log('history',props.history)
    super(props);
    this.state = {
      editDialogOpen: false,
      blockData: {},
      children: [],
      id: this.props.match.params.blockId,
      compendiumId: this.props.match.params.blockId,
    };
  }
  
  
  componentDidMount(){
    const path = 'blocks/'+ this.state.id;
    listen(path).on("value", this.gotData, this.errData);
  }
  
  componentWillReceiveProps(nextProps){
    //TODO ParentBlockId needs to relate to a parent not previous.
    console.log('this never fired', nextProps);
    const path = 'blocks/'+ nextProps.match.params.blockId;
    this.setState({parentBlockId: this.state.id});
    listen(path).on("value", this.gotData, this.errData);
    this.setState({id:nextProps.match.params.blockId});
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
    console.log(blockData);
    if(blockData.children){
      this.setState({ children: blockData.children.map(x => { return {id:x, redirect:this.redirect,  updateCompendium:this.updateCompendium} } ) } );
    }else{
      this.setState({ children: [] } );
    }
    this.props.getCurrentBlock(blockData.id);
  }
  
  redirect = (p) => {
    this.props.history.push(p)
  }
  
  updateCompendium = (compendiumId) => {
    this.setState({compendiumId});
  }
  
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      children: arrayMove(this.state.children, oldIndex, newIndex),
    });
  };
  
  render(){
    return (
      <div>
        <div className="nav_items">
          <SortableList items={this.state.children} axis="x" onSortEnd={this.onSortEnd}  />
          <CreateBlock parentBlockId={this.state.id} />
        </div>
        <div className="study_container">
          <Library />
          <Compendium blockId={this.state.compendiumId}/>
        </div>
      </div>
    );
  }
}
