import React, { Component } from 'react';
import FontAwesome  from 'react-fontawesome';
import CRUDBlockDialog from './CRUDBlockDialog'
import FloatingActionButton from 'material-ui/FloatingActionButton';
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
  
  render() {

    return (
       <FloatingActionButton
        className="pointer addBlock" 
        onClick={()=>this.refs.editBlockDialog.toggleDialog()} 
    
      >
        <FontAwesome name='plus' size='2x' style={{position:'relative',top:2}}/>
      
        <CRUDBlockDialog 
          ref="editBlockDialog"
          parentBlockId={this.state.parentBlockId} 
          pinIt={( this.props.pinIt ? true : false )} 
          uid={this.props.uid}
          createNew={true}
        />
      </FloatingActionButton>
    );
  }
}
