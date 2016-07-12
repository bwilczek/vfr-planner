import { combineReducers } from "redux";

import { labelListReducer } from './LabelListReducer'
import { usersReducer } from './UsersReducer'

export const reducers = {
  labelList: labelListReducer,
  users: usersReducer,
}
