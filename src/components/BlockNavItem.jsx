import React, { Component, Fragment } from 'react';
import { listen, checkWrite, checkRead } from '../helpers/database';
import CRUDBlockDialog from './CRUDBlockDialog';
import FontAwesome  from 'react-fontawesome';
import { firebaseAuth } from '../config/constants';
// import {Context, DataStore} from '../Context'
// import {  Link } from 'react-router-dom';

import { Card } from 'material-ui/Card';

import { SortableHandle } from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <span className="drag_handle" style={{position:"relative", right:10, opacity:.5}}>::</span>);

export default class Block extends Component {
  constructor(props){
    super(props);
    this.state = {
      editDialogOpen: false,
      blockTitle: "",
      blockData: "",
      blockId: this.props.blockId,
      writePerms:false,
      readPerms:false,
    };
    console.log(props);
  }
  
  componentDidMount(){
    const path = 'blocks/'+ this.props.blockId;
    listen(path).on("value", this.gotData, this.errData);
  }
  
  componentWillReceiveProps(nextProps){
    const path = 'blocks/'+ nextProps.blockId;
    this.setState({blockId:nextProps.blockId});
    
    
    listen(path).on("value", this.gotData, this.errData);
  }
  
  componentDidMount () {
    firebaseAuth().onAuthStateChanged((user) => {
      checkWrite(this.state.blockId, user.uid).then(x => {
        this.setState({ writePerms:  x });
      });
      checkRead(this.state.blockId, user.uid).then(x => {
        this.setState({ readPerms:  x });
      });
    })
  }
  
  errData = (error) => {
    console.log("errData", error);
  }
  
  gotData = (data) => {
    if(data.val()){
      this.setState({blockTitle:data.val().title});
      this.setState({blockData:data.val()});
    }
  }
  
  updateCompendium = (e) => {
    this.props.updateCompendium(this.props.blockId);
  }
  
  redirect = () => {
    this.props.redirect('/block/'+this.props.blockId);
  }
  
  render(){
    return (
      <Fragment>
        {(this.state.readPerms ?
          <div  onDoubleClick={this.redirect}  onClick={this.updateCompendium}>
            <Card className="pointer nav_item" >
                <h3>
                  {(this.state.writePerms? <DragHandle /> : null)}
                  <span style={{position:'relative', top:'1px'}}>{this.state.blockTitle}</span>
                  {(this.state.writePerms?   
                    <FontAwesome
                       name='ellipsis-v'
                       style={{float:'right', position:'relative', left:15, top:5, padding:'0 10px 0 0px'}}
                       onClick={()=>this.refs.editBlockDialog.toggleDialog()}
                     /> : null)}
                
                 </h3>
            </Card>
            <CRUDBlockDialog
              ref="editBlockDialog" 
              blockId={this.props.blockId} 
              blockData={this.state.blockData} 
              pinIt={this.props.pinIt}
              uid={this.props.uid}
              buttonText="Update"
              isPinned={true}
            />
          </div> :
          null )}
        </Fragment>
    );
  }
}
