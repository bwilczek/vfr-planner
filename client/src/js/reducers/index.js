import { combineReducers } from "redux";

import user from './userReducer';
import itemList from './itemListReducer';
import navPointList from './navPointListReducer';

export default combineReducers({
  user,
  itemList,
  navPointList,
})
