import React, { Component } from 'react';
// import * as firebase from 'firebase';
import FontAwesome  from 'react-fontawesome';
// import {Card, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import { createBlock, pinBlock, update, updateChildren, generateLongId, trashPin } from '../helpers/database'
import '../styles/App.css';

const defaultBlock = {
  title : "",
  description : "",
  permissions: "public"
}
 
export default class CRUDBlockDialog extends Component {
  constructor(props){
    super(props);

    if(props.parentBlockId)
      defaultBlock.parentBlockId = props.parentBlockId;
    // console.log("start the crud", props.parentBlockId, defaultBlock);
    this.state = {
      dialogOpen: false,
      blockData : (props.blockData ? props.blockData: Object.create(defaultBlock)),
      uid: this.props.uid,
      pinIt: (this.props.pinIt? true: false),
      isPinned: (this.props.isPinned? true: false),
      uniqueKey: generateLongId()
    };
    
    
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps.blockData) 
      this.setState({blockData:nextProps.blockData});
    if(nextProps.parentBlockId)
      defaultBlock.parentBlockId = nextProps.parentBlockId;
  }
  
  toggleDialog = () => {
    if(this.props.createNew){
      console.log("is createNew");
      this.setState({blockData:Object.create(defaultBlock)});
    }
    this.setState({dialogOpen: !this.state.dialogOpen});
    // NOTE Save to the database when dialog is closed
    if((this.state.dialogOpen && this.state.blockData.title) || (this.state.blockData.description && this.props.blockId)){
      const path = 'blocks/'+ this.props.blockId;
      update(path,this.state.blockData);  
    }else{
      this.setState({uniqueKey:generateLongId()});
    }
  };

  handleTextChange = (e) => {
      let blockData = this.state.blockData;
      blockData[e.target.id] = e.target.value;
      this.setState({blockData: blockData});
  }
  
  handleDropDownChange = (e, i, v) =>{
    let blockData = this.state.blockData;
    // This hack allows us to mack a generic function out of material-ui dropdownmenu
    blockData[e.target.parentElement.parentElement.parentElement.id] = v;
    this.setState({blockData:blockData});
  }
  
  addBlock = () => {
    let blockData = this.state.blockData;
    if(this.props.parentBlockId)
      blockData.parentBlockId = this.props.parentBlockId;
    createBlock(blockData)
    .then( x => {
        console.log("block created", this.state, this.props);
        if(this.props.pinIt) 
            pinBlock(this.state.uid , x);
        if(this.state.blockData.parentBlockId)
            updateChildren(this.state.blockData.parentBlockId, x)

        
        this.setState({dialogOpen: false}) 
      } 
    );    
  }
  
  // onDoubleClick
  doublClicked = () => {
    console.log("hello");
  }  
  
  trashBlock = () => {
    // remove()
    // console.log("trashed block");
    if(this.props.isPinned){
      console.log("this got clicked")
      trashPin(this.props.uid, this.state.blockData.id);
    }else{
      console.log("only allowed to delete pinned blocks");
    }
  }
  render() {

    return (
        <Dialog key={this.state.uniqueKey}
          actions={[<FlatButton label={(this.props.buttonText ? this.props.buttonText :'Add Block')} 
          primary={true}  
          onClick={this.addBlock} fullWidth={true} />]}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.toggleDialog}
        >
          <div>
              
            <FontAwesome
               // onDoubleClick={this.doublClicked}
               onClick={this.trashBlock}
               style={{float:'right'}}
               name='trash'
               size='lg'
             />
           </div>
                   
          <TextField
            id="title"
            onChange={this.handleTextChange}
            hintText="Add a title."
            floatingLabelText="Block Title"
            value={this.state.blockData.title}
            fullWidth={true}
          />
          
          <br />
          
          <TextField
            id="description"
            onChange={this.handleTextChange}
            hintText="Write a description."
            floatingLabelText="Block Description"
            value={this.state.blockData.description}
            multiLine={true}
            fullWidth={true}
          />
          
          <FontAwesome
             name='eye'
             size='2x'
           />
           
           <DropDownMenu value={this.state.permissions} menuStyle={{padding:0}} underlineStyle={{margin: '-1px 24px -1px 0px'}} onChange={this.handleDropDownChange}>
              <MenuItem id="permissions" value={'public'} primaryText="Public" />
              <MenuItem id="permissions" value={'group'} primaryText="Group" />
              <MenuItem id="permissions" value={'private'} primaryText="Private" />
            </DropDownMenu>
            
          <FontAwesome
             name='pencil'
             size='2x'
           />
           
          <DropDownMenu value={this.state.blockData.editors} menuStyle={{padding:0}} underlineStyle={{margin: '-1px 24px -1px 0px'}} onChange={this.handlePermissionChange}>
             <MenuItem value={'public'} primaryText="Public" />
             <MenuItem value={'group'} primaryText="Group" />
             <MenuItem value={'private'} primaryText="Private" />
           </DropDownMenu>
        
        </Dialog>
    );
  }
}
