'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView
} from 'react-native'

import StyleVars from '../styles/StyleVars'

import ReceivedMessageModal from '../components/ReceivedMessageModal'
import AnswerMessageModal from '../components/AnswerMessageModal'
import SendMessageModal from '../components/SendMessageModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var messages = []

export default class AnnouncerMessageScreen extends Component {

    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})

        this.state = {
            dataSource: ds.cloneWithRows(messages),
            receivedMessageModalVisible: false,
            answerMessageModalVisable: false,
            sendMessageModalVisable: false,
            loading: true,

            receivedMessage: {
                from: '',
                message: '',
                senderID: '',
                subject: '',
                messageFrom: ''
            },
            answerMessage: {
                to: '',
                receiverID: '',
                subject: '',
                messageFrom: '',
                isServiceSending: true,
                isGroupSending: false
            }
        }

        this.darkRow = false
    }

    componentDidMount() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        if (FirebaseRequest.getCurrentServiceMessages()) {

            messages = FirebaseRequest.getCurrentServiceMessages()

            this.setState({
                dataSource: ds.cloneWithRows(messages),
                loading: false
            })


            FirebaseRequest.listenToNewServiceMessages(this.updateMessagesListWhenAdded)
            FirebaseRequest.listenToServiceMessageChanges(this.updateMessagesListWhenChanged)
            FirebaseRequest.listenToServiceMessageRemoved(this.updateMessagesListWhenRemoved)

        } else {

            FirebaseRequest.fetchServiceMessages()
                .then((messagesArray) => {

                    messages = messagesArray

                    this.setState({
                        dataSource: ds.cloneWithRows(messages),
                        loading: false
                    })

                    FirebaseRequest.listenToNewServiceMessages(this.updateMessagesListWhenAdded)
                    FirebaseRequest.listenToServiceMessageChanges(this.updateMessagesListWhenChanged)
                    FirebaseRequest.listenToServiceMessageRemoved(this.updateMessagesListWhenRemoved)

                })
                .catch((err) => {
                    this.setState({
                        dataSource: ds.cloneWithRows(messages),
                        loading: false
                    })
                    console.error("Could not fetch service messages: ", err.message)
                })

        }

    }

    componentWillUnmount() {
        FirebaseRequest.removeNewServiceMessagesListener()
    }

    updateMessagesListWhenAdded = (newMessage) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        messages.push(newMessage)

        this.setState({
            dataSource: ds.cloneWithRows(messages)
        })

    }

    updateMessagesListWhenChanged = (changedMessage) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < messages.length; i++) {
            if (messages[i].key === changedMessage.key) {
                messages[i] = changedMessage
                break
            }
        }

        this.setState({
            dataSource: ds.cloneWithRows(messages)
        })

    }

    updateMessagesListWhenRemoved = (messageRemoved) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < messages.length; i++) {
            if (messages[i].key === messageRemoved.key) {
                index = i
            }
        }

        if (index !== null) {
            messages.splice(index, 1)
        }

        this.setState({
            dataSource: ds.cloneWithRows(messages)
        })

    }

    removeMessage(rowData) {

        FirebaseRequest.removeServiceMessage(rowData.key)
        .then(() => {
            if (rowData.read === false) {
                this.props.data.decreaseCallback()
            } 
        })
        .catch((err) => alert('Erro ao deletar mensagem.'))

    }


    _setupReceivedMessageModal(rowData) {
        this.setState({
            receivedMessage: {
                from: rowData.from,
                message: rowData.message,
                senderID: rowData.senderID,
                subject: rowData.subject,
                messageFrom: rowData.messageFrom
            }
        })
    }

    showReceivedMessageModal(rowData){
        this._setupReceivedMessageModal(rowData)
        this.setState({receivedMessageModalVisible: true})

        if (!rowData.read) {
            FirebaseRequest.updateServiceMessagesReadStatus(rowData.key)
            .then(() => {
                this.props.data.decreaseCallback()
            })
            .catch((err) => alert('Erro ao marcar notificação como lida'))
        }
    }

     hideModals(){
        this.setState({
            receivedMessageModalVisible: false,
            answerMessageModalVisable: false,
            sendMessageModalVisable: false,
        })
    }

    changeModals(){
        this.setState({
            receivedMessageModalVisible: false,
            answerMessageModalVisable: true,
            answerMessage: {
                to: this.state.receivedMessage.from,
                receiverID: this.state.receivedMessage.senderID,
                subject: this.state.receivedMessage.subject,
                messageFrom: this.state.receivedMessage.messageFrom,
                isServiceSending: true,
                isGroupSending: false
            }
        })
    }

     _renderRow(rowData){

        let rowBackgroundColor = this.darkRow ? {backgroundColor: StyleVars.Colors.secondary} 
                                              : {backgroundColor: StyleVars.Colors.primary}

        this.darkRow = !this.darkRow
        
        return(
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={[styles.rowStyle,rowBackgroundColor]}
                    onPress={() => this.showReceivedMessageModal(rowData)}
                >
                    <View style={styles.dateContainer}>
                    <Text style={rowData.read ? styles.dateTextRead : styles.dateText}>{rowData.creationDay + '/' + rowData.creationMonth + '/' + rowData.creationYear}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={rowData.read ? styles.rowTextRead : styles.rowText}>De: {rowData.from}</Text>
                        <Text style={rowData.read ? styles.rowTextRead : styles.rowText}>Assunto: {rowData.subject}</Text>
                    </View>
                </TouchableOpacity>
            
        )
    }

     _renderHiddenMessageRow(rowData) {

         let rowBackgroundColor = this.darkRow ? { backgroundColor: StyleVars.Colors.secondary }
             : { backgroundColor: StyleVars.Colors.primary }

         this.darkRow = !this.darkRow

         return (
             <View style={[styles.hiddenRow, rowBackgroundColor]}>
                 <TouchableOpacity
                     activeOpacity={0.5}
                     style={styles.deleteButton}
                     onPress={() => this.removeMessage(rowData)}
                 >

                     <Text style={styles.rowText}>Deletar</Text>
                 </TouchableOpacity>
             </View>

         )
     }


    render(){

        return(
            <View style={styles.container}>
                {this.state.loading ? 
                (
                    <View style={styles.loadingView}>
                        <Text style={styles.loadingText}>Carregando...</Text>
                    </View>
                ) : 
                (
                        <SwipeListView
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => this._renderRow(rowData)}
                            renderHiddenRow={(rowData) => this._renderHiddenMessageRow(rowData)}
                            removeClippedSubviews={false}
                            leftOpenValue={0}
                            rightOpenValue={-(windowWidth * 0.25)}

                        >
                        </SwipeListView>
                )}
                
                <ReceivedMessageModal
                    visible={this.state.receivedMessageModalVisible}
                    data={this.state.receivedMessage}
                    hideModals={() => this.hideModals()}
                    changeModals={() => this.changeModals()}
                />
                <SendMessageModal
                    visible={this.state.sendMessageModalVisable}
                    hideModals={() => this.hideModals()}
                />
                <AnswerMessageModal
                    visible={this.state.answerMessageModalVisable}
                    data={this.state.answerMessage}
                    hideModals={() => this.hideModals()}
                />
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.listViewBackground
    },
    rowText:{
        color: 'white',
        fontSize: 14
    },
    dateText:{
        color: 'white',
        fontSize: 12
    },
    rowTextRead: {
        color: 'darkgrey',
        fontSize: 14
    },
    dateTextRead: {
        color: 'darkgrey',
        fontSize: 12
    },
    rowStyle:{
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    textContainer:{
        paddingVertical: 10,
        marginLeft: 30
    },
    dateContainer:{
        alignItems: 'center',
        paddingVertical: 10
    },
    loadingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        color: 'white',
        fontSize: 16
    },
    hiddenRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    deleteButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        width: windowWidth * 0.25,
        height: windowHeight * 0.1
    }
})