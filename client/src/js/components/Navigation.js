import React from "react";

import { Link } from "react-router";
import { Button, ButtonGroup } from "react-bootstrap";

import Auth from "./Auth";

export default class Navigation extends React.Component {

  render() {

    const links = {
      "Home": "/",
      "Plan": "/plan",
      "Summary": "/summary",
    };

    let buttons = [];

    _.forEach(links, (path, label) => {
      let active = false;
      if(this.props.pathname == path) {
        active = true;
      }
      buttons.push(<Button key={path} active={active}><Link to={path}>{label}</Link></Button>);
    });

    return (
      <div style={{marginBottom: '1px'}}>
        <Auth />
        <ButtonGroup>
          {buttons}
        </ButtonGroup>
      </div>
    );
  }
}
