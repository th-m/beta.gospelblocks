import React, { Component } from 'react';
import PinnedBlock from './PinnedBlock';
import CreateBlock from './CreateBlock';
// import {GridList, GridTile} from 'material-ui/GridList';
// import { login, resetPassword, userEmailProviders } from '../helpers/database.js'
import { listen } from '../helpers/database'
import '../styles/App.css';



export default class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      pinnedBlocks: []
    };
  }
  
  componentDidMount(){
    const path = 'users/'+ this.props.user.uid;
    listen(path).on("value", this.gotData, this.errData);
    this.props.hideBarTitle();
  }
  
  errData = (error) => {
    console.log("errData", error);
    
  }
  
  gotData = (data) => {
    if(data.val() && data.val().pinnedBlocks){
      let pinnedBlocks = Object.keys(data.val().pinnedBlocks).map(key => key); 
      this.setState({pinnedBlocks:pinnedBlocks});
    }else{
      this.setState({pinnedBlocks:[]});
    };
  }
  
  render() {
    return (
      <div className="dashboard_grid">
        {this.state.pinnedBlocks.map(pin => <PinnedBlock key={pin} blockId={pin} uid={this.props.user.uid}/> )}
        <CreateBlock uid={this.props.user.uid} pinIt={true} />
      </div>
    );
  }
}



