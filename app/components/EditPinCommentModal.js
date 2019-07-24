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
    TextInput
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'


const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class EditPinCommentModal extends Component {

    constructor(props) {
        super(props)

        this.text = this.props.message

        this.state = {
            deletingComment: false,
            sendingComment: false
        }
    }

    deleteComment() {

        this.setState({
            deletingComment: true
        })

        FirebaseRequest.removeCommentFromPin(this.props.pinID, this.props.commentID)
            .then(() => {
                this.setState({
                    deletingComment: false
                })
                this.props.hideModals()
            })
            .catch((err) => {
                Alert.alert('', 'Não foi possível deletar o comentáro.',
                    [
                        {
                            text: 'Ok', onPress: () => { }
                        }
                    ],
                    { cancelable: false }
                )
                this.setState({
                    deletingComment: false
                })
            })

    }

    editComment(){

        if (this.text === null || this.text === '') {
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
            sendingComment: true
        })

        FirebaseRequest.updatePinComment(this.props.pinID, this.props.commentID,this.text)
            .then(() => {
                this.setState({
                    sendingComment: false
                })
                this.props.hideModals()
            })
            .catch((err) => {
                console.error("Error while editing comment: ", err.message)
                this.setState({
                    sendingComment: false
                })
            })


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
                                <View style={[styles.modalHeader, { backgroundColor: this.props.headerColor }]}>
                                    <View style={styles.modalHeaderTextContainer}>
                                        <Text style={styles.modalHeaderText}>Editar Comentário</Text>
                                    </View>
                                </View>
                                <View style={styles.messageTextContainer}>
                                    <Text style={styles.modalText}></Text>
                                    <TextInput
                                        placeholder={this.props.message}
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                        selectionColor="white"
                                        multiline={true}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        defaultValue={this.props.message}
                                        onChangeText={(text) => { this.text = text }}
                                        returnKeyType="default"
                                        style={styles.input}
                                        onSubmitEditing={() => { }}
                                    />
                                </View>
                                <View style={styles.rowContainer}>
                                    <View style={styles.buttomContainer}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={styles.editButtom}
                                            onPress={() => this.editComment()}
                                        >
                                            <Text style={styles.modalFooterText}>{this.state.sendingComment ? 'Editando...' : 'Editar'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.buttomContainer}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={styles.sendButtom}
                                            onPress={() => this.deleteComment()}
                                        >
                                            <Text style={styles.modalFooterText}>{this.state.deletingComment ? 'Deletando...' : 'Deletar'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[styles.modalFooter, { backgroundColor: this.props.headerColor }]}>
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
    fromContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.5,
        marginLeft: 20
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
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 5
    },
    innerModalContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        marginBottom: 30
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
    messageTextContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        height: windowHeight * 0.2
    },
    buttomContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendButtom: {
        backgroundColor: 'darkred',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.35,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    },
    editButtom: {
        backgroundColor: 'darkgreen',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.35,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 18,
        paddingHorizontal: 5
    },
    adoptionIntentAdviceText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 12
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    rowContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12
    }

})
