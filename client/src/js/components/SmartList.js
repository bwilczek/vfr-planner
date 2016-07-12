import React from "react";
import { connect } from 'react-redux';

import DumbList from './DumbList';

const mapStateToProps = (state) => {
  return {
    label: state.labelList.label,
    labels: state.labelList.labels,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleChange: (e) => {
      dispatch({
        type: 'LABEL_CHANGED',
        payload: e.target.value,
      })
    },
    handleEnterPress: (txt) => {
      dispatch({
        type: 'LABEL_ADDED',
        payload: txt,
      })
    }
  }
}

const SmartList = connect(
  mapStateToProps,
  mapDispatchToProps
)(DumbList)

export default SmartList;
