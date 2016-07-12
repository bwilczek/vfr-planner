import React from "react";

import { Button } from "react-bootstrap";

export default class UserList extends React.Component {

  handleButtonClick(e) {
    this.props.fetchUsers(e);
  }

  render() {

    let renderedUsers = this.props.users.map((u) => <li key={u.id}>{u.name}</li>)

    // console.log(this.props);

    if(this.props.fetching) {
      return <div>loading...</div>
    } else if(this.props.error) {
      return <div>error!</div>
    } else {
      return this.renderNormal(renderedUsers);
    }
  }

  renderNormal(renderedUsers) {
    return (
      <div>
        <Button onClick={this.handleButtonClick.bind(this)} >Fetch users</Button>
        <ul>
          {renderedUsers}
        </ul>
      </div>
    );
  }

}
