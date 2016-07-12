import React from "react";

export default class DumbList extends React.Component {

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.handleEnterPress(e.target.value);
      e.target.value = '';
      this.props.handleChange(e);
    }
  }

  render() {

    let renderedLabels = this.props.labels.slice(0).reverse().map((l,i) => <div key={i}>{l}</div>);

    return (
      <div>
        <input onChange={this.props.handleChange.bind(this)} onKeyPress = {this.handleKeyPress.bind(this)}/>
        <div>Current label: {this.props.label}</div>
        <hr />
        <div>{renderedLabels}</div>
      </div>
    );
  }
}
