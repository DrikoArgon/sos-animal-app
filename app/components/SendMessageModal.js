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
import WhoToSendMessageModal from '../components/WhoToSendMessageModal'


const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class SendMessageModal extends Component{

    constructor(props){
        super(props)

        var receiverName = ""
        var receiverID = ''
        var isMessageWithoutInicialReceiver = false

        if(this.props.isMessageFromPin){
            receiverName = this.props.data.pinOwnerName
            receiverID = this.props.data.pinOwnerID
        }
        else{
            if (this.props.data) {
                if (this.props.data.surname) {
                    receiverName = this.props.data.name + " " + this.props.data.surname
                } else {
                    receiverName = this.props.data.name
                }

                receiverID = this.props.data.key
            }
        }

        if(receiverName === undefined){
            receiverID = ''
            receiverName = ''
            isMessageWithoutInicialReceiver = true
        }

        this.state = {
            to: receiverName,
            adoptionIntent: this.props.adoptionIntent,
            sending: false,
            messageSent: false,
            receiverID: receiverID, 
            whoToSendMessageModalVisible: false,
            isMessageWithoutInicialReceiver: isMessageWithoutInicialReceiver
        }

        this.text = null
        this.subject = null

    }

    showWhoToSendMessageModal(){
        this.setState({
            whoToSendMessageModalVisible: true
        })
    }

    hideModals() {
        this.setState({
            whoToSendMessageModalVisible: false
        })

    }

    selectReceiver(name,surname,key){

        this.setState({
            receiverID: key,
            to: name + ' ' + surname
        })

        this.hideModals()

    }

    sendMessage(){

        if (this.state.receiverID === '' || !this.subject || !this.text ){
            Alert.alert('', 'Faltam campos a serem preenchidos.',
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }

        this.setState({
            sending: true
        })

        if(this.props.data.isGroupLooking){
            FirebaseRequest.sendMessageAsGroup({
                message: this.text,
                subject: this.subject,
                receiverID: this.state.receiverID
            })
                .then(() => {

                    this.text = null
                    this.subject = null
                    this.setState({
                        sending: false,
                        messageSent: true
                    })
                })
                .catch((err) => {
                    this.setState({
                        sending: false
                    })
                    Alert.alert('', 'Erro ao enviar mensagem.',
                        [
                            {
                                text: 'Ok', onPress: () => { }
                            }
                        ],
                        { cancelable: false }
                    )
                })
        }
        else{
            if(this.props.data.accountType){
                if (this.props.data.accountType === "service"){

                        FirebaseRequest.sendServiceMessage({
                            message: this.text,
                            subject: this.subject,
                            receiverID: this.state.receiverID
                        })
                            .then(() => {

                                this.text = null
                                this.subject = null
                                this.setState({
                                    sending: false,
                                    messageSent: true
                                })
                            })
                            .catch((err) => {
                                this.setState({
                                    sending: false
                                })
                                Alert.alert('', 'Erro ao enviar mensagem.',
                                    [
                                        {
                                            text: 'Ok', onPress: () => { }
                                        }
                                    ],
                                    { cancelable: false }
                                )
                            })
                    }
                    else{
                        FirebaseRequest.sendGroupMessage({
                            message: this.text,
                            subject: this.subject,
                            receiverID: this.state.receiverID
                        })
                            .then(() => {

                                this.text = null
                                this.subject = null
                                this.setState({
                                    sending: false,
                                    messageSent: true
                                })

                                if(this.state.adoptionIntent){
                                    this.props.changeModals()
                                }
                            })
                            .catch((err) => {
                                this.setState({
                                    sending: false
                                })
                                Alert.alert('', 'Erro ao enviar mensagem.',
                                    [
                                        {
                                            text: 'Ok', onPress: () => { }
                                        }
                                    ],
                                    { cancelable: false }
                                )
                            }) 
                    }
            }else{

                FirebaseRequest.sendMessage({
                    message: this.text,
                    subject: this.subject,
                    receiverID: this.state.receiverID
                })
                    .then(() => {

                        this.text = null
                        this.subject = null
                        this.setState({
                            sending: false,
                            messageSent: true
                        })

                        if (this.state.adoptionIntent) {
                            this.props.changeModals()
                        }
                    })
                    .catch((err) => {
                        this.setState({
                            sending: false
                        })
                        Alert.alert('', 'Erro ao enviar mensagem.',
                            [
                                {
                                    text: 'Ok', onPress: () => { }
                                }
                            ],
                            { cancelable: false }
                        )
                    })
            } 
        }
    }

    sendNotificationWithMessage(){

        var isOwnerGroup = false

        if (this.state.receiverID === '' || !this.text) {
            Alert.alert('', 'Faltam campos a serem preenchidos.',
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }

        this.setState({
            sending: true
        })

        if (this.props.data.accountType) {
            isOwnerGroup = true
        }

        FirebaseRequest.sendNewAdoptionIntentNotification({
            message: this.text,
            receiverID: this.state.receiverID,
            targetAnimal: this.props.data.targetAnimal
        },isOwnerGroup)
            .then(() => {

                this.text = null
                this.subject = null
                this.setState({
                    sending: false,
                    messageSent: true
                })
                
                this.props.changeModals()
                
            })
            .catch((err) => {
                this.setState({
                    sending: false
                })
                console.error('Error sending notification: ', err.message)
            })
        

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
                            this.props.hideModals()}
                            }
                    >
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback
                            onPress={() => dismissKeyboard()}>
                            <View style={styles.innerModalContainer}>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHeaderTextContainer}>
                                        <Text style={styles.modalHeaderText}>ENVIAR MENSAGEM</Text>
                                    </View>
                                </View>
                                <View style={styles.modalTextContainerLight}>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.modalText}>Para: </Text>
                                    </View>
                                    {this.state.isMessageWithoutInicialReceiver ? 
                                    (
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={styles.fromContainer}
                                            onPress={() => { this.showWhoToSendMessageModal() }}
                                        >
                                            <Text style={styles.modalText}>{this.state.to}</Text>
                                        </TouchableOpacity>
                                        
                                    ) : 
                                    (
                                        <View style={styles.fromContainer}>
                                            <Text style={styles.receiverNameText}>{this.state.to}</Text>
                                        </View> 
                                    )}
                                </View>
                                {this.props.adoptionIntent ?
                                    (
                                        <View></View>
                                    )
                                    :
                                    (
                                        <View style={ styles.modalTextContainerLight } >
                                            <View style={styles.textContainer}>
                                                <Text style={styles.modalText}>Assunto: </Text>
                                            </View>
                                            <View style={styles.subjectInputContainer}>
                                                <TextInput
                                                    selectionColor="white"
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    onChangeText={(subject) => { this.subject = subject }}
                                                    returnKeyType="default"
                                                    style={styles.subjectInput}
                                                    onSubmitEditing={() => { }}
                                                />
                                            </View>
                                        </View>
                                    )
                                }
                                <View style={styles.messageTextContainer}>
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
                                {this.state.adoptionIntent ? 
                                    (
                                        <Text style={styles.adoptionIntentAdviceText}>
                                        Importante: Ao enviar essa mensagem, estará visível para o responsável do animal o seu perfil, 
                                        os seus animais, 
                                        o seu e-mail e telefone para contato.
                                        </Text>
                                    ): null
                                }
                                <View style={styles.buttomContainer}>
                                    {!this.state.messageSent ?
                                        (
                                            this.props.adoptionIntent ? 
                                                (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={[styles.sendButtom, { marginBottom: this.state.adoptionIntent ? 10 : 30, marginTop: this.state.adoptionIntent ? 10 : 20 }]}
                                                        onPress={() => { this.sendNotificationWithMessage()}}
                                                    >

                                                        <Text style={styles.modalFooterText}>{this.state.sending ? "Enviando..." : "Enviar"}</Text>
                                                    </TouchableOpacity>
                                                )
                                                : 
                                                (
                                                    <TouchableOpacity
                                                        activeOpacity={ 0.5}
                                                        style= { [styles.sendButtom, { marginBottom: this.state.adoptionIntent ? 10 : 30, marginTop: this.state.adoptionIntent ? 10 : 20 }]}
                                                        onPress={() => { this.sendMessage() }}
                                                    >

                                                        <Text style={styles.modalFooterText}>{this.state.sending ? "Enviando..." : "Enviar"}</Text>
                                                    </TouchableOpacity>
                                                )
                                           
                                        ):
                                        (
                                            <View style={[styles.sendButtom, { marginBottom: this.state.adoptionIntent ? 10 : 30, marginTop: this.state.adoptionIntent ? 10 : 20 }]}>
                                                <Text style={styles.modalFooterText}>Enviado</Text>
                                            </View>

                                        )
                                    }
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
                                        }}
                                    >
                                      <Text style={styles.modalFooterText}>Sair</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    </TouchableWithoutFeedback>
                    {this.state.isMessageWithoutInicialReceiver ?
                        (
                            <WhoToSendMessageModal
                                visible={this.state.whoToSendMessageModalVisible}
                                hideModals={() => this.hideModals()}
                                selectReceiver={(name,surname,key) => this.selectReceiver(name,surname,key)}
                            />
                        )
                        :
                        (
                            <View/>   
                        )
                    }
                </Modal>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.listViewBackground,
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
        width: windowWidth * 0.5
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
        fontSize: 16
    },
    innerModalContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        marginBottom: 30
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
        alignItems: 'center'
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 18,
        paddingHorizontal: 5
    },
    adoptionIntentAdviceText:{
        color: 'white',
        textAlign: 'center',
        fontSize: 10
    },
    receiverNameText: {
        color: 'white',
        fontSize: 16
    },
    subjectInputContainer:{
        flexDirection: 'row',
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        width: windowWidth * 0.5,
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    subjectInput:{
        color: 'white',
        fontSize: 14,
        flex: 1,
        height: 15,
        paddingHorizontal: 5,
    },
    textContainer:{
        width: windowWidth * 0.2,
        marginRight: 10
    }
    
})
