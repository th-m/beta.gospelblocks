import React from 'react';
import AppBar from 'material-ui/AppBar';
import Login from './Login';
import MainMenu from './MainMenu';
import {  Link } from 'react-router-dom';
import { listen } from '../helpers/database';
  
function handleClick(e) {
  console.log("Kicked")
}

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
  // componentWillReceiveProps(nextProps){
  //   //TODO ParentBlockId needs to relate to a parent not previous.
  //   // const path = 'blocks/'+ nextProps.match.params.blockId;
  //   console.log('header ',nextProps);
  //   // this.setState({parentBlockId: this.state.id});
  //   // listen(path).on("value", this.gotData, this.errData);
  //   // this.setState({id:nextProps.match.params.blockId});
  // }
  // componentDidMount(){
  //   // this.props.getCurrentBlock(this.props.match.params.blockId);
  //   if(this.state.id){
  //     console.log("hello buddy");
  //     const path = 'blocks/'+ this.state.id;
  //     listen(path).on("value", this.gotData, this.errData);
  //   }
  // 
  // }
  // 
  // componentWillReceiveProps(nextProps){
  //   //TODO ParentBlockId needs to relate to a parent not previous.
  //   const path = 'blocks/'+ nextProps.match.params.blockId;
  //   this.setState({parentBlockId: this.state.id});
  //   listen(path).on("value", this.gotData, this.errData);
  //   this.setState({id:nextProps.match.params.blockId});
  //   this.props.getCurrentBlock(nextProps.match.params.blockId);
  // }
  hideBarTitle = () => {
    console.log('hello');
    let blockData = this.state.blockData;
    // blockData.blockTitle = '';
    this.setState({ blockTitle: '' });
      // location.replace("https://www.w3schools.com")
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
            title={ <Link to='/'> <span onClick={handleClick} style={{cursor: 'pointer'}}>Gospel Blocks</span> </Link>}
            iconElementRight={(this.props.authed? <MainMenu /> : <Login />)}
            showMenuIconButton={false}
          />
        </div>
    );
  }
}