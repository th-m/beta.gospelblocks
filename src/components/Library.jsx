import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import { getVolumes, getBooks, getChapters, getVerses, scriptureSearch } from '../helpers/scriptureAPI';
// import { listen, addBit, update, reduceList } from '../helpers/database';
import { addBit } from '../helpers/database';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FontAwesome  from 'react-fontawesome';
import TextField from 'material-ui/TextField';

import LibraryBreadCrumbs from './LibraryBreadCrumbs';
import '../styles/App.css';


// TODO fix. we are returning a book id that is relative to all books in the database rather than just the books in that volume. 

// TODO we are basically doing the same thing in verseCard and Search Card.
const VerseCard = (props) => {
    return props.shelf.map(x => 
      <div key={'k_'+(x.id?x.id:x.chapter)} className="Verse" draggable="true" onDragStart={props.handleDrag} onDragEnd={props.handleDragStop} >
          <Paper >
           <i  
             className="title" 
             key={(x.id?x.id:x.chapter)} 
             data-key={(x.id?x.id:x.chapter)} 
             data-depth={props.depth} 
             data-title={x.verse_title_short}
             data-volume={x.volume_id} 
             data-book={x.book_id} 
             data-chapter={x.chapter}  
             data-type="verse"
             onClick={this.handleClick}> 
             {x.verse}
           </i> 
           <span className="text"> {x.verse_scripture} </span>
         </Paper>
       </div>
    )
}

const SearchCard = (props) => {
    
    return props.shelf.map(x => 
      <div key={'k_'+(x.id?x.id:x.chapter)} className="Verse" draggable="true" onDragStart={props.handleDrag} onDragEnd={props.handleDragStop} >
          <Paper >
           <i  
             className="title" 
             key={(x.id?x.id:x.chapter)} 
             data-key={(x.id?x.id:x.chapter)} 
             data-depth={props.depth} 
             data-title={x.verse_title_short} 
             data-volume={x.volume_id} 
             data-book={x.book_id} 
             data-chapter={x.chapter} 
             data-type="searchVerse"
             onClick={this.handleClick}> 
             {x.verse_title_short}
           </i> 
           <span className="text"> {x.verse_scripture} </span>
         </Paper>
       </div>
    )
}

const NoResults = (props) => (
  <Paper>
    <h3 > 
      There were no results
    </h3> 
  </Paper>
)

const TabCard = (props) => {
    return props.shelf.map(x =>
          <Paper style={{ display: 'flex',  alignItems: 'center', justifyContent: 'center'}}  onClick={props.handleClick} key={(x.id?x.id:x.chapter)} 
            data-key={(x.id?x.id:x.chapter)} data-depth={props.depth} data-title={(x[props.preface+'title']?x[props.preface+'title']:x.chapter)} >
            <span  >
              <h4 > 
               {(x[props.preface+'title']?x[props.preface+'title']:x.chapter)}
             </h4> 
           </span>
           </Paper>
    )
}

const SwitchFunction = (props) => {

     if(!props.shelf || props.shelf.length < 1){
       return ( <NoResults />)
     }
     
     switch (props.depth) {
        case 0:
        case 1:
        case 2:
           return ([
              <TabCard {...props} handleClick={props.handleClick}/>,
           ]);
        case 3:
           return ([
              <VerseCard {...props} handleDrag={props.handleDrag} handleDragStop={props.handleDragStop}/>,
           ]);
        case 4:
           return ([
              <SearchCard {...props} />,
           ]);
        
        default:
          return ([
           <TabCard {...props} handleClick={props.handleClick}/>,
        ]);
     }
}




export default class Library extends Component {
  constructor(props){
    super(props);
    // console.log(props);
    this.state = {
      id: this.props.blockId,
      selectedTab: 0,
      tabs:[{key:0, depth:0, title: 'Volumes'}],
      depth: 0,
      searchString:'',
      volume: '',
      book: '',
      chapter: '',
      preface:'',
      page: 1,
      shelf: []
    };
  }
  
  componentDidMount(){
    if(!this.state.volume){
      getVolumes().then( x => this.setState({shelf:x, preface:'volume_'}));
    }
  }
  
  handleKeyDown = (e) => {
    if(e.key === "Enter"){
      this.handleSearch();
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
  
  handleSearch = () => {
    scriptureSearch(this.state.searchString, this.state.page , this.state.volume , this.state.book , this.state.chapter)
    .then( x => {
      this.setState({ shelf : x }); 
      this.setState({ depth : 4 }); 
      console.log(x);
    })
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
    // eventVerse = e.target.querySelector('.title').dataset;
    let verseData = {
      type:  e.target.querySelector('.title').dataset.type,
      title : e.target.querySelector('.title').dataset.title,
      text :e.target.querySelector('.text').innerHTML,
      // volumeId : this.state.volume,
      // bookId : this.state.book,
      // chapterId : this.state.chapter,
      volumeId : e.target.querySelector('.title').dataset.volume,
      bookId : e.target.querySelector('.title').dataset.book,
      chapterId : e.target.querySelector('.title').dataset.chapter
    }
    // Array.from(document.querySelectorAll('.bit')).forEach(x => console.log(x));
    // console.log(verseData);
    let bits = document.querySelectorAll('.Bit');
    bits.forEach((x, i) => {
      let d = this.createDropZone(i);
      x.parentNode.insertBefore(d, x);
      // x.firstChild.classList.add("bit_box_shadow")
    });
    // console.log(bits.length);
    if(bits.length > 0){
      let d = this.createDropZone(bits.length);
      bits[bits.length-1].parentNode.insertBefore(d, bits[bits.length-1].nextSibling);
    }
    
    setTimeout( () => {
      document.querySelectorAll('.drop_zone').forEach(x => x.className+=" ready");
      document.querySelectorAll('.Bit').forEach(x => x.classList.add("bit_box_shadow"));
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
    document.querySelectorAll('.Bit').forEach(x => x.classList.remove("bit_box_shadow"));
    document.querySelectorAll('.drop_zone').forEach(x => {
      x.classList.remove("ready"); 
      setTimeout( () => {
        x.remove();
      }, 250);
    });
  }
  
  handleTextChange =  (e) => {
      this.setState({[e.target.id]: e.target.value});
  }
  
  findTab = (t) => {
    if(t.dataset.depth){
      return t.dataset;
    }else{
      // console.log(t.parentElement);
      return this.findTab(t.parentElement)
    }
  }
  
  handleClick= (e) => {
    let tabs = this.state.tabs;
    let dataset = this.findTab(e.target);
    switch (dataset.depth) {
      case '0':
        console.log('get books');
        this.setState({volume:dataset.key});
        getBooks(dataset.key).then( x => this.setState({shelf:x, preface:'book_'}));
        this.setState({depth:1});
        tabs.push({key:dataset.key, depth:1, title: dataset.title});
        this.setState({tabs:tabs});
        break;
      case '1':
        this.setState({book:dataset.key});
        getChapters(this.state.volume, dataset.key).then( x => this.setState({shelf:x, preface:'chapter_'}));
        this.setState({depth:2});
        tabs.push({key:dataset.key, depth:2, title: dataset.title});
        this.setState({tabs:tabs});
        break;
      case '2':
        this.setState({chapter:dataset.key});
        getVerses(this.state.volume, this.state.book, dataset.key).then( x => this.setState({shelf:x, preface:'verse_'}));
        this.setState({depth:3});
        tabs.push({key:dataset.key, depth:3, title: dataset.title});
        this.setState({tabs:tabs});
        break;
      default:
        
    }
    this.refs['breadcrumbs'].movePointer();
  }
  
  breadClick= (data) => {
    console.log(this.state.depth , data.depth);
    if(this.state.depth !== data.depth){
      console.log("passed first test");
      let tabs = this.state.tabs;
    
      switch (data.depth) {
        case 0:
          console.log('get volumes');
          this.setState({volume:''});
          this.setState({book:''});
          this.setState({chapter:''});
          getVolumes().then( x => this.setState({shelf:x, preface:'volume_'}));
          break;
        case 1:
          console.log('get books');
          this.setState({volume:data.key});
          this.setState({book:''});
          this.setState({chapter:''});
          getBooks(data.key).then( x => this.setState({shelf:x, preface:'book_'}));
          break;
        case 2:
          console.log('get chapters');
          this.setState({book:data.key});
          this.setState({chapter:''});
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
       <Paper zDepth={1}>
         <div className="Library">
           <div>
             <LibraryBreadCrumbs ref="breadcrumbs" tabs={this.state.tabs} breadClick={this.breadClick}/>
           </div>
           <div className={"libraryWindow " + (this.state.depth < 3? "grid": null)}>
               <SwitchFunction {...this.state} handleClick={this.handleClick} handleDrag={this.handleStart} handleDragStop={this.handleStop}/>
           </div>
           <div>
             <Toolbar>
                <ToolbarGroup>
                  <FontAwesome
                     name='search'
                     size='2x'
                     onClick={this.handleSearch}
                   />
                   
                </ToolbarGroup>
                <TextField
                  id="searchString"
                  onChange={this.handleTextChange}
                  hintText="Search"
                  onKeyDown={this.handleKeyDown}
                  value={this.state.searchString}
                  // multiLine={true}
                  fullWidth={true}
                />
             </Toolbar>       
           </div>
          </div>
       </Paper>
    );
  }
}


