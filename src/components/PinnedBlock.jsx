import React, { Component } from 'react';
import {  Link } from 'react-router-dom';

import { listen } from '../helpers/database'

import FontAwesome  from 'react-fontawesome';
import CRUDBlockDialog from './CRUDBlockDialog'

import {Card, CardActions, CardHeader, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


export default class PinnedBlock extends Component {
  constructor(props){
    super(props);
    this.state = {
      blockData: {}
    };
  }
  
  componentDidMount(){
    const path = 'blocks/'+ this.props.blockId;
    listen(path).on("value", this.gotData, this.errData);
  }
  
  errData = (error) => {
    console.log("errData", error);
  }
  
  gotData = (data) => {
    this.setState({blockData:data.val()});
  }
      
  render(){
    return (
      <Card >
        <CardHeader>
            <FontAwesome
              style={{float:'left'}}
              name='share-alt'
              size='2x'
            />
            <FontAwesome
               name='ellipsis-v'
               size='2x'
               style={{float:'right'}}
               onClick={()=>this.refs.editBlockDialog.toggleDialog()}
             />
        </CardHeader>
        
        {/* {
          (this.state.blockData.coverImg ?  
            <CardMedia overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}>
              <img src="images/nature-600-337.jpg" alt="" />
            </CardMedia>
          : null )
        } */}
      
        <CardTitle title={this.state.blockData.title} subtitle={this.state.blockData.description} />
        
        <CardActions>
           <Link to={'/block/'+this.props.blockId}>
            <FlatButton label="Open" primary={true} fullWidth={true}/>
          </Link>
        </CardActions>
        
        <CRUDBlockDialog
          ref="editBlockDialog" 
          blockId={this.props.blockId} 
          blockData={this.state.blockData} 
          pinIt={this.props.pinIt}
          uid={this.props.uid}
          buttonText="Update"
          isPinned={true}
        />
      </Card>
      
    );
  }
}
