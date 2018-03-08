import React, { Component } from 'react';
// import * as firebase from 'firebase';
import FontAwesome  from 'react-fontawesome';
// import {Card, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import MultiSelect from './MultiSelect'

import { createBlock, pinBlock, update, updateChildren, generateLongId, trashPin } from '../helpers/database'
import '../styles/App.css';

const defaultBlock = {
  title : "",
  description : "",
  viewers: 2,
  editors: 2
}
 
export default class CRUDBlockDialog extends Component {
  constructor(props){
    super(props);
    if(props.parentBlockId)
      defaultBlock.parentBlockId = props.parentBlockId;

    this.state = {
      dialogOpen: false,
      blockData : (props.blockData ? props.blockData: Object.create(defaultBlock)),
      uid: this.props.uid,
      pinIt: (this.props.pinIt? true: false),
      viewers: (props.blockData && props.blockData.viewers ? props.blockData.viewers: 1),
      viewersList: [], // default option 1 = public
      editors: (props.blockData && props.blockData.editors ? props.blockData.editors: 1), // default option 1 = public
      editorsList: [],
      isPinned: (this.props.isPinned? true: false),
      uniqueKey: generateLongId()
    };
    
    let blockData = this.state.blockData;
    blockData.viewers = this.state.viewers;
    blockData.editors = this.state.editors;
    this.state.blockData = blockData;
    
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

  handleMultiSelect = (data) => {
    this.setState(data);
    console.log(this.state);
  }
  
  trashBlock = () => {
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
        
           <DropDownMenu value={this.state.blockData.viewers} menuStyle={{padding:0}} underlineStyle={{margin: '-1px 24px -1px 0px'}} onChange={this.handleDropDownChange}>
              <MenuItem id="viewers" value={1} primaryText="Public" />
              <MenuItem id="viewers" value={2} primaryText="Group" />
              <MenuItem id="viewers" value={3} primaryText="Private" />
            </DropDownMenu>
            
            {(this.state.blockData.viewers == 2)? <MultiSelect name="viewersList" handleData={this.handleMultiSelect} /> : null}
            <br />
          <FontAwesome
             name='pencil'
             size='2x'
           />
           
          <DropDownMenu value={this.state.blockData.editors} menuStyle={{padding:0}} underlineStyle={{margin: '-1px 24px -1px 0px'}} onChange={this.handleDropDownChange}>
             <MenuItem id="editors" value={1} primaryText="Public" />
             <MenuItem id="editors" value={2} primaryText="Group" />
             <MenuItem id="editors" value={3} primaryText="Private" />
           </DropDownMenu>
           
           {(this.state.blockData.editors == 2)? <MultiSelect name="editorsList" handleData={this.handleMultiSelect} /> : null}
        
        </Dialog>
    );
  }
}
