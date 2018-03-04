import React, { Component } from 'react';
// import {Breadcrumbs} from 'material-ui-breadcrumbs/Breadcrumbs';
import Paper from 'material-ui/Paper';
import { getVolumes, getBooks, getChapters, getVerses } from '../helpers/scriptureAPI';

import LibraryBreadCrumbs from './LibraryBreadCrumbs';

const style = {
  height: '100%',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
};
const className = 'custom-class';
const style2 = {
  width: '50%',
  height: '48px',
};
export default class Library extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab: 0,
      tabs:[{key:0, depth:0, title: 'Volumes'}],
      depth: 0,
      volume: '',
      book: '',
      chapter: '',
      preface:'',
      shelf: []
    };
  }
  
  componentDidMount(){
    if(!this.state.volume){
      getVolumes().then( x => this.setState({shelf:x, preface:'volume_'}));
    }
  }

  queryChapters = (i) => {
    this.setState({book:i});
    getChapters(this.state.volume, i).then( x => this.setState({shelf:x, preface:'chapter_'}));
    
  }
  queryVerses = (i) => {
    this.setState({chapter:i});
    getVerses(this.state.volume, this.state.book, i).then( x => this.setState({shelf:x, preface:'verse_'}));
  }
  
  handleClick= (e) => {
    let tabs = this.state.tabs;
    switch (e.target.dataset.depth) {
      case '0':
        console.log('get books');
        this.setState({volume:e.target.dataset.key});
        getBooks(e.target.dataset.key).then( x => this.setState({shelf:x, preface:'book_'}));
        this.setState({depth:1});
        tabs.push({key:e.target.dataset.key, depth:1, title: e.target.dataset.title});
        this.setState({tabs:tabs});
        break;
      case '1':
        console.log('get chapters');
        this.setState({book:e.target.dataset.key});
        getChapters(this.state.volume, e.target.dataset.key).then( x => this.setState({shelf:x, preface:'chapter_'}));
        this.setState({depth:2});
        tabs.push({key:e.target.dataset.key, depth:2, title: e.target.dataset.title});
        this.setState({tabs:tabs});
        break;
      case '2':
        console.log('get verses');
        this.setState({chapter:e.target.dataset.key});
        getVerses(this.state.volume, this.state.book, e.target.dataset.key).then( x => this.setState({shelf:x, preface:'verse_'}));
        this.setState({depth:3});
        tabs.push({key:e.target.dataset.key, depth:3, title: e.target.dataset.title});
        this.setState({tabs:tabs});
        break;
      default:
        
    }
    this.refs['breadcrumbs'].movePointer();
  }
  
  breadClick= (data) => {
    if(this.state.tabs[this.state.tabs.length-1].depth != data.depth){
      let tabs = this.state.tabs;
    
      switch (data.depth) {
        case 0:
          console.log('get volumes');
          getVolumes().then( x => this.setState({shelf:x, preface:'volume_'}));
          break;
        case 1:
          console.log('get books');
          this.setState({volume:data.key});
          getBooks(data.key).then( x => this.setState({shelf:x, preface:'book_'}));
          break;
        case 2:
          console.log('get chapters');
          this.setState({book:data.key});
          getChapters(this.state.volume, data.key).then( x => this.setState({shelf:x, preface:'chapter_'}));
          break;
        case 3:
          console.log('get verses');
          this.setState({chapter:data.key});
          getVerses(this.state.volume, this.state.book, data.key).then( x => this.setState({shelf:x, preface:'verse_'}));
          break;
        default:
      }
      this.setState({depth:data.depth});
      tabs = tabs.slice(0,data.depth+1);
      this.setState({tabs:tabs});
    }
  }
  
  
  render() {
    return (
       <Paper style={style} zDepth={1} rounded={false} >
         <LibraryBreadCrumbs ref="breadcrumbs" tabs={this.state.tabs} breadClick={this.breadClick}/>
         <div>
             {this.state.shelf.map(x => <Paper >
               <h3 key={x.id} data-key={(x.id?x.id:x.chapter)} data-depth={this.state.depth} data-title={(x[this.state.preface+'title']?x[this.state.preface+'title']:x.chapter)} onClick={this.handleClick}> 
                 {(x[this.state.preface+'title']?x[this.state.preface+'title']:x.chapter)}
               </h3> 
               {(this.state.depth >= 3)?
                 <p> {x.verse_scripture} </p>
               :null}
             </Paper> )}
         </div>       
       </Paper>
    );
  }
}


