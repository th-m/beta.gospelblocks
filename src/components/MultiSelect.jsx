import React from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

import { getUsersList, getUsername } from '../helpers/database'

export default class MultiSelect extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      values: [],
      selectedUsers:(props.selectedUsers ? props.selectedUsers: []),
      usersList:[],
    };
    
  
    if(props.selectedUsers){
      props.selectedUsers.forEach(userId => {
        getUsername(userId).then(x => { 
          this.state.values.push(x);
        });
      })
    }
  }
  
  componentDidMount(){
      let usersList;
      getUsersList().then(x =>  {
       usersList = Object.keys(x).map(i => x[i].info);
       console.log(usersList);
       this.setState({usersList})
      });
  }
  
  handleChange = (event, key, values) => {
    let selectedUsers = [];
    values.forEach(value => {
      this.state.usersList.forEach( user => {
        if(user.username === value){
          selectedUsers.push(user.uid);
        }
      })
    })
    this.setState({ values });
    this.setState({selectedUsers});
    this.props.handleData({[this.props.name]: selectedUsers});
  };

  
  selectionRenderer = values => {
    return (
      <span style={{ color: "#ff4081" }}>
        {values.join(", ")}
      </span>
    );
  };

  menuItems() {
    return this.state.usersList.map(u => (
      <MenuItem
        key={u.uid}
        insetChildren={true}
        checked={this.state.selectedUsers.includes(u.uid)}
        value={u.username}
        primaryText={u.username}
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
        {this.menuItems()}
      </SelectField>
    );
  }
}
