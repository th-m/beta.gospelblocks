import React from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

import { getUsersList } from '../helpers/database'
// const names = [ ];

export default class MultiSelect extends React.Component {
  constructor(){
    super()
    this.state = {
      values: [],
      names:[]
    };
    
  }
  
  componentDidMount(){
      let users;
      getUsersList().then(x =>  {
        // console.log(x);
       users = Object.keys(x).map(i => x[i].info.email);
       console.log(users);
       this.setState({names:users})
      });
      // console.log(users);
  }
  
  handleChange = (event, key, values) => {
    this.setState({ values });
  };

  
  selectionRenderer = values => {
    // change the default comma separated rendering
    return (
      <span style={{ color: "#ff4081" }}>
        {values.join("; ")}
      </span>
    );
  };

  menuItems(values) {
    return this.state.names.map(name => (
      <MenuItem
        key={name}
        insetChildren={true}
        checked={values.includes(name)}
        value={name}
        primaryText={name}
      />
    ));
  }

  render() {
    const { values } = this.state;
    const floatingLabelText = "Names" +
      (values.length > 1 ? ` (${values.length})` : "");
    return (
      <SelectField
        multiple={true}
        floatingLabelText={floatingLabelText}
        value={values}
        onChange={this.handleChange}
        selectionRenderer={this.selectionRenderer}
      >
        {this.menuItems(values)}
      </SelectField>
    );
  }
}
