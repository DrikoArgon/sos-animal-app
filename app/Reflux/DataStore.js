'use strict'
import Reflux from 'reflux'

import AccessToken from '../Auth/AccessToken'
import Actions from './Action'
import FirebaseRequest from '../Firebase/FirebaseRequest'



export default Reflux.createStore({
  listenables: Actions,
  init: () => {},

  getCurrentUser(){
      return FirebaseRequest.getCurrentUser()
  },

  onLogin: (data) => {
    FirebaseRequest.login(data)
      .then((authData) => {
        AccessToken.set(authData.refreshToken)
          .then(() => Actions.login.completed(authData))
      })
      .catch((err) => Actions.login.failed(err))
  },
  onLoginCompleted: (data) => {
    Actions.loadUser(data.uid)
  },
  onLoginFailed: (err) => {
    console.error("Login failed with error ",err.message)
  },

  onSignup: (data) => {
    FirebaseRequest.signup(data)
      .then((userData) => Actions.signup.completed(data,userData))
      .catch((err) => Actions.signup.failed(err))
  },
  onSignupCompleted: (data,userData) => {
    Actions.login(data)
  },
  onSignupFailed: (error) => {
    console.error("Signup failed with error", error.message);
  },


  onLoadUser: (userId) => {
    FirebaseRequest.loadUser(userId)
      .then((currentUser) => Actions.loadUser.completed(currentUser))
      .catch((err) => Actions.loadUser.failed(err))
  },
  onLoadUserCompleted: (currentUser) => {

    console.warn("User loaded")
  },
  onLoadUserFailed: (err) => {
    console.error("Error loading user ", err.message)
  },

  onProfileEdit: (data) => {
    FirebaseRequest.updateUserProfile(data)
      .then((userId) => Actions.profileEdit.completed(userId))
      .catch((err) => Actions.profileEdit.failed(err))
  },
  onProfileEditCompleted: (userId) => {
    console.warn("User edited")
    Actions.loadUser(userId)
  },
  onProfileEditFailed: (err) => {
    console.error("Error editing user ", err.message)
  },

  onLogout(){
    FirebaseRequest.logout()
    AccessToken.clear()
  }

})
