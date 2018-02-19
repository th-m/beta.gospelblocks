import React, { Component } from 'react';
// import {Breadcrumbs} from 'material-ui-breadcrumbs/Breadcrumbs';
import Paper from 'material-ui/Paper';

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
  render() {
    return (
       <Paper style={style} zDepth={1} rounded={false} >
         <LibraryBreadCrumbs />
         {/* <Breadcrumbs
           className={className}
           style={style2}
           transparentBackground={true}
         /> */}
         
       </Paper>
    );
  }
}


