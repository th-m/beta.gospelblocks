import React, { Component, Fragment } from 'react';
import TextField from 'material-ui/TextField';
import Markdown from 'react-remarkable';
import {  update } from '../helpers/database';


export default class extends Component {
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      text: this.props.text,
    };
    console.log(props);
  }
  
  handleButtonPress = () => {
    this.buttonPressTimer = setTimeout(() => {
      this.handleNoteSave();
    }, 1000);
  }

  handleButtonRelease = () => {
    clearTimeout(this.buttonPressTimer);
  }
  
  handleDoubleClick = () => {
    console.log('double click');
    this.handleNoteSave();
  }
  
  handleNoteSave = () => {
    if(this.state.editMode){
      update(`blocks/${this.props.blockId}/bits/${this.props.keyIndex}/text`, this.state.text )
    }
    this.setState({editMode:!this.state.editMode});
    
  }
  
  handleTextChange = (e) => {
    this.setState({text: e.target.value});
  }
  
  render(){
    return (
      <span onDoubleClick={this.handleDoubleClick} onTouchStart={this.handleButtonPress} onTouchEnd={this.handleButtonRelease} onMouseDown={this.handleButtonPress} onMouseUp={this.handleButtonRelease}>
        {(!this.state.editMode ?
          <Markdown>{this.props.text}</Markdown> :
          <span onDoubleClick={this.handleDoubleClick}>
            <TextField
              onChange={this.handleTextChange}
              hintText="Write something profound"
              value={this.state.text}
              multiLine={true}
              fullWidth={true}
            />
          </span>
        )}
      </span>
    )
  }
  
}