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
import { TextInputMask } from 'react-native-masked-text'
import DataStore from '../Reflux/DataStore'
import Actions from '../Reflux/Action'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

let unsub = null

export default class AddAdditionalContactInfoScreen extends Component {

    constructor(props) {
        super(props)

        this.currentUserInfo = FirebaseRequest.getCurrentUser()

        this.phone = this.currentUserInfo.phone
        this.celphone = this.currentUserInfo.celphone
        this.email = this.currentUserInfo.email

        this.state = {
            loading: false
        }

    }

    submitForm() {

        if (this.email.length === 0 ){
            Alert.alert('', 'Faltam informações.',
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }

        if(this.phone.length === 0){
            this.phone = '-'
        }

        if(this.celphone.length === 0){
            this.celphone = '-'
        }

        this.setState({
            loading: true
        })


        FirebaseRequest.updateUserProfile({
            phone: this.phone,
            celphone: this.celphone,
            email: this.email
        })
            .then(() => {

                FirebaseRequest.addUserPet({
                    name: this.props.data.name,
                    ageAmount: this.props.data.ageAmount,
                    ageType: this.props.data.ageType,
                    specie: this.props.data.specie,
                    breed: this.props.data.breed,
                    size: this.props.data.size,
                    gender: this.props.data.gender,
                    color: this.props.data.color,
                    vaccinated: this.props.data.vaccinated,
                    dewormed: this.props.data.dewormed,
                    castrated: this.props.data.castrated,
                    petSituation: this.props.data.petSituation,
                    profilePhoto: this.props.data.profilePhoto

                })
                    .then(() => {
                        this.setState({
                            loading: false
                        })

                        this.props.backByNScenes(2)
                    })
                    .catch((err) => { console.error("Failed to add pet, ", err.message) })
            })
            .catch((err) => { console.error("Error editing user ", err.message) })


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
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText2}>Número de telefone ou celular (opcional)</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Telefone</Text>
                            <View style={styles.inputContainer}>
                                <TextInputMask
                                    ref={(ref) => this._phoneRef = ref}
                                    defaultValue={this.currentUserInfo.phone}
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
                                    defaultValue={this.currentUserInfo.celphone}
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
                                onChangeText={(email) => { this.email = email }}
                                returnKeyType="next"
                                onSubmitEditing={() => {}}
                            />
                        </View>
                    </View>

                    
                    <View style={styles.signupButtonContainer}>
                        <TouchableOpacity
                            style={styles.signupButton}
                            activeOpacity={0.5}
                            onPress={() => this.submitForm()}
                        >
                            <Text style={styles.signupButtonText}>{this.state.loading ? 'Cadastrando...' : 'Confirmar' } </Text>
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
    infoText2: {
        color: 'white',
        fontSize: 16,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
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