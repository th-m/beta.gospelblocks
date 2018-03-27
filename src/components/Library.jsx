import React, { Component } from 'react';
// import {Breadcrumbs} from 'material-ui-breadcrumbs/Breadcrumbs';
import Paper from 'material-ui/Paper';
import { getVolumes, getBooks, getChapters, getVerses } from '../helpers/scriptureAPI';
import { listen, addBit, update, reduceList } from '../helpers/database';
// import Draggable from 'react-draggable'; 
// import { DragSource } from 'react-dnd';
import LibraryBreadCrumbs from './LibraryBreadCrumbs';

const style = {
  height: '74vh',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
};

export default class Library extends Component {
  constructor(props){
    super(props);
    console.log(props);
    this.state = {
      id: this.props.blockId,
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
  
  componentWillReceiveProps(nextProps){
    // const path = 'blocks/'+ nextProps.blockId;
    // listen(path).on("value", this.gotData, this.errData);
    this.setState({id:nextProps.blockId});
  }
  
  queryChapters = (i) => {
    this.setState({book:i});
    getChapters(this.state.volume, i).then( x => this.setState({shelf:x, preface:'chapter_'}));
    
  }
  queryVerses = (i) => {
    this.setState({chapter:i});
    getVerses(this.state.volume, this.state.book, i).then( x => this.setState({shelf:x, preface:'verse_'}));
  }
  
  createDropZone = (x) => {
    let d = document.createElement("div");
    d.classList.add("drop_zone");
    d.addEventListener("drop", this.handleOnDrop);
    d.addEventListener("dragover", this.handleDragOver);
    d.innerHTML = '&nbsp;';
    d.setAttribute('data-order', (x+1));
    
    return d;
    // x.parentNode.insertBefore(d, x.nextSibling);
  }
  
  handleStart = (e) => {
    let verseData = {
      type: 'verse',
      title : e.target.querySelector('.title').innerHTML,
      text :e.target.querySelector('.text').innerHTML,
      volumeId : this.state.volume,
      bookId : this.state.book,
      chapterId : this.state.chapter
    }
    // Array.from(document.querySelectorAll('.bit')).forEach(x => console.log(x));
    let bits = document.querySelectorAll('.bit');
    bits.forEach((x, i) => {
      let d = this.createDropZone(i);
      x.parentNode.insertBefore(d, x);
    });
    // console.log(bits.length);
    if(bits.length > 0){
      let d = this.createDropZone(bits.length);
      bits[bits.length-1].parentNode.insertBefore(d, bits[bits.length-1].nextSibling);
    }
    
    setTimeout( () => {
      document.querySelectorAll('.drop_zone').forEach(x => x.className+=" ready");
    }, 50);
    e.dataTransfer.setData("verseData",  JSON.stringify(verseData));
  }
  
  handleOnDrop = (e) => {
    let data = JSON.parse(e.dataTransfer.getData("verseData"));
    // console.log(data);
    // console.log(e.target.dataset.order);
    e.target.removeAttribute("style");
    
    addBit(this.state.id, data, e.target.dataset.order)
    .then( x => { 
      // console.log(x);
      if(x && x.bits){
        this.setState({bits:x.bits}) 
      }
    });
  }
  
  handleDragOver = (e) => {
    e.preventDefault();
  }
  // This works with the drop event in the compoendium component
  handleDrag = (e) => {
    e.dataTransfer.setData("t",  JSON.stringify({test:'data'}));
  }
  
  handleStop = (e) => {
    e.preventDefault();
    document.querySelectorAll('.drop_zone').forEach(x => {
      x.classList.remove("ready"); 
      setTimeout( () => {
        x.remove();
      }, 250);
    });
    // document.querySelectorAll('.bit')
    // .classList.remove("mystyle");
    // console.log('handleStop', e);
  }
  
  
  
  handleClick= (e) => {
    let tabs = this.state.tabs;
    switch (e.target.dataset.depth) {
      case '0':
        // console.log('get books');
        this.setState({volume:e.target.dataset.key});
        getBooks(e.target.dataset.key).then( x => this.setState({shelf:x, preface:'book_'}));
        this.setState({depth:1});
        tabs.push({key:e.target.dataset.key, depth:1, title: e.target.dataset.title});
        this.setState({tabs:tabs});
        break;
      case '1':
        // console.log('get chapters');
        this.setState({book:e.target.dataset.key});
        getChapters(this.state.volume, e.target.dataset.key).then( x => this.setState({shelf:x, preface:'chapter_'}));
        this.setState({depth:2});
        tabs.push({key:e.target.dataset.key, depth:2, title: e.target.dataset.title});
        this.setState({tabs:tabs});
        break;
      case '2':
        // console.log('get verses');
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
    if(this.state.tabs[this.state.tabs.length-1].depth !== data.depth){
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
  
  
  doublClicked = () => {
    console.log("hello");
  }  
  
  render() {
    return (
       <Paper style={style} zDepth={1} rounded={false} >
         <LibraryBreadCrumbs ref="breadcrumbs" tabs={this.state.tabs} breadClick={this.breadClick}/>
         <div className="libraryWindow">
             {this.state.shelf.map(x => {
               {return (this.state.depth < 3)?    
                   (<Paper >
                    <h3 key={(x.id?x.id:x.chapter)} data-key={(x.id?x.id:x.chapter)} data-depth={this.state.depth} data-title={(x[this.state.preface+'title']?x[this.state.preface+'title']:x.chapter)} onClick={this.handleClick}> 
                      {(x[this.state.preface+'title']?x[this.state.preface+'title']:x.chapter)}
                    </h3> 
                  </Paper>)     
                   :
                  (<div draggable="true" onDragStart={this.handleStart} onDragEnd={this.handleStop} >
                        <Paper >
                         <h3  
                           className="title" 
                           key={(x.id?x.id:x.chapter)} 
                           data-key={(x.id?x.id:x.chapter)} 
                           data-depth={this.state.depth} 
                           data-title={(x[this.state.preface+'title']?x[this.state.preface+'title']:x.chapter)} 
                           onClick={this.handleClick}> 
                           {/* // onDoubleClick={this.doublClicked} */}
                           {(x[this.state.preface+'title']?x[this.state.preface+'title']:x.chapter)}
                         </h3> 
                         <p className="text"> {x.verse_scripture} </p>
                       </Paper>
                     </div>
                   )
                 }
               })
             }
         </div>       
       </Paper>
    );
  }
}


