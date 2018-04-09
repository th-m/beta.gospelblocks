import React, { Component, Fragment } from 'react';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import { listen, addBit, update, reduceList, validateYouTubeUrl } from '../helpers/database';
// import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FontAwesome  from 'react-fontawesome';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Markdown from 'react-remarkable';

import Bit from './Bit'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

const style = {
  height: '74vh',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
};

const DragHandle = SortableHandle(() => <span>::</span>);

const SortableItem = SortableElement(({value}) => {
  // console.log(value);
  let content = "";
  switch (value.type) {
    case "verse":
      content = <Fragment> <DragHandle /><h3>{value.title}</h3><p>{value.text}</p></Fragment>;
      break;
    case "note":
      content = <Fragment> <DragHandle /> <Bit keyIndex={value.key} {...value} /></Fragment>
      break;
    default:
  }
  
  return (
    <div className="bit" data-key={value.key}>
      <Paper>
        {content}
      </Paper>
    </div>
  );
  
});

const SortableList = SortableContainer(({items}) => {
  
  items.map((value, index) =>  {
    value.key = index;
    return value;
  });
  
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem key={`bit-${index}`} index={index} value={value} />
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
      title: 'Compendium',
      dialogOpen: false,
      notePreview: false,
      note: '',
    };
    // console.log(props);
  }
  
  componentDidMount(){
    const path = 'blocks/'+ this.state.id;
    listen(path).on("value", this.gotData, this.errData);
  }
  
  componentWillReceiveProps(nextProps){
    // console.log("compendium" ,nextProps);
    const path = 'blocks/'+ nextProps.blockId;
    listen(path).on("value", this.gotData, this.errData);
    this.setState({id:nextProps.blockId});
  }
  
  errData = (error) => {
    console.log("errData", error);
  }
  
  gotData = (data) => {
    const blockData = data.val();
    
    if(!blockData)
      return false;
    
    this.setState({title: blockData.title});
    
      
    if(blockData.bits){
      let bits = blockData.bits.map(x => {
        x.uid = this.props.uid
        x.blockId = this.props.blockId
        return x;
      });
      // console.log(bits);
      this.setState({bits:blockData.bits});
    }else{
      this.setState({bits:[]});
    }
  }
  
  handleOnDrop = (e) => {
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
       <Paper style={style} zDepth={1} rounded={false}>
         <Tabs>
             <Tab  label={this.state.title}  />)
         </Tabs>
         <div className="compendiumWindow">
           {
             (this.state.bits.length < 1 ?
               <div className="drop_zone" onDrop={this.handleOnDrop} onDragOver={this.handleDragOver} data-order="0">
                 &nbsp;
               </div>
               :null
             )
           }
             <SortableList items={this.state.bits} axis="y" onSortEnd={this.onSortEnd} useDragHandle={true} /> 
          
        </div> 
        <Toolbar>
           <ToolbarGroup>
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
           </ToolbarGroup>
        </Toolbar>
       </Paper>
    );
  }
}


