import React, { Component, Fragment } from 'react';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import { listen, addBit, update } from '../helpers/database';
// import { listen, addBit, update, reduceList, validateYouTubeUrl } from '../helpers/database';
// import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FontAwesome  from 'react-fontawesome';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Markdown from 'react-remarkable';

import Bit from './Bit'
// import Verse from './Verse'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

// const style = {
//   height: '74vh',
//   width: '100%',
//   textAlign: 'center',
//   display: 'inline-block',
// };

const DragHandle = SortableHandle(() =>  <span className="drag_handle">::</span>);

const SortableItem = SortableElement(({blockId, value}) => {
  // console.log(value);
  // console.log(blockId);
  let content = "";
  switch (value.type) {
    case "verse":
    case "searchVerse":
      // content = <div> <i>{value.title}</i><span>{value.text}</span> <DragHandle /></div>;
      // break;
    case "note":
      content = <Fragment> <Bit keyIndex={value.key} blockId={blockId} {...value} /> <DragHandle /></Fragment>
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
  // console.log(props);
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
      keysPressed:{}
    };
    // console.log(props);
  }
  
  componentDidMount(){
    
    // const path = 'blocks/'+ this.props.blockId +'/bits';
    listen('blocks/'+ this.props.blockId +'/bits').on("value", this.gotData, this.errData);
    listen('blocks/'+ this.props.blockId +'/title').once("value", this.gotBlockTitle, this.errData);
  }
  
  componentWillReceiveProps(nextProps){
    // console.log("compendium" ,nextProps);
    // const oldpath = 'blocks/'+ this.props.blockId +'/bits';
    listen('blocks/'+ this.props.blockId +'/bits').off();
    // const path = 'blocks/'+ nextProps.blockId+'/bits';
    listen('blocks/'+ nextProps.blockId+'/bits').on("value", this.gotData, this.errData);
    listen('blocks/'+ nextProps.blockId +'/title' ).once("value", this.gotBlockTitle, this.errData);
    
    this.setState({id:nextProps.blockId});
  }
  
  
// accepted
// Multiple keystroke detection is easy if you understand the concept
// 
// The way I do it is like this:

// var map = {}; // You could also use an array
// onkeydown = onkeyup = function(e){
//     e = e || event; // to deal with IE
//     map[e.keyCode] = e.type == 'keydown';
//     /* insert conditional here */
// }
// 
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
    // console.log(e)
    e.stopPropagation();
    // console.log('this happened');
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
               <SortableList items={this.state.bits} blockId={this.props.blockId} axis="y" onSortEnd={this.onSortEnd} useDragHandle={true} /> 
               <div className="defaultDragArea" onDrop={this.handleOnDrop} onDragOver={this.handleDragOver} data-order={(this.state.bits ? this.state.bits.length-1 : 0)}></div>
          </div> 
          <div>
            <Toolbar>
              {/* <ToolbarGroup>
                <FontAwesome
                  name='edit'
                  size='2x'
                  onClick={this.toggleDialog}
                />
                <Dialog
                  actions={[<FlatButton label='save' primary={true} onClick={this.saveNote} fullWidth={true} />]}
                  modal={false}
                  open={this.state.dialogOpen}
                  onRequestClose={this.toggleDialog}
                  >
                    {(this.state.notePreview 
                      ?<FontAwesome
                        name='eye-slash'
                        size='2x'
                        onClick={this.togglePreview}
                      />
                      :<FontAwesome
                        name='eye'
                        size='2x'
                        onClick={this.togglePreview}
                      />
                    )}
                    
                    {(!this.state.notePreview 
                      ?<TextField
                        id="note"
                        onChange={this.handleTextChange}
                        hintText="Write something profound"
                        floatingLabelText="New Note"
                        value={this.state.note}
                        multiLine={true}
                        fullWidth={true}
                      />
                      
                      :<Markdown>
                        {this.state.note}
                      </Markdown>
                    )}
                    
                  </Dialog>
                </ToolbarGroup> */}
              
                   {/* <ToolbarGroup>
                     <FontAwesome
                        name='search'
                        size='2x'
                        onClick={this.handleSearch}
                      />
                      
                   </ToolbarGroup> */}
                   <TextField
                     id="note"
                     onChange={this.handleTextChange}
                     hintText="Write something profound"
                     onKeyDown={this.handleKeyDown}
                     onKeyUp={this.handleKeyUp}
                     value={this.state.note}
                     multiLine={true}
                     fullWidth={true}
                   />
                   {/* TODO I need to create a textfield component that can be used to render the value with markup real time. */}
                 {/* </TextField> */}
                 {/* <Markdown>{this.state.note}</Markdown>  */}
              </Toolbar>
            </div> 
          </div>
       </Paper>
    );
  }
}


