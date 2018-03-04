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

export default class LibraryBreadCrumbs extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab: 0,
      moveDeeper: false,
      tabs:props.tabs
    };
  }

  
  componentWillReceiveProps(nextProps){
    this.setState({tabs:nextProps.tabs});
  }
  
  componentDidUpdate(){
    let d = this.state.tabs[this.state.tabs.length-1].depth;
    if(this.state.moveDeeper){
      console.log(d);
      this['tab_'+d].handleClick();
      this.setState({moveDeeper:false});
    }
    console.log(this.state.tabs);
  }
  
  movePointer = () => {
      this.setState({moveDeeper:true});
  }
  
  handleActive = (tab) => {
    console.log(`A tab with this route property ${tab.props['data-route']} was activated.`, tab.props['data-route']);
    this.props.breadClick(tab.props['data-route'])
  }

  render() {
    return (
      <Tabs initialSelectedIndex={this.state.selectedTab}>
          {this.state.tabs.map( x => <Tab ref={(c) => this['tab_'+x.depth] = c} key={x.depth} data-route={{depth:x.depth,key:x.key, title:x.title}} label={x.title} onActive={this.handleActive}  />)}
      </Tabs>
    );
  }
}


