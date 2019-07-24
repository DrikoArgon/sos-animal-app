'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'

import ReceivedMessageModal from '../components/ReceivedMessageModal'
import AnswerMessageModal from '../components/AnswerMessageModal'
import SendMessageModal from '../components/SendMessageModal'
import FriendshipRequestModal from '../components/FriendshipRequestModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import MemberRequestModal from '../components/MemberRequestModal'
import AdoptionIntentNotificationModal from '../components/AdoptionIntentNotificationModal'
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var messages = []
var notifications = []

export default class MessagesScreen extends Component {

    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})

        this.state = {
            dataSource: ds.cloneWithRows(messages),
            notificationDataSource: ds.cloneWithRows(notifications),
            receivedMessageModalVisible: false,
            answerMessageModalVisible: false,
            friendshipRequestModalVisible: false,
            memberRequestModalVisible: false,
            adoptionIntentModalVisible: false,
            loading: true,

            receivedMessage:{
                from: '',
                message: '',
                senderID: '',
                subject: '',
                messageFrom: ''
            },
            answerMessage:{
                to: '',
                receiverID: '',
                subject: '',
                messageFrom: '',
                isServiceSending: false,
                isGroupSending: false
            },
            friendshipRequest:{
                name: '',
                senderID: '',
                notificationID: ''
            },
            memberRequest:{
                name: '',
                senderID: '',
                notificationID: ''
            },
            adoptionIntent:{
                name: '',
                senderID: '',
                phone: '',
                email: '',
                celphone: '',
                targetAnimal: ''
            },

            messagesSelected: true

            
        }

        this.darkRow = false
    }

    componentDidMount(){
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        if(FirebaseRequest.getCurrentUserMessages()){

            messages = FirebaseRequest.getCurrentUserMessages()

            this.setState({
                dataSource: ds.cloneWithRows(messages)
            })

            FirebaseRequest.listenToNewUserMessages(this.updateMessagesListWhenAdded)
            FirebaseRequest.listenToUserMessageRemoved(this.updateMessagesListWhenRemoved)
            FirebaseRequest.listenToUserMessageChanges(this.updateMessagesListWhenChanged)

        } else {

            FirebaseRequest.fetchUserMessages()
            .then((messagesArray) => {

                messages = messagesArray

                this.setState({
                    dataSource: ds.cloneWithRows(messages)
                })

                FirebaseRequest.listenToNewUserMessages(this.updateMessagesListWhenAdded)
                FirebaseRequest.listenToUserMessageRemoved(this.updateMessagesListWhenRemoved)
                FirebaseRequest.listenToUserMessageChanges(this.updateMessagesListWhenChanged)

            })
            .catch((err) => {
                this.setState({
                    dataSource: ds.cloneWithRows(messages)
                })
                console.error("Could not fetch user messages: ", err.message)
            })

        }

        if (FirebaseRequest.getCurrentUserNotifications()) {

            notifications = FirebaseRequest.getCurrentUserNotifications()

            this.setState({
                notificationDataSource: ds.cloneWithRows(notifications),
                loading: false
            })

            FirebaseRequest.listenToNewUserNotifications(this.updateNotificationsListWhenAdded)
            FirebaseRequest.listenToUserNotificationRemoved(this.updateNotificationsListWhenRemoved)

        } else {

            FirebaseRequest.fetchUserNotifications()
                .then((notificationsArray) => {

                    notifications = notificationsArray

                    this.setState({
                        notificationDataSource: ds.cloneWithRows(notifications),
                        loading: false
                    })

                    FirebaseRequest.listenToNewUserNotifications(this.updateNotificationsListWhenAdded)
                    FirebaseRequest.listenToUserNotificationRemoved(this.updateNotificationsListWhenRemoved)

                })
                .catch((err) => {
                    this.setState({
                        notificationDataSource: ds.cloneWithRows(notifications),
                        loading: false
                    })
                    console.error("Could not fetch user notifications: ", err.message)
                })

        }

    }

    componentWillUnmount(){
        FirebaseRequest.removeNewUserMessagesListener()
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


    updateNotificationsListWhenAdded = (newNotification) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        notifications.push(newNotification)

        this.setState({
            notificationDataSource: ds.cloneWithRows(notifications)
        })

    }

    updateNotificationsListWhenChanged = (changedNotification) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < notifications.length; i++) {
            if (notifications[i].key === changedNotification.key) {
                notifications[i] = changedNotification
                break
            }
        }

        this.setState({
            notificationDataSource: ds.cloneWithRows(notifications)
        })

    }

    updateNotificationsListWhenRemoved = (notificationRemoved) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for(var i = 0; i < notifications.length; i++){
            if(notifications[i].key === notificationRemoved.key){
                index = i
            }
        }

        if(index !== null){
            notifications.splice(index,1)
        }

        this.setState({
            notificationDataSource: ds.cloneWithRows(notifications)
        })

    }

    _setupReceivedMessageModal(rowData){
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

    _setupFriendshipRequestModal(rowData){
        this.setState({
            friendshipRequest: {
                name: rowData.from,
                senderID: rowData.senderID,
                notificationID: rowData.key
            }
        })
    }

    _setupMemberRequestModal(rowData) {
        this.setState({
            memberRequest: {
                name: rowData.from,
                senderID: rowData.senderID,
                notificationID: rowData.key
            }
        })
    }

    _setupAdoptionIntentModal(rowData) {
        this.setState({
            adoptionIntent: {
                name: rowData.from,
                senderID: rowData.senderID,
                phone: rowData.senderPhone,
                email: rowData.senderEmail,
                celphone: rowData.senderCelphone,
                targetAnimal: rowData.targetAnimal,
                message: rowData.message
            }
        })
    }

    showFriendshipRequestModal(rowData){
        this._setupFriendshipRequestModal(rowData)
        this.setState({ friendshipRequestModalVisible: true })

        if (!rowData.read) {
            FirebaseRequest.updateUserNotificationReadStatus(rowData.key)
                .then(() => {
                    this.props.data.decreaseCallback()
                })
                .catch((err) => alert('Erro ao marcar notificação como lida'))
        }
    }

    showMemberRequestModal(rowData){
        this._setupMemberRequestModal(rowData)
        this.setState({ memberRequestModalVisible: true })

        if (!rowData.read) {
            FirebaseRequest.updateUserNotificationReadStatus(rowData.key)
                .then(() => {
                    this.props.data.decreaseCallback()
                })
                .catch((err) => alert('Erro ao marcar notificação como lida'))
        }
    }

    showAdoptionIntentModal(rowData) {
        this._setupAdoptionIntentModal(rowData)
        this.setState({ adoptionIntentModalVisible: true })

        if(!rowData.read){
            FirebaseRequest.updateUserNotificationReadStatus(rowData.key)
                .then(() => {
                    this.props.data.decreaseCallback()
                })
                .catch((err) => alert('Erro ao marcar notificação como lida'))
        }
        
    }

    showReceivedMessageModal(rowData){
        this._setupReceivedMessageModal(rowData)
        this.setState({receivedMessageModalVisible: true})

        if(!rowData.read){
            FirebaseRequest.updateUserMessagesReadStatus(rowData.key)
                .then(() => {
                    this.props.data.decreaseCallback()
                })
                .catch((err) => alert('Erro ao marcar mensagem como lida'))
        }

    }

    hideModals(){
        this.setState({
            receivedMessageModalVisible: false,
            answerMessageModalVisible: false,
            sendMessageModalVisible: false,
            friendshipRequestModalVisible: false,
            memberRequestModalVisible: false,
            adoptionIntentModalVisible: false
        })
    }

    changeModals(){
        this.setState({
            receivedMessageModalVisible: false,
            answerMessageModalVisible: true,
            answerMessage: {
                to: this.state.receivedMessage.from,
                receiverID: this.state.receivedMessage.senderID,
                subject: this.state.receivedMessage.subject,
                messageFrom: this.state.receivedMessage.messageFrom,
                isServiceSending: false,
                isGroupSending: false
            }
        })
    }

    removeMessage(rowData){

        Alert.alert('', 'Gostaria de deletar esta mensagem?',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {

                        FirebaseRequest.removeUserMessage(rowData.key)
                        .then(() => {
                            if (!rowData.read) {
                                this.props.data.decreaseCallback()
                            }
                        })
                        .catch((err) => alert('Erro ao deletar mensagem.'))
                    }
                }
            ],
            { cancelable: false }
        )   

       

    }

    removeNotification(rowData)  {

        Alert.alert('', 'Gostaria de deletar esta notificação?',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {

                        FirebaseRequest.removeUserNotification(rowData.key)
                            .then(() => {
                                if (!rowData.read) {
                                    this.props.data.decreaseCallback()
                                }
                            })
                            .catch((err) => alert('Erro ao deletar notificação.'))
                    }
                }
            ],
            { cancelable: false }
        )   
   

    }

     _renderRow(rowData){

        let rowBackgroundColor = this.darkRow ? {backgroundColor: StyleVars.Colors.secondary} 
                                              : {backgroundColor: StyleVars.Colors.primary}

        this.darkRow = !this.darkRow

        
        return(
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.rowStyle,rowBackgroundColor]}
                    onPress={() => this.showReceivedMessageModal(rowData)}
                >
                    <View style={styles.dateContainer}>
                        <Text style={rowData.read ? styles.dateTextRead : styles.dateText}>{rowData.creationDay + '/' + rowData.creationMonth + '/' + rowData.creationYear} </Text>
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
                    activeOpacity={0.8}
                    style={styles.deleteButton}
                    onPress={() => this.removeMessage(rowData)}
                >
                    
                        <Text style={styles.rowText}>Deletar</Text>
                </TouchableOpacity>
             </View>

         )
     }

     _renderNotificationRow(rowData) {

         let rowBackgroundColor = this.darkRow ? { backgroundColor: StyleVars.Colors.secondary }
             : { backgroundColor: StyleVars.Colors.primary }

         this.darkRow = !this.darkRow

         if(rowData.type === 'friendshipRequest'){

             return (
                 <TouchableOpacity
                     activeOpacity={0.5}
                     style={[styles.rowStyle, rowBackgroundColor]}
                     onPress={() => this.showFriendshipRequestModal(rowData)}
                 >
                     <View style={styles.dateContainer}>
                         <Text style={rowData.read ? styles.dateTextRead : styles.dateText}>{rowData.creationDay + '/' + rowData.creationMonth + '/' + rowData.creationYear} </Text>
                     </View>
                     <View style={styles.textContainer}>
                         <Text style={rowData.read ? styles.rowTextRead : styles.rowText}>De: {rowData.from}</Text>
                         <Text style={rowData.read ? styles.rowTextRead : styles.rowText}>Tipo: Solicitação de Amizade</Text>
                     </View>
                 </TouchableOpacity>
             )
         } else if (rowData.type === 'memberRequest'){

             return (
                 <TouchableOpacity
                     activeOpacity={0.5}
                     style={[styles.rowStyle, rowBackgroundColor]}
                     onPress={() => this.showMemberRequestModal(rowData)}
                 >
                     <View style={styles.dateContainer}>
                         <Text style={rowData.read ? styles.dateTextRead : styles.dateText}>{rowData.creationDay + '/' + rowData.creationMonth + '/' + rowData.creationYear} </Text>
                     </View>
                     <View style={styles.textContainer}>
                         <Text style={rowData.read ? styles.rowTextRead : styles.rowText}>De: {rowData.from}</Text>
                         <Text style={rowData.read ? styles.rowTextRead : styles.rowText}>Tipo: Solicitação de Novo Membro</Text>
                     </View>
                 </TouchableOpacity>
             )
         } else {

             return (
                 <TouchableOpacity
                     activeOpacity={0.5}
                     style={[styles.rowStyle, rowBackgroundColor]}
                     onPress={() => this.showAdoptionIntentModal(rowData)}
                 >
                     <View style={styles.dateContainer}>
                         <Text style={rowData.read ? styles.dateTextRead : styles.dateText}>{rowData.creationDay + '/' + rowData.creationMonth + '/' + rowData.creationYear} </Text>
                     </View>
                     <View style={styles.textContainer}>
                         <Text style={rowData.read ? styles.rowTextRead : styles.rowText}>De: {rowData.from}</Text>
                         <Text style={rowData.read ? styles.rowTextRead : styles.rowText}>Tipo: Adoção</Text>
                     </View>
                 </TouchableOpacity>
             )
         }
         
     }

     _renderHiddenNotificationRow(rowData)  {

         let rowBackgroundColor = this.darkRow ? { backgroundColor: StyleVars.Colors.secondary }
             : { backgroundColor: StyleVars.Colors.primary }

         this.darkRow = !this.darkRow

         return (
             <View style={[styles.hiddenRow, rowBackgroundColor]}>
                 <TouchableOpacity
                     activeOpacity={0.5}
                     style={styles.deleteButton}
                     onPress={() => this.removeNotification(rowData) }
                 >

                     <Text style={styles.rowText}>Deletar</Text>
                 </TouchableOpacity>
             </View>

         )
     }

     changeListView(index) {
         index === 0 ? this.setState({ messagesSelected: true })
             : this.setState({ messagesSelected: false })
     }


    render(){

        return(
            <View style={styles.container}>
                <SegmentedControlTab
                    values={['Mensagens', 'Notificações']}
                    selectedIndex={0}
                    tabsContainerStyle={styles.tabContainerStyle}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.activeTabStyle}
                    onTabPress={index => this.changeListView(index)}
                />
                {!this.state.loading ? 
                    (
                        this.state.messagesSelected ?
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
                        )
                        : 
                        (
                                <SwipeListView 
                                    dataSource={ this.state.notificationDataSource }
                                    renderRow={(rowData) => this._renderNotificationRow(rowData)}
                                    renderHiddenRow={(rowData) => this._renderHiddenNotificationRow(rowData)}
                                    removeClippedSubviews={false}
                                    leftOpenValue={0}
                                    rightOpenValue={-(windowWidth * 0.25)}
                                >
                                </SwipeListView>
                        )
                    )
                    :
                    (
                        <View style={styles.loadingView}>
                            <Text style={styles.loadingText}>Carregando...</Text>
                        </View>
                    )
                }
                <ReceivedMessageModal
                    visible={this.state.receivedMessageModalVisible}
                    data={this.state.receivedMessage}
                    hideModals={() => this.hideModals()}
                    changeModals={() => this.changeModals()}
                />
                <AnswerMessageModal
                    visible={this.state.answerMessageModalVisible}
                    data={this.state.answerMessage}
                    hideModals={() => this.hideModals()}
                />
                <FriendshipRequestModal
                    visible={this.state.friendshipRequestModalVisible}
                    data={this.state.friendshipRequest}
                    hideModals={() => this.hideModals()}
                    navigator={this.props.navigator}
                />
                <MemberRequestModal
                    visible={this.state.memberRequestModalVisible}
                    data={this.state.memberRequest}
                    hideModals={() => this.hideModals()}
                    navigator={this.props.navigator}
                    isSenderGroup={true}
                />
                <AdoptionIntentNotificationModal
                    visible={this.state.adoptionIntentModalVisible}
                    data={this.state.adoptionIntent}
                    hideModals={() => this.hideModals()}
                    navigator={this.props.navigator}
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
    tabContainerStyle: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,

    },
    tabStyle: {
        backgroundColor: StyleVars.Colors.secondary,
        borderColor: 'rgba(255,255,255,0.5)'
    },
    activeTabStyle: {
        backgroundColor: StyleVars.Colors.primary
    },
    hiddenRow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    deleteButton:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        width: windowWidth * 0.25,
        height: windowHeight * 0.1
    }
})