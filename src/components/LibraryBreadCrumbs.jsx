import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

function handleActive(tab) {
  console.log(`A tab with this route property ${tab.props['data-route']} was activated.`);
}


export default class LibraryBreadCrumbs extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab: 0,
      tabs:{'0':'Library'}
    };
  }

  componentDidMount(){
    setTimeout(()=>{
            console.log("timeout this", this);
            console.log("timeout this tab_1",   this.tab_1);
            this.setState({tabs:{'0':'Library', '1':'Old Testament'}});
            this.setState({selectedTab:1});
            this.tab_1.handleClick();
            
    }, 2000);
  }
  
  errData = (error) => {
    console.log("errData", error);
    
  }
  
  render() {
    return (
      <Tabs initialSelectedIndex={this.state.selectedTab}>
          {Object.keys(this.state.tabs).map((key,index) => <Tab ref={(c) => this['tab_'+key] = c} label={this.state.tabs[key]} onActive={handleActive} />)}
          
         {/* >
         <Tab
           label="onActive"
           data-route="/home2"
           onActive={handleActive}
         >
          
         </Tab> */}
      </Tabs>
    );
  }
}


