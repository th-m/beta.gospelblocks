import React, { Component } from 'react';
// import * as firebase from 'firebase';
import FontAwesome  from 'react-fontawesome';
import {Card, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
// import Dialog from 'material-ui/Dialog';
// import TextField from 'material-ui/TextField';
import CRUDBlockDialog from './CRUDBlockDialog'

// import DropDownMenu from 'material-ui/DropDownMenu';
// import MenuItem from 'material-ui/MenuItem';

// import { createBlock, pinBlock } from '../helpers/database'
import '../styles/App.css';


export default class CreateBlock extends Component {
  constructor(props){
    // console.log(props);
    super(props);
    this.state ={
      parentBlockId : props.parentBlockId
    }
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({parentBlockId: nextProps.parentBlockId})
  }
  // componentWillUpdate(){
  //   this.setState({parentBlockId: this.props.parentBlockId})
  // }
  // 
  render() {

    return (
      <Card 
        className="pointer" 
        onClick={()=>this.refs.editBlockDialog.toggleDialog()} 
        style={{display:'flex',justifyContent:'center',alignItems:'center'}}
      >
        <CardActions>
            <FlatButton  primary={true}  style={{height:44}} hoverColor="rgba(0, 0, 0, 0)" fullWidth={true}>
              <FontAwesome name='plus' size='3x' />
            </FlatButton>
        </CardActions>
        <CRUDBlockDialog 
          ref="editBlockDialog"
          parentBlockId={this.state.parentBlockId} 
          pinIt={( this.props.pinIt ? true : false )} 
          uid={this.props.uid}
          createNew={true}
        />
      </Card>
    );
  }
}
