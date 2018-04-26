import React, { Component, Fragment } from 'react';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import { listen, addBit, update, checkWrite, checkRead } from '../helpers/database';
// import { listen, addBit, update, reduceList, validateYouTubeUrl } from '../helpers/database';
// import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FontAwesome  from 'react-fontawesome';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Markdown from 'react-remarkable';
import { firebaseAuth } from '../config/constants';

import Bit from './Bit'
// import Verse from './Verse'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() =>  <span className="drag_handle">::</span>);

const SortableItem = SortableElement(({blockId, value}) => {
  let content = "";
  // NOTE we may want to explore different components with these different options
  switch (value.type) {
    case "verse":
    case "searchVerse":
    case "note":
      content = <Fragment>  <Bit keyIndex={value.key} blockId={blockId} {...value} /> </Fragment>
      break;
    default:
  }
  
  return (
    <div className="Bit" data-key={value.key}>
      <Paper >
        {content}
      </Paper>
    </div>
  );
  
});

const SortableList = SortableContainer( (props) => {
  props.items.map((value, index) =>  {
    value.key = index;
    return value;
  });
  // 
  return (
    <div>
      {props.items.map((value, index) => (
        <SortableItem key={`bit-${index}`} blockId={props.blockId} index={index} value={value} />
      ))}
    </div>
  );
  
});

export default class Compendium extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: this.props.blockId,
      bits: [],
      title: (this.props.compendiumTitle? this.props.compendiumTitle : 'Compendium'),
      dialogOpen: false,
      notePreview: false,
      note: '',
      keysPressed:{},
      writePerms: false,
      readPerms: false,
    };
  }
  
  componentDidMount(){
    listen('blocks/'+ this.props.blockId +'/bits').on("value", this.gotData, this.errData);
    listen('blocks/'+ this.props.blockId +'/title').once("value", this.gotBlockTitle, this.errData);
    firebaseAuth().onAuthStateChanged((user) => {
      checkWrite(this.state.id, user.uid).then(x => {
        this.setState({ writePerms:  x });
      });
      checkRead(this.state.id, user.uid).then(x => {
        this.setState({ readPerms:  x });
      });
    });
    
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({id: nextProps.blockId});
    listen('blocks/'+ this.props.blockId +'/bits').off();
    listen('blocks/'+ nextProps.blockId+'/bits').on("value", this.gotData, this.errData);
    listen('blocks/'+ nextProps.blockId +'/title' ).once("value", this.gotBlockTitle, this.errData);
    
    this.setState({id:nextProps.blockId});
  }
  
  
  handleKeyUp = (e) => {
    let keysPressed = this.state.keysPressed;
    keysPressed[e.key] = false;
    this.setState({keysPressed});
  }
  handleKeyDown = (e) => {
    let keysPressed = this.state.keysPressed;
    keysPressed[e.key] = true;
    
    if(keysPressed["Enter"] && keysPressed["Shift"]){
      console.log("We just want to enter");
    }else if (keysPressed["Enter"]) {
      
      if(this.state.note !== ""){
        this.saveNote();
      }
      
      setTimeout(() => {
        this.setState({note:""});
      }, 300);
      
    }
    
    this.setState({keysPressed});
  }
  
  errData = (error) => {
    console.log("errData", error);
  }
  
  gotData = (data) => {
    const bits = data.val();
    this.setState({bits: ( bits ? bits : [] ) });
  }
  
  gotBlockTitle = (data) => {
    const title = data.val();
    this.setState({title: ( title ? title : "Compendium" ) });
  }
  
  
  handleOnDrop = (e) => {
    e.stopPropagation();
    let data = JSON.parse(e.dataTransfer.getData("verseData"));
    e.target.removeAttribute("style");
    
    addBit(this.state.id, data)
    .then( x => { 
      if(x && x.bits){
        this.setState({bits:x.bits}) 
      }
    });
  }
  
  toggleDialog = () => {
    this.setState({dialogOpen:!this.state.dialogOpen});
  }
  togglePreview = () => {
    this.setState({notePreview:!this.state.notePreview});
  }
  saveNote = () => {
    let data = {type:'note', text:this.state.note};
    
    addBit(this.state.id, data)
    .then( x => { 
      if(x && x.bits){
        this.setState({bits:x.bits}) 
      }
    });
    this.setState({note:""}) 
  }
  
  handleTextChange =  (e) => {
      this.setState({[e.target.id]: e.target.value});
  }
  
  handleDragOver = (e) => {
    e.preventDefault();
  }
  
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      bits: arrayMove(this.state.bits, oldIndex, newIndex),
    });
    
    const path = 'blocks/'+ this.state.id +'/bits';
    update(path,this.state.bits);
    
  };
  
  render() {
    return (
        
       <Paper  zDepth={1}>
         <div className="Compendium">
           <div>
             <Tabs>
                 <Tab  label={this.state.title}  />)
             </Tabs>
           </div>
           <div className="compendiumWindow">
             {( this.state.readPerms?
                 <Fragment>
                   <SortableList items={this.state.bits} blockId={this.props.blockId} axis="y" onSortEnd={this.onSortEnd} useDragHandle={true} /> 
                   <div className="defaultDragArea" onDrop={this.handleOnDrop} onDragOver={this.handleDragOver} data-order={(this.state.bits ? this.state.bits.length-1 : 0)}></div>
                 </Fragment>:
                 null
             )}
          </div> 
          <div>
            <Toolbar>
               {( this.state.writePerms?
                   <TextField
                     id="note"
                     onChange={this.handleTextChange}
                     hintText="Write something profound"
                     onKeyDown={this.handleKeyDown}
                     onKeyUp={this.handleKeyUp}
                     value={this.state.note}
                     multiLine={true}
                     fullWidth={true}
                   />: null )}
              </Toolbar>
            </div> 
          </div>
       </Paper>
       
    );
  }
}


