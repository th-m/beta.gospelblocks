import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import { listen, addBit } from '../helpers/database';

const style = {
  height: '100%',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
};


export default class Compendium extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: this.props.blockId,
      bits: []
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
    // console.log(blockData.bits);
    if(blockData.bits){
      this.setState({bits:blockData.bits});
    }else{
      this.setState({bits:[]});
    }
    this.state.bits.forEach((x,i)=>console.log(x.title));
  }
  
  handleOnDrop = (e) => {
    let data = JSON.parse(e.dataTransfer.getData("verseData"));
    e.target.removeAttribute("style");
    
    addBit(this.state.id, data)
    .then( x => { 
      console.log(x);
      if(x && x.bits){
        this.setState({bits:x.bits}) 
      }
    });
  }
  
  handleDragOver = (e) => {
    e.preventDefault();
    e.target.setAttribute("style", "border-bottom:1px solid blue;")
  }
  
  render() {
    return (
       <Paper style={style} zDepth={1} rounded={false}>
         <Tabs>
             <Tab  label="Compendium"  />)
         </Tabs>
         <div onDrop={this.handleOnDrop} onDragOver={this.handleDragOver} data-order="0">
           drag here
         </div> 
          {this.state.bits.map((x, i) => {
            return(
              <div>
                <Paper >
                  <h3>{x.title}</h3>
                  <p>{x.text}</p>
                </Paper>
                <div onDrop={this.handleOnDrop} onDragOver={this.handleDragOver} data-order={i}>
                  drag here
                </div>
              </div>
            )
          })
        }
       </Paper>
    );
  }
}


