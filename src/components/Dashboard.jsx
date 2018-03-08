import React, { Component } from 'react';
import PinnedBlock from './PinnedBlock';
import CreateBlock from './CreateBlock';
import { listen } from '../helpers/database'
import '../styles/App.css';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';


// class SortableComponent extends Component {
// 
//   render() {
//     return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
//   }
// }

const SortableItem = SortableElement(({value}) => {
  return (
    <li>
      <PinnedBlock key={value.pin} blockId={value.pin} uid={value.uid}/>
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

export default class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      pinnedBlocks: [],
      list:[],
    };
  }
  
  componentDidMount(){
    const path = 'users/'+ this.props.user.uid;
    listen(path).on("value", this.gotData, this.errData);
    this.props.hideBarTitle();
  }
  
  errData = (error) => {
    console.log("errData", error);
    
  }
  
  onSort = (sortedList, dropEvent) => {
    console.log("sortedList", sortedList, dropEvent);
  }

  formatDraggableList = (pins) => {
    let list = pins.map(pin => {return { pin:pin, uid:this.props.user.uid, value:pin, index: pin} });
    this.setState({list});
  }
  
  gotData = (data) => {
    if(data.val() && data.val().pinnedBlocks){
      let pinnedBlocks = Object.keys(data.val().pinnedBlocks).map(key => key); 
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
  };
  
  render() {
    return (
      <div className="dashboard_container">
        <div className="dashboard_grid">
          <SortableList items={this.state.list} axis="xy" onSortEnd={this.onSortEnd} />
        </div>
      <CreateBlock uid={this.props.user.uid} pinIt={true} />
    </div>
    );
  }
}



