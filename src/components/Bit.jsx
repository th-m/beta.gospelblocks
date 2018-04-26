import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Markdown from 'react-remarkable';
import {  update, checkWrite } from '../helpers/database';
import FontAwesome  from 'react-fontawesome';
import { deleteBit } from '../helpers/database';
import { SortableHandle } from 'react-sortable-hoc';
import { firebaseAuth } from '../config/constants';

const DragHandle = SortableHandle(() =>  <span className="drag_handle">::</span>);

export default class extends Component {
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      blockId:this.props.blockId,
      text: this.props.text,
      writePerms: false,
    };
    console.log(props);
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({text:nextProps.text});
  }
  handleButtonPress = () => {
    this.buttonPressTimer = setTimeout(() => {
      this.handleNoteSave();
    }, 750);
  }

  handleButtonRelease = () => {
    clearTimeout(this.buttonPressTimer);
  }
  
  handleDoubleClick = () => {
    console.log('double click');
    this.handleNoteSave();
  }
  
  handleNoteSave = () => {
    if(this.state.writePerms){
      
      if(this.state.editMode){
        console.log(`blocks/${this.props.blockId}/bits/${this.props.keyIndex}/text`, this.state.text);
        update(`blocks/${this.props.blockId}/bits/${this.props.keyIndex}/text`, this.state.text )
      }
      this.setState({editMode:!this.state.editMode});
    }
    
  }
  deleteBit = () => {
    // console.log(this.props);
    this.setState({editMode:!this.state.editMode});
    deleteBit(this.props.blockId, this.props.keyIndex);
  }
  handleTextChange = (e) => {
    this.setState({text: e.target.value});
  }
  
  componentDidMount(){
    firebaseAuth().onAuthStateChanged((user) => {
      checkWrite(this.state.blockId, user.uid).then(x => {
        this.setState({ writePerms:  x });
      });
    
    });
    
  }
  render(){
    let displayText = "<span class='dragSpace'>&nbsp;</span>";

    if (this.props.type.includes('verse') || this.props.type.includes('searchVerse'))
      displayText += "<i>"+this.props.title+"</i>";
      
    if (this.state.text.substring(1, 2).match(/^(#|\*|\|)$/))
      displayText += '\n';
    
    displayText += this.state.text;
    
    
    return (
      <span onDoubleClick={this.handleDoubleClick} onTouchStart={this.handleButtonPress} onTouchEnd={this.handleButtonRelease} >
        {(this.state.writePerms? <DragHandle /> : null)}
        {(!this.state.editMode ?
          <Markdown options={{html: true, linkify: true, typographer: true}}>
             {displayText}
           </Markdown> :
          <span className="editText" >
            <span className="saveBit" >
              <FontAwesome name='times-circle' onClick={this.handleNoteSave} />
            </span>
            <span className="deleteBit" >
              <FontAwesome name='trash' onClick={this.deleteBit} />
            </span>
            <TextField
              onChange={this.handleTextChange}
              hintText="Write something profound"
              value={this.state.text}
              style={{opacity:.7}}
              multiLine={true}
              fullWidth={true}
            />
          </span>
        )}
      </span>
    )
  }
  
}