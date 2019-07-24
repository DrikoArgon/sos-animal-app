'use strict'

import React, { Component } from 'react'
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import Geocoder from 'react-native-geocoder'
import RNFetchBlob from 'react-native-fetch-blob'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height
const fs = RNFetchBlob.fs

let imagePath = null

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager
} = FBSDK;

export default class FacebookSignupScreen extends Component {

    constructor(props) {
        super(props)

        this.accessToken = this.props.data.accessToken
        this.userData = null

        this.phone = null
        this.celphone = null
        this.email = null
        this.base64ProfilePicture = null

        this.state = {
            loading: false,
            userInfoCollected: false
        }

    }

    _getFacebookUserInfo = (error,result) => {

        if(error){
            console.log('Erro ao coletar dados: ', error.toString())
        } else {
            console.log('Sucesso ao coletar dados: ', result.toString())
            console.log(Object.keys(result))

            this.userData = result
            this.email = result.email

            this.convertProfilePictureURLToBase64()

            this.setState({
                userInfoCollected: true
            })
        }

    }

    convertProfilePictureURLToBase64(){

        RNFetchBlob
            .config({
                fileCache: true
            })
            .fetch('GET',this.userData.picture.data.url)
            .then((resp) => {
                imagePath = resp.path()
                return resp.readFile('base64')
            })
            .then((base64Data) => {
                console.log(base64Data)

                this.base64ProfilePicture = base64Data
                return fs.unlink(imagePath)
            })

    }

    componentDidMount(){

        const infoRequest = new GraphRequest('/me',{
            parameters: {
                fields: {
                    string: 'id,first_name,last_name,email,picture.type(large)'
                },
                access_token: {
                    string: this.accessToken
                }
            }
        },this._getFacebookUserInfo)

        new GraphRequestManager().addRequest(infoRequest).start()

    }


    submitForm() {
        if (!this.phone || !this.celphone || !this.email) {
            Alert.alert('', 'Por favor, preencha todos os campos.',
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }

        this.setState({
            loading: true
        })

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
                        phone: this.phone,
                        celphone: this.celphone,
                        email: this.email,
                        city: res[0].locality,
                        state: res[0].adminArea,
                        country: res[0].country,
                        countryCode: res[0].countryCode,
                        cep: this.cep,
                        profileImage: this.base64ProfilePicture
                    },this.props.data.uid)
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

    }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    ref="scrollView"
                    keyboardShouldPersistTaps="never"
                    automaticallyAdjustContentInsects={true}
                    alwaysBounceVertical={true}
                    style={styles.scrollView}
                >

                    {/*Phone and Celphone Fields */}

                    <View style={styles.rowContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Telefone</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    ref={(ref) => this._phoneRef = ref}
                                    placeholderTextColor="white"
                                    keyboardType="numeric"
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(phone) => { this.phone = phone }}
                                    returnKeyType="next"
                                    onSubmitEditing={() => this._celphoneRef.focus()}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Celular</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    ref={(ref) => this._celphoneRef = ref}
                                    placeholderTextColor="white"
                                    keyboardType="numeric"
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(celphone) => { this.celphone = celphone }}
                                    returnKeyType="next"
                                    onSubmitEditing={() => this._emailRef.focus()}
                                />
                            </View>
                        </View>
                    </View>

                    {/*Email Field */}

                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Email</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={(ref) => this._emailRef = ref}
                                defaultValue={this.email}
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(email) => { this.email = email }}
                                returnKeyType="next"
                                onSubmitEditing={() => this._cepRef.focus()}
                            />
                        </View>
                    </View>

                    <View style={styles.signupButtonContainer}>
                        <TouchableOpacity
                            style={styles.signupButton}
                            activeOpacity={0.5}
                            onPress={() => this.submitForm()}
                        >
                            <Text style={styles.signupButtonText}>{this.state.loading ? "Cadastrando.." : "Cadastrar"}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.primary,

    },
    scrollView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        backgroundColor: StyleVars.Colors.primary,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row'

    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 10
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 5
    },
    input: {
        flex: 1,
        alignItems: 'center',
        height: 30,
        backgroundColor: StyleVars.Colors.secondary,
        color: 'white',
        fontSize: 14,
        borderRadius: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'

    },
    signupButtonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    signupButton: {
        paddingVertical: 12,
        width: windowWidth * 0.8,
        backgroundColor: '#003000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signupButtonText: {
        fontSize: 20,
        color: 'lime'
    }

})