'use strict'

import React, {Component} from 'react'
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

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class SignupScreen extends Component{

    constructor(props){
        super(props)

        this.name = null
        this.surname = null
        this.phone = "-"
        this.celphone = "-"
        this.email = null
        this.password = null
        this.passwordConfirmation = null

        this.state = {
            loading: false
        }

    }


    submitForm(){
        if (!this.name || !this.surname || !this.email || !this.passwordConfirmation || !this.password){
            Alert.alert('', "Faltam informações.",
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
            return;
        }
        if (this.password != this.passwordConfirmation){
            Alert.alert('', "As senhas não são iguais.",
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
            return;
        } else if (this.password.length < 6 && this.passwordConfirmation.length < 6){
            Alert.alert('', "Sua senha precisa ter 6 ou mais caracteres.",
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
            return;
        }

        Alert.alert('', "Nome: " + this.name + " " +
            "Sobrenome: " + this.surname + " " +
            "Telefone: " + this.phone + " " +
            "Senha: " + this.password + " " +
            "email: " + this.email,
            [
                {
                    text: 'Ok', onPress: () => {
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



                                    FirebaseRequest.signup({
                                        name: this.name,
                                        surname: this.surname,
                                        phone: this.phone,
                                        celphone: this.celphone,
                                        email: this.email,
                                        city: res[0].locality.toLowerCase(),
                                        state: res[0].adminArea.toLowerCase(),
                                        country: res[0].country.toLowerCase(),
                                        countryCode: res[0].countryCode,
                                        password: this.password
                                    })
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
                                            Alert.alert('Ocorreu um erro ao tentar criar sua conta.', err.message,
                                                [
                                                    {
                                                        text: 'Ok', onPress: () => { }
                                                    }
                                                ],
                                                { cancelable: false }
                                            )
                                            return;
                                        })

                                })
                                .catch((err) => { console.error(err) })


                        })
                     }
                }
            ],
            { cancelable: false }
        )    

    }

    checkTypedInfo(){

        Alert.alert('', "Nome: " + this.name + " " +
            "Sobrenome: " + this.surname + " " +
            "Telefone: " + this.phone + " " +
            "Senha: " + this.password + " " +
            "email: " + this.email,
            [
                {
                    text: 'Ok', onPress: () => { }
                }
            ],
            { cancelable: false }
        )
    }

    render(){
        return(
            <View style={styles.container}>
                <KeyboardAwareScrollView
                ref="scrollView"
                keyboardShouldPersistTaps="never"
                automaticallyAdjustContentInsects={true}
                alwaysBounceVertical={true}
                style={styles.scrollView}
                >

                {/*Name and Surname Fields */}

                <View style={styles.rowContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Nome</Text>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                placeholderTextColor="white"
                                underlineColorAndroid={StyleVars.Colors.secondary}
                                selectionColor="white"
                                style={styles.input}
                                autoFocus={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(name) => {this.name = name}}
                                returnKeyType="next"
                                onSubmitEditing={() => this._surnameRef.focus()}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Sobrenome</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={(ref) => this._surnameRef = ref}
                                placeholderTextColor="white"
                                underlineColorAndroid={StyleVars.Colors.secondary}
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(surname) => { this.surname = surname }}
                                returnKeyType="next"
                                onSubmitEditing={() => this._emailRef.focus()}
                            />
                        </View>
                    </View>
                </View>
                    {/*Phone and Celphone Fields */}
{/* 
                    <View style={styles.rowContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Telefone</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    ref={(ref) => this._phoneRef = ref}
                                    placeholderTextColor="white"
                                    underlineColorAndroid={StyleVars.Colors.secondary}
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
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Celular</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    ref={(ref) => this._celphoneRef = ref}
                                    placeholderTextColor="white"
                                    underlineColorAndroid={StyleVars.Colors.secondary}
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
                    </View> */}

                {/*Email Field */}

                <View style={styles.innerContainer}>
                    <Text style={styles.infoText}>Email</Text>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                ref={(ref) => this._emailRef = ref}
                                placeholderTextColor="white"
                                underlineColorAndroid={StyleVars.Colors.secondary}
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(email) => {this.email = email}}
                                returnKeyType="next"
                                onSubmitEditing={() => this._passwordRef.focus()}
                            />
                    </View>
                </View>

                {/*Password and Confirm Password Fields */}

                 <View style={styles.rowContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Senha</Text>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                ref={(ref) => this._passwordRef = ref}
                                placeholderTextColor="white"
                                underlineColorAndroid={StyleVars.Colors.secondary}
                                selectionColor="white"
                                style={styles.input}
                                secureTextEntry={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(password) => {this.password = password}}
                                returnKeyType="next"
                                onSubmitEditing={() => this._confirmPasswordRef.focus()}
                            />
                        </View>
                    </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Confirmar Senha</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    ref={(ref) => this._confirmPasswordRef = ref}
                                    placeholderTextColor="white"
                                    underlineColorAndroid={StyleVars.Colors.secondary}
                                    selectionColor="white"
                                    style={styles.input}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(passwordConfirmation) => { this.passwordConfirmation = passwordConfirmation }}
                                    returnKeyType="go"
                                    onSubmitEditing={() => this.submitForm()}
                                />
                            </View>
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
        backgroundColor: StyleVars.Colors.primary
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row'

    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 20,
    },
    infoText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 5
    },
    input: {
        flex: 1,
        alignItems: 'center',
        height: 50,
        backgroundColor: StyleVars.Colors.secondary,
        color: 'white',
        fontSize: 16,
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