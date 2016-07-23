import React from "react";
import { Button, ButtonGroup, DropdownButton, MenuItem } from "react-bootstrap";
import { connect } from 'react-redux';

import * as actions from '../actions/authActions';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import * as secrets from '../secrets';

@connect((store) => {
  return _.cloneDeep(store.user)
})
export default class Auth extends React.Component {

  responseFacebook = (response) => {
    this.props.dispatch(actions.authenticate('facebook', response.accessToken));
  };

  responseGoogle = (googleUser) => {
    let id_token = googleUser.getAuthResponse().id_token;
    this.props.dispatch(actions.authenticate('google', id_token));
  };

  render() {
    if(this.props.name) {
      return <span>{this.props.name}</span>
    }
    return (
      <span>
      <DropdownButton title="Login">
        <MenuItem onClick={(e)=>{this.refs.auth_button_fb.click(e)}}>Facebook</MenuItem>
        <MenuItem onClick={(e)=>{console.log(this.refs.auth_button_google); this.refs.auth_button_google.onBtnClick(e)}}>Google</MenuItem>
      </DropdownButton>
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
      </span>
    );
  }

}
