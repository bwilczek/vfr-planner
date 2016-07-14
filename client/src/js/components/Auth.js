import React from "react";
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
    return (
      <div>
      {this.props.name}
      <FacebookLogin
        appId={secrets.FACEBOOK_APP_ID}
        autoLoad={false}
        fields="name,picture"
        callback={this.responseFacebook}
        cssClass="my-facebook-button-class"
        icon="fa-facebook"
      />
      <GoogleLogin
          clientId={secrets.GOOGLE_APP_ID}
          buttonText="Login"
          callback={this.responseGoogle} />
      </div>
    );
  }

}
