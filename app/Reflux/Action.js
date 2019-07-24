import Reflux from 'reflux'
import AccessToken from '../Auth/AccessToken'
import FirebaseRequest from '../Firebase/FirebaseRequest'

let actions = Reflux.createActions([
  "auth",
  "unauth",
  { login: { asyncResult: true } },
  "logout",
  { signup: { asyncResult: true } },
  { loadUser: { asyncResult: true } },
  { profileEdit: { asyncResult: true } },
  { getUserPets: { asyncResult: true } }
])

actions.auth.listen(() => {
   AccessToken.get()
    .then((token) => actions.login(token))
    .catch((err) => actions.logout())
})

actions.unauth.listen(() => {
  AccessToken.clear()
})


export default actions
