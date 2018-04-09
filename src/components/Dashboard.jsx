import React, { Component, Fragment } from 'react';
import PinnedBlock from './PinnedBlock';
import CreateBlock from './CreateBlock';
import { listen, update, reduceList } from '../helpers/database'
import '../styles/App.css';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <span>::</span>);

const SortableItem = SortableElement(({value}) => {
  console.log(value);
  return (
    <li>
      <DragHandle />
      <PinnedBlock key={value.key} blockId={value.blockId} uid={value.uid}/>
    </li>
  );
});

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
       <SortableItem key={`pin-${index}`} index={index} value={value} /> 
      ))}
    </ul>
  );
});


export default class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      pinnedBlocks: [],
      list:[],
    };
    console.log(props);
  }
  
  componentDidMount(){
    const path = 'users/'+ this.props.user.uid;
    listen(path).on("value", this.gotData, this.errData);
    console.log(this.props.updateBlockTitle);
    // this.props.updateBlockId();
  }
  
  errData = (error) => {
    console.log("errData", error);
    
  }
  
  onSort = (sortedList, dropEvent) => {
    console.log("sortedList", sortedList, dropEvent);
  }

  formatDraggableList = (pins) => {
    let list = pins.map(pin => {return { key:pin.key, blockId:pin.blockId, uid:this.props.user.uid} });
    this.setState({list});
  }
  
  gotData = (data) => {
    // console.log(data.val());
    if(data.val() && data.val().pinnedBlocks){
      let pinnedBlocks = Object.keys(data.val().pinnedBlocks).map(key => {return {key:key, blockId:data.val().pinnedBlocks[key]}}); 
      this.setState({pinnedBlocks:pinnedBlocks});
      this.formatDraggableList(pinnedBlocks);
    }else{
      this.setState({pinnedBlocks:[]});
    };
  }
  
  
  
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      list: arrayMove(this.state.list, oldIndex, newIndex),
    });
    
    const newPinOrder = Object.keys(this.state.list).map(key => {return {[(parseInt(key) + 1)] : this.state.list[key].blockId}}).reduce(reduceList, {});
    const path = 'users/'+ this.props.user.uid +'/pinnedBlocks';
    update(path,newPinOrder);
    
  };
  
  render() {
    return (
      <div className="dashboard_container">
        <div className="dashboard_grid">
          <SortableList items={this.state.list} axis="xy" onSortEnd={this.onSortEnd} useDragHandle={true} />
        </div>
      <CreateBlock uid={this.props.user.uid} pinIt={true} />
    </div>
    );
  }
}



