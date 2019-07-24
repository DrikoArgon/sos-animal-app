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
    TouchableWithoutFeedback
} from 'react-native'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const dismissKeyboard = require("dismissKeyboard")

import Routes from '../navigation/Routes'
import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'

export default class ONGLoginScreen extends Component{

    constructor(props){
        super(props)

        this.email = null
        this.password = null

        this.state = {
            loading: false
        }

    }

    submitForm(){

        if (!this.email || !this.password) {
            return console.error("Missing Input Fields")
        }

        this.setState({
            loading: true
        })


        FirebaseRequest.groupLogin({
            email: this.email,
            password: this.password
        })
        .then((authData) => {
            FirebaseRequest.loadUserGroup(authData.uid)
            .then(() => {

                this.setState({
                    loading: false
                })
                this.props.toRoute(Routes.ongArea({
                    amountOfScenesToPop: 1
                }))
            })
            .catch((err) => { console.error("Error loading user service ", err.message) })
        })
        .catch((err) => { console.error("Login failed with error ", err.message) })

    }

    renderForm(){

        return(
            <View>
                <View style={styles.inputContainer}>
                    <TextInput 
                        placeholder="E-mail"
                        placeholderTextColor="white"
                        selectionColor="white"
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={(email) => {this.email = email}}
                        returnKeyType="next"
                        onSubmitEditing={() => this._passwordRef.focus()}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput 
                        ref={(ref) => this._passwordRef = ref}
                        placeholder="Senha"
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
                        onPress={() => this.submitForm()}
                    >
                        <Text style={styles.loginButtonText}>{this.state.loading ? "Entrando..." : "Login"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    render(){
        return(
            <TouchableWithoutFeedback
                onPress={() => dismissKeyboard()}
            >
                <View style={styles.container}>     
                    <View style={styles.innerContainer}>
                        {this.renderForm()}
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity 
                            activeOpacity={0.5}
                            onPress={() => {}}
                        >
                            <Text style={styles.footerText}> Esqueci minha senha </Text>
                        </TouchableOpacity>
                        <Text style={[styles.footerSeparator]}> | </Text>
                        <TouchableOpacity 
                            activeOpacity={0.5}
                            onPress={() => {this.props.toRoute(Routes.ongRegistration())}}
                        >
                            <Text style={styles.footerText}> Cadastro </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.primary
    },
    scrollView: {
        flex: 1,
        backgroundColor: StyleVars.Colors.primary,
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
        alignItems: 'center'
    },
    loginButton:{
        width: windowWidth * 0.8,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
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
        backgroundColor: StyleVars.Colors.primary,
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
        marginBottom: 60
    }

})