import React, { Component, Fragment } from 'react';
import AppBar from 'material-ui/AppBar';
import Login from './Login';
import MainMenu from './MainMenu';
import {  Link } from 'react-router-dom';
import { listen } from '../helpers/database';
import {Context, DataStore} from '../Context'

export default class Header extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      authed: false,
      loading: false,
      user: '',
      blockData:'',
      link:'/'
    };
    // console.log(props);
  }
  
  componentWillReceiveProps(nextProps){
    this.getCurrentBlock(nextProps.match.params.blockId);
  }
  
  componentDidMount(){
      this.getCurrentBlock(this.props.match.params.blockId);
    // check permissions and render or push somewhere elese
  }
  
  getCurrentBlock = (id) => {
    
    if(id){
      const path = 'blocks/'+id;
      listen(path).on("value", this.gotData, this.errData);
    }else{
      this.setState({blockData:''});
    }
    
  }
  
  errData = (error) => {
    console.log("errData", error);
  }
  
  gotData = (data) => {
    const blockData = data.val();
    this.setState({ blockData: blockData });
    
    if(blockData && blockData.parentBlockId){
      this.setState({link:'/block/'+blockData.parentBlockId});
    }else{
      this.setState({link:'/'});
    }
  }
    
  redirect = () => {
    this.props.history.push(this.state.link);
  }
  
  updateCompendium = () => {
     this.props.updateCompendium(this.state.blockData.id);
  }
  
  render() {
    return (
      <Context>
        <DataStore.Consumer>
          {context => (
            <Fragment>
              <div style={{position:'relative'}}>
                  <div  onDoubleClick={this.redirect}  onClick={this.updateCompendium}>
                     <h2 style={{position:'absolute', top:0, left: '28%', width:'40%', margin:10, zIndex:1200, textAlign:'center' }}>{this.state.blockData.title}</h2> 
                  </div>
                <AppBar
                    style={{textAlign: 'left'}}
                    // TODO: make BrandIcon component
                    title={ <Link to='/'> <span style={{cursor: 'pointer'}}>Gospel Blocks</span> </Link>}
                    iconElementRight={(this.props.authed? <MainMenu /> : <Login />)}
                    showMenuIconButton={false}
                  />
                </div>
              </Fragment>
            )}
          </DataStore.Consumer>  
        </Context>
        
    );
  }
  
}

// {(this.state.blockData.parentBlockId?
//   <div  onDoubleClick={this.redirect}  onClick={this.updateCompendium}>
//     {/* <Link to={'/block/'+this.state.blockData.parentBlockId}>  <h2 style={{position:'absolute', top:0, left: '28%', width:'40%', margin:10, zIndex:1200, textAlign:'center' }}>{this.state.blockData.title}</h2> </Link> */}
//      <h2 style={{position:'absolute', top:0, left: '28%', width:'40%', margin:10, zIndex:1200, textAlign:'center' }}>{this.state.blockData.title}</h2> 
//    </div>
//   : <Link to={'/'}>  <h2  style={{position:'absolute', top:0, left: '28%', width:'40%', margin:10, zIndex:1200,  textAlign:'center' }}>{this.state.blockData.title}</h2> </Link>
// )}