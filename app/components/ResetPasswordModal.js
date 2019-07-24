'use strict'

import React, { Component } from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    Image,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'


const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class ResetPasswordModal extends Component {

    constructor(props) {
        super(props)

        this.email = ''

        this.state = {
            loading: false
        }

    }

    sendResetEmail(){

        this.setState({
            loading: true
        })
        FirebaseRequest.sendResetPasswordEmail(this.email)
        .then(() => {
            this.setState({
                loading: false
            })
            
            
            Alert.alert(
                'Sucesso',
                'Um email foi enviado para que sua senha seja redefinida.',
                [
                    { text: 'Ok', onPress: () => { this.props.hideModals() } },
                ],
                { cancelable: true }
            )
            
        })
            .catch((err) => {
                this.setState({
                    loading: false
                })

                console.log('Error sendind reset email: ', err.message)
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro. ' + err.message,
                    [
                        { text: 'Ok', onPress: () => {} },
                    ],
                    { cancelable: true }
                )})

    }


    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => { }}
            >
                <TouchableWithoutFeedback
                    onPress={() => this.props.hideModals()}
                >
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback
                            onPress={() => dismissKeyboard()}>
                            <View style={styles.innerModalContainer}>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHeaderTextContainer}>
                                        <Text style={styles.modalHeaderText}>ESQUECI MINHA SENHA</Text>
                                    </View>
                                </View>
                                <View style={styles.messageTextContainer}>
                                    <Text style={styles.modalText}>Para alterar sua senha preencha com o seu email.</Text>
                                </View>
                                <View style={styles.inputContainer}>
                                    <View style={styles.bigInputContainer}>
                                        <TextInput
                                            ref={(ref) => this._emailRef = ref}
                                            selectionColor="white"
                                            style={styles.input}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            onChangeText={(email) => { this.email = email }}
                                            returnKeyType="next"
                                            onSubmitEditing={() => { }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.buttomContainer}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={this.email.length === 0 ? styles.sendButtom : styles.disabledSendButton}
                                        onPress={() => { this.sendResetEmail() }}
                                    >
                                        <Text style={styles.modalFooterText}>{this.state.loading ? "Enviando..." : "Enviar"}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => this.props.hideModals()}
                                    >
                                        <Text style={styles.modalFooterText}>Sair</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.listViewBackground,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalTextContainerLight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    modalTextContainerDark: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    modalHeader: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center'
    },
    modalHeaderTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    modalHeaderText: {
        color: 'white',
        fontSize: 20
    },
    modalText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center'
    },
    innerModalContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        marginBottom: 30,
    },
    modalFooter: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    modalFooterText: {
        color: 'white',
        fontSize: 18
    },
    buttomContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendButtom: {
        backgroundColor: 'rgb(29,105,175)',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    },
    disabledSendButton: {
        backgroundColor: 'rgba(29,105,175,0.5)',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    },
    messageTextContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        alignItems: 'center'
    },
    input: {
        height: windowHeight * 0.06,
        backgroundColor: StyleVars.Colors.secondary,
        color: 'white',
        fontSize: 14,
        borderRadius: 5,
        textAlign: 'center'
    },
    bigInputContainer: {
        width: windowWidth * 0.7,
        paddingVertical: 10,
    },
    inputContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    }

})
