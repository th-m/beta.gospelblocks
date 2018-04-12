import React, { Component, Fragment } from 'react';
// import {Breadcrumbs} from 'material-ui-breadcrumbs/Breadcrumbs';
import Paper from 'material-ui/Paper';
import { getVolumes, getBooks, getChapters, getVerses, scriptureSearch } from '../helpers/scriptureAPI';
import { listen, addBit, update, reduceList } from '../helpers/database';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FontAwesome  from 'react-fontawesome';
import TextField from 'material-ui/TextField';
// import Draggable from 'react-draggable'; 
// import { DragSource } from 'react-dnd';
import LibraryBreadCrumbs from './LibraryBreadCrumbs';

const style = {
  height: '74vh',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
};



const VerseCard = (props) => {
    return props.shelf.map(x => 
      <div key={'k_'+(x.id?x.id:x.chapter)} draggable="true" onDragStart={props.handleDrag} onDragEnd={props.handleDragStop} >
          <Paper >
           <h3  
             className="title" 
             key={(x.id?x.id:x.chapter)} 
             data-key={(x.id?x.id:x.chapter)} 
             data-depth={props.depth} 
             data-title={(x[props.preface+'title']?x[props.preface+'title']:x.chapter)} 
             onClick={this.handleClick}> 
             {(x[props.preface+'title']?x[props.preface+'title']:x.chapter)}
           </h3> 
           <p className="text"> {x.verse_scripture} </p>
         </Paper>
       </div>
    )
}

const SearchCard = (props) => {
    return props.shelf.map(x => 
      <div key={'k_'+(x.id?x.id:x.chapter)} draggable="true" onDragStart={props.handleDrag} onDragEnd={props.handleDragStop} >
          <Paper >
           <h3  
             className="title" 
             key={(x.id?x.id:x.chapter)} 
             data-key={(x.id?x.id:x.chapter)} 
             data-depth={props.depth} 
             data-title={(x[props.preface+'title']?x[props.preface+'title']:x.chapter)} 
             onClick={this.handleClick}> 
             {(x[props.preface+'title']?x[props.preface+'title']:x.chapter)}
           </h3> 
           <p className="text"> {x.verse_scripture} </p>
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
        <Paper key={(x.id?x.id:x.chapter)} >
            <h3  data-key={(x.id?x.id:x.chapter)} data-depth={props.depth} data-title={(x[props.preface+'title']?x[props.preface+'title']:x.chapter)}  onClick={props.handleClick} > 
             {(x[props.preface+'title']?x[props.preface+'title']:x.chapter)}
           </h3> 
         </Paper>
    )
}

const SwitchFunction = (props) => {

     if(props.shelf.length < 1){
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
        break;
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
      this.setState({ depth : 3 }); 
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
  
  handleTextChange =  (e) => {
      this.setState({[e.target.id]: e.target.value});
  }
  
  handleClick= (e) => {
    console.log(e);
    let tabs = this.state.tabs;
    switch (e.target.dataset.depth) {
      case '0':
        console.log('get books');
        this.setState({volume:e.target.dataset.key});
        // this.setState({book:''});
        // this.setState({chapter:''});
        getBooks(e.target.dataset.key).then( x => this.setState({shelf:x, preface:'book_'}));
        this.setState({depth:1});
        tabs.push({key:e.target.dataset.key, depth:1, title: e.target.dataset.title});
        this.setState({tabs:tabs});
        break;
      case '1':
        // console.log('get chapters');
        this.setState({book:e.target.dataset.key});
        // this.setState({chapter:''});
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
       <Paper style={style} zDepth={1} rounded={false} >
         <LibraryBreadCrumbs ref="breadcrumbs" tabs={this.state.tabs} breadClick={this.breadClick}/>
         <div className="libraryWindow">
             <SwitchFunction {...this.state} handleClick={this.handleClick} handleDrag={this.handleStart} handleDragStop={this.handleStop}/>
             {
               // this.state.shelf.map(x => {
               // {return (this.state.depth < 3)?    
               //     (<Paper >
               //      <h3 key={(x.id?x.id:x.chapter)} data-key={(x.id?x.id:x.chapter)} data-depth={this.state.depth} data-title={(x[this.state.preface+'title']?x[this.state.preface+'title']:x.chapter)} onClick={this.handleClick}> 
               //        {(x[this.state.preface+'title']?x[this.state.preface+'title']:x.chapter)}
               //      </h3> 
               //    </Paper>)     
               //     :
               //    (<div draggable="true" onDragStart={this.handleStart} onDragEnd={this.handleStop} >
               //          <Paper >
               //           <h3  
               //             className="title" 
               //             key={(x.id?x.id:x.chapter)} 
               //             data-key={(x.id?x.id:x.chapter)} 
               //             data-depth={this.state.depth} 
               //             data-title={(x[this.state.preface+'title']?x[this.state.preface+'title']:x.chapter)} 
               //             onClick={this.handleClick}> 
               //             {(x[this.state.preface+'title']?x[this.state.preface+'title']:x.chapter)}
               //           </h3> 
               //           <p className="text"> {x.verse_scripture} </p>
               //         </Paper>
               //       </div>
               //     )
               //   }
               // })
            }
             
         </div>
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
              value={this.state.searchString}
              // multiLine={true}
              fullWidth={true}
            />
         </Toolbar>       
       </Paper>
    );
  }
}


