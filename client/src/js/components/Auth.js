import React from 'react'
import { Button, Dropdown, MenuItem } from 'react-bootstrap'
var FontAwesome = require('react-fontawesome')
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
        {this.settingsDropdow()}
      </div>
    )
  }

  settingsDropdow() {
    return (
      <Dropdown id="dropdown-settings-1" pullRight="true">
        <Dropdown.Toggle>
          <FontAwesome size="2x" name="cogs" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <div style={{margin: '5px'}}>
            Language: EN
            <br />
            Units: kt/nm/feet
          </div>
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
        {this.settingsDropdow()}
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
