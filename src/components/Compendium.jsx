import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

const style = {
  height: '100%',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
};


export default class Compendium extends Component {
  render() {
    return (
       <Paper style={style} zDepth={1} rounded={false}>
         <div>Compendium</div>
       </Paper>
    );
  }
}


