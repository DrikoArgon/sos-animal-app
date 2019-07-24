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
    Image
} from 'react-native'

import Routes from '../navigation/Routes'
import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'


const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class FriendshipRequestModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            addingFriend: false,
            userInfo: null,
            lastUserNameSearched: ''
        }

    }

    searchUserInfo(){

        if(this.state.lastUserNameSearched !== this.props.data.name){

            this.setState({
                loading: true,
                lastUserNameSearched: this.props.data.name
            })

            FirebaseRequest.fetchPersonInfo(this.props.data.senderID)
                .then((personInfo) => {
                    this.setState({
                        userInfo: personInfo,
                        loading: false
                    })
                })
                .catch((err) => { console.error("Error trying to search person info ", err.message) })
        } 

    }

    goToProfile(){

        this.props.hideModals()

        this.props.navigator.push(Routes.friendProfile(this.state.userInfo,false,false,true))
    }

    acceptFriendship(){

        this.setState({
            addingFriend: true
        })

        FirebaseRequest.addNewFriend(this.props.data.senderID,this.props.data.notificationID)
        .then(() => {
            this.setState({
                addingFriend: false
            })

            this.props.hideModals()
        })
        .catch((err) => {
            console.error('Error while trying to add friend: ', err.message)
        })

    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onShow={() => this.searchUserInfo()}
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
                                        <Text style={styles.modalHeaderText}>Solicitação de Amizade</Text>
                                    </View>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.modalText}>O usuário {this.props.data.name} deseja te adicionar à sua lista de amigos.</Text>
                                </View>
                                {this.state.loading ?
                                    (
                                        <View style={styles.displayContainer}>
                                            <View style={styles.userInfoDisplay}>
                                                <View style={styles.textContainer}>
                                                    <Text style={styles.modalText}>Carregando...</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                    :
                                    (
                                        <View style={styles.displayContainer}>
                                            <TouchableOpacity
                                                activeOpacity={0.5}
                                                style={styles.userInfoDisplay}
                                                onPress={() => this.goToProfile()}
                                            >
                                                <View style={styles.userInfoContainer}>
                                                    <View style={styles.imageContainer}>
                                                        <Image
                                                            source={this.state.userInfo.profileImage ? { uri: 'data:image/jpeg;base64,' + this.state.userInfo.profileImage } : require("../Resources/meuPerfilIcon.png")}
                                                            style={styles.friendImage}
                                                        />
                                                    </View>
                                                    <View style={styles.userInfoNameContainer}>
                                                        <Text style={styles.rowText}>{this.state.userInfo.name} {this.state.userInfo.surname}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                
                                }
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={styles.closeButtom}
                                        onPress={() => this.props.hideModals()}
                                    >
                                        <Text style={styles.modalFooterText}>Sair</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={styles.sendButtom}
                                        onPress={() => { this.acceptFriendship() }}
                                    >
                                        <Text style={styles.modalFooterText}>{this.state.addingFriend ?  'Adicionando...' :  'Aceitar'}</Text>
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
        padding: 20,
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
        fontSize: 24
    },
    modalText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
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
        fontSize: 16
    },
    buttomContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendButtom: {
        backgroundColor: 'rgb(29,105,175)',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.37,
        marginTop: 5,
        marginBottom: 5,
        alignItems: 'center'
    },
    closeButtom: {
        backgroundColor: 'darkred',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.37,
        marginTop: 5,
        marginBottom: 5,
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
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    biggerText: {
        color: 'white',
        fontSize: 22,
        textAlign: 'center'
    },
    valueText: {
        color: 'lime',
        fontSize: 20,
        textAlign: 'center'
    },
    userInfoDisplay: {
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        paddingVertical: 10,
        width: windowWidth * 0.75,
        height: windowHeight * 0.18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    displayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginTop: 10
    },
    rowText: {
        color: 'white',
        fontSize: 12
    },
    userInfoContainer: {
        flexDirection: 'row',
        borderRadius: 10,
        paddingHorizontal: 25,
        paddingVertical: 5,
        width: windowWidth * 0.75,
        height: windowHeight * 0.18,
        alignItems: 'center'

    },
    friendImage: {
        height: windowWidth * 0.22,
        width: windowWidth * 0.22,
        borderRadius: (windowWidth * 0.22) / 2
    },
    userInfoNameContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageContainer: {
        justifyContent: 'center',
        marginBottom: 7,
        marginTop: 5,
        marginRight: 15
    },

})
