'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Platform,
    AsyncStorage,
    PermissionsAndroid,
    Alert
} from 'react-native'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

import Routes from '../navigation/Routes'
import Reflux from 'reflux'
import Actions from '../Reflux/Action'
import Geocoder from 'react-native-geocoder'
import RNFetchBlob from 'react-native-fetch-blob'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import StyleVars from '../styles/StyleVars'
import ResetPasswordModal from '../components/ResetPasswordModal'

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} = FBSDK;

const fs = RNFetchBlob.fs

let imagePath = null
let unsub = null

export default class LoginScreen extends Component{

    constructor(props){
        super(props)

        this.login = null
        this.password = null

        this.userData = null
        this.facebookEmail = null
        this.base64ProfilePicture = null
        this.facebookUid = null

        this.state = {
            loading: false,
            userInfoCollected: false,
            resetPasswordModalVisible: false
        }
        console.disableYellowBox = true;
    }

    showResetPasswordModal(){
        this.setState({
            resetPasswordModalVisible: true
        })
    }

    hideModals(){
        this.setState({
            resetPasswordModalVisible: false
        })
    }

    componentDidMount(){

        if(Platform.OS === 'android'){

            PermissionsAndroid.request("android.permission.ACCESS_FINE_LOCATION",
                {
                    title: 'Permissão para obter localização',
                    message: 'SOS Animal App necessita de sua localização para funcionar corretamente.'
                })
                .then((result) => {
                    if (result === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log('Permissao de localização concedida')
                    } else {
                        console.log('Permissão negada')
                    }
                })
                .catch((err) => {
                    console.log(err.message)
                })

        }

        AccessToken.getCurrentAccessToken()
        .then((data) => {
            
            if(data !== null){

                this.setState({
                    loading: true
                })

                FirebaseRequest.loginWithFacebook(data.accessToken)
                    .then((authData) => {

                        FirebaseRequest.checkIfFirstFacebookLogin(authData)
                            .then((isFirstTime) => {

                                if (isFirstTime) {

                                    this.facebookUid = authData.uid
                                    const infoRequest = new GraphRequest('/me', {
                                        parameters: {
                                            fields: {
                                                string: 'id,first_name,last_name,email,picture.type(large)'
                                            },
                                            access_token: {
                                                string: data.accessToken
                                            }
                                        }
                                    }, this._getFacebookUserInfo)

                                    new GraphRequestManager().addRequest(infoRequest).start()
                                } else {
                                    FirebaseRequest.loadUser(authData.uid)
                                        .then(() => {

                                            this.setState({
                                                loading: false
                                            })
                                            this.props.toRoute(Routes.main())
                                        })
                                        .catch((err) => {
                                            this.setState({
                                                loading: false
                                            })
                                            Alert.alert('', 'Erro ao realizar login.',
                                                [
                                                    {
                                                        text: 'Ok', onPress: () => { }
                                                    }
                                                ],
                                                { cancelable: false }
                                            )
                                        })
                                }
                            })
                            .catch((err) => { console.error('Erro ao verificar primeiro login com o facebook: ', err.message) })
                    })
                    .catch((err) => { console.error('Erro ao realizar login com o facebook: ', err.message) })
            }
            else{

                AsyncStorage.getItem('USER_EMAIL')
                .then((userEmail) => {
                    if (userEmail) {
                        AsyncStorage.getItem('USER_PASSWORD')
                        .then((userPassword) => {
                            if (userPassword){

                                this.setState({
                                    loading: true
                                })

                                FirebaseRequest.login({
                                    email: userEmail,
                                    password: userPassword
                                })
                                    .then((authData) => {
                                        FirebaseRequest.loadUser(authData.uid)
                                            .then(() => {

                                                this.setState({
                                                    loading: false
                                                })
                                                this.props.toRoute(Routes.main())
                                            })
                                            .catch((err) => {
                                                this.setState({
                                                    loading: false
                                                })
                                                console.log(err.message)
                                                Alert.alert('', 'Erro ao realizar login. Verifique seu email e senha ou sua conexão. Erro: ' + err.message,
                                                    [
                                                        {
                                                            text: 'Ok', onPress: () => { }
                                                        }
                                                    ],
                                                    { cancelable: false }
                                                )
                                            })
                                    })
                                    .catch((err) => {
                                        this.setState({
                                            loading: false
                                        })
                                        console.log(err.message)
                                        Alert.alert('', 'Erro ao realizar login. Verifique seu email e senha ou sua conexão. Erro: ' + err.message,
                                            [
                                                {
                                                    text: 'Ok', onPress: () => { }
                                                }
                                            ],
                                            { cancelable: false }
                                        )
                                    })
                            }
                        })
                        .catch((err) => { })
                    }
                })
                .catch((err) => {})
            }
        })

    }

   requestLocationPermission() {

        


    }

    submitForm(){

        if(!this.login || !this.password){
            return alert("Faltam campos a serem preenchidos.")
        }

        this.setState({
            loading: true
        })

        FirebaseRequest.logout()

        FirebaseRequest.login({
            email: this.login,
            password: this.password
        })
        .then((authData) => {
            FirebaseRequest.loadUser(authData.uid)
                .then(() => { 
                    
                    this.setState({
                        loading: false
                    })
                    this.props.toRoute(Routes.main()) } )
                .catch((err) => { 
                    this.setState({
                        loading: false
                    })
                    console.log(err.message)
                    Alert.alert('', 'Erro ao realizar login. Verifique seu email e senha ou sua conexão. Erro: ' + err.message,
                        [
                            {
                                text: 'Ok', onPress: () => { }
                            }
                        ],
                        { cancelable: false }
                    )
                })     
        })
        .catch((err) => { 
            this.setState({
                loading: false
            })
            console.log(err.message)
            Alert.alert('', 'Erro ao realizar login. Verifique seu email e senha ou sua conexão. Erro: ' + err.message,
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        })



    }

    renderForm(){

        return(
            <View>
                <View style={styles.inputContainer}>
                    <TextInput 
                        placeholder="E-mail"
                        underlineColorAndroid='transparent'
                        keyboardType="email-address"
                        placeholderTextColor="white"
                        selectionColor="white"
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={(login) => {this.login = login}}
                        returnKeyType="next"
                        onSubmitEditing={() => this._passwordRef.focus()}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput 
                        ref={(ref) => this._passwordRef = ref}
                        placeholder="Senha"
                        underlineColorAndroid='transparent'
                        placeholderTextColor="white"
                        secureTextEntry={true}
                        selectionColor="white"
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={(password) => {this.password = password}}
                        returnKeyType="go"
                        onSubmitEditing={() => this.submitForm()}
                    />
                </View>
                <View style={styles.loginButtonContainer}>
                    <TouchableOpacity 
                        style={styles.loginButton}
                        activeOpacity={0.5}
                        onPress={() => this.state.loading ? {} : this.submitForm()}
                    >
                     <Text style={styles.loginButtonText}>{this.state.loading ? "Entrando..." : "Login"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _getFacebookUserInfo = (error, result) => {

        if (error) {
            console.log('Erro ao coletar dados: ', error.toString())
        } else {
            console.log('Sucesso ao coletar dados: ', result.toString())
            console.log(Object.keys(result))

            this.userData = result
            this.facebookEmail = result.email

            this.convertProfilePictureURLToBase64()

            this.setState({
                userInfoCollected: true
            })

        }

    }

    convertProfilePictureURLToBase64() {

        RNFetchBlob
            .config({
                fileCache: true
            })
            .fetch('GET', this.userData.picture.data.url)
            .then((resp) => {
                imagePath = resp.path()
                return resp.readFile('base64')
            })
            .then((base64Data) => {

                this.base64ProfilePicture = base64Data

                navigator.geolocation.getCurrentPosition((position) => {

                    var currentPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }

                    Geocoder.geocodePosition(currentPosition)
                        .then((res) => {

                            FirebaseRequest.signupWithFacebook({
                                name: this.userData.first_name,
                                surname: this.userData.last_name,
                                phone: "-",
                                celphone: "-",
                                email: this.facebookEmail,
                                city: res[0].locality.toLowerCase(),
                                state: res[0].adminArea.toLowerCase(),
                                country: res[0].country.toLowerCase(),
                                countryCode: res[0].countryCode,
                                profileImage: this.base64ProfilePicture
                            }, this.facebookUid)
                                .then(() => {
                                    this.setState({
                                        loading: false
                                    })
                                    this.props.toRoute(Routes.main())
                                })
                                .catch((err) => {
                                    this.setState({
                                        loading: false
                                    })
                                    console.error("Sign up failed with error ", err.message)
                                })

                        })
                        .catch((err) => { console.error(err) })


                })
                
                fs.unlink(imagePath)
            })

    }


    render(){
        return(
            <View style={styles.container}>
                <ScrollView
                ref="scrollView"
                keyboardShouldPersistTaps="never"
                automaticallyAdjustContentInsects={true}
                alwaysBounceVertical={true}
                style={styles.scrollView}
                >
                    <View style={styles.innerContainer}>
                        <Image 
                            source={require("../Resources/sosanimalappLogo.png")}
                            style={styles.logo}
                            resizeMode='contain'
                        />
                        {this.renderForm()}
                        <View style={styles.facebookButtonContainer}>
                            <LoginButton
                                readPermissions={["public_profile","email"]}
                                onLoginFinished={
                                    (error, result) => {
                                        if (error) {
                                            console.log("login has error: " + result.error);
                                        } else if (result.isCancelled) {
                                            console.log("login is cancelled.");
                                        } else {
                                            AccessToken.getCurrentAccessToken().then(
                                                (data) => {
                                                    this.setState({
                                                        loading: true
                                                    })

                                                    FirebaseRequest.loginWithFacebook(data.accessToken)
                                                        .then((authData) => {

                                                            FirebaseRequest.checkIfFirstFacebookLogin(authData)
                                                            .then((isFirstTime) => {

                                                                if(isFirstTime){

                                                                    const infoRequest = new GraphRequest('/me', {
                                                                        parameters: {
                                                                            fields: {
                                                                                string: 'id,first_name,last_name,email,picture.type(large)'
                                                                            },
                                                                            access_token: {
                                                                                string: data.accessToken
                                                                            }
                                                                        }
                                                                    }, this._getFacebookUserInfo)

                                                                    new GraphRequestManager().addRequest(infoRequest).start()

                                                                    // this.props.toRoute(Routes.signupWithFacebook({
                                                                    //     accessToken: data.accessToken,
                                                                    //     uid: authData.uid
                                                                    // }))
                                                                } else {
                                                                    FirebaseRequest.loadUser(authData.uid)
                                                                        .then(() => {

                                                                            this.setState({
                                                                                loading: false
                                                                            })
                                                                            this.props.toRoute(Routes.main())
                                                                        })
                                                                        .catch((err) => {
                                                                            this.setState({
                                                                                loading: false
                                                                            })
                                                                            Alert.alert('', 'Erro ao realizar login.',
                                                                                [
                                                                                    {
                                                                                        text: 'Ok', onPress: () => { }
                                                                                    }
                                                                                ],
                                                                                { cancelable: false }
                                                                            )
                                                                        })   
                                                                }
                                                            })
                                                            .catch((err) => { console.error('Erro ao verificar primeiro login com o facebook: ', err.message)})  
                                                        })
                                                        .catch((err) => {console.error('Erro ao realizar login com o facebook: ', err.message)})

                                                }
                                            )
                                        }
                                    }
                                }
                                onLogoutFinished={() => {
                                    FirebaseRequest.logout()
                                }}
                            />
                        </View>
                    </View>
                    
                </ScrollView>
                <View style={styles.footer}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {this.showResetPasswordModal() }}
                    >
                        <Text style={styles.footerText}> Esqueci minha senha </Text>
                    </TouchableOpacity>
                    <Text style={[styles.footerSeparator]}> | </Text>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => { this.props.toRoute(Routes.signup()) }}
                    >
                        <Text style={styles.footerText}> Cadastro </Text>
                    </TouchableOpacity>
                </View>
                <ResetPasswordModal
                    visible={this.state.resetPasswordModalVisible}
                    hideModals={() => this.hideModals()}
                />
            </View>
            
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'black',

    },
    footer: {
        height: windowHeight * 0.1,
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row'
    },
    footerText: {
        color: 'white',
        fontSize: 18
    },
    footerSeparator: {
        color: 'white',
        fontSize: 30
    },
    loginButtonContainer: {
        marginTop: 5,
        width: windowWidth * 0.8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButton:{
        width: windowWidth * 0.8,
        paddingVertical: 12,
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
     },
     loginButtonText: {
         fontSize: 20,
         color: 'white'
     },
    innerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        height: windowHeight * 0.9,
        width: windowWidth
    },
    inputContainer: {
        width: windowWidth * 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        
    },
    input: {
        flex: 1,
        alignItems: 'center',
        height: 50,
        backgroundColor: StyleVars.Colors.secondary,
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        padding: 10,
        borderRadius: 10
    },
    logo:{
        width: windowWidth * 0.30,
        height: windowHeight * 0.20,
        marginBottom: 40
    },
    facebookButtonContainer:{
        marginTop: 25,
        backgroundColor: '#4267B2',
        width: windowWidth * 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingVertical: 10 
    }

})