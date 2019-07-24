'use strict'

import React, {Component} from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class AnswerMessageModal extends Component{

    constructor(props){
        super(props)
        
        this.state = {
            to: "",
            sending: false,
            messageSent: false
        }

        this.text = null
    }

    sendMessage() {

        if (!this.text) {
            return console.error("Missing Input Fields")
        }

        this.setState({
            sending: true
        })

        if(this.props.data.messageFrom === "user"){
            if (this.props.data.isServiceSending){

                FirebaseRequest.sendMessageAsService({
                    message: this.text,
                    subject: this.props.data.subject,
                    receiverID: this.props.data.receiverID
                })
                .then((messageSent) => {

                    if(messageSent){
                        this.setState({
                            sending: false,
                            messageSent: true
                        })
                    } else {

                        Alert.alert('', 'Este usuário não existe mais.',
                            [
                                {
                                    text: 'Ok', onPress: () => { }
                                }
                            ],
                            { cancelable: false }
                        )
                        this.setState({
                            sending: false,
                        })
                    }
                    
                })
                .catch((err) => {
                    this.setState({
                        sending: false
                    })
                    console.error('Error sending message: ', err.message)
                })

            }else if(this.props.data.isGroupSending){

                FirebaseRequest.sendMessageAsGroup({
                    message: this.text,
                    subject: this.props.data.subject,
                    receiverID: this.props.data.receiverID
                })
                .then((messageSent) => {

                    if(messageSent){
                        this.setState({
                            sending: false,
                            messageSent: true
                        })
                    } else {
                        Alert.alert('', 'Este usuário não existe mais.',
                            [
                                {
                                    text: 'Ok', onPress: () => { }
                                }
                            ],
                            { cancelable: false }
                        )
                        this.setState({
                            sending: false,
                        })
                    }
                })
                .catch((err) => {
                    this.setState({
                        sending: false
                    })
                    console.error('Error sending message: ', err.message)
                })
            }
            else{

                FirebaseRequest.sendMessage({
                    message: this.text,
                    subject: this.props.data.subject,
                    receiverID: this.props.data.receiverID
                })
                .then((messageSent) => {

                    if(messageSent){
                        this.setState({
                            sending: false,
                            messageSent: true
                        })
                    } else {
                        Alert.alert('', 'Este usuário não existe mais.',
                            [
                                {
                                    text: 'Ok', onPress: () => { }
                                }
                            ],
                            { cancelable: false }
                        )
                        this.setState({
                            sending: false,
                        })
                    }
                })
                .catch((err) => {
                    this.setState({
                        sending: false
                    })
                    console.error('Error sending message: ', err.message)
                })
            }     
        } else if (this.props.data.messageFrom === "service"){

            FirebaseRequest.sendServiceMessage({
                message: this.text,
                subject: this.props.data.subject,
                receiverID: this.props.data.receiverID
            })
            .then((messageSent) => {

                if(messageSent){
                    this.setState({
                        sending: false,
                        messageSent: true
                    })
                } else {
                    Alert.alert('', 'Este serviço não existe mais.',
                        [
                            {
                                text: 'Ok', onPress: () => { }
                            }
                        ],
                        { cancelable: false }
                    )
                    this.setState({
                        sending: false,
                    })
                }
            })
            .catch((err) => {
                this.setState({
                    sending: false
                })
                console.error('Error sending message: ', err.message)
            })
        } else {

            FirebaseRequest.sendGroupMessage({
                message: this.text,
                subject: this.props.data.subject,
                receiverID: this.props.data.receiverID
            })
            .then((messageSent) => {

                if(messageSent){
                    this.setState({
                        sending: false,
                        messageSent: true
                    })
                } else {
                    Alert.alert('', 'Este grupo não existe mais.',
                        [
                            {
                                text: 'Ok', onPress: () => { }
                            }
                        ],
                        { cancelable: false }
                    )
                    this.setState({
                        sending: false,
                    })
                }
            })
            .catch((err) => {
                this.setState({
                    sending: false
                })
                console.error('Error sending message: ', err.message)
            })
        }
    }

    render(){
        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={()=> {}}
                 >
                    <TouchableWithoutFeedback 
                        onPress={() => {
                            this.setState({
                                sending: false,
                                messageSent: false
                            })
                            this.props.hideModals()
                        }
                        }
                    >
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback
                            onPress={() => dismissKeyboard()}>
                            <View style={styles.innerModalContainer}>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHeaderTextContainer}>
                                        <Text style={styles.modalHeaderText}>RESPONDER MENSAGEM</Text>
                                    </View>
                                </View>
                                <View style={styles.modalTextContainerLight}>
                                    <Text style={styles.modalText}>Para: </Text>
                                    <View style={styles.fromContainer}>
                                        <Text style={styles.receiverNameText}>{this.props.data.to ? this.props.data.to : this.state.to}</Text>
                                    </View>
                                </View>
                                <View style={styles.messageTextContainer}>
                                    <Text style={styles.modalText}></Text>
                                        <TextInput
                                            placeholder="Digite sua mensagem aqui..."
                                            placeholderTextColor="rgba(255,255,255,0.5)"
                                            selectionColor="white"
                                            multiline={true}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            onChangeText={(text) => {this.text = text}}
                                            returnKeyType="default"
                                            style={styles.input}
                                            onSubmitEditing={() => {}}
                                        />
                                </View>
                                <View style={styles.buttomContainer}>
                                    {this.state.messageSent? 
                                        (
                                            <View style={styles.sendButtom}>
                                                <Text style={styles.modalFooterText}>Enviado</Text>
                                            </View>
                                        ): 
                                        (
                                            <TouchableOpacity
                                                    activeOpacity={ 0.5}
                                                    style={styles.sendButtom}
                                                    onPress={() => this.sendMessage()}
                                            >
                                                <Text style={styles.modalFooterText}>{this.state.sending ? "Enviando..." : "Enviar"}</Text>
                                            </TouchableOpacity>
                                        )}
                                    
                                </View>
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => {
                                            this.setState({
                                                sending: false,
                                                messageSent: false
                                            })
                                            this.props.hideModals()
                                        }
                                        }
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
        backgroundColor: StyleVars.Colors.listViewBackground
    },
    modalContainer:{
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalTextContainerLight:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    fromContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.5,
        marginLeft: 20
    },
    modalTextContainerDark:{
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    modalHeader:{
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center'
    },
    modalHeaderTextContainer:{
       justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    modalHeaderText:{
        color: 'white',
        fontSize: 20
    },
    modalText:{
        color: 'white',
        fontSize: 18
    },
    innerModalContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10
    },
    modalFooter:{
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    modalFooterText:{
        color: 'white',
        fontSize: 18
    },
    messageTextContainer:{
        flexDirection: 'row',
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        height: windowHeight * 0.4
    },
    buttomContainer:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendButtom:{
        backgroundColor: 'rgb(29,105,175)',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center'
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 18,
        paddingHorizontal: 5
    },
    receiverNameText:{
        color: 'white',
        fontSize: 14
    }
    
})
