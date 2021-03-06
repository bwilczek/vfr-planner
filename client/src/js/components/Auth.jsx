import React from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
// import FacebookLogin from 'react-facebook-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login'
import { injectIntl } from 'react-intl'

import * as secrets from '../secrets'
import * as actions from '../actions/authActions'

@injectIntl
@connect(
  (state) => {
    return {
      user: {
        name: state.user.name,
        img: state.user.img
      }
    }
  },
  (dispatch) => {
    return {
      handleResponseFacebook: (response) => {
        dispatch(actions.authenticate('facebook', response.accessToken))
      },
      handleResponseGoogle: (googleUser) => {
        dispatch(actions.authenticate('google', googleUser.getAuthResponse().access_token))
      }
    }
  }
)
export default class Auth extends React.Component {

  renderAuthorized() {
    return (
      <span style={{marginRight: '5px'}}>
        <span>{this.props.user.name}</span>
        <img style={{width: '42px', marginLeft: '5px', marginRight: '5px', borderRadius: '21px'}} src={this.props.user.img} />
      </span>
    )
  }

  renderUnauthorized() {
    const { formatMessage } = this.props.intl

    return (
      <span>
        <FacebookLogin
          ref="auth_button_fb"
          appId={secrets.FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,picture"
          callback={this.props.handleResponseFacebook}
          textButton="Facebook"
          render={renderProps => (
            <FontAwesome title={formatMessage({id: 'loginWithFacebook'})} name="facebook-official" class="auth-button" size="3x" onClick={renderProps.onClick}/>
          )}
        />
        <FontAwesome title={formatMessage({id: 'loginWithGoogle'})} name="google" class="auth-button" size="3x" onClick={(e) => { this.refs.auth_button_google.signIn() }}/>
        <GoogleLogin
          ref="auth_button_google"
          clientId={secrets.GOOGLE_APP_ID}
          buttonText="Login"
          class="hidden"
          onSuccess={this.props.handleResponseGoogle}
          onFailure={(e) => console.log(e)}
          >Login with Google</GoogleLogin>
      </span>
    )
  }

  render() {
    if (this.props.user.name) {
      return this.renderAuthorized()
    }
    return this.renderUnauthorized()
  }
}
