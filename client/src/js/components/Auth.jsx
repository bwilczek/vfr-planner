import React from 'react'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'
import { injectIntl, FormattedMessage } from 'react-intl'

import * as secrets from '../secrets'
import * as actions from '../actions/authActions'

@injectIntl
@connect(
  (state) => {
    return {
      user: {
        name: state.user.name
      }
    }
  },
  (dispatch) => {
    return {
      handleResponseFacebook: (response) => {
        dispatch(actions.authenticate('facebook', response.accessToken))
      },
      handleResponseGoogle: (googleUser) => {
        dispatch(actions.authenticate('google', googleUser.getAuthResponse().id_token))
      }
    }
  }
)
export default class Auth extends React.Component {

  renderAuthorized() {
    return (
      <div>{this.props.user.name}</div>
    )
  }

  renderUnauthorized() {
    const { formatMessage } = this.props.intl

    return (
      <div>
        <FontAwesome title={formatMessage({id: 'loginWithFacebook'})} name="facebook-official" style={{verticalAlign: 'middle', cursor: 'pointer'}} size="3x" onClick={(e)=>{this.refs.auth_button_fb.click(e)}}/>
        <FontAwesome title={formatMessage({id: 'loginWithGoogle'})} name="google" style={{verticalAlign: 'middle', cursor: 'pointer'}} size="3x" onClick={(e)=>{this.refs.auth_button_google.signIn()}}/>
        <FacebookLogin
          ref="auth_button_fb"
          appId={secrets.FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,picture"
          callback={this.props.handleResponseFacebook}
          cssClass="hidden"
          textButton="Facebook"/>
        <GoogleLogin
          ref="auth_button_google"
          clientId={secrets.GOOGLE_APP_ID}
          buttonText="Login"
          class="hidden"
          onSuccess={this.props.handleResponseGoogle}
          onFailure={(e) => console.log(e)}
          >Login with Google</GoogleLogin>
      </div>
    )
  }

  render() {
    if(this.props.user.name) {
      return this.renderAuthorized()
    }
    return this.renderUnauthorized()
  }
}
