import React, { Component } from 'react';

const DataStore = React.createContext();

class Context extends Component {
  state = {
   compendiumId: 'zmh8y',
   libraryId: '', 
  }
  render(){
    return (
      <DataStore.Provider value={{
        state:this.state,
        updateCompendiumId: (id) =>{ 
          console.log(this.state);
          console.log("test", id);
          this.setState({compendiumId: id})
        },
        updateLibraryId: (id) => this.setState({libraryId: id})
      }}>
        {this.props.children}
      </DataStore.Provider>
    )
  }
}

export {
  Context,
  DataStore
  
}