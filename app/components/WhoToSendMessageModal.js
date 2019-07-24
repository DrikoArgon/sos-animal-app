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
    Image,
    ListView
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'


const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var receivers = []

export default class WhoToSendMessageModal extends Component {

    constructor(props) {
        super(props)

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.state = {
            dataSource: ds.cloneWithRows(receivers),
            loading: true,
            friendsFound: false
        }

        this.darkRow = false

    }

    onModalOpen(){

        if (!this.state.friendsFound){

            const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

            FirebaseRequest.fetchUserFriends()
                .then((friendsArray) => {

                    receivers = friendsArray

                    this.setState({
                        dataSource: ds.cloneWithRows(receivers),
                        loading: false,
                        friendsFound: true
                    })

                })
                .catch((err) => {
                    alert('Erro ao encontrar informações dos amigos')
                    this.setState({
                        loading: false
                    })
                })
        }
    }

    _renderRow(rowData){


        let rowBackgroundColor = this.darkRow ? { backgroundColor: StyleVars.Colors.secondary }
            : { backgroundColor: StyleVars.Colors.listViewBackground }

        this.darkRow = !this.darkRow

       return( 
            <View style={styles.listViewRowContainer}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={[styles.listViewRowInfoContainer,rowBackgroundColor]}
                    onPress={() => {this.props.selectReceiver(rowData.name,rowData.surname,rowData.key)}}
                >
                    <View style={styles.listViewRowImageContainer}>
                        <Image
                            source={rowData.profileImage ? { uri: 'data:image/jpeg;base64,' + rowData.profileImage } : require("../Resources/meuPerfilIcon.png")}
                            style={styles.userImage}
                        />
                    </View>
                    <View style={styles.listViewRowTextContainer}>
                        <Text style={styles.userNameText}>{rowData.name} {rowData.surname}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )

    }


    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => { }}
                onShow={() => { this.onModalOpen() }}
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
                                        <Text style={styles.modalHeaderText}>Escolher Remetente</Text>
                                    </View>
                                </View>
                                {this.state.loading ? 
                                    (
                                        <View style={styles.loadingView}>
                                            <View style={styles.modalTextContainerLight}>
                                                <Text style={styles.modalText}>Carregando...</Text>
                                            </View>
                                        </View>
                                    )
                                    :
                                    (
                                        <ListView
                                            dataSource={this.state.dataSource}
                                            renderRow={(rowData) => this._renderRow(rowData)}
                                            enableEmptySections={true}
                                        >
                                        </ListView>
                                    )
                                }           
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
        backgroundColor: StyleVars.Colors.listViewBackground
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
        paddingHorizontal: 15
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
        fontSize: 16,
        textAlign: 'center'
    },
    bulletText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
    },
    innerModalContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        height: windowHeight * 0.6
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
    listViewRowInfoContainer: {
        flexDirection: 'row',
        backgroundColor: StyleVars.Colors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10

    },
    listViewRowTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 10
    },
    listViewRowImageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    userNameText: {
        color: 'white',
        fontSize: 12
    },
    userImage: {
        width: windowWidth * 0.17,
        height: windowWidth * 0.17,
        borderRadius: (windowWidth * 0.17) / 2,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5
    },
    listViewRowContainer:{
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    loadingView:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})
