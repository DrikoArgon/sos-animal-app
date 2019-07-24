'use strict'
import * as Firebase from 'firebase'
import {
  AsyncStorage
} from 'react-native'

import Axios from 'axios'

const firebaseConfig = {
    apiKey: "AIzaSyBfa-OdKTGdOZWjI89rDMfJI_YpVJc21GI",
    authDomain: "sosanimalapp.firebaseapp.com",
    databaseURL: "https://sosanimalapp.firebaseio.com",
    storageBucket: "sosanimalapp.appspot.com",
    messagingSenderId: "845482706321"
};
const firebaseApp = Firebase.initializeApp(firebaseConfig);

class FirebaseRequest {
  constructor(){
    this.firebase = firebaseApp.database().ref()

    this.currentUser = null
    this.currentService = null
    this.currentGroup = null
    this.currentUserPets = null
    this.currentUserTemporaryHomePets = null
    this.currentUserFriends = null
    this.currentUserMessages = null
    this.currentServiceMessages = null
    this.currentGroupMessages = null
    this.currentUserFavoriteServicesAndGroups = null
    this.currentUserFavoritePetsToAdopt = null
    this.currentGroupAnimals = null
    this.currentGroupAdoptedAnimals = null
    this.currentGroupMembers = null
    this.currentUserNotifications = null
    this.currentGroupNotifications = null
    this.currentUserMessagesAndNotificationsAmount = 0
    this.currentGroupMessagesAndNotificationsAmount = 0
    this.currentServiceMessagesAmount = 0
  }

  getCurrentUser() {
    return this.currentUser
  }

  getCurrentUserID() {
    return this.currentUser.uid
  }

  getCurrentService() {
    return this.currentService
  }

  getCurrentServiceID() {
    return this.currentService.uid
  }

  getCurrentGroup() {
    return this.currentGroup
  }

  getCurrentGroupID() {
    return this.currentGroup.uid
  }

  getFirebaseRef() {
    return this.firebase
  }

  getCurrentUserPets(temporaryHome) {
    if (temporaryHome) {
      return this.currentUserTemporaryHomePets
    }
    else {
      return this.currentUserPets
    }
  }

  getCurrentUserFriends() {
    return this.currentUserFriends
  }

  getCurrentUserNotifications() {
    return this.currentUserNotifications
  }

  getCurrentUserFavoriteServicesAndGroups() {
    return this.currentUserFavoriteServicesAndGroups
  }

  getCurrentUserFavoritePetsToAdopt() {
    return this.currentUserFavoritePetsToAdopt
  }

  getCurrentUserMessages() {
    return this.currentUserMessages
  }

  getCurrentUserMessagesAndNotificationsAmount() {
    return this.currentUserMessagesAndNotificationsAmount
  }

  getCurrentServiceMessages() {
    return this.currentServiceMessages
  }

  getCurrentServiceMessagesAmount() {
    return this.currentServiceMessagesAmount
  }

  getCurrentGroupMessages() {
    return this.currentGroupMessages
  }

  getCurrentGroupNotifications() {
    return this.currentGroupNotifications
  }

  getCurrentGroupMessagesAndNotificationsAmount() {
    return this.currentGroupMessagesAndNotificationsAmount
  }

  getCurrentGroupAnimals(adoptedAnimals) {
    if (adoptedAnimals) {
      return this.currentGroupAdoptedAnimals
    }
    else {
      return this.currentGroupAnimals
    }
  }

  getCurrentGroupMembers() {
    return this.currentGroupMembers
  }

  addUserMessageToCurrentArray(newMessage){
    this.currentUserMessages.push(newMessage)
  }

  addUserNotificationToCurrentArray(newNotification) {
    this.currentUserNotifications.push(newNotification)
  }

  addServiceMessageToCurrentArray(newMessage) {
    this.currentServiceMessages.push(newMessage)
  }

  addGroupMessageToCurrentArray(newMessage) {
    this.currentGroupMessages.push(newMessage)
  }

  addGroupNotificationToCurrentArray(newNotification) {
    this.currentGroupNotifications.push(newNotification)
  }

  addPointsToCurrentUser(amount){
    this.currentUser.totalPoints += amount
  }

  addCoinsToCurrentUser(amount){
    this.currentUser.coinsAmount += amount
  }

  removePointsFromCurrentUser(amount) {
    this.currentUser.totalPoints -= amount
  }

  removeCoinsFromCurrentUser(amount) {
    this.currentUser.coinsAmount -= amount
  }

  signup(data){
    return new Promise((next,error) => {
      Firebase.auth().createUserWithEmailAndPassword(data.email,data.password)
        .then((authData) => {
          let userRef = this.firebase.child('userProfiles').child(authData.uid)
          userRef.set({ 
              name: data.name,
              surname: data.surname,
              phone: data.phone,
              celphone: data.celphone,
              email: data.email,
              city: data.city,
              state: data.state,
              country: data.country,
              countryCode: data.countryCode,
              coinsAmount: 0,
              totalPoints: 0,
              protectionLevel: 1,
              reports: {
                pinReports: 0,
                profileReports: 0,
                falseProfileReports: 0,
                inapropriateProfileReports: 0
              }
            })
              .then(() => {
                this.login({
                  email: data.email,
                  password: data.password
                })
                  .then((authData) => {
                        this.loadUser(authData.uid)
                          .then(() => {

                            next(data)
                          })
                          .catch((err) => { console.error("Error loading user ", err.message) })
                  })
                  .catch((err) => { console.error("Login failed with error ", err.message) })
            })
            .catch((err) => error(err))
        })
        .catch((err) => error(err))
    })
  }

  signupWithFacebook(data,uid) {
    return new Promise((next, error) => {
      
        let userRef = this.firebase.child('userProfiles').child(uid)
        userRef.set({
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          celphone: data.celphone,
          email: data.email,
          city: data.city,
          state: data.state,
          country: data.country,
          countryCode: data.countryCode,
          coinsAmount: 0,
          totalPoints: 0,
          protectionLevel: 1,
          reports: {
            pinReports: 0,
            profileReports: 0,
            falseProfileReports: 0,
            inapropriateProfileReports: 0
          },
          profileImage: data.profileImage
        })
          .then(() => {
            this.loadUser(uid)
              .then(() => {
                next(data)
              })
              .catch((err) => { console.error("Error loading user ", err.message) })
          })
          .catch((err) => error(err))
      })
  }

  sendResetPasswordEmail(email){

    return new Promise((next, error) => {
      var auth = Firebase.auth()


      auth.sendPasswordResetEmail(email)
      .then(() => {
        next()
      })
      .catch((err) => error(err))

    })
  }

  serviceSignup(data){

      return new Promise((next, error) => {
        Firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
          .then((authData) => {
            let serviceRef = this.firebase.child('serviceProfiles').child(authData.uid)
            serviceRef.set({
              name: data.name,
              socialMission: data.socialMission,
              owner: data.owner,
              CPForCNPJ: data.cpf,
              activityType: data.activityType,
              CRMV: data.crmv,
              adress: data.adress,
              district: data.district,
              phone: data.phone,
              celphone: data.celphone,
              email: data.email,
              city: data.city,
              state: data.state,
              country: data.country,
              cep: data.cep,
              website: data.website,
              logoImage: data.logoImage,
              backgroundImage: data.backgroundImage,
              planType: data.planType,
              planCost: data.planCost,
              planExpirationDay: data.planExpirationDay,
              planExpirationMonth: data.planExpirationMonth,
              planExpirationYear: data.planExpirationYear,
              starCount: {
                oneStar: 0,
                twoStars: 0,
                threeStars: 0,
                fourStars: 0,
                fiveStars: 0
              },
              rating: {
                averageRating: 0
              },
              openingHour: data.openingHour,
              closingHour: data.closingHour,
              accountType: "service",
              reports: {
                pinReports: 0,
                profileReports: 0
              }
            })
              .then(() => next(authData.uid))
              .catch((err) => error(err))
          })
          .catch((err) => error(err))
      })
  }

  groupSignup(data) {

    return new Promise((next, error) => {
      Firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        .then((authData) => {
          let groupRef = this.firebase.child('groupProfiles').child(authData.uid)
          groupRef.set({
            name: data.name,
            socialMission: data.socialMission,
            owner: data.owner,
            CPForCNPJ: data.cpf,
            activityType: data.activityType,
            adress: data.adress,
            district: data.district,
            phone: data.phone,
            celphone: data.celphone,
            email: data.email,
            city: data.city,
            state: data.state,
            country: data.country,
            cep: data.cep,
            website: data.website,
            logoImage: data.logoImage,
            backgroundImage: data.backgroundImage,
            starCount: {
              oneStar: 0,
              twoStars: 0,
              threeStars: 0,
              fourStars: 0,
              fiveStars: 0
            },
            rating: {
              averageRating: 0
            },
            accountType: "group"
          })
            .then(() => next(data))
            .catch((err) => error(err))
        })
        .catch((err) => error(err))
    })
  }

  login(data){
    return new Promise((next,error) => {

      if(data && data.email && data.password){
        Firebase.auth().signInWithEmailAndPassword(data.email,data.password)
          .then((authData) => {
            
            AsyncStorage.setItem('USER_EMAIL',data.email)
            AsyncStorage.setItem('USER_PASSWORD', data.password)

            next(authData)
          })
          .catch((err) => error(err))
      } 
    })
  }

  serviceLogin(data){

    return new Promise((next, error) => {

      if (data && data.email && data.password) {
        Firebase.auth().signInWithEmailAndPassword(data.email, data.password)
          .then((authData) => {

            next(authData)
          })
          .catch((err) => error(err))
      } else {
        Firebase.auth().signInWithEmailAndPassword("driko.argon@gmail.com", "123456")
          .then((authData) => next(authData))
          .catch((err) => error(err))
      }
    })
  }


  groupLogin(data) {

    return new Promise((next, error) => {

      if (data && data.email && data.password) {
        Firebase.auth().signInWithEmailAndPassword(data.email, data.password)
          .then((authData) => {

            next(authData)
          })
          .catch((err) => error(err))
      } else {
        Firebase.auth().signInWithEmailAndPassword("driko.argon@gmail.com", "123456")
          .then((authData) => next(authData))
          .catch((err) => error(err))
      }
    })
  }

  loginWithFacebook(accessToken){
    return new Promise((next, error) => {

      var credential = Firebase.auth.FacebookAuthProvider.credential(accessToken)

      Firebase.auth().signInWithCredential(credential)
        .then((authData) => {
          next(authData)
        })
        .catch((err) => {
          error(err)
        })
    })
  }

  checkIfFirstFacebookLogin(authData){
    return new Promise((next, error) => {

      var isFirstTime = false

      this.firebase.child('userProfiles').child(authData.uid).once('value')
      .then((snap) => {
        if(!snap.exists()){
          isFirstTime = true
        }
        next(isFirstTime)
      })
      .catch((err) => { error(err)})
    })

  }

  logout(){
    Firebase.auth().signOut()

    AsyncStorage.removeItem('USER_EMAIL')
    AsyncStorage.removeItem('USER_PASSWORD')

    this.updateUserOnlineStatus(false)
    .then(() => {

      this.currentUser = null
      this.currentService = null
      this.currentGroup = null
      this.currentUserPets = null
      this.currentUserTemporaryHomePets = null
      this.currentUserFriends = null
      this.currentUserMessages = null
      this.currentServiceMessages = null
      this.currentGroupMessages = null
      this.currentUserFavoriteServicesAndGroups = null
      this.currentUserFavoritePetsToAdopt = null
      this.currentGroupAnimals = null
      this.currentGroupAdoptedAnimals = null
      this.currentGroupMembers = null
      this.currentUserNotifications = null
      this.currentGroupNotifications = null
      this.currentUserMessagesAndNotificationsAmount = 0
      this.currentGroupMessagesAndNotificationsAmount = 0
      this.currentServiceMessagesAmount = 0
    })
    .catch((err) => {})

  }

  deleteAccount(motive){

    return new Promise((next, error) => {

        var userProfileRef = this.firebase.child('userProfiles').child(this.getCurrentUserID())
        var userPinsRef = this.firebase.child('userPins').child(this.getCurrentUserID())
        var userMessagesRef = this.firebase.child('userMessages').child(this.getCurrentUserID())
        var userNotificationsRef = this.firebase.child('userNotifications').child(this.getCurrentUserID())
        var userOnlineStatusRef = this.firebase.child('userOnlineStatus').child(this.getCurrentUserID())
        var mapPinsFromThisUserRef = this.firebase.child('pins').orderByChild('pinOwnerID').equalTo(this.getCurrentUserID())
        var userRelationshipsRef = this.firebase.child('userRelationships').child(this.getCurrentUserID())

        userPinsRef.remove()
        .then(() => {
          userMessagesRef.remove()
          .then(() => {
            userNotificationsRef.remove()
            .then(() => {
              userOnlineStatusRef.remove()
              .then(() => {
                userRelationshipsRef.remove()
                .then(() => {
                  mapPinsFromThisUserRef.once('value')
                  .then((snap) => {
                    snap.forEach((child) => {
                      this.firebase.child('pins').child(child.key).remove()
                    })

                    userProfileRef.remove()
                    .then(() => {

                      var user = Firebase.auth().currentUser

                      user.delete()
                        .then(() => {

                          this.firebase.child('deletedUsers').child(this.getCurrentUserID()).set({
                            motive: motive
                          })
                            .then(() => {
                              
                              Firebase.auth().signOut()

                              AsyncStorage.removeItem('USER_EMAIL')
                              AsyncStorage.removeItem('USER_PASSWORD')

                              this.currentUser = null
                              this.currentService = null
                              this.currentGroup = null
                              this.currentUserPets = null
                              this.currentUserTemporaryHomePets = null
                              this.currentUserFriends = null
                              this.currentUserMessages = null
                              this.currentServiceMessages = null
                              this.currentGroupMessages = null
                              this.currentUserFavoriteServicesAndGroups = null
                              this.currentUserFavoritePetsToAdopt = null
                              this.currentGroupAnimals = null
                              this.currentGroupAdoptedAnimals = null
                              this.currentGroupMembers = null
                              this.currentUserNotifications = null
                              this.currentGroupNotifications = null
                              this.currentUserMessagesAndNotificationsAmount = 0
                              this.currentGroupMessagesAndNotificationsAmount = 0
                              this.currentServiceMessagesAmount = 0

                              next()

                            })
                            .catch((err) => {
                              console.log('Error registering deleted user motive', err.message)
                              error(err)
                            }) 
                      
                      })
                      .catch((err) => {
                        console.log('Error deleting user from firebase auth', err.message)
                        error(err)
                      })
                    })
                    .catch((err) => {
                      console.log('Error deleting user profile', err.message)
                      error(err)
                    })
                  })
                  .catch((err) => {
                    console.log('Error fetching user pins on map', err.message)
                    error(err)
                  })
                })
                .catch((err) => {
                  console.log('Error deleting user relationships', err.message)
                  error(err)
                })
              })
              .catch((err) => {
                console.log('Error deleting user online status', err.message)
                error(err)
              })
            })
            .catch((err) => {
              console.log('Error deleting user notifications', err.message)
              error(err)
            })
          })
          .catch((err) => {
            console.log('Error deleting user messages', err.message)
            error(err)
          })
        })
        .catch((err) => {
          console.log('Error deleting user pins', err.message)
          error(err)
        })
    })
  }

 
  loadUser(uid){
    return new Promise((next,error) => {
      this.firebase.child('userProfiles').child(uid).once('value')
        .then((snap) => {

           this.currentUser = snap.val()
           this.currentUser.uid = uid

           this.fetchUserMessages()
           .then((messagesArray) => {

             this.currentUserMessagesAndNotificationsAmount = 0

             for(var i = 0; i < messagesArray.length; i++){
               if(messagesArray[i].read === false){
                 this.currentUserMessagesAndNotificationsAmount += 1
               }
             }

            this.fetchUserNotifications()
            .then((notificationsArray) => {

              for (var i = 0; i < notificationsArray.length; i++) {
                if (notificationsArray[i].read === false) {
                  this.currentUserMessagesAndNotificationsAmount += 1
                }
              }

              if (this.currentUserMessagesAndNotificationsAmount > 99) {
                this.currentUserMessagesAndNotificationsAmount = 99
              }

              this.updateUserOnlineStatus(true)
              .then(() => { 

                  next(this.currentUser)
              })
              .catch((err) => error(err))
            })
            .catch((err) => {error(err)})

           })
           .catch((err) => {error(err)})
        })
        .catch((err) => error(err))
    })
  }

  loadUserService(uid){
    return new Promise((next, error) => {
      this.firebase.child('serviceProfiles').child(uid).once('value')
        .then((snap) => {

          this.currentService = snap.val()
          this.currentService.uid = uid

          this.fetchServiceMessages()
          .then((messagesArray) => {

            this.currentServiceMessagesAmount = 0

            for (var i = 0; i < messagesArray.length; i++) {
              if (messagesArray[i].read === false) {
                this.currentServiceMessagesAmount += 1
              }
            }

            if (this.currentServiceMessagesAmount > 99) {
              this.currentServiceMessagesAmount = 99
            }

            next(this.currentService)

          })
          .catch((err) => {error(err)})
        })
        .catch((err) => error(err))
    })
  }

  loadUserGroup(uid) {
    return new Promise((next, error) => {
      this.firebase.child('groupProfiles').child(uid).once('value')
        .then((snap) => {

          this.currentGroup = snap.val()
          this.currentGroup.uid = uid

          this.fetchGroupMessages()
            .then((messagesArray) => {

              this.currentGroupMessagesAndNotificationsAmount = 0

              for (var i = 0; i < messagesArray.length; i++) {
                if (messagesArray[i].read === false) {
                  this.currentGroupMessagesAndNotificationsAmount += 1
                }
              }

              this.fetchGroupNotifications()
                .then((notificationsArray) => {

                  for (var i = 0; i < notificationsArray.length; i++) {
                    if (notificationsArray[i].read === false) {
                      this.currentGroupMessagesAndNotificationsAmount += 1
                    }
                  }

                  if(this.currentGroupMessagesAndNotificationsAmount > 99){
                    this.currentGroupMessagesAndNotificationsAmount = 99
                  }

                  next(this.currentGroup)
                })
                .catch((err) => { error(err) })

            })
            .catch((err) => { error(err) })


        })
        .catch((err) => error(err))
    })
  }

  updateUserProfile(data){
    return new Promise((next, error) => {
      let userRef = this.firebase.child('userProfiles').child(this.getCurrentUserID())

      userRef.update(data)
        .then(() => {

          this.loadUser(this.getCurrentUserID())
          .then(() => next())
          .catch((err) => error(err))
        
        })
        .catch((err) => error(err))
    })
  }

  updateUserLocation(data){
    return new Promise((next, error) => {
      let userRef = this.firebase.child('userProfiles').child(this.getCurrentUserID())

      userRef.update(data)
        .then(() => {

          this.fetchUserPets(false)
            .then((petsArray) => {
              petsArray.forEach((pet) => {
                let petRef = userRef.child('userPets').child(pet.key)

                petRef.update(data)
                .then(() => {})
                .catch((err) => error(err))
              })

            })
            .catch((err) => error(err))

          this.fetchUserPets(true)
            .then((petsArray) => {
              petsArray.forEach((pet) => {
                let petRef = userRef.child('userTemporaryHomePets').child(pet.key)

                petRef.update(data)
                  .then(() => { })
                  .catch((err) => error(err))
              })

            })
            .catch((err) => error(err))

          this.loadUser(this.getCurrentUserID())
            .then(() => next())
            .catch((err) => error(err))
          })
          .catch((err) => error(err))          
        })
      
  }

  updateUserOnlineStatus(value) {
    return new Promise((next, error) => {
      let userRef = this.firebase.child('userOnlineStatus').child(this.getCurrentUserID())

      userRef.update({
        online: value
      })
      .then(() => {
          next()
      })
      .catch((err) => error(err))
    })
  }

  updateUserPetsLocation(data){
    return new Promise((next, error) => {
      

      userRef.update(data)
        .then(() => {

          this.loadUser(this.getCurrentUserID())
            .then(() => next())
            .catch((err) => error(err))

        })
        .catch((err) => error(err))
    })
  }

  updateUserLevel(){
    return new Promise((next, error) => {

      var currentLevel = this.currentUser.protectionLevel
      var currentPoints = this.currentUser.totalPoints
      var newLevel = 1
      let userRef = this.firebase.child('userProfiles').child(this.getCurrentUserID())

      if (currentPoints >= 0 && currentPoints < 25 ){
        newLevel = 1
      } else if( currentPoints >= 25 && currentPoints < 50){
        newLevel = 2
      } else if (currentPoints >= 50 && currentPoints < 100) {
        newLevel = 3
      } else if (currentPoints >= 100 && currentPoints < 200) {
        newLevel = 4
      } else if (currentPoints >= 200 && currentPoints < 300) {
        newLevel = 5
      } else if (currentPoints >= 300 && currentPoints < 400) {
        newLevel = 6
      } else if (currentPoints >= 400 && currentPoints < 500) {
        newLevel = 7
      } else if (currentPoints >= 500 && currentPoints < 750) {
        newLevel = 8
      } else if (currentPoints >= 750 && currentPoints < 1000) {
        newLevel = 9
      } else if (currentPoints >= 1000 && currentPoints < 1250) {
        newLevel = 10
      } else if (currentPoints >= 1250 && currentPoints < 1500) {
        newLevel = 11
      } else if (currentPoints >= 1500 && currentPoints < 1750) {
        newLevel = 12
      } else if (currentPoints >= 1750 && currentPoints < 2000) {
        newLevel = 13
      } else if (currentPoints >= 2000) {
        newLevel = 14
      }

      if(newLevel !== currentLevel){

        userRef.update({
          protectionLevel: newLevel
        })
          .then(() => {

            this.currentUser.protectionLevel = newLevel
            next()
          })
          .catch((err) => error(err))
      }else{
        next()
      }
    })
  }

  updateUserMessagesReadStatus(messageID) {
    return new Promise((next, error) => {
      let userMessageRef = this.firebase.child('userMessages').child(this.getCurrentUserID()).child(messageID)

      userMessageRef.update({
        read: true
      })
        .then(() => {

          for(var i = 0; i < this.currentUserMessages.length; i++){
            if (this.currentUserMessages[i].key === messageID){
              this.currentUserMessages[i].read = true
              break
            }
          }

          next()
        })
        .catch((err) => error(err))
    })
  }

  updateUserNotificationReadStatus(notificationID) {
    return new Promise((next, error) => {
      let userNotificationRef = this.firebase.child('userNotifications').child(this.getCurrentUserID()).child(notificationID)

      userNotificationRef.update({
        read: true
      })
        .then(() => {

          for (var i = 0; i < this.currentUserNotifications.length; i++) {
            if (this.currentUserNotifications[i].key === notificationID) {
              this.currentUserNotifications[i].read = true
              break
            }
          }
          next()
        })
        .catch((err) => error(err))
    })
  }

  updateUserPinSolvedStatus(pinID, mapPinID) {
    return new Promise((next, error) => {

      let mapPinRef = this.firebase.child('pins').child(mapPinID)
      let userPinRef = this.firebase.child('userPins').child(this.getCurrentUserID()).child(pinID)

      userPinRef.update({
        solved: true
      })
        .then(() => {

          mapPinRef.remove()
          .then(() => {

            next()
          })
          .catch((err) => error(err))
        })
        .catch((err) => error(err))
    })
  }

  updateGroupMessagesReadStatus(messageID) {
    return new Promise((next, error) => {
      let groupMessageRef = this.firebase.child('groupMessages').child(this.getCurrentGroupID()).child(messageID)

      groupMessageRef.update({
        read: true
      })
        .then(() => {

          for (var i = 0; i < this.currentGroupMessages.length; i++) {
            if (this.currentGroupMessages[i].key === messageID) {
              this.currentGroupMessages[i].read = true
              break
            }
          }
          next()
        })
        .catch((err) => error(err))
    })
  }


  updateGroupNotificationReadStatus(notificationID) {
    return new Promise((next, error) => {
      let groupNotificationRef = this.firebase.child('groupNotifications').child(this.getCurrentGroupID()).child(notificationID)

      groupNotificationRef.update({
        read: true
      })
        .then(() => {

          for (var i = 0; i < this.currentGroupNotifications.length; i++) {
            if (this.currentGroupNotifications[i].key === notificationID) {
              this.currentGroupNotifications[i].read = true
              break
            }
          }
          next()
        })
        .catch((err) => error(err))
    })
  }

  updateServiceMessagesReadStatus(messageID) {
    return new Promise((next, error) => {
      let serviceMessageRef = this.firebase.child('serviceMessages').child(this.getCurrentServiceID()).child(messageID)

      serviceMessageRef.update({
        read: true
      })
        .then(() => {
          next()
        })
        .catch((err) => error(err))
    })
  }


  updateUserPetProfile(data,oldPetSituation,petID) {
    return new Promise((next, error) => {

      var userPetRef = null
      var index = null

      if(data.petSituation === oldPetSituation){

        if(data.petSituation === 0){
           userPetRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userPets').child(petID)
        } else {
          userPetRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userTemporaryHomePets').child(petID)
        }

        userPetRef.update(data)
        .then(() => next())
        .catch((err) => error(err))


      } else {

        if (oldPetSituation === 0) {
          userPetRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userPets').child(petID)
        } else {
          userPetRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userTemporaryHomePets').child(petID)
        }

        this.addUserPet(data)
        .then(() => {

          userPetRef.remove()
          .then(() => {
            
            if(this.oldPetSituation === 0){

              for (var i = 0; i < this.currentUserPets.length; i++) {

                if (this.currentUserPets[i].key === petID) {
                  index = i
                  break
                }

              }

              if (index !== null) {
                this.currentUserPets.splice(index, 1)
              }

              next()

            } else {

              for (var i = 0; i < this.currentUserTemporaryHomePets.length; i++) {

                if (this.currentUserTemporaryHomePets[i].key === petID) {
                  index = i
                  break
                }

              }

              if (index !== null) {
                this.currentUserTemporaryHomePets.splice(index, 1)
              }

              next()
            }

          })
          .catch((err) => error(err))

        })
        .catch(() => error(err))

      }
   

    })
  }

  updatePin(data,pinID,userPinKey) {
    return new Promise((next, error) => {

      let userPinRef = this.firebase.child('userPins').child(this.getCurrentUserID()).child(userPinKey)
      let pinRef = this.firebase.child('pins').child(pinID)

      userPinRef.update(data)
        .then(() => {

          pinRef.update(data)
          .then(() => {next()})
          .catch((err) => error(err))

        })
        .catch((err) => error(err))
    })
  }

  updatePinComment(pinID,commentID,message) {
    return new Promise((next, error) => {

      let pinCommentRef = this.firebase.child('pinComments').child(pinID).child(commentID)

      pinCommentRef.update({
        message: message
      })
        .then(() => {      
           next()
        })
        .catch((err) => error(err))
    })
  }

  updateServiceProfile(data){
    return new Promise((next, error) => {


      let serviceRef = this.firebase.child('serviceProfiles').child(this.getCurrentServiceID())

      serviceRef.update(data)
        .then(() => {

          this.loadUserService(this.getCurrentServiceID())
            .then(() => next())
            .catch((err) => error(err))

        })
        .catch((err) => error(err))
    })
  }

  updateServicePin(data) {
    return new Promise((next, error) => {

      let servicePinRef = this.firebase.child('pins').orderByChild('pinOwnerID').equalTo(this.getCurrentServiceID())

      servicePinRef.once('value')
      .then((snapshot) => {

        if(snapshot.exists()){
          
          snapshot.forEach((child) => {

            this.firebase.child('pins').child(child.key).update({
              name: data.name,
              activityType: data.activityType,
              CRMV: data.crmv,
              adress: data.adress,
              district: data.district,
              phone: data.phone,
              celphone: data.celphone,
              email: data.email,
              city: data.city,
              state: data.state,
              country: data.country,
              website: data.website
            })
              .then(() => {
                next()
              })
              .catch((err) => error(err))

          })
        }
      })
      .catch((err) => {error(err)})
    })
  }

  updateGroupProfile(data) {
    return new Promise((next, error) => {


      let groupRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID())

      groupRef.update(data)
        .then(() => {

          this.loadUserGroup(this.getCurrentGroupID())
            .then(() => next())
            .catch((err) => error(err))

        })
        .catch((err) => error(err))
    })
  }


  updateGroupAnimalProfile(data, oldPetSituation, animalID) {
    return new Promise((next, error) => {

      var groupAnimalRef = null

      if (data.petSituation === oldPetSituation) {

        if (data.petSituation === 0) {
          groupAnimalRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAnimals').child(animalID)
        } else {
          groupAnimalRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAdoptedAnimals').child(animalID)
        }

        groupAnimalRef.update(data)
          .then(() => next())
          .catch((err) => error(err))


      } else {

        if (oldPetSituation === 0) {
          groupAnimalRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAnimals').child(animalID)
        } else {
          groupAnimalRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAdoptedAnimals').child(animalID)
        }

        this.addGroupAnimal(data)
          .then(() => {

            groupAnimalRef.remove()
              .then(() => {

                if (this.oldPetSituation === 0) {

                  for (var i = 0; i < this.currentGroupAnimals.length; i++) {

                    if (this.currentGroupAnimals[i].key === petID) {
                      index = i
                      break
                    }

                  }

                  if (index !== null) {
                    this.currentGroupAnimals.splice(index, 1)
                  }

                  next()

                } else {

                  for (var i = 0; i < this.currentGroupAdoptedAnimals.length; i++) {

                    if (this.currentGroupAdoptedAnimals[i].key === petID) {
                      index = i
                      break
                    }

                  }

                  if (index !== null) {
                    this.currentGroupAdoptedAnimals.splice(index, 1)
                  }

                  next()
                }
              })
              .catch((err) => error(err))

          })
          .catch((err) => error(err))

      }

    })
  }

  updateServiceSaleStatus(saleStatus) {
    return new Promise((next, error) => {


      let serviceRef = this.firebase.child('serviceProfiles').child(this.getCurrentServiceID())

      serviceRef.update({
        sale: saleStatus
      })
        .then(() => {

          this.loadUserService(this.getCurrentServiceID())
            .then(() => next())
            .catch((err) => error(err))

        })
        .catch((err) => error(err))
    })
  }

  updateGroupSaleStatus(saleStatus) {
    return new Promise((next, error) => {


      let groupRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID())

      groupRef.update({
        sale: saleStatus
      })
        .then(() => {

          this.loadUserGroup(this.getCurrentGroupID())
            .then(() => next())
            .catch((err) => error(err))

        })
        .catch((err) => error(err))
    })
  }

  updateFareAnimalAdoptionStatus(fareID,farePinID,selectedAnimals) {
    return new Promise((next, error) => {

      var numberOfAnimals = selectedAnimals.length
      var numberOfAnimalsUpdated = 0

      for(var i = 0; i < selectedAnimals.length; i++){

        var fareAnimalRef = this.firebase.child('groupFares').child(this.getCurrentGroupID()).child(fareID).child('fareAnimals').child(selectedAnimals[i].id)
        var farePinAnimalRef = this.firebase.child('pins').child(farePinID).child('fareAnimals').child(selectedAnimals[i].animalKeyOnPin)

        var newAdoptedFareAnimalKey = this.firebase.child('groupFares').child(this.getCurrentGroupID()).child(fareID).child('adoptedFareAnimals').push().key
        var newAdoptedFareAnimalRef = this.firebase.child('groupFares').child(this.getCurrentGroupID()).child(fareID).child('adoptedFareAnimals').child(newAdoptedFareAnimalKey)

        fareAnimalRef.remove()
        .then(() => {
          farePinAnimalRef.remove()
          .then(() => {

            newAdoptedFareAnimalRef.set(selectedAnimals[numberOfAnimalsUpdated])
            .then(() => {

              this.updateGroupAnimalProfile({
                  name: selectedAnimals[numberOfAnimalsUpdated].name,
                  ageAmount: selectedAnimals[numberOfAnimalsUpdated].ageAmount,
                  ageType: selectedAnimals[numberOfAnimalsUpdated].ageType,
                  specie: selectedAnimals[numberOfAnimalsUpdated].specie,
                  breed: selectedAnimals[numberOfAnimalsUpdated].breed,
                  size: selectedAnimals[numberOfAnimalsUpdated].size,
                  gender: selectedAnimals[numberOfAnimalsUpdated].gender,
                  color: selectedAnimals[numberOfAnimalsUpdated].color,
                  vaccinated: selectedAnimals[numberOfAnimalsUpdated].vaccinated,
                  dewormed: selectedAnimals[numberOfAnimalsUpdated].dewormed,
                  castrated: selectedAnimals[numberOfAnimalsUpdated].castrated,
                  profilePhoto: selectedAnimals[numberOfAnimalsUpdated].profilePhoto,
                  city: selectedAnimals[numberOfAnimalsUpdated].city,
                  state: selectedAnimals[numberOfAnimalsUpdated].state,
                  country: selectedAnimals[numberOfAnimalsUpdated].country,
                  petSituation: 1
                },0,selectedAnimals[numberOfAnimalsUpdated].key)
              .then(() => {

                numberOfAnimalsUpdated++

                if (numberOfAnimalsUpdated === numberOfAnimals) {

                  var fareRef = this.firebase.child('groupFares').child(this.getCurrentGroupID()).child(fareID)

                  fareRef.once('value')
                    .then((snap) => {

                      fareRef.update({
                        animalsForAdoptionAmount: snap.val().animalsForAdoptionAmount - numberOfAnimals,
                        adoptedAnimalsAmount: snap.val().adoptedAnimalsAmount + numberOfAnimals
                      })
                        .then(() => {

                          next()
                        })
                        .catch((err) => { error(err) })

                    })
                    .catch((err) => { error(err) })
                }

              })
              .catch((err) => error(err))   
            })
            .catch((err) => error(err))
          })
          .catch((err) => error(err))
        })
        .catch((err) => error(err))

      }


    })

  }

  fetchUserPets(temporaryHome){
    return new Promise((next, error) => {

      let userPetsRef = null
      var petsArray = []

      if(temporaryHome){
        userPetsRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userTemporaryHomePets')
    
      }
      else{
        userPetsRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userPets')
      }

      userPetsRef.once('value')
      .then((snap) => {

        snap.forEach((child) => {

          var pet = child.val()
          pet.key = child.key
          petsArray.push(pet)

        })

        if(temporaryHome){
          this.currentUserTemporaryHomePets = petsArray
        }else{
          this.currentUserPets = petsArray
        }

        next(petsArray)
        
      })
      .catch((err) => error(err))

    })

  }

  fetchGroupAnimals(adoptedAnimals) {
    return new Promise((next, error) => {

      let groupAnimalsRef = null
      var animalsArray = []

      if (adoptedAnimals) {
        groupAnimalsRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAdoptedAnimals')

      }
      else {
        groupAnimalsRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAnimals')
      }

      groupAnimalsRef.once('value')
        .then((snap) => {
          snap.forEach((child) => {

            var animal = child.val()
            animal.key = child.key
            animalsArray.push(animal)

          })

          if (adoptedAnimals) {
            this.currentGroupAdoptedAnimals = animalsArray
          } else {
            this.currentGroupAnimals = animalsArray
          }

          next(animalsArray)

        })
        .catch((err) => error(err))

    })

  }

  fetchGroupAnimalsWithKey(groupID,adoptedAnimals) {
    return new Promise((next, error) => {

      let groupAnimalsRef = null
      var animalsArray = []

      if (adoptedAnimals) {
        groupAnimalsRef = this.firebase.child('groupProfiles').child(groupID).child('groupAdoptedAnimals')

      }
      else {
        groupAnimalsRef = this.firebase.child('groupProfiles').child(groupID).child('groupAnimals')
      }

      groupAnimalsRef.once('value')
        .then((snap) => {
          snap.forEach((child) => {

            var animal = child.val()
            animalsArray.push(animal)

          })

          next(animalsArray)

        })
        .catch((err) => error(err))

    })

  }

  fetchPersonInfo(personID){
    console.log("Fetching user info. ID: ", personID);
    return new Promise((next, error) => {

      let personRef = this.firebase.child('userProfiles').child(personID)

      personRef.once('value')
      .then((snap) => {
      
        var personInfo = snap.val()
        personInfo.key = snap.key

        next(personInfo)
      })
      .catch((err) => {
        console.log("Error fetching pin owner info: ", err.message)
        error(err)
      })

    })
  }

  fetchPinCommentOwnerInfo(comment,index) {
    return new Promise((next, error) => {

      let personRef = this.firebase.child('userProfiles').child(comment.authorID)

      personRef.once('value')
        .then((snap) => {

          var personInfo = null
          var commentInfo = null

          if (!snap.exists()){

            commentInfo = {
              ownerName: "Usuário Deletado",
              ownerProfileImage: null,
              message: comment.message,
              key: comment.key,
              index: index
            }
          } else {
            personInfo = snap.val()
            personInfo.key = snap.key

            commentInfo = {
              ownerName: personInfo.name + ' ' + personInfo.surname,
              ownerProfileImage: personInfo.profileImage,
              message: comment.message,
              key: comment.key,
              index: index
            }
          }
          

          next(commentInfo)
        })
        .catch((err) => { error(err) })

    })
  }

  fetchGroupInfo(groupID) {
    return new Promise((next, error) => {

      let groupRef = this.firebase.child('groupProfiles').child(groupID)

      groupRef.once('value')
        .then((snap) => {

          var groupInfo = snap.val()
          groupInfo.key = snap.key

          next(groupInfo)
        })
        .catch((err) => { error(err) })

    })
  }

  fetchGroupFares() {
    return new Promise((next, error) => {

      let groupFaresRef = this.firebase.child('groupFares').child(this.getCurrentGroupID())
      var faresArray = []

      groupFaresRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

            var fare = child.val()
            fare.key = child.key
            faresArray.push(fare)

          })

          next(faresArray)
        })
        .catch((err) => { error(err) })
    })
  }

  fetchFareAnimals(pinID){
    return new Promise((next, error) => {

      var animalArray = []
      let farePinAnimalsRef = this.firebase.child('pins').child(pinID).child('fareAnimals')

      farePinAnimalsRef.once('value')
      .then((snap) => {

        snap.forEach((child) => {

            var animal = child.val()
            animal.id = child.key
            animalArray.push(animal)

        })
        next(animalArray)
      })
      .catch((err) => error(err))

    })
  }

  fetchGroupFareAnimals(fareID,adoptedAnimals) {
    return new Promise((next, error) => {

      var animalArray = []
      let fareAnimalsRef = null

      if(adoptedAnimals){
        fareAnimalsRef = this.firebase.child('groupFares').child(this.getCurrentGroupID()).child(fareID).child('adoptedFareAnimals')
      } else {
        fareAnimalsRef = this.firebase.child('groupFares').child(this.getCurrentGroupID()).child(fareID).child('fareAnimals')
      }

      fareAnimalsRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

            var animal = child.val()
            animal.id = child.key
            animalArray.push(animal)

          })
          next(animalArray)
        })
        .catch((err) => error(err))

    })
  }

  fetchPeople(isGroupSearching){
    return new Promise((next, error) => {

      let usersRef = null
      var peopleArray = []

      var currentUserKey = this.getCurrentUserID()

      usersRef = this.firebase.child('userProfiles')

      usersRef.once('value')
      .then((snap) => {
        snap.forEach((child) => {

          if(isGroupSearching){

            var person = child.val()
            person.key = child.key
            peopleArray.push(person)

          } else{

            if (child.key !== currentUserKey) {
              var person = child.val()
              person.key = child.key
              peopleArray.push(person)

            }
          }
          

        })

        next(peopleArray)

      })
      .catch((err) => error(err))

    })
  }

  fetchUserFriends() {
    return new Promise((next, error) => {

      var friendsArray = []
      var numberOfFriends = 0 
      var numberOfFriendsFetchd = 0

      let userFriendsRef = this.firebase.child('userRelationships').child(this.getCurrentUserID())

      userFriendsRef.once('value')
        .then((snap) => {
          
          numberOfFriends = snap.numChildren()

          snap.forEach((child) => {

            this.firebase.child('userProfiles').child(child.val().friendID).once('value')
             .then((snapshot) => {

                if (!snapshot.exists()) {
                  this.firebase.child('userRelationships').child(this.getCurrentUserID()).child(child.key).remove()
                }
                else {
                  var friend = snapshot.val()
                  friend.key = child.val().friendID
                  friendsArray.push(friend)
                }

                numberOfFriendsFetchd++

                if (numberOfFriendsFetchd === numberOfFriends){

                  this.currentUserFriends = friendsArray
                  next(friendsArray)

                }
            })
            .catch((err) => error(err))

          })

          if(numberOfFriends === 0){
            this.currentUserFriends = friendsArray
            next(friendsArray)
          }

         
        })
        .catch((err) => error(err))
    })
  }

  fetchUserOnlineFriends() {
    return new Promise((next, error) => {

      var friendsArray = []
      var numberOfFriends = 0
      var numberOfFriendsFetchd = 0

      let userFriendsRef = this.firebase.child('userRelationships').child(this.getCurrentUserID())

      userFriendsRef.once('value')
        .then((snap) => {

          numberOfFriends = snap.numChildren()

          snap.forEach((child) => {

            this.firebase.child('userProfiles').child(child.val().friendID).once('value')
              .then((snapshot) => {

                if (!snapshot.exists()) {
                  this.firebase.child('userRelationships').child(this.getCurrentUserID()).child(child.key).remove()

                  numberOfFriendsFetchd++

                  if (numberOfFriendsFetchd === numberOfFriends) {

                    next(friendsArray)

                  }
                }
                else{      
                  var friend = snapshot.val()
                  friend.key = child.val().friendID

                  this.firebase.child('userOnlineStatus').child(child.val().friendID).once('value')
                  .then((snap) => {

                    if (snap.val().online === true) {
                      friendsArray.push(friend)
                    }

                    numberOfFriendsFetchd++

                    if (numberOfFriendsFetchd === numberOfFriends) {

                      next(friendsArray)

                    }

                  })
                  .catch((err) => error(err))
                }
              })
              .catch((err) => error(err))
          })

          if (numberOfFriends === 0) {
            next(friendsArray)
          }


        })
        .catch((err) => error(err))
    })
  }

  fetchGroupMembers() {
    return new Promise((next, error) => {

      var membersArray = []
      var numberOfMembers = 0
      var numberOfMembersFetchd = 0

      let groupMembersRef = this.firebase.child('groupMembers').child(this.getCurrentGroupID())

      groupMembersRef.once('value')
        .then((snap) => {

          numberOfMembers = snap.numChildren()

          snap.forEach((child) => {

            this.firebase.child('userProfiles').child(child.val().memberID).once('value')
              .then((snapshot) => {
         
                if (!snapshot.exists()) {
                  this.firebase.child('groupMembers').child(this.getCurrentGroupID()).child(child.key).remove()
                }
                else{
                  var member = snapshot.val()
                  member.key = child.val().memberID
                  membersArray.push(member)
                }
                
                numberOfMembersFetchd++

                if (numberOfMembersFetchd === numberOfMembers) {

                  this.currentGroupMembers = membersArray
                  next(membersArray)

                }
              })
              .catch((err) => error(err))

          })

          if (numberOfMembers === 0) {
            this.currentGroupMembers = membersArray
            next(membersArray)
          }


        })
        .catch((err) => error(err))
    })
  }

  fetchGroupMembersWithKey(groupID) {
    return new Promise((next, error) => {

      var membersArray = []
      var numberOfMembers = 0
      var numberOfMembersFetchd = 0

      let groupMembersRef = this.firebase.child('groupMembers').child(groupID)

      groupMembersRef.once('value')
        .then((snap) => {

          numberOfMembers = snap.numChildren()

          snap.forEach((child) => {

            this.firebase.child('userProfiles').child(child.val().memberID).once('value')
              .then((snapshot) => {

                if (!snapshot.exists()) {
                  this.firebase.child('groupMembers').child(groupID).child(child.key).remove()
                }
                else {
                  var member = snapshot.val()
                  member.key = child.val().memberID
                  membersArray.push(member)
                }

                numberOfMembersFetchd++

                if (numberOfMembersFetchd === numberOfMembers) {

                  next(membersArray)

                }
              })
              .catch((err) => error(err))

          })

          if (numberOfMembers === 0) {
            next(membersArray)
          }


        })
        .catch((err) => error(err))
    })
  }

  fetchServicesAndGroups() {
    return new Promise((next, error) => {

      let servicesRef = null
      let groupsRef = null
      var servicesArray = []
      var numberOfGroups = null
      var numberOfGroupsChecked = null

      servicesRef = this.firebase.child('serviceProfiles')
      groupsRef = this.firebase.child('groupProfiles')

      servicesRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

              var service = child.val()
              service.key = child.key
              servicesArray.push(service)
          })
          
          groupsRef.once('value')
            .then((snap) => {

              numberOfGroups = snap.numChildren()

              if (snap.numChildren() === 0) {
                next(serviceArray)
              }

              snap.forEach((child) => {

                var group = child.val()
                group.key = child.key

                var groupMembersRef = this.firebase.child('groupMembers').child(group.key).orderByChild('memberID').equalTo(this.getCurrentUserID())

                groupMembersRef.once('value')
                  .then((snap) => {

                    if (snap.numChildren() !== 0) {
                      group.isMember = true
                    } else {
                      group.isMember = false
                    }

                    servicesArray.push(group)
                    numberOfGroupsChecked++

                    if (numberOfGroupsChecked === numberOfGroups) {
                      next(servicesArray)
                    }

                  })
                  .catch((err) => { error(err) })
              })
            })
            .catch((err) => {error(err)})
        })
        .catch((err) => error(err))

    })
  }

  fetchUserFavoriteServicesAndGroups() {
    return new Promise((next, error) => {

      var servicesAndGroupsArray = []
      var numberOfServices = 0
      var numberOfServicesFetchd = 0

      let userFavoriteServicesRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child("userFavoriteServicesAndGroups")

      userFavoriteServicesRef.once('value')
        .then((snap) => {

          numberOfServices = snap.numChildren()

          snap.forEach((child) => {

            if(child.val().serviceID){

              this.firebase.child('serviceProfiles').child(child.val().serviceID).once('value')
                .then((snapshot) => {

                  if (!snapshot.exists()) {
                    this.firebase.child('userProfiles').child(this.getCurrentUserID()).child("userFavoriteServicesAndGroups").child(child.key).remove()
                  }
                  else{
                    var service = snapshot.val()
                    service.favoriteKey = child.key
                    service.key = child.val().serviceID
                    servicesAndGroupsArray.push(service)
                  }
                  numberOfServicesFetchd++

                  if (numberOfServicesFetchd === numberOfServices) {

                    this.currentUserFavoriteServicesAndGroups = servicesAndGroupsArray
                    next(servicesAndGroupsArray)

                  }
                })
                .catch((err) => error(err))
            } else {

              this.firebase.child('groupProfiles').child(child.val().groupID).once('value')
                .then((snapshot) => {

                  if (!snapshot.exists()) {
                    this.firebase.child('userProfiles').child(this.getCurrentUserID()).child("userFavoriteServicesAndGroups").child(child.key).remove()

                    numberOfServicesFetchd++

                    if (numberOfServicesFetchd === numberOfServices) {

                      this.currentUserFavoriteServicesAndGroups = servicesAndGroupsArray
                      next(servicesAndGroupsArray)

                    }
                  }
                  else{  
                    var group = snapshot.val()
                    group.favoriteKey = child.key
                    group.key = child.val().groupID

                    var groupMembersRef = this.firebase.child('groupMembers').child(group.key).orderByChild('memberID').equalTo(this.getCurrentUserID())

                    groupMembersRef.once('value')
                      .then((snap) => {

                        if (snap.numChildren() !== 0) {
                          group.isMember = true
                        } else {
                          group.isMember = false
                        }

                        servicesAndGroupsArray.push(group)
                      
                        numberOfServicesFetchd++

                        if (numberOfServicesFetchd === numberOfServices) {

                          this.currentUserFavoriteServicesAndGroups = servicesAndGroupsArray
                          next(servicesAndGroupsArray)

                        }

                      })
                      .catch((err) => { error(err) })
                  }
                    
                })
                .catch((err) => error(err))
            }

          })

          if (numberOfServices === 0) {
            this.currentUserFavoriteServicesAndGroups = servicesAndGroupsArray
            next(servicesAndGroupsArray)
          }


        })
        .catch((err) => error(err))
    })
  }

  fetchUserFavoritePetsToAdopt() {
    return new Promise((next, error) => {

      var petsToAdoptArray = []
      var numberOfPets = 0
      var numberOfPetsFetchd = 0

      let userFavoritePetsRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child("userFavoritePetsToAdopt")

      userFavoritePetsRef.once('value')
        .then((snap) => {

          numberOfPets = snap.numChildren()

          snap.forEach((child) => {

            if (child.val().ownerType === 'group') {

              this.firebase.child('groupProfiles').child(child.val().ownerID).child('groupAnimals').child(child.val().animalID).once('value')
              .then((snapshot) => {

                if(!snapshot.exists()){
                  this.firebase.child('userProfiles').child(this.getCurrentUserID()).child("userFavoritePetsToAdopt").child(child.key).remove()
                }
                else{
                  var animal = snapshot.val()
                  animal.favoriteKey = child.key
                  animal.key = child.val().animalID
                  animal.situation = "Para Adoção"
                  petsToAdoptArray.push(animal)
                }

                numberOfPetsFetchd++

                if (numberOfPetsFetchd === numberOfPets) {

                  this.currentUserFavoritePetsToAdopt = petsToAdoptArray
                  next(petsToAdoptArray)

                }
                
              })
              .catch((err) => error(err))

            } else {

              this.firebase.child('userProfiles').child(child.val().ownerID).child('userTemporaryHomePets').child(child.val().animalID).once('value')
              .then((snapshot) => {

                if (!snapshot.exists()) {
                  this.firebase.child('userProfiles').child(this.getCurrentUserID()).child("userFavoritePetsToAdopt").child(child.key).remove()
                }
                else{
                  var animal = snapshot.val()
                  animal.favoriteKey = child.key
                  animal.key = child.val().animalID
                  animal.ownerID = child.val().ownerID
                  animal.situation = "Lar Temporário"
                  petsToAdoptArray.push(animal)
                }   
                numberOfPetsFetchd++

                if (numberOfPetsFetchd === numberOfPets) {

                  this.currentUserFavoritePetsToAdopt = petsToAdoptArray
                  next(petsToAdoptArray)

                }

              })
              .catch((err) => { error(err) })

            }

          })

          if (numberOfPets === 0) {
            this.currentUserFavoritePetsToAdopt = petsToAdoptArray
            next(petsToAdoptArray)
          }


        })
        .catch((err) => error(err))
    })
  }

  fetchServiceComments(serviceID, callbackFunction){

    let commentsRef = null

    commentsRef = this.firebase.child("serviceComments").child(serviceID)

    commentsRef.on('child_added', (snapshot) => {
      var comment = snapshot.val()
      
      callbackFunction(comment)

    })

  }

  fetchServiceRating(serviceID){

    return new Promise((next, error) => {
    
      let serviceRatingRef = null

      serviceRatingRef = this.firebase.child('serviceProfiles').child(serviceID).child('rating')

      serviceRatingRef.once('value')
      .then((snap) => {
        next(snap.val().averageRating)
      })
      .catch((err) => {error(err)})
    })
  }

  fetchGroupComments(groupID, callbackFunction) {

    let commentsRef = null

    commentsRef = this.firebase.child("groupComments").child(groupID)

    commentsRef.on('child_added', (snapshot) => {
      var comment = snapshot.val()

      callbackFunction(comment)

    })

  }

  fetchPinComments(pinID) {

    return new Promise((next, error) => {

      let commentsRef = null
      var commentArray = []

      commentsRef = this.firebase.child("pinComments").child(pinID)

      commentsRef.once('value')
      .then((snap) => {

        snap.forEach((child) => {
          var comment = child.val()
          comment.key = child.key

          commentArray.push(comment)
        })

        next(commentArray)
      })
      .catch((err) => error(err))

    })

  }

  fetchAnimalsToAdopt(){

    return new Promise((next, error) => {

      var animalsArray = []
      let usersRef = this.firebase.child('userProfiles')
      let groupsRef = this.firebase.child('groupProfiles')

      usersRef.once('value')
      .then((snap) => {

        snap.forEach((child) => {

          if(child.child('userTemporaryHomePets').exists()){

            child.child('userTemporaryHomePets').forEach((pet) => {

              var temporaryHomePet = pet.val()
              temporaryHomePet.ownerKey = child.key
              temporaryHomePet.key = pet.key
              temporaryHomePet.ownerName = child.val().name + ' ' + child.val().surname
              temporaryHomePet.situation = "Lar Temporário"
              animalsArray.push(temporaryHomePet)   
              
            })

          }

        })

        groupsRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

            if (child.child('groupAnimals').exists()) {

              child.child('groupAnimals').forEach((animal) => {

                var groupAnimal = animal.val()
                groupAnimal.ownerKey = child.key
                groupAnimal.key = animal.key
                groupAnimal.ownerName = child.val().name
                groupAnimal.situation = "Para Adoção"
                animalsArray.push(groupAnimal)

              })

            }

          })

          next(animalsArray)

        })
        .catch((err) => {error(err)})

      })
      .catch((err) => {error(err)})


    })

  }

  fetchUserMessages() {
    return new Promise((next, error) => {

      var messagesArray = []
      let userMessagesRef = this.firebase.child('userMessages').child(this.getCurrentUserID())

      userMessagesRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

            var message = child.val()
            message.key = child.key
            messagesArray.push(message)

          })

          this.currentUserMessages = messagesArray

          next(messagesArray)

        })
        .catch((err) => error(err))

    })
  }


  fetchUserNotifications() {
    return new Promise((next, error) => {

      var notificationsArray = []
      let userNotificationsRef = this.firebase.child('userNotifications').child(this.getCurrentUserID())

      userNotificationsRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

            var notification = child.val()
            notification.key = child.key
            notificationsArray.push(notification)

          })

          this.currentUserNotifications = notificationsArray

          next(notificationsArray)

        })
        .catch((err) => error(err))

    })
  }

  fetchServiceMessages() {
    return new Promise((next, error) => {

      var messagesArray = []
      let serviceMessagesRef = this.firebase.child('serviceMessages').child(this.getCurrentServiceID())

      serviceMessagesRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

            var message = child.val()
            message.key = child.key
            messagesArray.push(message)

          })

          this.currentServiceMessages = messagesArray

          next(messagesArray)

        })
        .catch((err) => error(err))

    })
  }

  fetchGroupMessages() {
    return new Promise((next, error) => {

      var messagesArray = []
      let groupMessagesRef = this.firebase.child('groupMessages').child(this.getCurrentGroupID())

      groupMessagesRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

            var message = child.val()
            message.key = child.key
            messagesArray.push(message)

          })

          this.currentGroupMessages = messagesArray

          next(messagesArray)

        })
        .catch((err) => error(err))

    })
  }

  fetchGroupNotifications() {
    return new Promise((next, error) => {

      var notificationsArray = []
      let groupNotificationsRef = this.firebase.child('groupNotifications').child(this.getCurrentGroupID())

      groupNotificationsRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

            var notification = child.val()
            notification.key = child.key
            notificationsArray.push(notification)

          })

          this.currentGroupNotifications = notificationsArray

          next(notificationsArray)

        })
        .catch((err) => error(err))

    })
  }

  fetchPins(maxLatitude,maxLongitude,minLatitude,minLongitude){
    return new Promise((next, error) => {

      var pinArray = []
      var latitudeFilterArray = []

      let filterLatitudeRef = this.firebase.child('pins').orderByChild("latitude").startAt(minLatitude).endAt(maxLatitude)


      filterLatitudeRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

            if ( (child.val().longitude >= minLongitude ) && ( child.val().longitude <= maxLongitude) ){
              
              var pin = child.val()
              pin.key = child.key
              pin.location = {
                latitude: child.val().latitude,
                longitude: child.val().longitude
              }
      
              pin.images = []

              if (child.val().image1) {
                pin.images.push(child.val().image1)
              }

              if (child.val().image2) {
                pin.images.push(child.val().image2)
              }

              if (child.val().image3) {
                pin.images.push(child.val().image3)
              }

              if (child.val().image4) {
                pin.images.push(child.val().image4)
              }

              console.log("Pin fetched", pin.key)
              pinArray.push(pin)
            }

          })

         next(pinArray)
        })
        .catch((err) => error(err))


      // pinRef.once('value')
      // .then((snap) => {
      //   console.log("Pins fetched")
      //   snap.forEach((child) => {

      //     var pin = child.val()
      //     pin.key = child.key
      //     pin.coordinate = {
      //       latitude: child.val().latitude,
      //       longitude: child.val().longitude
      //     }

      //     console.log("Pin ", pin.key)
      //     console.log("Coordinates  ", pin.coordinate)
      //     pin.images = []

      //     if(child.val().image1){
      //       pin.images.push(child.val().image1)
      //     }

      //     if (child.val().image2) {
      //       pin.images.push(child.val().image2)
      //     }

      //     if (child.val().image3) {
      //       pin.images.push(child.val().image3)
      //     }

      //     if (child.val().image4) {
      //       pin.images.push(child.val().image4)
      //     }

      //     pinArray.push(pin)
          
      //   })

      //   next(pinArray)
      // })
      // .catch((err) => error(err))


    })
  }

  fetchUserPins(){

    return new Promise((next, error) => {

      var pinArray = []
      let pinRef = this.firebase.child('userPins').child(this.getCurrentUserID())
      var counter = 0

      pinRef.once('value')
        .then((snap) => {
          snap.forEach((child) => {

            counter++

            var pin = child.val()
            pin.key = child.key
            pin.coordinate = {
              latitude: child.val().latitude,
              longitude: child.val().longitude
            }

            pin.images = []

            if (child.val().image1) {
              pin.images.push(child.val().image1)
            }

            if (child.val().image2) {
              pin.images.push(child.val().image2)
            }

            if (child.val().image3) {
              pin.images.push(child.val().image3)
            }

            if (child.val().image4) {
              pin.images.push(child.val().image4)
            }

            pinArray.push(pin)


          })

          next(pinArray)
        })
        .catch((err) => error(err))


    })
  }

  searchForAnimalsToAdopt(filters){

    return new Promise((next, error) => {

      var animalsArray = []
      var filtersReached = 0
      var temporaryHomeQueryRef = null
      var groupAnimalsQueryRef = null
      var count = 0

      if(filters.districtFilter !== null){
        temporaryHomeQueryRef = this.firebase.child('userProfiles').orderByChild('district').equalTo(filters.districtFilter.toLowerCase())
        groupAnimalsQueryRef = this.firebase.child('groupProfiles').orderByChild('district').equalTo(filters.districtFilter.toLowerCase())
      } else if(filters.cityFilter !== null){
        temporaryHomeQueryRef = this.firebase.child('userProfiles').orderByChild('city').equalTo(filters.cityFilter.toLowerCase())
        groupAnimalsQueryRef = this.firebase.child('groupProfiles').orderByChild('city').equalTo(filters.cityFilter.toLowerCase())
      } else if(filters.stateFilter !== null){
        temporaryHomeQueryRef = this.firebase.child('userProfiles').orderByChild('state').equalTo(filters.stateFilter.toLowerCase())
        groupAnimalsQueryRef = this.firebase.child('groupProfiles').orderByChild('state').equalTo(filters.stateFilter.toLowerCase())
      } else if(filters.countryFilter !== null){
        temporaryHomeQueryRef = this.firebase.child('userProfiles').orderByChild('country').equalTo(filters.countryFilter.toLowerCase())
        groupAnimalsQueryRef = this.firebase.child('groupProfiles').orderByChild('country').equalTo(filters.countryFilter.toLowerCase())
      } else {
        temporaryHomeQueryRef = this.firebase.child('userProfiles')
        groupAnimalsQueryRef = this.firebase.child('groupProfiles')
      }

      temporaryHomeQueryRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

            if (child.child('userTemporaryHomePets').exists()) {

              child.child('userTemporaryHomePets').forEach((pet) => {

                var animal = pet.val()

                if (filters.specieFilter !== null) {
                  if (animal.specie === filters.specieFilter) {
                    filtersReached++
                  }
                }

                if (filters.genderFilter !== null) {
                  if (animal.gender === filters.genderFilter) {
                    filtersReached++
                  }
                }

                if (filters.cityFilter !== null) {
                  if (animal.city.toLowerCase() === filters.cityFilter.toLowerCase() ) {
                    filtersReached++
                  }
                }

                if (filters.stateFilter !== null) {
                  if (animal.state.toLowerCase() === filters.stateFilter.toLowerCase() ) {
                    filtersReached++
                  }
                }

                if (filters.countryFilter !== null) {
                  if (animal.country.toLowerCase() === filters.countryFilter.toLowerCase() ) {
                    filtersReached++
                  }
                }

                if (filters.districtFilter !== null) {
                  if (animal.district.toLowerCase() === filters.districtFilter.toLowerCase() ) {
                    filtersReached++
                  }
                }

                if (filtersReached === filters.filterCount) {
                  animal.key = pet.key
                  animal.ownerKey = child.key
                  animal.ownerName = child.val().name + ' ' + child.val().surname
                  animal.situation = "Lar Temporário"
                  animalsArray.push(animal)
                }

                filtersReached = 0
              })

            }

            filtersReached = 0
          })

          groupAnimalsQueryRef.once('value')
            .then((snap) => {

              snap.forEach((child) => {

                if (child.child('groupAnimals').exists()) {

                  child.child('groupAnimals').forEach((animal) => {

                    var groupAnimal = animal.val()

                    if (filters.specieFilter !== null) {
                  
                      if (groupAnimal.specie === filters.specieFilter) {
                        filtersReached++
                      }
                    }

                    if (filters.genderFilter !== null) {

                      if (groupAnimal.gender === filters.genderFilter) {
                        filtersReached++
                      }
                    }

                    if (filters.cityFilter !== null) {
                      if (groupAnimal.city === filters.cityFilter) {
                        filtersReached++
                      }
                    }

                    if (filters.stateFilter !== null) {
                      if (groupAnimal.state === filters.stateFilter) {
                        filtersReached++
                      }
                    }

                    if (filters.countryFilter !== null) {
                      if (groupAnimal.country === filters.countryFilter) {
                        filtersReached++
                      }
                    }

                    if (filters.districtFilter !== null) {
                      if (groupAnimal.district === filters.districtFilter) {
                        filtersReached++
                      }
                    }

                    if (filtersReached === filters.filterCount) {
                      groupAnimal.key = animal.key
                      groupAnimal.ownerKey = child.key
                      groupAnimal.ownerName = child.val().name
                      groupAnimal.situation = "Para Adoção"
                      animalsArray.push(groupAnimal)
                    }

                    filtersReached = 0
                  })
              }
              
              filtersReached = 0

              })

            next(animalsArray)

            })
            .catch((err) => { error(err) })
        })
        .catch((err) => error(err))

    })

  }

  searchForGroupsAndServices(filters){

    return new Promise((next, error) => {

      var serviceArray = []
      var filtersReached = 0
      var searchGroup = true
      var searchService = true
      var serviceQueryRef = null
      var groupQueryRef = null
      var numberOfGroups = 0
      var numberOfGroupsChecked = 0

      if (filters.activityFilter !== null) {
        if (filters.activityFilter !== "ONG/OSCIPS/Grupo de Proteção Animal") {
          searchGroup = false
        } else {
          searchService = false
        }
      }

     
      if(searchService){

        if (filters.districtFilter !== null) {
          serviceQueryRef = this.firebase.child('serviceProfiles').orderByChild("district").equalTo(filters.districtFilter)
        } else if (filters.cityFilter !== null) {
          serviceQueryRef = this.firebase.child('serviceProfiles').orderByChild("city").equalTo(filters.cityFilter)
        } else if (filters.stateFilter !== null) {
          serviceQueryRef = this.firebase.child('serviceProfiles').orderByChild("state").equalTo(filters.stateFilter)
        } else if (filters.countryFilter !== null) {
          serviceQueryRef = this.firebase.child('serviceProfiles').orderByChild("country").equalTo(filters.countryFilter)
        } else if (filters.activityFilter !== null) {
            serviceQueryRef = this.firebase.child('serviceProfiles').orderByChild("activityType").equalTo(filters.activityFilter)
        } else if(filters.ratingFilter !== null){
          serviceQueryRef = this.firebase.child('serviceProfiles').orderByChild("rating").startAt(filters.ratingFilter)
        } else if (filters.saleFilter !== null){
          serviceQueryRef = this.firebase.child('serviceProfiles').orderByChild("sale").equalTo(true)
        }
      }

      if(searchGroup){
        if (filters.districtFilter !== null) {
          groupQueryRef = this.firebase.child('groupProfiles').orderByChild("district").equalTo(filters.districtFilter)
        } else if (filters.cityFilter !== null) {
          groupQueryRef = this.firebase.child('groupProfiles').orderByChild("city").equalTo(filters.cityFilter)
        } else if (filters.stateFilter !== null) {
          groupQueryRef = this.firebase.child('groupProfiles').orderByChild("state").equalTo(filters.stateFilter)
        } else if (filters.countryFilter !== null) {
          groupQueryRef = this.firebase.child('groupProfiles').orderByChild("country").equalTo(filters.countryFilter)
        } else if (filters.ratingFilter !== null){
          groupQueryRef = this.firebase.child('groupProfiles').orderByChild("rating").startAt(filters.ratingFilter)
        } else if (filters.activityFilter !== null) {
          groupQueryRef = this.firebase.child('groupProfiles').orderByChild("activityType").equalTo(filters.activityFilter)
        } else if (filters.saleFilter !== null) {
          groupQueryRef = this.firebase.child('groupProfiles').orderByChild("sale").equalTo(true)
        }
      }

      if(searchService){

        serviceQueryRef.once('value')
          .then((snap) => {

            snap.forEach((child) => {

              var service = child.val()

              if (filters.activityFilter !== null){
                if (service.activityType === filters.activityFilter){
                  filtersReached++
                }
              }

              if (filters.ratingFilter !== null) {
                if (service.rating.averageRating >= filters.ratingFilter) {
                  filtersReached++
                }
              }

              if (filters.cityFilter !== null) {
                if (service.city === filters.cityFilter) {
                  filtersReached++
                }
              }

              if (filters.stateFilter !== null) {
                if (service.state === filters.stateFilter) {
                  filtersReached++
                }
              }

              if (filters.countryFilter !== null) {
                if (service.country === filters.countryFilter) {
                  filtersReached++
                }
              }

              if (filters.districtFilter !== null) {
                if (service.district === filters.districtFilter) {
                  filtersReached++
                }
              }

              if (filters.saleFilter !== null) {
                if (service.sale === true) {
                  filtersReached++
                }
              }

              if(filtersReached === filters.filterCount){
                service.key = child.key
                serviceArray.push(service)
              }
              
              filtersReached = 0  
            })

            if(searchGroup){

              groupQueryRef.once('value')
                .then((snap) => {

                  if (snap.numChildren() === 0) {
                    next(serviceArray)
                  }

                  snap.forEach((child) => {

                    var group = child.val()

                    if (filters.activityFilter !== null) {
                      if (group.activityType === filters.activityFilter) {
                        filtersReached++
                      }
                    }

                    if (filters.ratingFilter !== null) {
                      if (group.rating.averageRating >= filters.ratingFilter) {
                        filtersReached++
                      }
                    }

                    if (filters.cityFilter !== null) {
                      if (group.city === filters.cityFilter) {
                        filtersReached++
                      }
                    }

                    if (filters.stateFilter !== null) {
                      if (group.state === filters.stateFilter) {
                        filtersReached++
                      }
                    }

                    if (filters.countryFilter !== null) {
                      if (group.country === filters.countryFilter) {
                        filtersReached++
                      }
                    }

                    if (filters.districtFilter !== null) {
                      if (group.district === filters.districtFilter) {
                        filtersReached++
                      }
                    }

                    if (filters.saleFilter !== null) {
                      if (group.sale === true) {
                        filtersReached++
                      }
                    }

                    if (filtersReached === filters.filterCount) {

                      numberOfGroups++

                      group.key = child.key

                      var groupMembersRef = this.firebase.child('groupMembers').child(group.key).orderByChild('memberID').equalTo(this.getCurrentUserID())

                      groupMembersRef.once('value')
                      .then((snap) => {

                        if(snap.numChildren() !== 0){
                          group.isMember = true
                        } else{
                          group.isMember = false
                        }

                        serviceArray.push(group)

                        numberOfGroupsChecked++

                        if(numberOfGroupsChecked === numberOfGroups){

                          next(serviceArray)
                        }

                      })
                      .catch((err) => {error(err)})        
                    }

                    filtersReached = 0
                  })

                  
                })
                .catch((err) => {error(err)})

            }else{
              next(serviceArray)
            }

          })
          .catch((err) => error(err))

      }else{

        groupQueryRef.once('value')
          .then((snap) => {

            if(snap.numChildren() === 0){
              next(serviceArray)
            }

            snap.forEach((child) => {

              var group = child.val()

              if (filters.activityFilter !== null) {
                if (group.activityType === filters.activityFilter) {
                  filtersReached++
                }
              }

              if (filters.ratingFilter !== null) {
                if (group.rating.averageRating >= filters.ratingFilter) {
                  filtersReached++
                }
              }

              if (filters.cityFilter !== null) {
                if (group.city === filters.cityFilter) {
                  filtersReached++
                }
              }

              if (filters.stateFilter !== null) {
                if (group.state === filters.stateFilter) {
                  filtersReached++
                }
              }

              if (filters.countryFilter !== null) {
                if (group.country === filters.countryFilter) {
                  filtersReached++
                }
              }

              if (filters.districtFilter !== null) {
                if (group.district === filters.districtFilter) {
                  filtersReached++
                }
              }

              if (filtersReached === filters.filterCount) {

                numberOfGroups++

                group.key = child.key

                var groupMembersRef = this.firebase.child('groupMembers').child(group.key).orderByChild('memberID').equalTo(this.getCurrentUserID())

                groupMembersRef.once('value')
                  .then((snap) => {

                    if (snap.numChildren() !== 0) {
                      group.isMember = true
                    } else {
                      group.isMember = false
                    }

                    serviceArray.push(group)

                    numberOfGroupsChecked++

                    if (numberOfGroupsChecked === numberOfGroups) {

                      next(serviceArray)
                    }

                  })
                  .catch((err) => { error(err) })
              }

              filtersReached = 0
            })
          })
          .catch((err) => { error(err) })
      }

    })

  }

  addRating(ID,rating,callbackFunction,isGroup){

     let starCountRef = null

      if(isGroup){
        starCountRef = this.firebase.child("groupProfiles").child(ID).child("starCount")
      } else {
        starCountRef = this.firebase.child("serviceProfiles").child(ID).child("starCount")
      }

      

      if(rating === 1){
        starCountRef.child("oneStar").transaction(function(currentValue){
          return (currentValue || 0) + 1
        },function(){
          callbackFunction()
        })
      }else if(rating === 2){
        starCountRef.child("twoStars").transaction(function (currentValue) {
          return(currentValue || 0) + 1
        }, function () {
          callbackFunction()
        })
      }else if(rating === 3){
        starCountRef.child("threeStars").transaction(function (currentValue) {
          return (currentValue || 0) + 1
        },function () {
          callbackFunction()
        })
      } else if(rating === 4) {
        starCountRef.child("fourStars").transaction(function (currentValue) {
          return (currentValue || 0) + 1
        }, function () {
          callbackFunction()
        })
      } else if (rating === 5) {
        starCountRef.child("fiveStars").transaction(function (currentValue) {
          return (currentValue || 0) + 1
        }, function () {
          callbackFunction()
        })
      }

  }

  calculateNewRating(ID, isGroup){

    return new Promise((next, error) => {

      let starCountRef = null
      let serviceRef = null

      if(isGroup){
        starCountRef = this.firebase.child("groupProfiles").child(ID).child("starCount")
        serviceRef = this.firebase.child("groupProfiles").child(ID)
      } else {
        starCountRef = this.firebase.child("serviceProfiles").child(ID).child("starCount")
        serviceRef = this.firebase.child("serviceProfiles").child(ID)
      }

   
      var rating = 0

      starCountRef.once('value')
      .then((snap) => {

        rating = (snap.val().oneStar * 1 + snap.val().twoStars * 2 + snap.val().threeStars * 3 + snap.val().fourStars * 4 + snap.val().fiveStars * 5) / (snap.val().oneStar + snap.val().twoStars + snap.val().threeStars + snap.val().fourStars + snap.val().fiveStars)

        serviceRef.child('rating').update({
          averageRating: rating
        })
        .then(() => {next()})
        .catch((err) => {error(err)})

      })
      .catch((err) => error(err))

    })
  
  }

  listenToNewFriendsAdded(callbackFunction){

    var newInfo = false
    let userFriendsRef = this.firebase.child("userRelationships").child(this.getCurrentUserID())
    let firebaseRef = this.firebase

    userFriendsRef.on("child_added", function (snapshot) {
      if(!newInfo) {
        return
      }

      var friendRef = firebaseRef.child('userProfiles').child(snapshot.val().friendID)

      friendRef.once('value')
        .then((snap) => {
          var newFriend = snap.val()
          newFriend.key = snapshot.val().friendID
       
          callbackFunction(newFriend)
        })
        .catch((err) => {})
      
    })

    userFriendsRef.once('value')
    .then((snap) => {
      newInfo = true
    })
    .catch((err) => {})

  }

  listenToFriendsOnlineStatus(callbackFunction){

    let userFriendsRef = this.firebase.child('userRelationships').child(this.getCurrentUserID())
    let firebaseReference = this.getFirebaseRef()

    userFriendsRef.once('value')
    .then((snap) => {

      snap.forEach((child) => {

        var friendOnlineStatusRef = this.firebase.child('userOnlineStatus').child(child.val().friendID)

        friendOnlineStatusRef.on('child_changed', function (snapshot) {

          var newFriend = {}

          if(snapshot.val() === false){
            newFriend.online = false
            newFriend.key = child.val().friendID

            callbackFunction(newFriend)
          } else {

            var friendRef = firebaseReference.child('userProfiles').child(child.val().friendID)

            friendRef.once('value')
            .then((friend) => {

              newFriend = friend.val()
              newFriend.online = true
              newFriend.key = child.val().friendID

              callbackFunction(newFriend)

            })
            .catch((err) => {})

          }

        })

      })

    })
    .catch((err) => {})

  }

  listenToNewMembersAdded(callbackFunction) {

    var newInfo = false
    let groupMembersRef = this.firebase.child("groupMembers").child(this.getCurrentGroupID())
    let firebaseRef = this.firebase

    groupMembersRef.on("child_added", function (snapshot) {
      if (!newInfo) {
        return
      }

      var memberRef = firebaseRef.child('userProfiles').child(snapshot.val().memberID)

      memberRef.once('value')
        .then((snap) => {
          var newMember = snap.val()
          newMember.key = snapshot.val().memberID

          callbackFunction(newMember)
        })
        .catch((err) => { })

    })

    groupMembersRef.once('value')
      .then((snap) => {
        newInfo = true
      })
      .catch((err) => { })

  }

  listenToNewPinsAdded(callbackFunction) {

    var newInfo = false
    let pinsRef = this.firebase.child("pins")
    let firebaseRef = this.firebase

    pinsRef.on("child_added", function (snapshot) {
      if (!newInfo) {
        return
      }

      var newPin = snapshot.val()
      newPin.key = snapshot.key
      newPin.coordinate = {
        latitude: snapshot.val().latitude,
        longitude: snapshot.val().longitude
      }

      newPin.images = []

      if (snapshot.val().image1) {
        newPin.images.push(snapshot.val().image1)
      }

      if (snapshot.val().image2) {
        newPin.images.push(snapshot.val().image2)
      }

      if (snapshot.val().image3) {
        newPin.images.push(snapshot.val().image3)
      }

      if (snapshot.val().image4) {
        newPin.images.push(snapshot.val().image4)
      }


      callbackFunction(newPin)


    })

    pinsRef.once('value')
      .then((snap) => {
        newInfo = true
      })
      .catch((err) => { })

  }

  listenToPinRemoved(callbackFunction){

    let pinsRef = this.firebase.child("pins")

    pinsRef.on('child_removed', function (snapshot) {

      var pinRemoved = snapshot.val()
      pinRemoved.key = snapshot.key

      callbackFunction(pinRemoved)
    })

  }

  listenToUserPinChanges(callbackFunction) {

    let userPinsRef = this.firebase.child("userPins").child(this.getCurrentUserID())

    userPinsRef.on("child_changed", function (snapshot) {

      var pinChanged = snapshot.val()
      pinChanged.key = snapshot.key

      callbackFunction(pinChanged)
    })

  }

  listenToUserPinRemoved(callbackFunction) {

    let userPinsRef = this.firebase.child("userPins").child(this.getCurrentUserID())

    userPinsRef.on('child_removed', function (snapshot) {

      var pinRemoved = snapshot.val()
      pinRemoved.key = snapshot.key

      callbackFunction(pinRemoved)
    })

  }

  listenToNewPetsAdded(callbackFunctionPets, callbackFunctionTemporaryHomePets) {

    var newInfoPets = false
    var newInfoTemporaryHomePets = false
    let userPetsRef = this.firebase.child("userProfiles").child(this.getCurrentUserID()).child('userPets')
    let userTemporaryHomePetsRef = this.firebase.child("userProfiles").child(this.getCurrentUserID()).child('userTemporaryHomePets')
    let firebaseRef = this.firebase

    userPetsRef.on("child_added", function (snapshot) {
      if (!newInfoPets) {
        return
      }

      var newPet = snapshot.val()
      newPet.key = snapshot.key

      callbackFunctionPets(newPet)


    },this)

    userPetsRef.once('value')
      .then((snap) => {
        newInfoPets = true
      })
      .catch((err) => {})

    userTemporaryHomePetsRef.on("child_added", function (snapshot) {
      if (!newInfoTemporaryHomePets) {
        return
      }

      var newTemporaryHomePet = snapshot.val()
      newTemporaryHomePet.key = snapshot.key

      callbackFunctionTemporaryHomePets(newTemporaryHomePet)


    },this)

    userTemporaryHomePetsRef.once('value')
      .then((snap) => {
        newInfoTemporaryHomePets = true
      })
      .catch((err) => {})



  }

  listenToUserPetChanges(callbackFunction) {

    let userPetsRef = this.firebase.child("userProfiles").child(this.getCurrentUserID()).child('userPets')

    userPetsRef.on("child_changed", function (snapshot) {

      var petChanged = snapshot.val()
      petChanged.key = snapshot.key

      callbackFunction(petChanged)
    })

  }

  listenToUserTemporaryHomePetChanges(callbackFunction) {

    let userTemporaryHomePetsRef = this.firebase.child("userProfiles").child(this.getCurrentUserID()).child('userTemporaryHomePets')

    userTemporaryHomePetsRef.on("child_changed", function (snapshot) {

      var petChanged = snapshot.val()
      petChanged.key = snapshot.key

      callbackFunction(petChanged)
    })

  }

  listenToUserPetRemoved(callbackFunction) {

    let userPetsRef = this.firebase.child("userProfiles").child(this.getCurrentUserID()).child('userPets')

    userPetsRef.on('child_removed', function (snapshot) {

      var petRemoved = snapshot.val()
      petRemoved.key = snapshot.key

      callbackFunction(petRemoved)
    },this)

  }

  listenToUserTemporaryHomePetRemoved(callbackFunction) {

    let userTemporaryHomePetsRef = this.firebase.child("userProfiles").child(this.getCurrentUserID()).child('userTemporaryHomePets')

    userTemporaryHomePetsRef.on('child_removed', function (snapshot) {

      var petRemoved = snapshot.val()
      petRemoved.key = snapshot.key

      callbackFunction(petRemoved)
    },this)

  }

  listenToNewGroupAnimalsAdded(callbackFunctionAdotpion, callbackFunctionAdopted) {

    var newInfoAdopted = false
    var newInfoAdoption = false
    let groupAnimalsRef = this.firebase.child("groupProfiles").child(this.getCurrentGroupID()).child('groupAnimals')
    let groupAdoptedAnimalsRef = this.firebase.child("groupProfiles").child(this.getCurrentGroupID()).child('groupAdoptedAnimals')
    let firebaseRef = this.firebase

    groupAnimalsRef.on("child_added", function (snapshot) {
      if (!newInfoAdoption) {
        return
      }

      var newAnimal = snapshot.val()

      callbackFunctionAdotpion(newAnimal)


    })

    groupAnimalsRef.once('value')
      .then((snap) => {
        newInfoAdoption = true
      })
      .catch((err) => { })

    groupAdoptedAnimalsRef.on("child_added", function (snapshot) {
      if (!newInfoAdopted) {
        return
      }

      var newAdoptedAnimal = snapshot.val()

      callbackFunctionAdopted(newAdoptedAnimal)


    })

    groupAdoptedAnimalsRef.once('value')
      .then((snap) => {
        newInfoAdopted = true
      })
      .catch((err) => { })

  }

  listenToGroupAnimalChanges(callbackFunction) {

    let groupAnimalsRef = this.firebase.child("groupProfiles").child(this.getCurrentGroupID()).child('groupAnimals')

    groupAnimalsRef.on("child_changed", function (snapshot) {

      var petChanged = snapshot.val()
      petChanged.key = snapshot.key

      callbackFunction(petChanged)
    })

  }

  listenToGroupAdoptedAnimalChanges(callbackFunction) {

    let groupAdoptedAnimalsRef = this.firebase.child("groupProfiles").child(this.getCurrentGroupID()).child('groupAdoptedAnimals')

    groupAdoptedAnimalsRef.on("child_changed", function (snapshot) {

      var petChanged = snapshot.val()
      petChanged.key = snapshot.key

      callbackFunction(petChanged)
    })

  }

  listenToGroupAnimalRemoved(callbackFunction) {

    let groupAnimalsRef = this.firebase.child("groupProfiles").child(this.getCurrentGroupID()).child('groupAnimals')

    groupAnimalsRef.on('child_removed', function (snapshot) {

      var petRemoved = snapshot.val()
      petRemoved.key = snapshot.key

      callbackFunction(petRemoved)
    })

  }

  listenToGroupAdoptedAnimalRemoved(callbackFunction) {

    let groupAdoptedAnimalsRef = this.firebase.child("groupProfiles").child(this.getCurrentGroupID()).child('groupAdoptedAnimals')

    groupAdoptedAnimalsRef.on('child_removed', function (snapshot) {

      var petRemoved = snapshot.val()
      petRemoved.key = snapshot.key

      callbackFunction(petRemoved)
    })

  }

  listenToGroupFareChanges(callbackFunction) {

    let groupFaresRef = this.firebase.child("groupFares").child(this.getCurrentGroupID())

    groupFaresRef.on("child_changed", function (snapshot) {

      var fareChanged = snapshot.val()
      fareChanged.key = snapshot.key

      callbackFunction(fareChanged)
    })

  }

  listenToGroupFareRemoved(callbackFunction) {

    let groupFaresRef = this.firebase.child("groupFares").child(this.getCurrentGroupID())

    groupFaresRef.on('child_removed', function (snapshot) {

      var fareRemoved = snapshot.val()
      fareRemoved.key = snapshot.key

      callbackFunction(fareRemoved)
    })

  }

  listenToNewUserMessageOrNotificationReceived(callbackFunction) {

    let userMessagesRef = this.firebase.child('userMessages').child(this.getCurrentUserID())
    let userNotificationsRef = this.firebase.child('userNotifications').child(this.getCurrentUserID())

    let newMessages = false
    let newNotifications = false

    userMessagesRef.on('child_added', function (snapshot) {
      if (!newMessages) {
        return
      }

      var newMessage = snapshot.val()
      newMessage.key = snapshot.key

      callbackFunction(true,newMessage)
    })

    userMessagesRef.once('value')
      .then((snap) => {
        newMessages = true
      })
      .catch((err) => { })

    userNotificationsRef.on('child_added', function (snapshot) {
      if (!newNotifications) {
        return
      }

      var newNotification = snapshot.val()
      newNotification.key = snapshot.key

      callbackFunction(false,newNotification)
    })

    userNotificationsRef.once('value')
      .then((snap) => {
        newNotifications = true
      })
      .catch((err) => { })


  }

  listenToUserNotificationOrMessageChanged(callbackFunction) {

    let userMessagesRef = this.firebase.child('userMessages').child(this.getCurrentUserID())
    let userNotificationsRef = this.firebase.child('userNotifications').child(this.getCurrentUserID())

    userNotificationsRef.on('child_changed', function (snapshot) {

      callbackFunction()
    })

    userMessagesRef.on('child_changed', function (snapshot) {

      callbackFunction()
    })

  }


  listenToUserNotificationOrMessageRemoved(callbackFunction) {

    let userMessagesRef = this.firebase.child('userMessages').child(this.getCurrentUserID())
    let userNotificationsRef = this.firebase.child('userNotifications').child(this.getCurrentUserID())

    userNotificationsRef.on('child_removed', function (snapshot) {

      callbackFunction()
    })

    userMessagesRef.on('child_removed', function (snapshot) {

      callbackFunction()
    })

  }

  listenToNewUserMessages(callbackFunction){

    let userMessagesRef = this.firebase.child('userMessages').child(this.getCurrentUserID())
    let newInfo = false

    userMessagesRef.on('child_added', function(snapshot){
      if (!newInfo) {
        return
      }
      var newMessage = snapshot.val()

      callbackFunction(newMessage)
    })

    userMessagesRef.once('value')
    .then((snap) => {
      newInfo = true
    })
    .catch((err) => {})

  }

  listenToUserMessageChanges(callbackFunction) {

    let userMessagesRef = this.firebase.child("userMessages").child(this.getCurrentUserID())

    userMessagesRef.on("child_changed", function (snapshot) {

      var changedMessage = snapshot.val()
      changedMessage.key = snapshot.key

      callbackFunction(changedMessage)
    })

  }

  listenToNewUserNotifications(callbackFunction) {

    let userNotificationsRef = this.firebase.child('userNotifications').child(this.getCurrentUserID())
    let newInfo = false

    userNotificationsRef.on('child_added', function (snapshot) {
      if (!newInfo) {
        return
      }
      var newNotification = snapshot.val()

      callbackFunction(newNotification)
    })

    userNotificationsRef.once('value')
      .then((snap) => {
        newInfo = true
      })
      .catch((err) => { })

  }

  listenToUserNotificationChanges(callbackFunction) {

    let userNotificationsRef = this.firebase.child("userNotifications").child(this.getCurrentUserID())

    userMessagesRef.on("child_changed", function (snapshot) {

      var changedNotification = snapshot.val()
      changedNotification.key = snapshot.key

      callbackFunction(changedNotification)
    })

  }

  listenToUserFriendRemoved(callbackFunction) {

    let userFriendsRef = this.firebase.child("userRelationships").child(this.getCurrentUserID())

    userFriendsRef.on('child_removed', function (snapshot) {

      var friendRemoved = snapshot.val()
      friendRemoved.key = snapshot.val().friendID

      callbackFunction(friendRemoved)
    })

  }

  listenToUserMessageRemoved(callbackFunction) {

    let userMessagesRef = this.firebase.child('userMessages').child(this.getCurrentUserID())

    userMessagesRef.on('child_removed', function (snapshot) {

      var messageRemoved = snapshot.val()
      messageRemoved.key = snapshot.key

      callbackFunction(messageRemoved)
    })

  }

  listenToUserNotificationRemoved(callbackFunction){

    let userNotificationsRef = this.firebase.child('userNotifications').child(this.getCurrentUserID())

    userNotificationsRef.on('child_removed', function (snapshot) {

      var notificationRemoved = snapshot.val()
      notificationRemoved.key = snapshot.key

      callbackFunction(notificationRemoved)
    })

  }

  listenToRemovedGroupMember(callbackFunction) {

    let groupMembersRef = this.firebase.child("groupMembers").child(this.getCurrentGroupID())

    groupMembersRef.on('child_removed', function (snapshot) {

      var memberRemoved = snapshot.val()
      memberRemoved.key = snapshot.val().memberID

      callbackFunction(memberRemoved)
    })

  }

  listenToNewServiceMessages(callbackFunction) {

    let serviceMessagesRef = this.firebase.child('serviceMessages').child(this.getCurrentServiceID())
    let newInfo = false

    serviceMessagesRef.on('child_added', function (snapshot) {
      if (!newInfo) {
        return
      }
      var newMessage = snapshot.val()
      callbackFunction(newMessage)
    })

    serviceMessagesRef.once('value')
      .then((snap) => {
        newInfo = true
      })
      .catch((err) => { })

  }

  listenToServiceInfoChanges(serviceID,callbackFunction) {

    let serviceRef = this.firebase.child("serviceProfiles").child(serviceID)

    serviceRef.on("child_changed", function (snapshot) {

      serviceRef.once('value')
      .then((snap) => {

        var serviceInfoChanged = snap.val()
        serviceInfoChanged.key = snap.key

        callbackFunction(serviceInfoChanged)
      })
      .catch()
    })

  }

  listenToServiceMessageChanges(callbackFunction) {

    let serviceMessagesRef = this.firebase.child("serviceMessages").child(this.getCurrentServiceID())

    serviceMessagesRef.on("child_changed", function (snapshot) {

      var changedMessage = snapshot.val()
      changedMessage.key = snapshot.key

      callbackFunction(changedMessage)
    })

  }


  listenToServiceMessageRemoved(callbackFunction) {

    let serviceMessagesRef = this.firebase.child('serviceMessages').child(this.getCurrentServiceID())

    serviceMessagesRef.on('child_removed', function (snapshot) {

      var messageRemoved = snapshot.val()
      messageRemoved.key = snapshot.key

      callbackFunction(messageRemoved)
    })

  }

  listenToNewGroupMessageOrNotificationReceived(callbackFunction) {

    let groupMessagesRef = this.firebase.child('groupMessages').child(this.getCurrentGroupID())
    let groupNotificationsRef = this.firebase.child('groupNotifications').child(this.getCurrentGroupID())

    let newMessages = false
    let newNotifications = false

    groupMessagesRef.on('child_added', function (snapshot) {
      if (!newMessages) {
        return
      }

      callbackFunction()
    })

    groupMessagesRef.once('value')
      .then((snap) => {
        newMessages = true
      })
      .catch((err) => { })

    groupNotificationsRef.on('child_added', function (snapshot) {
      if (!newNotifications) {
        return
      }
      callbackFunction()
    })

    groupNotificationsRef.once('value')
      .then((snap) => {
        newNotifications = true
      })
      .catch((err) => { })


  }

  listenToGroupNotificationOrMessageRemoved(callbackFunction) {

    let groupMessagesRef = this.firebase.child('groupMessages').child(this.getCurrentGroupID())
    let groupNotificationsRef = this.firebase.child('groupNotifications').child(this.getCurrentGroupID())

    groupNotificationsRef.on('child_removed', function (snapshot) {

      callbackFunction()
    })

    groupMessagesRef.on('child_removed', function (snapshot) {

      callbackFunction()
    })

  }

  listenToGroupNotificationOrMessageChanged(callbackFunction) {

    let groupMessagesRef = this.firebase.child('groupMessages').child(this.getCurrentGroupID())
    let groupNotificationsRef = this.firebase.child('groupNotifications').child(this.getCurrentGroupID())

    groupNotificationsRef.on('child_changed', function (snapshot) {

      callbackFunction()
    })

    groupMessagesRef.on('child_changed', function (snapshot) {

      callbackFunction()
    })

  }

  listenToNewGroupMessages(callbackFunction) {

    let groupMessagesRef = this.firebase.child('groupMessages').child(this.getCurrentGroupID())
    let newInfo = false

    groupMessagesRef.on('child_added', function (snapshot) {
      if (!newInfo) {
        return
      }
      var newMessage = snapshot.val()
      callbackFunction(newMessage)
    })

    groupMessagesRef.once('value')
      .then((snap) => {
        newInfo = true
      })
      .catch((err) => { })

  }

  listenToGroupMessageChanges(callbackFunction) {

    let groupMessagesRef = this.firebase.child("groupMessages").child(this.getCurrentGroupID())

    groupMessagesRef.on("child_changed", function (snapshot) {

      var changedMessage = snapshot.val()
      changedMessage.key = snapshot.key

      callbackFunction(changedMessage)
    })

  }

  listenToGroupMessageRemoved(callbackFunction) {

    let groupMessagesRef = this.firebase.child('groupMessages').child(this.getCurrentGroupID())

    groupMessagesRef.on('child_removed', function (snapshot) {

      var messageRemoved = snapshot.val()
      messageRemoved.key = snapshot.key

      callbackFunction(messageRemoved)
    })

  }

  listenToNewGroupNotifications(callbackFunction) {

    let groupNotificationsRef = this.firebase.child('groupNotifications').child(this.getCurrentGroupID())
    let newInfo = false

    groupNotificationsRef.on('child_added', function (snapshot) {
      if (!newInfo) {
        return
      }
      var newNotification = snapshot.val()

      callbackFunction(newNotification)
    })

    groupNotificationsRef.once('value')
      .then((snap) => {
        newInfo = true
      })
      .catch((err) => { })

  }

  listenToGroupNotificationChanges(callbackFunction) {

    let groupNotificationsRef = this.firebase.child("groupNotifications").child(this.getCurrentGroupID())

    groupNotificationsRef.on("child_changed", function (snapshot) {

      var changedNotification = snapshot.val()
      changedNotification.key = snapshot.key

      callbackFunction(changedNotification)
    })

  }


  listenToGroupNotificationRemoved(callbackFunction) {

    let groupNotificationsRef = this.firebase.child('groupNotifications').child(this.getCurrentGroupID())

    groupNotificationsRef.on('child_removed', function (snapshot) {

      var notificationRemoved = snapshot.val()
      notificationRemoved.key = snapshot.key

      callbackFunction(notificationRemoved)
    })

  }


  listenToGroupFareAdded(callbackFunction) {

    let groupFareRef = this.firebase.child("groupFares").child(this.getCurrentGroupID())
    var newInfo = false

    groupFareRef.on('child_added', function (snapshot) {
      if (!newInfo) {
        return
      }
      var newFare = snapshot.val()
      fareRemoved.key = snapshot.key

      callbackFunction(newFare)
    })

    groupFareRef.once('value')
      .then((snap) => {
        newInfo = true
      })
      .catch((err) => { })

  }

  listenToGroupFareChanges(callbackFunction) {

    let groupFareRef = this.firebase.child("groupFares").child(this.getCurrentGroupID())

    groupFareRef.on("child_changed", function (snapshot) {

      var changedFare = snapshot.val()
      changedFare.key = snapshot.key

      callbackFunction(changedFare)
    })

  }

  listenToGroupFareRemoved(callbackFunction) {

    let groupFareRef = this.firebase.child("groupFares").child(this.getCurrentGroupID())

    groupFareRef.on('child_removed', function (snapshot) {

      var fareRemoved = snapshot.val()
      fareRemoved.key = snapshot.key

      callbackFunction(fareRemoved)
    })

  }
  

  listenToRatingChanges(serviceID, callbackFunction) {

    let serviceRef = this.firebase.child("serviceProfiles").child(serviceID)

    serviceRef.child('rating').on("child_changed", function(snapshot){

      var newRating = snapshot.val()

      callbackFunction(newRating)
    })

  }

  listenToGroupRatingChanges(groupID, callbackFunction) {

    let serviceRef = this.firebase.child("groupProfiles").child(groupID)

    serviceRef.child('rating').on("child_changed", function (snapshot) {

      var newRating = snapshot.val()

      callbackFunction(newRating)
    })

  }

  listenToNewPinComment(pinID,callbackFunction){

    var newInfo = false
    let pinCommentsRef = this.firebase.child("pinComments").child(pinID)
    let firebaseRef = this.firebase

    pinCommentsRef.on("child_added", function (snapshot) {
      if (!newInfo) {
        return
      }

      var commentRef = firebaseRef.child('pinComments').child(pinID).child(snapshot.key)

      commentRef.once('value')
        .then((snap) => {
          var comment = snap.val()
          comment.key = snapshot.key

          callbackFunction(comment)
        })
        .catch((err) => { })

    })

    pinCommentsRef.once('value')
      .then((snap) => {
        newInfo = true
      })
      .catch((err) => { })

  }


  listenToPinCommentChanges(pinID,callbackFunction){

    let pinCommentsRef = this.firebase.child("pinComments").child(pinID)

    pinCommentsRef.on("child_changed", function (snapshot) {

      var changedComment = snapshot.val()
      changedComment.key = snapshot.key

      callbackFunction(changedComment)
    })
  }

  listenToPinCommentRemoved(pinID,callbackFunction) {

    let pinCommentsRef = this.firebase.child("pinComments").child(pinID)

    pinCommentsRef.on('child_removed', function (snapshot) {

      var commentRemoved = snapshot.val()
      commentRemoved.key = snapshot.key

      callbackFunction(commentRemoved)
    })

  }

  listenToServicePinCommentChanges(serviceID, callbackFunction) {

    let servicePinCommentsRef = this.firebase.child("serviceComments").child(serviceID)

    servicePinCommentsRef.on("child_changed", function (snapshot) {

      var changedComment = snapshot.val()
      changedComment.key = snapshot.key

      callbackFunction(changedComment)
    })
  }

  listenToServicePinCommentRemoved(serviceID, callbackFunction) {

    let servicePinCommentsRef = this.firebase.child("serviceComments").child(serviceID)

    servicePinCommentsRef.on('child_removed', function (snapshot) {

      var commentRemoved = snapshot.val()
      commentRemoved.key = snapshot.key

      callbackFunction(commentRemoved)
    })

  }

  listenToPinFalseReportChanges(pinID, callbackFunction) {

    let pinFalseReportsRef = this.firebase.child("pins").child(pinID).child('reports').child('falseReports')

    pinFalseReportsRef.on("child_changed", function (snapshot) {


      var newReportAmount = snapshot.val()

      callbackFunction(newReportAmount)
    })
  }

  listenToPinInapropriateContentReportChanges(pinID, callbackFunction) {

    let pinInapropriateContentReportsRef = this.firebase.child("pins").child(pinID).child('reports').child('inapropriateContentReports')

    pinInapropriateContentReportsRef.on("child_changed", function (snapshot) {

      var newReportAmount = snapshot.val()

      callbackFunction(newReportAmount)
    })
  }

  listenToFarePinAnimalAdded(pinID, callbackFunction) {

    let farePinAnimalsRef = this.firebase.child("pins").child(pinID).child('fareAnimals')
    var newInfo = false

    farePinAnimalsRef.on('child_added', function (snapshot) {
      if (!newInfo) {
        return
      }
      var newAnimal = snapshot.val()

      callbackFunction(newAnimal)
    })

    farePinAnimalsRef.once('value')
      .then((snap) => {
        newInfo = true
      })
      .catch((err) => { })

  }

  listenToFarePinAnimalRemoved(pinID, callbackFunction) {

    let farePinAnimalsRef = this.firebase.child("pins").child(pinID).child('fareAnimals')

    farePinAnimalsRef.on('child_removed', function (snapshot) {

      var animalRemoved = snapshot.val()

      callbackFunction(animalRemoved)
    })

  }

  listenToFavoritePetToAdoptRemoved(callbackFunction) {

    let favoritePetsToAdoptRef = this.firebase.child("userProfiles").child(this.getCurrentUserID()).child('userFavoritePetsToAdopt')

    favoritePetsToAdoptRef.on('child_removed', function (snapshot) {

      var animalRemoved = snapshot.val()
      animalRemoved.favoriteKey = snapshot.key

      callbackFunction(animalRemoved)
    })

  }

  listenToFavoriteServiceOrGroupRemoved(callbackFunction) {

    let favoriteServicesAndGroupsRef = this.firebase.child("userProfiles").child(this.getCurrentUserID()).child('userFavoriteServicesAndGroups')

    favoriteServicesAndGroupsRef.on('child_removed', function (snapshot) {

      var serviceOrGroupRemoved = snapshot.val()
      serviceOrGroupRemoved.favoriteKey = snapshot.key

      callbackFunction(serviceOrGroupRemoved)
    })

  }

  removeRatingListener(serviceID){

    let ratingRef = this.firebase.child("serviceProfiles").child(serviceID).child("rating")

    ratingRef.off()
  }

  removeGroupRatingListener(groupID) {

    let ratingRef = this.firebase.child("groupProfiles").child(groupID).child("rating")

    ratingRef.off()
  }

  removeCommentsListener(serviceID){

    let commentsRef = this.firebase.child("serviceComments").child(serviceID)

    commentsRef.off()

  }

  removePinCommentsListener(pinID) {

    let commentsRef = this.firebase.child("pinComments").child(pinID)

    commentsRef.off()

  }

  removeGroupCommentsListener(groupID) {

    let commentsRef = this.firebase.child("groupComments").child(groupID)

    commentsRef.off()

  }

  removeNewFriendsListener(){
    let userFriendsRef = this.firebase.child('userRelationships').child(this.getCurrentUserID())

    userFriendsRef.off()
  }

  removeNewPetsListener(){
    let userPetsRef = this.firebase.child("userProfiles").child(this.getCurrentUserID()).child('userPets')
    let userTemporaryHomePetsRef = this.firebase.child("userProfiles").child(this.getCurrentUserID()).child('userTemporaryHomePets')

    userPetsRef.off()
    userTemporaryHomePetsRef.off()
  }

  removeNewUserMessagesListener() {
    let userMessagesRef = this.firebase.child('userMessages').child(this.getCurrentUserID())

    userMessagesRef.off()
  }

  removeNewServiceMessagesListener() {
    let serviceMessagesRef = this.firebase.child('serviceMessages').child(this.getCurrentServiceID())

    serviceMessagesRef.off()
  }

  removeNewGroupMessagesListener() {
    let groupMessagesRef = this.firebase.child('groupMessages').child(this.getCurrentGroupID())

    groupMessagesRef.off()
  }

  addUserPet(data) {
    return new Promise((next, error) => {

      let newUserPetRef = null
      var newUserPetKey = null

      if (data.petSituation === 0) {

        newUserPetKey = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userPets').push().key
        newUserPetRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userPets').child(newUserPetKey)
      }
      else {
        newUserPetKey = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userTemporaryHomePets').push().key
        newUserPetRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userTemporaryHomePets').child(newUserPetKey)
      }

      newUserPetRef.set({
        name: data.name,
        ageAmount: data.ageAmount,
        ageType: data.ageType,
        specie: data.specie,
        breed: data.breed,
        size: data.size,
        gender: data.gender,
        color: data.color,
        vaccinated: data.vaccinated,
        dewormed: data.dewormed,
        castrated: data.castrated,
        profilePhoto: data.profilePhoto,
        city: this.getCurrentUser().city,
        state: this.getCurrentUser().state,
        country: this.getCurrentUser().country
      })
        .then(() => {
          if (data.petSituation === 0) {
            this.currentUserPets.push({
              name: data.name,
              ageAmount: data.ageAmount,
              ageType: data.ageType,
              specie: data.specie,
              breed: data.breed,
              size: data.size,
              gender: data.gender,
              color: data.color,
              vaccinated: data.vaccinated,
              dewormed: data.dewormed,
              castrated: data.castrated,
              profilePhoto: data.profilePhoto,
              city: this.getCurrentUser().city,
              state: this.getCurrentUser().state,
              country: this.getCurrentUser().country,
              key: newUserPetKey
            })
          } else {
            this.currentUserTemporaryHomePets.push({
              name: data.name,
              ageAmount: data.ageAmount,
              ageType: data.ageType,
              specie: data.specie,
              breed: data.breed,
              size: data.size,
              gender: data.gender,
              color: data.color,
              vaccinated: data.vaccinated,
              dewormed: data.dewormed,
              castrated: data.castrated,
              profilePhoto: data.profilePhoto,
              city: this.getCurrentUser().city,
              state: this.getCurrentUser().state,
              country: this.getCurrentUser().country,
              key: newUserPetKey
            })
          }

          next()
        })
        .catch((err) => error(err))

    })
  }

  addGroupAnimal(data) {
    return new Promise((next, error) => {

      let newGroupAnimalRef = null
      var newGroupAnimalKey = null

      if (data.petSituation === 0) {

        newGroupAnimalKey = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAnimals').push().key
        newGroupAnimalRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAnimals').child(newGroupAnimalKey)
      }
      else {
        newGroupAnimalKey = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAdoptedAnimals').push().key
        newGroupAnimalRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAdoptedAnimals').child(newGroupAnimalKey)
      }

      newGroupAnimalRef.set({
        name: data.name,
        ageAmount: data.ageAmount,
        ageType: data.ageType,
        specie: data.specie,
        breed: data.breed,
        size: data.size,
        gender: data.gender,
        color: data.color,
        vaccinated: data.vaccinated,
        dewormed: data.dewormed,
        castrated: data.castrated,
        profilePhoto: data.profilePhoto,
        city: this.getCurrentGroup().city,
        state: this.getCurrentGroup().state,
        country: this.getCurrentGroup().country
      })
        .then(() => {
          if (data.petSituation === 0) {
            if(this.currentGroupAnimals){
              this.currentGroupAnimals.push({
                name: data.name,
                ageAmount: data.ageAmount,
                ageType: data.ageType,
                specie: data.specie,
                breed: data.breed,
                size: data.size,
                gender: data.gender,
                color: data.color,
                vaccinated: data.vaccinated,
                dewormed: data.dewormed,
                castrated: data.castrated,
                profilePhoto: data.profilePhoto,
                city: this.getCurrentGroup().city,
                state: this.getCurrentGroup().state,
                country: this.getCurrentGroup().country
              })
            }
          } else {
              if(this.currentGroupAdoptedAnimals) {
                this.currentGroupAdoptedAnimals.push({
                  name: data.name,
                  ageAmount: data.ageAmount,
                  ageType: data.ageType,
                  specie: data.specie,
                  breed: data.breed,
                  size: data.size,
                  gender: data.gender,
                  color: data.color,
                  vaccinated: data.vaccinated,
                  dewormed: data.dewormed,
                  castrated: data.castrated,
                  profilePhoto: data.profilePhoto,
                  city: this.getCurrentGroup().city,
                  state: this.getCurrentGroup().state,
                  country: this.getCurrentGroup().country
                })
              }    
          }
          next()
        })
        .catch((err) => error(err))

    })
  }

  addNewMemberAsGroup(newMemberID, notificationID) {

    return new Promise((next, error) => {

      var notificationRef = this.firebase.child('groupNotifications').child(this.getCurrentGroupID()).child(notificationID)

      var membersRef = this.firebase.child('groupMembers').child(this.getCurrentGroupID()).orderByChild('memberID').equalTo(newMemberID)

      membersRef.once('value')
        .then((snap) => {

          if (snap.numChildren() === 0) {

            var newMemberKey = this.firebase.child('groupMembers').child(this.getCurrentGroupID()).push().key
            let newMemberRef = this.firebase.child('groupMembers').child(this.getCurrentGroupID()).child(newMemberKey)

            newMemberRef.set({
              memberID: newMemberID
            })
              .then(() => {
                let memberRef = this.firebase.child('userProfiles').child(newMemberID)
                memberRef.once('value')
                  .then((snap) => {

                    var member = snap.val()
                    member.key = newMemberID
                    
                    if(this.currentGroupMembers){
                      this.currentGroupMembers.push(member)
                    }
                   
                    notificationRef.remove()
                      .then(() => {
                        next()
                      })
                      .catch((err) => error(err))

                  })
                  .catch((err) => { error(err) })

              })
              .catch((err) => error(err))
            

          } else {

            notificationRef.remove()
              .then(() => {
                next()
              })
              .catch((err) => error(err))
          }

        })
        .catch((err) => error(err))


    })
  }

  addNewMemberAsUser(groupID, notificationID) {

    return new Promise((next, error) => {

      var notificationRef = this.firebase.child('userNotifications').child(this.getCurrentUserID()).child(notificationID)

      var membersRef = this.firebase.child('groupMembers').child(groupID).orderByChild('memberID').equalTo(this.getCurrentUserID())

      membersRef.once('value')
        .then((snap) => {

          if (snap.numChildren() === 0) {

            var newMemberKey = this.firebase.child('groupMembers').child(groupID).push().key
            let newMemberRef = this.firebase.child('groupMembers').child(groupID).child(newMemberKey)

            newMemberRef.set({
              memberID: this.getCurrentUserID()
            })
              .then(() => {
                let memberRef = this.firebase.child('userProfiles').child(this.getCurrentUserID())
                memberRef.once('value')
                  .then((snap) => {

                    var member = snap.val()
                    member.key = this.getCurrentUserID()

                    if(this.currentGroupMembers){
                      this.currentGroupMembers.push(member)
                    }
                    
                    notificationRef.remove()
                      .then(() => {
                        next()
                      })
                      .catch((err) => error(err))

                  })
                  .catch((err) => { error(err) })

              })
              .catch((err) => error(err))

          } else {

            notificationRef.remove()
              .then(() => {
                next()
              })
              .catch((err) => error(err))
          }

        })
        .catch((err) => error(err))
    })
  }

  addNewFriend(newFriendID, notificationID) {

    return new Promise((next, error) => {

      //Adding new friend to current user

      var notificationRef = this.firebase.child('userNotifications').child(this.getCurrentUserID()).child(notificationID)

      var friendsRef = this.firebase.child('userRelationships').child(this.getCurrentUserID()).orderByChild('friendID').equalTo(newFriendID)

      friendsRef.once('value')
        .then((snap) => {

          if (snap.numChildren() === 0) {

            var newUserFriendKey = this.firebase.child('userRelationships').child(this.getCurrentUserID()).push().key
            let newUserFriendRef = this.firebase.child('userRelationships').child(this.getCurrentUserID()).child(newUserFriendKey)

            newUserFriendRef.set({
              friendID: newFriendID
            })
              .then(() => {
                let friendRef = this.firebase.child('userProfiles').child(newFriendID)
                friendRef.once('value')
                  .then((snap) => {

                    var friend = snap.val()
                    friend.key = newFriendID

                    if (this.currentUserFriends) {
                      this.currentUserFriends.push(friend)
                    }

                    notificationRef.remove()
                      .then(() => {
                        next()
                      })
                      .catch((err) => error(err))

                  })
                  .catch((err) => { error(err) })
              })
              .catch((err) => error(err))

            // Adding current user as a new friend to the friend added

            var newFriendToUpdateKey = this.firebase.child('userRelationships').child(newFriendID).push().key
            let friendToUpdateRef = this.firebase.child('userRelationships').child(newFriendID).child(newUserFriendKey)

            friendToUpdateRef.set({
              friendID: this.getCurrentUserID()
            })
              .then(() => { })
              .catch((err) => error(err))

          } else {

            notificationRef.remove()
              .then(() => {
                next()
              })
              .catch((err) => error(err))
          }

        })
        .catch((err) => error(err))

    })
  }

  addNewCommentToServiceOrGroup(ID, message, isGroup){

    return new Promise((next, error) => {

      let newCommentKey = null
      let newCommentRef = null

      if(isGroup){
        newCommentKey = this.firebase.child("groupComments").child(ID).push().key
        newCommentRef = this.firebase.child("groupComments").child(ID).child(newCommentKey) 
      } else {
        newCommentKey = this.firebase.child("serviceComments").child(ID).push().key
        newCommentRef = this.firebase.child("serviceComments").child(ID).child(newCommentKey) 
      }



      newCommentRef.set({
        authorID: this.getCurrentUserID(),
        message: message
      })
      .then(() => {next()})
      .catch((err) => {error(err)})

    })

  }

  addNewCommentToPin(pinID, message) {

    return new Promise((next, error) => {

      let newCommentKey = this.firebase.child("pinComments").child(pinID).push().key
      let newCommentRef = this.firebase.child("pinComments").child(pinID).child(newCommentKey)

      newCommentRef.set({
        authorID: this.getCurrentUserID(),
        message: message
      })
        .then(() => { next() })
        .catch((err) => { error(err) })

    })

  }

  addNewPin(data){

    return new Promise((next, error) => {

    let newPinKey = this.firebase.child('pins').push().key
    let newPinRef = this.firebase.child('pins').child(newPinKey)
    let newUserPinRef = this.firebase.child('userPins').child(this.getCurrentUserID()).child(newPinKey)
    var userPinData = null

    data = Object.assign(data,{pinOwnerID: this.getCurrentUserID(), pinOwnerName: this.getCurrentUser().name + ' ' + this.getCurrentUser().surname,solved: false, reports:{falseReports:{falseReportsAmount: 0},inapropriateContentReports:{inapropriateContentReportsAmount: 0}}})
    userPinData = Object.assign(data,{pinID: newPinKey})

    newPinRef.set(data)
    .then(() => {
        newUserPinRef.set(userPinData)
        .then(() => next())
        .catch((err) => error(err))
    })
    .catch((err) => error(err))

    })

  }


  addNewServicePin(data, latitude, longitude, serviceID) {

    return new Promise((next, error) => {

      let newPinKey = this.firebase.child('pins').push().key
      let newPinRef = this.firebase.child('pins').child(newPinKey)

      var pinData = {
        pinOwnerID: serviceID,
        pinOwnerName: data.name,
        featured: false,
        openingHour: data.openingHour,
        closingHour: data.closingHour,
        backgroundImage: data.backgroundImage,
        adress: data.adress,
        district: data.district,
        city: data.city,
        state: data.state,
        country: data.country,
        activityType: data.activityType,
        phone: data.phone,
        celphone: data.celphone,
        email: data.email,
        website: data.website,
        latitude: latitude,
        longitude: longitude,
        type: 8,
        pinID: newPinKey,
        CRMV: data.crmv,
        reports: { 
            falseReports: { 
              falseReportsAmount: 0 
            }, 
            inapropriateContentReports: { 
              inapropriateContentReportsAmount: 0 
            } 
        }
      }

      newPinRef.set(pinData)
        .then(() => {
          next()
        })
        .catch((err) => error(err))

    })

  }

  addNewFarePin(data,fareAnimals){

    return new Promise((next, error) => {

      let newPinKey = this.firebase.child('pins').push().key
      let newPinRef = this.firebase.child('pins').child(newPinKey)
      let newGroupFareKey = this.firebase.child('groupFares').child(this.getCurrentGroupID()).push().key
      let newGroupFareRef = this.firebase.child('groupFares').child(this.getCurrentGroupID()).child(newGroupFareKey)
      var groupFareData = null
      var animalKeys = []

      var numberOfAnimals = fareAnimals.length
      var numberOfAnimalsAddedToFare = 0

      data = Object.assign(data, { pinOwnerID: this.getCurrentGroupID(), pinOwnerName: this.getCurrentGroup().name, active: true, pinID: newPinKey })


      newPinRef.set(data)
        .then(() => {

          for(var i = 0; i < fareAnimals.length; i++){

            var newFareAnimalKey = newPinRef.child('fareAnimals').push().key
            var newFareAnimalRef = newPinRef.child('fareAnimals').child(newFareAnimalKey)

            animalKeys.push(newFareAnimalKey)

            newFareAnimalRef.set(fareAnimals[i])
            .then(() => {

              numberOfAnimalsAddedToFare++

              if(numberOfAnimalsAddedToFare === numberOfAnimals){

                numberOfAnimalsAddedToFare = 0

                groupFareData = Object.assign(data, { pinID: newPinKey, adoptedAnimalsAmount: 0, animalsForAdoptionAmount: numberOfAnimals })

                newGroupFareRef.set(groupFareData)
                  .then(() => {

                    for (var i = 0; i < fareAnimals.length; i++) {

                      var newFareAnimalKey = newGroupFareRef.child('fareAnimals').push().key
                      var newFareAnimalRef = newGroupFareRef.child('fareAnimals').child(newFareAnimalKey)

                      fareAnimals[i] = Object.assign(fareAnimals[i], {animalKeyOnPin: animalKeys[i]})

                      newFareAnimalRef.set(fareAnimals[i])
                        .then(() => {
                          numberOfAnimalsAddedToFare++

                          if (numberOfAnimalsAddedToFare === numberOfAnimals) {
                            next()
                          }
                        })
                        .catch((err) => { error(err) })
                    }

                  })
                  .catch((err) => error(err))

              }
            })
            .catch((err) => {error(err)})
          }

         
        })
        .catch((err) => error(err))

    })
  }

  addServiceOrGroupToFavorites(ID,isGroup) {

    return new Promise((next, error) => {

      var newFavoriteServiceKey = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child("userFavoriteServicesAndGroups").push().key
      let newFavoriteServiceRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child("userFavoriteServicesAndGroups").child(newFavoriteServiceKey)

      if(isGroup){

        newFavoriteServiceRef.set({
          groupID: ID
        })
          .then(() => {
            let groupRef = this.firebase.child('groupProfiles').child(ID)
            groupRef.once('value')
              .then((snap) => {

                var group = snap.val()
                group.key = ID

                var groupMembersRef = this.firebase.child('groupMembers').child(group.key).orderByChild('memberID').equalTo(this.getCurrentUserID())

                groupMembersRef.once('value')
                  .then((snap) => {

                    if (snap.numChildren() !== 0) {
                      group.isMember = true
                    } else {
                      group.isMember = false
                    }

                    group.favoriteKey = newFavoriteServiceKey

                    if (this.currentUserFavoriteServicesAndGroups){
                      this.currentUserFavoriteServicesAndGroups.push(group)
                    }
                    next(newFavoriteServiceKey)

                  })
                  .catch((err) => { error(err) })
              })
              .catch((err) => { error(err) })
          })

      } else {

        newFavoriteServiceRef.set({
          serviceID: ID
        })
          .then(() => {
            let serviceRef = this.firebase.child('serviceProfiles').child(ID)
            serviceRef.once('value')
              .then((snap) => {

                var service = snap.val()
                service.key = ID
                service.favoriteKey = newFavoriteServiceKey
                if(this.currentUserFavoriteServicesAndGroups){
                  this.currentUserFavoriteServicesAndGroups.push(service)
                }
                next(newFavoriteServiceKey)

              })
              .catch((err) => { error(err) })

          })
      }

      
    })
  }


  addAdoptionPetToFavorites(animalID,ownerID, isGroupAnimal,animalData) {

    return new Promise((next, error) => {

      var newFavoritePetKey = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child("userFavoritePetsToAdopt").push().key
      let newFavoritePetRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child("userFavoritePetsToAdopt").child(newFavoritePetKey)

      if (isGroupAnimal) {

        newFavoritePetRef.set({
          animalID: animalID,
          ownerID: ownerID,
          ownerType: 'group'
        })
          .then(() => {
            var animal = animalData
            animal.key = animalData.key
            animal.favoriteKey = newFavoritePetKey
            animal.situation = "Para Adoção"
            this.currentUserFavoritePetsToAdopt.push(animal)
            next(newFavoritePetKey)
          })
          .catch((err) => error(err))

      } else {

        newFavoritePetRef.set({
          animalID: animalID,
          ownerID: ownerID,
          ownerType: 'user'
        })
          .then(() => {
            var animal = animalData
            animal.key = animalData.key
            animal.favoriteKey = newFavoritePetKey
            animal.situation = "Lar Temporário"
            this.currentUserFavoritePetsToAdopt.push(animal)
            next(newFavoritePetKey)
          })
          .catch((err) => error(err))
      }


    })
  }

  addPointsToUser(amount,callbackFunction){

    var userPointsRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('totalPoints')

    userPointsRef.transaction(function (currentValue) {
      return (currentValue || 0) + amount
    }, function () {
      callbackFunction()
    })

  }

  addCoinsToUser(amount,callbackFunction){

    var userCoinsRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('coinsAmount')

    userCoinsRef.transaction(function (currentValue) {
      return (currentValue || 0) + amount
    }, function () {
      callbackFunction()
    })

  }

  removePointsFromUser(amount,callbackFunction){

    var userPointsRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('totalPoints')

    userPointsRef.transaction(function (currentValue) {
      return (currentValue || 0) - amount
    }, function () {
      callbackFunction()
    })
  }

  removeCoinsFromUser(amount, callbackFunction) {

    var userCoinsRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('coinsAmount')

    userCoinsRef.transaction(function (currentValue) {
      return (currentValue || 0) - amount
    }, function () {
      callbackFunction()
    })

  }

  addPinReportToUser(pinOwnerID,pinID, callbackFunction) {
    var userRef = this.firebase.child('userProfiles').child(pinOwnerID).child('reports').child('pinReports')

    userRef.transaction(function (currentValue) {
      return (currentValue || 0) + 1
    }, function () {
      callbackFunction()
    })
  }

  addProfileReportToUser(userID, reportOption, callbackFunctionSuccess,callbackFunctionError) {
    var userRef = this.firebase.child('userProfiles').child(userID).child('reports').child('profileReports')
    
    if(reportOption === 1){
      var reportTypeRef = this.firebase.child('userProfiles').child(userID).child('reports').child('falseProfileReports');
    }else{
      var reportTypeRef = this.firebase.child('userProfiles').child(userID).child('reports').child('inapropriateProfileReports');
    }

    this.checkIfAlreadyReportedUser(userID)
    .then((alreadyInformed) => {

      if(!alreadyInformed){

        this.addInformerIDToUser(userID)
          .then(() => {

            reportTypeRef.transaction(function (currentValue){
              return (currentValue || 0) + 1
            })

            userRef.transaction(function (currentValue) {
              return (currentValue || 0) + 1
            }, function () {
              callbackFunctionSuccess()
            })

          })
          .catch((err) => error(err))
      } else {
        callbackFunctionError()
      }

    })
    .catch((err) => error(err))
      
  }

  addPinReportToService(pinOwnerID, pinID, callbackFunction) {
    var serviceRef = this.firebase.child('serviceProfiles').child(pinOwnerID).child('reports').child('pinReports')

    serviceRef.transaction(function (currentValue) {
      return (currentValue || 0) + 1
    }, function () {
      callbackFunction()
    })
  }

  addProfileReportToService(serviceID, callbackFunctionSuccess, callbackFunctionError) {
    var serviceRef = this.firebase.child('serviceProfiles').child(userID).child('reports').child('profileReports')

    this.checkIfAlreadyReportedService(serviceID)
      .then((alreadyInformed) => {

        if (!alreadyInformed) {

          this.addInformerIDToService(serviceID)
            .then(() => {

              serviceRef.transaction(function (currentValue) {
                return (currentValue || 0) + 1
              }, function () {
                callbackFunctionSuccess()
              })

            })
            .catch((err) => error(err))
        } else {
          callbackFunctionError()
        }

      })
      .catch((err) => error(err))

  }

  addFalseReportToPin(pinID, pinOwnerID, callbackFunctionSuccess, callbackFunctionError){
    var pinRef = this.firebase.child('pins').child(pinID).child('reports').child('falseReports').child('falseReportsAmount')
    var userPinRef = this.firebase.child('userPins').child(pinOwnerID).child(pinID).child('reports').child('falseReports').child('falseReportsAmount')

    this.checkIfAlreadyReportedPin(pinID)
    .then((alreadyInformed) => {

      if(!alreadyInformed){
     
        this.addInformerIDToPin(pinID)
          .then(() => {

            userPinRef.transaction(function (currentValue) {
              return (currentValue || 0) + 1
            })

            pinRef.transaction(function (currentValue) {
              return (currentValue || 0) + 1
            }, function () {
              callbackFunctionSuccess()
            })

          })
          .catch((err) => error(err))
      } else {
        callbackFunctionError()
      }
      
    })
    .catch((err) => error(err))
   
    
  }

  addInapropriateContentReportToPin(pinID, pinOwnerID, callbackFunctionSuccess, callbackFunctionError) {
    var pinRef = this.firebase.child('pins').child(pinID).child('reports').child('inapropriateContentReports').child('inapropriateContentReportsAmount')
    var userPinRef = this.firebase.child('userPins').child(pinOwnerID).child(pinID).child('reports').child('inapropriateContentReports').child('inapropriateContentReportsAmount')

    this.checkIfAlreadyReportedPin(pinID)
    .then((alreadyInformed) => {

      if(!alreadyInformed){

        this.addInformerIDToPin(pinID)
          .then(() => {

            userPinRef.transaction(function (currentValue) {
              return (currentValue || 0) + 1
            })

            pinRef.transaction(function (currentValue) {
              return (currentValue || 0) + 1
            }, function () {
              callbackFunctionSuccess()
            })

          })
          .catch((err) => error(err))
      } else{
        callbackFunctionError()
      }

    })
    .catch((err) => error(err))
    
    
  }

  addInformerIDToPin(pinID){
 
    return new Promise((next, error) => {

    var informerKey = this.firebase.child('pins').child(pinID).child('reports').child('informers').push().key
    var informerRef = this.firebase.child('pins').child(pinID).child('reports').child('informers').child(informerKey)

    informerRef.set({
      informerID: this.getCurrentUserID()
    })
    .then(() => next())
    .catch((err) => error(err))

    })
  }

  addInformerIDToUser(userID) {

    return new Promise((next, error) => {

      var informerKey = this.firebase.child('userProfiles').child(userID).child('reports').child('informers').push().key
      var informerRef = this.firebase.child('userProfiles').child(userID).child('reports').child('informers').child(informerKey)

      informerRef.set({
        informerID: this.getCurrentUserID()
      })
        .then(() => next())
        .catch((err) => error(err))

    })
  }

  addInformerIDToService(serviceID) {

    return new Promise((next, error) => {

      var informerKey = this.firebase.child('serviceProfiles').child(serviceID).child('reports').child('informers').push().key
      var informerRef = this.firebase.child('serviceProfiles').child(serviceID).child('reports').child('informers').child(informerKey)

      informerRef.set({
        informerID: this.getCurrentUserID()
      })
        .then(() => next())
        .catch((err) => error(err))

    })
  }
  

  removeUserFriend(friendID) {

    return new Promise((next, error) => {

      //removing  friend to current user
      var index = null

      var userFriendRef = this.firebase.child('userRelationships').child(this.getCurrentUserID()).orderByChild('friendID').equalTo(friendID)

      userFriendRef.once('value')
      .then((snap) => {

        snap.forEach((child) => {
         
          userFriendRef = this.firebase.child('userRelationships').child(this.getCurrentUserID()).child(child.key)

          userFriendRef.remove()
            .then(() => {
              for (var i = 0; i < this.currentUserFriends.length; i++) {

                if (this.currentUserFriends[i].key === friendID) {
                  index = i
                  break
                }

              }

              if (index !== null) {
                this.currentUserFriends.splice(index, 1)
              }

              next()
            })
            .catch((err) => { error(err) })

        })

      })
      .catch((err) => error(err))

      // Removing current user as a friend to the friend removed

      let friendToUpdateRef = this.firebase.child('userRelationships').child(friendID).orderByChild('friendID').equalTo(this.getCurrentUserID())

      friendToUpdateRef.once('value')
      .then((snap) => {

        snap.forEach((child) => {

          friendToUpdateRef = this.firebase.child('userRelationships').child(friendID).child(child.key)

          friendToUpdateRef.remove()
            .then(() => { })
            .catch((err) => error(err))


        })
      })
      .catch((err) => error(err))

      
    })
  }

  removeMemberFromGroup(memberID) {
    return new Promise((next, error) => {

      var index = null

      var memberRef = this.firebase.child('groupMembers').child(this.getCurrentGroupID()).orderByChild('memberID').equalTo(memberID)

      memberRef.once('value')
        .then((snap) => {

          snap.forEach((child) => {

            memberRef = this.firebase.child('groupMembers').child(this.getCurrentGroupID()).child(child.key)

            memberRef.remove()
            .then(() => {
              for (var i = 0; i < this.currentGroupMembers.length; i++) {

                if (this.currentGroupMembers[i].key === memberID) {
                  index = i
                  break
                }

              }

              if (index !== null) {
                this.currentGroupMembers.splice(index, 1)
              }

              next()
            })
            .catch((err) => { error(err) })

          })
        })
        .catch((err) => error(err))
    })
  }

  removeUserMessage(messageID){

    return new Promise((next, error) => {

      var index = null

      var userMessageRef = this.firebase.child('userMessages').child(this.getCurrentUserID()).child(messageID)

      userMessageRef.remove()
        .then(() => {
          for (var i = 0; i < this.currentUserMessages.length; i++) {

            if (this.currentUserMessages[i].key === messageID) {
              index = i
              break
            }

          }

          if (index !== null) {
            this.currentUserMessages.splice(index, 1)
          }

          next()
        })
        .catch((err) => { error(err) })

    })
  }

  removeUserNotification(notificationID) {

    return new Promise((next, error) => {

      var index = null

      var userNotificationRef = this.firebase.child('userNotifications').child(this.getCurrentUserID()).child(notificationID)

      userNotificationRef.remove()
        .then(() => {
          for (var i = 0; i < this.currentUserNotifications.length; i++) {

            if (this.currentUserNotifications[i].key === notificationID) {
              index = i
              break
            }

          }

          if (index !== null) {
            this.currentUserNotifications.splice(index, 1)
          }

          next()
        })
        .catch((err) => { error(err) })

    })
  }

  removeUserPin(pinID,mapPinID) {

    return new Promise((next, error) => {

      var index = null

      var mapPinRef = this.firebase.child('pins').child(mapPinID)
      var pinCommentsRef = this.firebase.child('pinComments').child(mapPinID)
      var userPinRef = this.firebase.child('userPins').child(this.getCurrentUserID()).child(pinID)

      userPinRef.remove()
        .then(() => {
         
         mapPinRef.remove()
         .then(() => {

           pinCommentsRef.remove()
             .then(() => {

               next()
             })
             .catch((err) => error(err))   
         })
         .catch((err) => error(err))   
        })
        .catch((err) => { error(err) })

    })
  }

  removeUserPet(petID){

    return new Promise((next, error) => {

      var index = null

      var userPetRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userPets').child(petID)

      userPetRef.remove()
        .then(() => {
          for (var i = 0; i < this.currentUserPets.length; i++) {

            if (this.currentUserPets[i].key === petID) {
              index = i
              break
            }

          }

          if (index !== null) {
            this.currentUserPets.splice(index, 1)
          }

          next()
        })
        .catch((err) => { error(err) })

    })
  }

  removeUserTemporaryHomePet(petID) {

    return new Promise((next, error) => {

      var index = null

      var userPetRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userTemporaryHomePets').child(petID)

      userPetRef.remove()
        .then(() => {
          for (var i = 0; i < this.currentUserTemporaryHomePets.length; i++) {

            if (this.currentUserTemporaryHomePets[i].key === petID) {
              index = i
              break
            }

          }

          if (index !== null) {
            this.currentUserTemporaryHomePets.splice(index, 1)
          }

          next()
        })
        .catch((err) => { error(err) })

    })
  }

  removeServiceMessage(messageID) {

    return new Promise((next, error) => {

      var index = null

      var serviceMessageRef = this.firebase.child('serviceMessages').child(this.getCurrentServiceID()).child(messageID)

      serviceMessageRef.remove()
        .then(() => {
          for (var i = 0; i < this.currentServiceMessages.length; i++) {

            if (this.currentServiceMessages[i].key === messageID) {
              index = i
              break
            }

          }

          if (index !== null) {
            this.currentServiceMessages.splice(index, 1)
          }

          next()
        })
        .catch((err) => { error(err) })

    })
  }

  removeGroupMessage(messageID) {

    return new Promise((next, error) => {

      var index = null

      var groupMessageRef = this.firebase.child('groupMessages').child(this.getCurrentGroupID()).child(messageID)

      groupMessageRef.remove()
        .then(() => {
          for (var i = 0; i < this.currentGroupMessages.length; i++) {

            if (this.currentGroupMessages[i].key === messageID) {
              index = i
              break
            }

          }

          if (index !== null) {
            this.currentGroupMessages.splice(index, 1)
          }

          next()
        })
        .catch((err) => { error(err) })

    })
  }

  removeGroupNotification(notificationID) {

    return new Promise((next, error) => {

      var index = null

      var groupNotificationRef = this.firebase.child('groupNotifications').child(this.getCurrentGroupID()).child(notificationID)

      groupNotificationRef.remove()
        .then(() => {
          for (var i = 0; i < this.currentGroupNotifications.length; i++) {

            if (this.currentGroupNotifications[i].key === notificationID) {
              index = i
              break
            }

          }

          if (index !== null) {
            this.currentGroupNotifications.splice(index, 1)
          }

          next()
        })
        .catch((err) => { error(err) })

    })
  }

  removeGroupAnimal(petID) {

    return new Promise((next, error) => {

      var index = null

      var groupAnimalRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAnimals').child(petID)

      userPetRef.remove()
        .then(() => {
          if(this.currentGroupAnimals){
            for (var i = 0; i < this.currentGroupAnimals.length; i++) {

              if (this.currentGroupAnimals[i].key === petID) {
                index = i
                break
              }

            }

            if (index !== null) {
              this.currentGroupAnimals.splice(index, 1)
            }
          }
          
          next()
        })
        .catch((err) => { error(err) })

    })
  }


  removeGroupAdoptedAnimal(petID) {

    return new Promise((next, error) => {

      var index = null

      var groupAnimalRef = this.firebase.child('groupProfiles').child(this.getCurrentGroupID()).child('groupAdoptedAnimals').child(petID)

      userPetRef.remove()
        .then(() => {

          if(this.currentGroupAdoptedAnimals){
            for (var i = 0; i < this.currentGroupAdoptedAnimals.length; i++) {

              if (this.currentGroupAdoptedAnimals[i].key === petID) {
                index = i
                break
              }

            }

            if (index !== null) {
              this.currentGroupAdoptedAnimals.splice(index, 1)
            }
          }
    
          next()
        })
        .catch((err) => { error(err) })

    })
  }

  removePinFromMap(pinID,ownerID) {

    return new Promise((next, error) => {

      var index = null

      var mapPinRef = this.firebase.child('pins').child(pinID)
      var pinCommentsRef = this.firebase.child('pinComments').child(pinID)
      var userPinRef = this.firebase.child('userPins').child(ownerID).child(pinID)

      userPinRef.remove()
        .then(() => {

          mapPinRef.remove()
            .then(() => {

              pinCommentsRef.remove()
              .then(() => {
                next()
              })
              .catch((err) => error(err))

            })
            .catch((err) => error(err))
        })
        .catch((err) => { error(err) })

    })
  }

  removeFarePinFromMap(pinID, ownerID) {

    return new Promise((next, error) => {

      var index = null

      var mapPinRef = this.firebase.child('pins').child(pinID)
      var groupFareRef = this.firebase.child('groupFares').child(ownerID).child(pinID)

      groupFareRef.remove()
        .then(() => {

          mapPinRef.remove()
            .then(() => {
              next()            
            })
            .catch((err) => error(err))
        })
        .catch((err) => { error(err) })

    })
  }

  removeGroupFare(pinID, mapPinID) {

    return new Promise((next, error) => {

      var index = null

      var mapPinRef = this.firebase.child('pins').child(mapPinID)
      var groupFareRef = this.firebase.child('groupFares').child(this.getCurrentGroupID()).child(pinID)

      userPinRef.remove()
        .then(() => {

          mapPinRef.remove()
            .then(() => {
              next()
            })
            .catch((err) => error(err))
        })
        .catch((err) => { error(err) })

    })
  }

  removeCommentFromPin(pinID, commentID){

    return new Promise((next, error) => {

      var index = null

      var pinCommentRef = this.firebase.child('pinComments').child(pinID).child(commentID)

      pinCommentRef.remove()
        .then(() => {
         next()
        })
        .catch((err) => { error(err) })

    })

  }

  removePetFromFavorites(favoriteKey){

    return new Promise((next, error) => {

      var favoritePetsRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userFavoritePetsToAdopt').child(favoriteKey)

      favoritePetsRef.remove()
      .then(() => {

        for(var i = 0; i < this.currentUserFavoritePetsToAdopt; i++){

          if(this.currentUserFavoritePetsToAdopt[i].favoriteKey === favoriteKey){
            this.currentUserFavoritePetsToAdopt.splice(i,1)
            break
          }

        }


        next()
      })
      .catch((err) => {error(err)})

    })

  }

  removeServiceOrGroupFromFavorites(favoriteKey) {

    return new Promise((next, error) => {

      var favoriteServiceAndGroupsRef = this.firebase.child('userProfiles').child(this.getCurrentUserID()).child('userFavoriteServicesAndGroups').child(favoriteKey)

      favoriteServiceAndGroupsRef.remove()
        .then(() => {

          for (var i = 0; i < this.currentUserFavoriteServicesAndGroups; i++) {

            if (this.currentUserFavoriteServicesAndGroups[i].favoriteKey === favoriteKey) {
              this.currentUserFavoriteServicesAndGroups.splice(i, 1)
              break
            }

          }

          next()
        })
        .catch((err) => { error(err) })

    })

  }
  

  sendNewFriendshipRequestNotification(data){
    return new Promise((next, error) => {

      var friendsRef = this.firebase.child('userRelationships').child(data.receiverID).orderByChild('friendID').equalTo(this.getCurrentUserID())
      var friendshipNotificationsRef = this.firebase.child('userNotifications').child(data.receiverID).orderByChild('type').equalTo('friendshipRequest')

      friendsRef.once('value')
      .then((snap) => {

        if(snap.numChildren() === 0){

          friendshipNotificationsRef.once('value')
          .then((snap) => {

            var alreadySent = false

             snap.forEach((child) => {
               if (child.val().senderID === this.getCurrentUserID()){
                 alreadySent = true
               }
             })

             if(!alreadySent){

               var newNotificationKey = this.firebase.child('userNotifications').child(data.receiverID).push().key
               var newNotificationRef = this.firebase.child('userNotifications').child(data.receiverID).child(newNotificationKey)

               var date = new Date()

               newNotificationRef.set({
                 creationDay: date.getDate(),
                 creationMonth: date.getMonth() + 1,
                 creationYear: date.getFullYear(),
                 from: this.getCurrentUser().name + " " + this.getCurrentUser().surname,
                 senderID: this.getCurrentUserID(),
                 type: 'friendshipRequest',
                 read: false
               })
                 .then(() => next())
                 .catch((err) => { error(err) })              

             } else {
              next()
             }

          })
          .catch((err) => error(err))


        }else{
          next()
        }

      })
      .catch((err) => error(err))

    })
  }

  sendNewMemberRequestNotificationAsGroup(data) {
    return new Promise((next, error) => {

      var membersRef = this.firebase.child('groupMembers').child(this.getCurrentGroupID()).orderByChild('memberID').equalTo(data.receiverID)
      var memberNotificationsRef = this.firebase.child('userNotifications').child(data.receiverID).orderByChild('type').equalTo('memberRequest')

      membersRef.once('value')
        .then((snap) => {

          if (snap.numChildren() === 0) {

            memberNotificationsRef.once('value')
            .then((snap) => {

              var alreadySent = false

              snap.forEach((child) => {
                if (child.val().senderID === this.getCurrentGroupID()) {
                  alreadySent = true
                }
              })

              if (!alreadySent) {

                var newNotificationKey = this.firebase.child('userNotifications').child(data.receiverID).push().key
                var newNotificationRef = this.firebase.child('userNotifications').child(data.receiverID).child(newNotificationKey)

                var date = new Date()

                newNotificationRef.set({
                  creationDay: date.getDate(),
                  creationMonth: date.getMonth() + 1,
                  creationYear: date.getFullYear(),
                  from: this.getCurrentGroup().name,
                  senderID: this.getCurrentGroupID(),
                  type: 'memberRequest',
                  read: false
                })
                  .then(() => next())
                  .catch((err) => { error(err) })

              } else {
                  next()
              }
            })
            .catch((err) => error(err))
          } else{
              next()
          }
        })
        .catch((err) => error(err))
    })
  }


  sendNewMemberRequestNotificationAsUser(data) {
    return new Promise((next, error) => {

      var membersRef = this.firebase.child('groupMembers').child(data.receiverID).orderByChild('memberID').equalTo(this.getCurrentUserID())
      var memberNotificationsRef = this.firebase.child('groupNotifications').child(data.receiverID).orderByChild('type').equalTo('memberRequest')

      membersRef.once('value')
        .then((snap) => {

          if (snap.numChildren() === 0) {

            memberNotificationsRef.once('value')
              .then((snap) => {

                var alreadySent = false

                snap.forEach((child) => {
                  if (child.val().senderID === this.getCurrentUserID()) {
                    alreadySent = true
                  }
                })

                if (!alreadySent) {

                  var newNotificationKey = this.firebase.child('groupNotifications').child(data.receiverID).push().key
                  var newNotificationRef = this.firebase.child('groupNotifications').child(data.receiverID).child(newNotificationKey)

                  var date = new Date()

                  newNotificationRef.set({
                    creationDay: date.getDate(),
                    creationMonth: date.getMonth() + 1,
                    creationYear: date.getFullYear(),
                    from: this.getCurrentUser().name + " " + this.getCurrentUser().surname,
                    senderID: this.getCurrentUserID(),
                    type: 'memberRequest',
                    read: false
                  })
                    .then(() => next())
                    .catch((err) => { error(err) })

                } else {
                  next()
                }
              })
              .catch((err) => error(err))
          } else {
            next()
          }
        })
        .catch((err) => error(err))
    })
  }

  sendNewAdoptionIntentNotification(data,isOwnerGroup) {
    return new Promise((next, error) => {

      var newNotificationKey = null
      var newNotificationRef = null

      if(isOwnerGroup){
        var newNotificationKey = this.firebase.child('groupNotifications').child(data.receiverID).push().key
        var newNotificationRef = this.firebase.child('groupNotifications').child(data.receiverID).child(newNotificationKey)
      } else{
        var newNotificationKey = this.firebase.child('userNotifications').child(data.receiverID).push().key
        var newNotificationRef = this.firebase.child('userNotifications').child(data.receiverID).child(newNotificationKey)
      }
      

      var date = new Date()

      newNotificationRef.set({
        creationDay: date.getDate(),
        creationMonth: date.getMonth() + 1,
        creationYear: date.getFullYear(),
        from: this.getCurrentUser().name + " " + this.getCurrentUser().surname,
        senderID: this.getCurrentUserID(),
        message: data.message,
        senderEmail: this.getCurrentUser().email,
        senderPhone: this.getCurrentUser().phone,
        senderCelphone: this.getCurrentUser().celphone,
        type: 'adoptionIntent',
        targetAnimal: data.targetAnimal,
        read: false
      })
        .then(() => next())
        .catch((err) => { error(err) })

    })
  }

  sendMessage(data){
    return new Promise((next,error) => {

      var receiverRef = this.firebase.child('userProfiles').child(data.receiverID)
      var messageSent = false

      receiverRef.once('value')
      .then((snap) => {

        if(snap.exists()){
          var newMessageKey = this.firebase.child('userMessages').child(data.receiverID).push().key
          let newMessageRef = this.firebase.child('userMessages').child(data.receiverID).child(newMessageKey)

          var date = new Date()

          newMessageRef.set({
            creationDay: date.getDate(),
            creationMonth: date.getMonth() + 1,
            creationYear: date.getFullYear(),
            from: this.getCurrentUser().name + " " + this.getCurrentUser().surname,
            senderID: this.getCurrentUserID(),
            message: data.message,
            subject: data.subject,
            messageFrom: 'user',
            read: false
          })
          .then(() =>{ 
            messageSent = true
            next(messageSent)
          })
          .catch((err) => error(err))

        } else {
          next(messageSent)
        }
      })
      .catch((err) => error(err))

    })
  }

  sendServiceMessage(data) {
    return new Promise((next, error) => {

      var receiverRef = this.firebase.child('serviceProfiles').child(data.receiverID)
      var messageSent = false

      receiverRef.once('value')
      .then((snap) => {

        if(snap.exists()){
          var newMessageKey = this.firebase.child('serviceMessages').child(data.receiverID).push().key
          let newMessageRef = this.firebase.child('serviceMessages').child(data.receiverID).child(newMessageKey)

          var date = new Date()

          newMessageRef.set({
            creationDay: date.getDate(),
            creationMonth: date.getMonth() + 1,
            creationYear: date.getFullYear(),
            from: this.getCurrentUser().name + " " + this.getCurrentUser().surname,
            senderID: this.getCurrentUserID(),
            message: data.message,
            subject: data.subject,
            messageFrom: 'user',
            read: false
          })
          .then(() => { 
            messageSent = true
            next(messageSent)
          })
          .catch((err) => error(err))
        }
        else {
          next(messageSent)
        }
      })
      .catch((err) => error(err))
      
    })

  }

  sendGroupMessage(data) {
    return new Promise((next, error) => {

      var receiverRef = this.firebase.child('groupProfiles').child(data.receiverID)
      var messageSent = false

      receiverRef.once('value')
      .then((snap) => {

        if(snap.exists()){
          var newMessageKey = this.firebase.child('groupMessages').child(data.receiverID).push().key
          let newMessageRef = this.firebase.child('groupMessages').child(data.receiverID).child(newMessageKey)

          var date = new Date()

          newMessageRef.set({
            creationDay: date.getDate(),
            creationMonth: date.getMonth() + 1,
            creationYear: date.getFullYear(),
            from: this.getCurrentUser().name + " " + this.getCurrentUser().surname,
            senderID: this.getCurrentUserID(),
            message: data.message,
            subject: data.subject,
            messageFrom: 'user',
            read: false
          })
          .then(() => { 
            messageSent = true
            next(messageSent)
          })
          .catch((err) => error(err))
        }
        else{
          next(messageSent)
        }
      })
      .catch((err) => error(err))
      
    })

  }

  sendMessageAsService(data){
    return new Promise((next, error) => {

      var receiverRef = this.firebase.child('userProfiles').child(data.receiverID)
      var messageSent = false

      receiverRef.once('value')
      .then((snap) => {

        if(snap.exists()){
          var newMessageKey = this.firebase.child('userMessages').child(data.receiverID).push().key
          let newMessageRef = this.firebase.child('userMessages').child(data.receiverID).child(newMessageKey)

          var date = new Date()

          newMessageRef.set({
            creationDay: date.getDate(),
            creationMonth: date.getMonth() + 1,
            creationYear: date.getFullYear(),
            from: this.getCurrentService().name,
            senderID: this.getCurrentServiceID(),
            message: data.message,
            subject: data.subject,
            messageFrom: 'service',
            read: false
          })
          .then(() => { 
            messageSent = true
            next(messageSent)
          })
          .catch((err) => error(err))
        } 
        else {
          next(messageSent)
        }
      })
      .catch((err) => error(err))
    })
  }

  sendMessageAsGroup(data) {
    return new Promise((next, error) => {

      var receiverRef = this.firebase.child('userProfiles').child(data.receiverID)
      var messageSent = false

      receiverRef.once('value')
      .then((snap) => {

        if(snap.exists()){
          var newMessageKey = this.firebase.child('userMessages').child(data.receiverID).push().key
          let newMessageRef = this.firebase.child('userMessages').child(data.receiverID).child(newMessageKey)

          var date = new Date()

          newMessageRef.set({
            creationDay: date.getDate(),
            creationMonth: date.getMonth() + 1,
            creationYear: date.getFullYear(),
            from: this.getCurrentGroup().name,
            senderID: this.getCurrentGroupID(),
            message: data.message,
            subject: data.subject,
            messageFrom: 'group',
            read: false
          })
          .then(() => { 
            messageSent = true
            next(messageSent)
          })
          .catch((err) => error(err))
        }
        else {
          next(messageSent)
        }
      })
      .catch((err) => error(err))
    })
  }

  sendMessageAsAdmToUser(data) {
    return new Promise((next, error) => {

      var newMessageKey = this.firebase.child('userMessages').child(data.receiverID).push().key
      let newMessageRef = this.firebase.child('userMessages').child(data.receiverID).child(newMessageKey)

      var date = new Date()

      newMessageRef.set({
        creationDay: date.getDate(),
        creationMonth: date.getMonth() + 1,
        creationYear: date.getFullYear(),
        from: 'SOS Animal App',
        senderID: '',
        message: data.message,
        subject: data.subject,
        messageFrom: 'adm',
        read: false
      })
        .then(() => next())
        .catch((err) => error(err))

    })

  }

  sendMessageAsAdmToService(data) {
    return new Promise((next, error) => {

      var newMessageKey = this.firebase.child('serviceMessages').child(data.receiverID).push().key
      let newMessageRef = this.firebase.child('serviceMessages').child(data.receiverID).child(newMessageKey)

      var date = new Date()

      newMessageRef.set({
        creationDay: date.getDate(),
        creationMonth: date.getMonth() + 1,
        creationYear: date.getFullYear(),
        from: 'SOS Animal App',
        senderID: '',
        message: data.message,
        subject: data.subject,
        messageFrom: 'adm',
        read: false
      })
        .then(() => next())
        .catch((err) => error(err))

    })

  }

  checkIfIsFriend(userID){
    return new Promise((next, error) => {

      var friendRef = this.firebase.child('userRelationships').child(this.getCurrentUserID()).orderByChild('friendID').equalTo(userID)
      var isFriend = false

      friendRef.once('value')
      .then((snap) => {

        if (snap.numChildren() !== 0) {
          isFriend = true
        } 

        next(isFriend)
      })
      .catch((err) => {error(err)})
    
    })
  }

  checkIfAlreadyReportedPin(pinID){

    return new Promise((next, error) => {

      var pinInformersRef = this.firebase.child('pins').child(pinID).child('reports').child('informers').orderByChild('informerID').equalTo(this.getCurrentUserID()) 
      var alreadyInformed = false

      pinInformersRef.once('value')
      .then((snap) => {

        if(snap.numChildren() != 0){
          alreadyInformed = true
        }

        next(alreadyInformed)

      })
      .catch((err) => {error(err)})
    })
  }

  checkIfAlreadyReportedUser(userID) {

    return new Promise((next, error) => {

      var userInformersRef = this.firebase.child('userProfiles').child(userID).child('reports').child('informers').orderByChild('informerID').equalTo(this.getCurrentUserID())
      var alreadyInformed = false

      userInformersRef.once('value')
        .then((snap) => {

          if (snap.numChildren() != 0) {
            alreadyInformed = true
          }

          next(alreadyInformed)

        })
        .catch((err) => { error(err) })
    })
  }


  checkIfAlreadyReportedService(serviceID) {

    return new Promise((next, error) => {

      var serviceInformersRef = this.firebase.child('serviceProfiles').child(serviceID).child('reports').child('informers').orderByChild('informerID').equalTo(this.getCurrentUserID())
      var alreadyInformed = false

      serviceInformersRef.once('value')
        .then((snap) => {

          if (snap.numChildren() != 0) {
            alreadyInformed = true
          }

          next(alreadyInformed)

        })
        .catch((err) => { error(err) })
    })
  }
  

}

export default new FirebaseRequest()
