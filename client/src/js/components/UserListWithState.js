import React from "react";
import { connect } from 'react-redux';
import axios from "axios";

import UserList from './UserList';

const mapStateToProps = (state) => {
  // cloning array of users as well
  // return {...state.users, users: state.users.users.slice(0)}
  return _.cloneDeep(state.users)
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUsers: (e) => {
      dispatch({
        type: "FETCH_USERS",
        // payload: axios.get("http://rest.learncode.academy/api/wstern/users")
        payload: axios.get("/nav_points")
      })
    }
  }
}

const UserListWithState = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList)

export default UserListWithState;
