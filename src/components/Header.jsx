import React from 'react';
import AppBar from 'material-ui/AppBar';
import Login from './Login';
import MainMenu from './MainMenu';
import {  Link } from 'react-router-dom';
import { listen } from '../helpers/database';
  


export default class Header extends React.Component {
  constructor(){
    super();
    this.state = {
      authed: false,
      loading: false,
      user: '',
      id:'',
      blockData:'',
      blockTitle:''
    };
  }
  getCurrentBlock = (id) => {
    if(id){
      // console.log("getCurrentBlock", id);
      this.setState({id:id});
      const path = 'blocks/'+id;
      listen(path).on("value", this.gotData, this.errData);
    }else{
      this.setState({blockTitle:''});
    }
  }

  hideBarTitle = () => {
    let blockData = this.state.blockData;
    this.setState({ blockTitle: '' });
  }
  
  errData = (error) => {
    console.log("errData", error);
  }
  
  gotData = (data) => {
    const blockData = data.val();
    // console.log('This is the data in the header',blockData);
    this.setState({ blockData: blockData });
    this.setState({ blockTitle: blockData.title });
    if(blockData.parentBlockId){
      this.setState({ parentBlockId: (blockData.parentBlockId )});
    }else{
      this.setState({ parentBlockId: false});
    }
    
  }
  
  render() {
    return (
      <div style={{position:'relative'}}>
        {(this.state.parentBlockId?
            <Link to={'/block/'+this.state.parentBlockId}>  <h2 style={{position:'absolute', top:0, left: '28%', width:'40%', margin:10, zIndex:1200 }}>{this.state.blockTitle}</h2> </Link>
          : <Link to={'/'}>  <h2  style={{position:'absolute', top:0, left: '28%', width:'40%', margin:10, zIndex:1200 }}>{this.state.blockTitle}</h2> </Link>
        )}
        
        {/* <h1 style={{position:'absolute', top:0, left: '28%', width:'40%', margin:10, zIndex:1200 }}>{this.state.blockTitle}</h1> */}
        <AppBar
            style={{textAlign: 'left'}}
            // TODO: make BrandIcon component
            title={ <Link to='/'> <span style={{cursor: 'pointer'}}>Gospel Blocks</span> </Link>}
            iconElementRight={(this.props.authed? <MainMenu /> : <Login />)}
            showMenuIconButton={false}
          />
        </div>
    );
  }
}