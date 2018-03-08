import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import { listen, addBit } from '../helpers/database';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FontAwesome  from 'react-fontawesome';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Markdown from 'react-remarkable';

const style = {
  height: '74vh',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
};


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
  }
  
  componentDidMount(){
    const path = 'blocks/'+ this.state.id;
    listen(path).on("value", this.gotData, this.errData);
  }
  
  componentWillReceiveProps(nextProps){
    const path = 'blocks/'+ nextProps.blockId;
    listen(path).on("value", this.gotData, this.errData);
    this.setState({id:nextProps.blockId});
  }
  
  errData = (error) => {
    console.log("errData", error);
  }
  
  gotData = (data) => {
    const blockData = data.val();
    console.log(blockData);
    
    this.setState({title: blockData.title});
    
    if(blockData.bits){
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
      // console.log(x);
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
    console.log(e.target.value);
      // let blockData = this.state.blockData;
      // blockData[e.target.id] = e.target.value;
      this.setState({[e.target.id]: e.target.value});
  }
  
  handleDragOver = (e) => {
    e.preventDefault();
  }
  
  render() {
    return (
       <Paper style={style} zDepth={1} rounded={false}>
         <Tabs>
             <Tab  label={this.state.title}  />)
         </Tabs>
         <div className="compendiumWindow">
           <div className="drop_zone" onDrop={this.handleOnDrop} onDragOver={this.handleDragOver} data-order="0">
             &nbsp;
           </div> 
            {this.state.bits.map((x, i) => {
              return(
                <div>
                  <Paper >
                  { 
                    ((x.type == "verse"))
                    ? <span><h3>{x.title}</h3><p>{x.text}</p></span>
                    :<Markdown>{x.text}</Markdown>
                  }
                  </Paper>
                  <div className="drop_zone" onDrop={this.handleOnDrop} onDragOver={this.handleDragOver} data-order={i}>
                    &nbsp;
                  </div>
                </div>
              )
            })
          }
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


