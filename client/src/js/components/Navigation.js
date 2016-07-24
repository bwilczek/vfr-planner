import React from 'react'

import { Link } from 'react-router'
import { Button, ButtonGroup } from 'react-bootstrap'

import Auth from './Auth'

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
      <div style={{marginBottom: '1px', borderBottom: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <img src="img/lecimy_icon.png" />
          <ButtonGroup>
            {buttons}
          </ButtonGroup>
          </div>
        <div style={{lineHeight: '52px'}}>
          <Auth />
        </div>
      </div>
    );
  } // render2
}
