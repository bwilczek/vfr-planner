import { combineReducers } from "redux";

import user from './userReducer';
import itemList from './itemListReducer';

export default combineReducers({
  user,
  itemList,
})
