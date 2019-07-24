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
import {TextInputMask} from 'react-native-masked-text'
import DataStore from '../Reflux/DataStore'
import Actions from '../Reflux/Action'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import Geocoder from 'react-native-geocoder'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

let unsub = null

export default class EditProfileScreen extends Component{

    constructor(props){
        super(props)

        this.currentUserInfo = FirebaseRequest.getCurrentUser()

        this.name = this.currentUserInfo.name
        this.surname = this.currentUserInfo.surname
        this.phone = this.currentUserInfo.phone
        this.celphone = this.currentUserInfo.celphone
        this.email = this.currentUserInfo.email
        this.city = this.currentUserInfo.city
        this.State = this.currentUserInfo.state
        this.country = this.currentUserInfo.country

        this.state = {
            loading: false,
            changingLocation: false
        }

    }

    submitForm(){
        
        if(this.name.length === 0 
            || this.surname.length === 0 
            || this.phone.length === 0
            || this.celphone.length === 0 
            || this.email.length === 0){

            Alert.alert('', 'Faltam informações.',
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

        FirebaseRequest.updateUserProfile({
            name: this.name,
            surname: this.surname,
            phone: this.phone,
            celphone: this.celphone,
            email: this.email,
            city: this.city,
            state: this.State,
            country: this.country,
        })
        .then(() => {
            this.setState({
                loading: false
            })
            this.props.back()        
        })
        .catch((err) => {console.error("Error editing user ", err.message)})


    }

    toDeactivationScreen(){
        this.props.toRoute(Routes.deactivate())
    }

    changeLocation(){

        Alert.alert('Atenção', 'Deseja mesmo alterar sua localização? A nova localização será atualizada para sua posição atual no GPS.',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {
                        this.setState({
                            changingLocation: true
                        })

                        navigator.geolocation.getCurrentPosition((position) => {

                            var currentPosition = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }

                            Geocoder.geocodePosition(currentPosition)
                                .then((res) => {

                                    FirebaseRequest.updateUserLocation({
                                        city: res[0].locality.toLowerCase(),
                                        state: res[0].adminArea.toLowerCase(),
                                        country: res[0].country.toLowerCase(),
                                        countryCode: res[0].countryCode,
                                    })
                                        .then(() => {
                                            this.setState({
                                                changingLocation: false
                                            })
                                            Alert.alert('', 'Localização alterada com sucesso.',
                                                [
                                                    {
                                                        text: 'Ok', onPress: () => { }
                                                    }
                                                ],
                                                { cancelable: false }
                                            )
                                        })
                                        .catch((err) => {
                                            this.setState({
                                                changingLocation: false
                                            })
                                            Alert.alert('', 'Erro ao atualizar a localização.',
                                                [
                                                    {
                                                        text: 'Ok', onPress: () => { }
                                                    }
                                                ],
                                                { cancelable: false }
                                            )
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
                                defaultValue={this.currentUserInfo.name}
                                placeholderTextColor="white"
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
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Sobrenome</Text>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                ref={(ref) => this._surnameRef = ref}
                                defaultValue={this.currentUserInfo.surname}
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(surname) => {this.surname = surname}}
                                returnKeyType="next"
                                onSubmitEditing={() => this._phoneRef.focus()}
                            />
                        </View>
                    </View>
                </View>

                {/*Phone and Celphone Fields */}

                <View style={styles.rowContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Telefone</Text>
                        <View style={styles.inputContainer}>
                            <TextInputMask
                                ref={(ref) => this._phoneRef = ref}
                                value={this.currentUserInfo.phone}
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                keyboardType='numeric'
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(phone) => { this.phone = phone }}
                                returnKeyType="next"
                                type={'cel-phone'}
                                onSubmitEditing={() => this._celphoneRef.focus()}
                            />
                        </View>        
                    </View>
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Celular</Text>
                        <View style={styles.inputContainer}>
                            <TextInputMask
                                ref={(ref) => this._celphoneRef = ref}
                                value={this.currentUserInfo.celphone}
                                placeholderTextColor="white"
                                selectionColor="white"
                                keyboardType='numeric'
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(celphone) => { this.celphone = celphone }}
                                returnKeyType="next"
                                type={'cel-phone'}
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
                                defaultValue={this.currentUserInfo.email}
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(email) => {this.email = email}}
                                returnKeyType="next"
                                onSubmitEditing={() => this._cityRef.focus()}
                            />
                    </View>
                </View>
                    <View style={styles.signupButtonContainer}>
                        <TouchableOpacity 
                            style={styles.signupButton}
                            activeOpacity={0.5}
                            onPress={() =>{this.state.changingLocation ? {} : this.submitForm()}}
                        >
                            <Text style={styles.signupButtonText}>{this.state.loading ? 'Cadastrado...' : 'Confirmar'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.signupButtonContainer}>
                        <TouchableOpacity
                            style={styles.changeLocationButton}
                            activeOpacity={0.5}
                            onPress={() => this.changeLocation()}
                        >
                            <Text style={styles.signupButtonText}>{this.state.changingLocation ? 'Alterando...' : 'Alterar Localização'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.deactivateButtonContainer}>
                        <TouchableOpacity 
                            style={styles.deactivateButton}
                            activeOpacity={0.5}
                            onPress={() => this.toDeactivationScreen()}
                        >
                        <Text style={styles.deactivateButtonText}>Desativar Conta</Text>
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
        height: windowHeight * 0.07,
        backgroundColor: StyleVars.Colors.secondary,
        color: 'white',
        fontSize: 14,
        borderRadius: 5
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
        
    },
    signupButtonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    signupButton: {
        paddingVertical: 12,
        width: windowWidth * 0.8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
     },
     signupButtonText: {
         fontSize: 20,
         color: 'white'
     },
    changeLocationButton: {
        paddingVertical: 12,
        width: windowWidth * 0.8,
        backgroundColor: 'navy',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
     deactivateButton: {
        paddingVertical: 12,
        width: windowWidth * 0.8,
        backgroundColor: StyleVars.Colors.redButtonBackground,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
     },
     deactivateButtonText: {
         fontSize: 20,
         color: 'red'
     },
     deactivateButtonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    }

})