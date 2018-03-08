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
      usersList:[],
      names:[]
    };
    
  }
  
  componentDidMount(){
      let users;
      let usersList;
      getUsersList().then(x =>  {
        // console.log(x);
       users = Object.keys(x).map(i => x[i].info.email);
       usersList = Object.keys(x).map(i => x[i].info);
       console.log(usersList);
       this.setState({names:users})
       this.setState({usersList})
      });
      // console.log(users);
  }
  
  handleChange = (event, key, values) => {
    
    this.setState({ values });
    this.props.handleData({[this.props.name]: values});
  };

  
  selectionRenderer = values => {
    // change the default comma separated rendering
    return (
      <span style={{ color: "#ff4081" }}>
        {values.join(", ")}
      </span>
    );
  };

  menuItems(values) {
    return this.state.usersList.map(u => (
      <MenuItem
        key={u.uid}
        insetChildren={true}
        checked={values.includes(u.email)}
        value={u.email}
        primaryText={u.email}
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
