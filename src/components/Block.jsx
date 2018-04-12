import React, { Component } from 'react';
import { listen, update, reduceList } from '../helpers/database';

import BlockNavItem from './BlockNavItem';
import CreateBlock from './CreateBlock';
import Library from './Library';
import Compendium from './Compendium';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import {Context, DataStore} from '../Context'

const DragHandle = SortableHandle(() => <span>::</span>);

const SortableItem = SortableElement(({value}) => {
  return (
    <li>
      <DragHandle />
      <BlockNavItem blockId={value.id} redirect={value.redirect} updateCompendium={value.updateCompendium} uid={value.uid}/>
    </li>
  );
});

const SortableList = SortableContainer(({items}) => {
  
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`blocknav-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

export default class Block extends Component {
  constructor(props){
    // console.log('history',props.history)
    super(props);
    this.state = {
      editDialogOpen: false,
      blockData: {},
      children: [],
      id: this.props.match.params.blockId,
      compendiumId: this.props.match.params.blockId,
    };
    // console.log(props);
  }
  
  
  componentDidMount(){
    const path = 'blocks/'+ this.state.id;
    listen(path).on("value", this.gotData, this.errData);
    // this.props.updateBlockId(this.state.id);
  }
  
  
  componentWillReceiveProps(nextProps){
    //TODO ParentBlockId needs to relate to a parent not previous.
    // console.log('this never fired', nextProps);
    const path = 'blocks/'+ nextProps.match.params.blockId;
    this.setState({parentBlockId: this.state.id});
    listen(path).on("value", this.gotData, this.errData);
    this.setState({id:nextProps.match.params.blockId});
    
    if(nextProps.forceCompendium){
      this.updateCompendium(nextProps.forceCompendium);
    }
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
    const children = data.val().children;
    // console.log(children);
    if(children){
      this.setState({ children: Object.keys(children).map(x => { return {key:x, id:children[x], redirect:this.redirect,  updateCompendium:this.updateCompendium, uid:this.props.user.uid} } ) } );
    }else{
      this.setState({ children: [] } );
    }
    // this.props.getCurrentBlock(blockData.id);
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
    
    
    const newPinOrder = Object.keys(this.state.children).map(key => {return {[(parseInt(key) + 1)] : this.state.children[key].id}}).reduce(reduceList, {});
    const path = 'blocks/'+ this.state.id +'/children';
    update(path,newPinOrder);
    
  };
  
  render(){
    return (
      <div>
        <div className="nav_items">
          <SortableList items={this.state.children} axis="x" onSortEnd={this.onSortEnd} useDragHandle={true}  />
          <CreateBlock parentBlockId={this.state.id} />
        </div>
        <div className="study_container">
          <Library  blockId={this.state.compendiumId} />
          <Compendium blockId={this.state.compendiumId} uid={this.props.user.uid} />
        </div>
      </div>
    );
  }
}
