import React from 'react'
import { Button, ButtonGroup, Dropdown, MenuItem } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'

import * as actions from '../actions/authActions'

import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'

import * as secrets from '../secrets'

@connect((store) => {
  return _.cloneDeep(store.user)
})
export default class Auth extends React.Component {

  responseFacebook = (response) => {
    this.props.dispatch(actions.authenticate('facebook', response.accessToken))
  }

  responseGoogle = (googleUser) => {
    let id_token = googleUser.getAuthResponse().id_token;
    this.props.dispatch(actions.authenticate('google', id_token))
  }

  renderAuthorized() {
    return (
      <div style={{marginRight: '5px'}}>
        <span>{this.props.name}</span>
        <img style={{width: '42px', marginLeft: '5px', borderRadius: '21px'}} src={this.props.img}/>
        &nbsp;
        <ButtonGroup>
          <Dropdown id="dropdown-routemenu-1" pullRight={true} style={{verticalAlign: 'middle'}}>
            <Dropdown.Toggle  noCaret={true} style={{verticalAlign: 'middle'}}>
              <FontAwesome title="My flight plans" size='2x' name="list" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem>New</MenuItem>
              <MenuItem>Open</MenuItem>
              <MenuItem>Save</MenuItem>
              <MenuItem>Save as</MenuItem>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Delete</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
          {this.settingsDropdown()}
        </ButtonGroup>
      </div>
    )
  }

  settingsDropdown() {
    return (
      // <Button style={{height: '43px'}}><FontAwesome title="Settings" size='2x' name="cogs" style={{verticalAlign: 'middle'}}/></Button>
      <Dropdown id="dropdown-settnigs-1" pullRight={true} id="dropdown-settings-1" style={{verticalAlign: 'middle', height: '43px'}}>
        <Dropdown.Toggle  noCaret={true} style={{verticalAlign: 'middle', height: '43px'}}>
          <FontAwesome title="Settings" size='2x' name="cogs" style={{verticalAlign: 'middle'}}/>
        </Dropdown.Toggle>
        <Dropdown.Menu style={{padding: '5px'}}>
          <div>Units: kt/nm/feet</div>
          <div>Language: EN</div>
          <div>Heading: Geo</div>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  renderUnauthorized() {
    return (
      <div style={{marginRight: '5px'}}>
        <FontAwesome title="Login with Facebook" name="facebook-official" style={{verticalAlign: 'middle', cursor: 'pointer'}} size="3x" onClick={(e)=>{this.refs.auth_button_fb.click(e)}}/>
        &nbsp;
        <FontAwesome title="Login with Google" name="google" style={{verticalAlign: 'middle', cursor: 'pointer'}} size="3x" onClick={(e)=>{this.refs.auth_button_google.onBtnClick(e)}}/>
        &nbsp;
        {this.settingsDropdown()}
        <FacebookLogin
          ref="auth_button_fb"
          appId={secrets.FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,picture"
          callback={this.responseFacebook}
          cssClass="hidden"
          textButton="Facebook"
        />
        <GoogleLogin
          ref="auth_button_google"
          clientId={secrets.GOOGLE_APP_ID}
          buttonText="Login"
          cssClass="hidden"
          callback={this.responseGoogle}>Google</GoogleLogin>
      </div>
    )
  }

  render() {
    if(this.props.name) {
      return this.renderAuthorized()
    }
    return this.renderUnauthorized()
  }
}
