import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Markdown from 'react-remarkable';
import {  update } from '../helpers/database';
import FontAwesome  from 'react-fontawesome';
import { deleteBit } from '../helpers/database';

export default class extends Component {
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      text: this.props.text,
    };
    // console.log(props);
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
    if(this.state.editMode){
      console.log(`blocks/${this.props.blockId}/bits/${this.props.keyIndex}/text`, this.state.text);
      update(`blocks/${this.props.blockId}/bits/${this.props.keyIndex}/text`, this.state.text )
    }
    this.setState({editMode:!this.state.editMode});
    
  }
  deleteBit = () => {
    // console.log(this.props);
    this.setState({editMode:!this.state.editMode});
    deleteBit(this.props.blockId, this.props.keyIndex);
  }
  handleTextChange = (e) => {
    this.setState({text: e.target.value});
  }
  
  render(){
    return (
      <span onDoubleClick={this.handleDoubleClick} onTouchStart={this.handleButtonPress} onTouchEnd={this.handleButtonRelease} onMouseDown={this.handleButtonPress} onMouseUp={this.handleButtonRelease}>
        {(this.props.type.includes('verse') || this.props.type.includes('searchVerse') ? <i>{this.props.title}</i>: null) }
        {(!this.state.editMode ?
          <Markdown>{this.state.text}</Markdown> :
          <span className="editText" >
            <span className="saveBit" >
              <FontAwesome name='pencil' onClick={this.handleNoteSave} />
            </span>
            <span className="deleteBit" >
              <FontAwesome name='times-circle' onClick={this.deleteBit} />
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