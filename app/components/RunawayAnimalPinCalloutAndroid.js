'use strict'

import React, { Component } from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Modal,
    ListView,
    ScrollView,
    TouchableWithoutFeedback,
    TextInput,
    Image
} from 'react-native'

import Routes from '../navigation/Routes'
import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'

import SendMessageModal from '../components/SendMessageModal'
import PinCommentModal from '../components/PinCommentModal'
import EditPinCommentModal from '../components/EditPinCommentModal'
import DeleteCommentModal from '../components/DeleteCommentModal'
import PinOwnerInfoModal from '../components/PinOwnerInfoModal'
import PinReportModal from '../components/PinReportModal'
import Share from 'react-native-share'

var comments = []
var images = []

const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class RunawayAnimalPinCalloutAndroid extends Component {

    constructor(props) {
        super(props)

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })


        this.state = {
            dataSource: ds.cloneWithRows(comments),
            imagesDataSource: ds.cloneWithRows(images),
            sendMessageModalVisible: false,
            commentModalVisible: false,
            deleteCommentModalVisible: false,
            editCommentModalVisible: false,
            pinOwnerInfoModalVisible: false,
            reportModalVisible: false,
            selectedCommentMessage: null,
            selectedCommentID: null,
            loadingOwnerInfo: true,
            userInfo: {
                name: '',
                surname: '',
                state: '',
                city: '',
                country: ''
            },
            pinReports: {
                falseReports: 0,
                inapropriateContentReports: 0,
                isServicePin: false
            }
        }

    }

    onModalOpen() {

        comments = []
        images = this.props.data.images
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.setState({
            currentData: this.props.data,
            imagesDataSource: ds.cloneWithRows(images),
            pinReports: {
                falseReports: this.props.data.reports.falseReports.falseReportsAmount,
                inapropriateContentReports: this.props.data.reports.inapropriateContentReports.inapropriateContentReportsAmount,
                isServicePin: false
            }
        })

        this.searchUserInfo()

        FirebaseRequest.fetchPinComments(this.props.data.key)
            .then((commentsArray) => {
                comments = commentsArray
                console.log('Comments fetched: ', commentsArray)
                for (var i = 0; i < commentsArray.length; i++) {

                    FirebaseRequest.fetchPinCommentOwnerInfo(commentsArray[i], i)
                        .then((commentInfo) => {

                            comments.splice(commentInfo.index, 1, commentInfo)
                            //comments.push(commentInfo)

                            this.setState({
                                dataSource: ds.cloneWithRows(comments)
                            })


                        })
                        .catch((err) => { console.error("Error while trying to fetch comment author info: ", err.message) })
                }


                FirebaseRequest.listenToNewPinComment(this.props.data.key, this.updateCommentListWhenAdded)
                FirebaseRequest.listenToPinCommentChanges(this.props.data.key, this.updateCommentListWhenChanged)
                FirebaseRequest.listenToPinCommentRemoved(this.props.data.key, this.updateCommentListWhenRemoved)
                FirebaseRequest.listenToPinFalseReportChanges(this.props.data.key, this.updateFalseReports)
                FirebaseRequest.listenToPinInapropriateContentReportChanges(this.props.data.key, this.updateInapropriateContentReports)

            })
            .catch((err) => { console.log(err.message) })

    }

    sharePinInfo() {

        var shareOptions = this.defineShareContent()

        Share.open(shareOptions)
            .then(() => console.log("share do pin realizado com sucesso"))
            .catch((err) => { })

    }

    defineShareContent() {

        var shareContent = null

        if (this.props.data.images.length === 1) {
            console.log("Apenas uma imagem pra dar share.")
            shareContent = {
                title: 'Opções de divulgação',
                message: "Vamos ajudar!",
                urls: [
                    "data:image/png;base64," + this.props.data.images[0]
                ]
            }
        } else if (this.props.data.images.length === 2) {
            shareContent = {
                title: 'Opções de divulgação',
                message: "Vamos ajudar!",
                urls: [
                    "data:image/png;base64," + this.props.data.images[0],
                    "data:image/png;base64," + this.props.data.images[1]
                ]
            }
        } else if (this.props.data.images.length === 3) {
            shareContent = {
                title: 'Opções de divulgação',
                message: "Vamos ajudar!",
                urls: [
                    "data:image/png;base64," + this.props.data.images[0],
                    "data:image/png;base64," + this.props.data.images[1],
                    "data:image/png;base64," + this.props.data.images[2]
                ]
            }
        } else if (this.props.data.images.length === 4) {
            shareContent = {
                title: 'Opções de divulgação',
                message: "Vamos ajudar!",
                urls: [
                    "data:image/png;base64," + this.props.data.images[0],
                    "data:image/png;base64," + this.props.data.images[1],
                    "data:image/png;base64," + this.props.data.images[2],
                    "data:image/png;base64," + this.props.data.images[3]
                ]
            }
        }

        return shareContent
    }

    onModalClose() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        FirebaseRequest.removePinCommentsListener(this.props.data.key)

        comments = null
        comments = []

        this.setState({
            dataSource: ds.cloneWithRows(comments)
        })

        this.props.hideModals()
    }

    updateCommentListWhenAdded = (newComment) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        FirebaseRequest.fetchPinCommentOwnerInfo(newComment,1)
            .then((commentInfo) => {

                comments.push(commentInfo)

                this.setState({
                    dataSource: ds.cloneWithRows(comments)
                })


            })
            .catch((err) => { console.error("Error while trying to fetch comment author info: ", err.message) })

    }

    updateCommentListWhenChanged = (changedComment) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < comments.length; i++) {
            if (comments[i].key === changedComment.key) {
                comments[i].message = changedComment.message
                break
            }
        }

        this.setState({
            dataSource: ds.cloneWithRows(comments)
        })

    }

    updateCommentListWhenRemoved = (commentRemoved) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < comments.length; i++) {
            if (comments[i].key === commentRemoved.key) {
                index = i
            }
        }

        if (index !== null) {
            comments.splice(index, 1)
        }

        this.setState({
            dataSource: ds.cloneWithRows(comments)
        })

    }

    updateFalseReports = (newReportAmount) => {

        var inapropriateContentReportsAmount = this.state.pinReports.inapropriateContentReports

        this.setState({
            pinReports: {
                falseReports: newReportAmount,
                inapropriateContentReports: inapropriateContentReportsAmount
            }
        })

    }

    updateInapropriateContentReports = (newReportAmount) => {

        var falseReportsAmount = this.state.pinReports.falseReports

        this.setState({
            pinReports: {
                falseReports: falseReportsAmount,
                inapropriateContentReports: newReportAmount
            }
        })
    }

    searchUserInfo() {


        FirebaseRequest.fetchPersonInfo(this.props.data.pinOwnerID)
            .then((personInfo) => {
                this.setState({
                    userInfo: personInfo,
                    loadingOwnerInfo: false
                })
            })
            .catch((err) => { alert("Erro ao encontrar informações do dono do pin. ", err.message) })


    }

    defineShareContent() {

        var shareContent = null

        if (this.props.data.images.length === 1) {
            console.log("Apenas uma imagem pra dar share.")
            shareContent = {
                title: 'Opções de divulgação',
                message: "Vamos ajudar!",
                urls: [
                    "data:image/png;base64," + this.props.data.images[0]
                ]
            }
        } else if (this.props.data.images.length === 2) {
            shareContent = {
                title: 'Opções de divulgação',
                message: "Vamos ajudar!",
                urls: [
                    "data:image/png;base64," + this.props.data.images[0],
                    "data:image/png;base64," + this.props.data.images[1]
                ]
            }
        } else if (this.props.data.images.length === 3) {
            shareContent = {
                title: 'Opções de divulgação',
                message: "Vamos ajudar!",
                urls: [
                    "data:image/png;base64," + this.props.data.images[0],
                    "data:image/png;base64," + this.props.data.images[1],
                    "data:image/png;base64," + this.props.data.images[2]
                ]
            }
        } else if (this.props.data.images.length === 4) {
            shareContent = {
                title: 'Opções de divulgação',
                message: "Vamos ajudar!",
                urls: [
                    "data:image/png;base64," + this.props.data.images[0],
                    "data:image/png;base64," + this.props.data.images[1],
                    "data:image/png;base64," + this.props.data.images[2],
                    "data:image/png;base64," + this.props.data.images[3]
                ]
            }
        }

        return shareContent
    }

    showReportModal() {
        this.setState({
            reportModalVisible: true
        })
    }


    showPinOwnerInfoModal() {
        this.setState({
            pinOwnerInfoModalVisible: true
        })
    }

    showCommentModal() {
        this.setState({
            commentModalVisible: true
        })
    }

    showEditCommentModal(rowData) {

        this.setState({
            editCommentModalVisible: true,
            selectedCommentID: rowData.key,
            selectedCommentMessage: rowData.message
        })
    }

    showDeleteCommentModal(rowData) {
        this.setState({
            deleteCommentModalVisible: true,
            selectedCommentID: rowData.key
        })
    }

    showSendMessageModal() {
        this.setState({
            sendMessageModalVisible: true
        })
    }

    hideModals() {
        this.setState({
            sendMessageModalVisible: false,
            commentModalVisible: false,
            editCommentModalVisible: false,
            deleteCommentModalVisible: false,
            pinOwnerInfoModalVisible: false,
            reportModalVisible: false
        })
    }

    _renderRow(rowData) {

        return (
            <View style={styles.listViewRowContainer}>
                {this.props.data.pinOwnerID === FirebaseRequest.getCurrentUserID() ?
                    (
                        rowData.authorID === FirebaseRequest.getCurrentUserID() ?
                            (
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={styles.listViewRowInfoContainer}
                                    onPress={() => this.showEditCommentModal(rowData)}
                                >
                                    <View style={styles.listViewRowImageContainer}>
                                        <Image
                                            source={rowData.ownerProfileImage ? { uri: 'data:image/jpeg;base64,' + rowData.ownerProfileImage } : require("../Resources/meuPerfilIcon.png")}
                                            style={styles.commentOwnerImage}
                                        />

                                    </View>
                                    <View style={styles.listViewRowTextContainer}>
                                        <Text style={styles.commentText}>{rowData.message}</Text>
                                        <Text style={styles.commentOwnerNameText}>{rowData.ownerName}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                            :
                            (
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={styles.listViewRowInfoContainer}
                                    onPress={() => this.showDeleteCommentModal(rowData)}
                                >
                                    <View style={styles.listViewRowImageContainer}>
                                        <Image
                                            source={rowData.ownerProfileImage ? { uri: 'data:image/jpeg;base64,' + rowData.ownerProfileImage } : require("../Resources/meuPerfilIcon.png")}
                                            style={styles.commentOwnerImage}
                                        />

                                    </View>
                                    <View style={styles.listViewRowTextContainer}>
                                        <Text style={styles.commentText}>{rowData.message}</Text>
                                        <Text style={styles.commentOwnerNameText}>{rowData.ownerName}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                    )
                    :
                    (
                        rowData.authorID === FirebaseRequest.getCurrentUserID() ?
                            (
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={styles.listViewRowInfoContainer}
                                    onPress={() => this.showEditCommentModal(rowData)}
                                >
                                    <View style={styles.listViewRowImageContainer}>
                                        <Image
                                            source={rowData.ownerProfileImage ? { uri: 'data:image/jpeg;base64,' + rowData.ownerProfileImage } : require("../Resources/meuPerfilIcon.png")}
                                            style={styles.commentOwnerImage}
                                        />

                                    </View>
                                    <View style={styles.listViewRowTextContainer}>
                                        <Text style={styles.commentText}>{rowData.message}</Text>
                                        <Text style={styles.commentOwnerNameText}>{rowData.ownerName}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                            :
                            (
                                <View style={styles.listViewRowInfoContainer} >
                                    <View style={styles.listViewRowImageContainer}>
                                        <Image
                                            source={rowData.ownerProfileImage ? { uri: 'data:image/jpeg;base64,' + rowData.ownerProfileImage } : require("../Resources/meuPerfilIcon.png")}
                                            style={styles.commentOwnerImage}
                                        />

                                    </View>
                                    <View style={styles.listViewRowTextContainer}>
                                        <Text style={styles.commentText}>{rowData.message}</Text>
                                        <Text style={styles.commentOwnerNameText}>{rowData.ownerName}</Text>
                                    </View>
                                </View>
                            )
                    )
                }
            </View>
        )
    }

    _renderImageRow(rowData) {

        return (
            <Image
                source={{ uri: "data:image/jpeg;base64," + rowData }}
                style={styles.pinImage}
                resizeMode='contain'
            />
        )
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onShow={() => { this.onModalOpen() }}
                onRequestClose={() => { this.onModalClose() }}
            >
                <TouchableWithoutFeedback
                    onPress={() => { this.onModalClose() }}
                >
                    <View>
                        <Text style={{ backgroundColor: 'rgba(0,0,0,0)', height: windowHeight * 0.15, width: windowWidth }}> </Text>
                    </View>
                </TouchableWithoutFeedback>
                    <View style={styles.modalContainer}>
                            <View style={styles.innerModalContainer}>
                                <View style={styles.header}>
                                    <View style={styles.headerImageContainer}>
                                        <Image
                                            source={require("../Resources/runawayAnimalIcon.png")}
                                            style={styles.rowIcon}
                                            resizeMode='contain'
                                        />
                                    </View>
                                    <View style={styles.headerTextContainer}>
                                        <Text style={styles.headerText}>ANIMAL FUGIU</Text>
                                    </View>
                                    <View>
                                    </View>
                                </View>
                                <ScrollView
                                    ref="scrollView"
                                    keyboardShouldPersistTaps="never"
                                    automaticallyAdjustContentInsects={true}
                                    alwaysBounceVertical={true}
                                    style={styles.scrollView}
                                >
                                    <ListView
                                        dataSource={this.state.imagesDataSource}
                                        renderRow={(rowData) => this._renderImageRow(rowData)}
                                        contentContainerStyle={styles.listView}
                                        horizontal={true}
                                        removeClippedSubviews={false}
                                        enableEmptySections={true}
                                    >
                                    </ListView>
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.infoText}>Data que fugiu</Text>
                                        <View style={styles.infoContainer}>
                                            <Text style={styles.infoText}>{this.props.data.runawayDate}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.infoText}>Nome</Text>
                                        <View style={styles.infoContainer}>
                                            <Text style={styles.infoText}>{this.props.data.name}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.infoText}>Espécie</Text>
                                        <View style={styles.infoContainer}>
                                            <Text style={styles.infoText}>{this.props.data.specie}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.infoText}>Raça</Text>
                                        <View style={styles.infoContainer}>
                                            <Text style={styles.infoText}>{this.props.data.breed}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.infoText}>Sexo</Text>
                                        <View style={styles.infoContainer}>
                                            <Text style={styles.infoText}>{this.props.data.gender}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.infoText}>Idade</Text>
                                        <View style={styles.infoContainer}>
                                            <Text style={styles.infoText}>{this.props.data.ageAmount} {this.props.data.ageType}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.infoText}>Porte</Text>
                                        <View style={styles.infoContainer}>
                                            <Text style={styles.infoText}>{this.props.data.size}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.infoText}>Criado por</Text>
                                        {this.state.loadingOwnerInfo ?
                                            (
                                                <View style={styles.displayContainer}>
                                                    <View style={styles.userInfoDisplay}>
                                                        <View style={styles.textContainer}>
                                                            <Text style={styles.loadingText}>Carregando...</Text>
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
                                                        onPress={() => this.showPinOwnerInfoModal()}
                                                    >
                                                        <View style={styles.userInfoContainer}>
                                                            <View style={styles.imageContainer}>
                                                                <Image
                                                                    source={this.state.userInfo.profileImage ? { uri: 'data:image/jpeg;base64,' + this.state.userInfo.profileImage } : require("../Resources/meuPerfilIcon.png")}
                                                                    style={styles.pinOwnerImage}
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
                                    </View>
                                    <View style={styles.separatorContainer}>
                                        <View style={styles.separator}></View>
                                    </View>
                                    <ListView
                                        dataSource={this.state.dataSource}
                                        renderRow={(rowData) => this._renderRow(rowData)}
                                        enableEmptySections={true}
                                    >
                                    </ListView>
                                </ScrollView>
                                <View style={styles.footer}>
                                    {/*  
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => this.showSendMessageModal()}
                                >
                                    <Image 
                                        source={require("../Resources/messageIcon.png")}
                                        style={styles.footerIconImage}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
*/}
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => this.showCommentModal()}
                                    >
                                        <Image
                                            source={require("../Resources/balloon.png")}
                                            style={styles.footerIconImage}
                                            resizeMode='contain'
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => this.sharePinInfo()}
                                    >
                                        <Image
                                            source={require("../Resources/shareIcon.png")}
                                            style={styles.footerIconImage}
                                            resizeMode='contain'
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => this.showReportModal()}
                                    >
                                        <Image
                                            source={require("../Resources/reportIcon.png")}
                                            style={styles.footerIconImage}
                                            resizeMode='contain'
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                    </View>
                {/* <SendMessageModal
                    visible={this.state.sendMessageModalVisible}
                    hideModals={() => this.hideModals()}
                    isMessageFromPin={true}
                    data={this.props.data}
                /> */}
                <PinCommentModal
                    visible={this.state.commentModalVisible}
                    hideModals={() => this.hideModals()}
                    headerColor={StyleVars.Colors.runawayAnimalPinBackground}
                    pinID={this.props.data.key}
                />
                <DeleteCommentModal
                    visible={this.state.deleteCommentModalVisible}
                    hideModals={() => this.hideModals()}
                    headerColor={StyleVars.Colors.runawayAnimalPinBackground}
                    pinID={this.props.data.key}
                    commentID={this.state.selectedCommentID}
                />
                <EditPinCommentModal
                    visible={this.state.editCommentModalVisible}
                    hideModals={() => this.hideModals()}
                    headerColor={StyleVars.Colors.runawayAnimalPinBackground}
                    pinID={this.props.data.key}
                    commentID={this.state.selectedCommentID}
                    message={this.state.selectedCommentMessage}
                />
                <PinOwnerInfoModal
                    visible={this.state.pinOwnerInfoModalVisible}
                    hideModals={() => this.hideModals()}
                    pinOwnerData={this.state.userInfo}
                    pinData={this.props.data}
                />
                <PinReportModal
                    visible={this.state.reportModalVisible}
                    hideModals={() => this.hideModals()}
                    pinData={this.props.data}
                    pinReportsData={this.state.pinReports}
                    headerColor={StyleVars.Colors.runawayAnimalPinBackground}
                />
                <TouchableWithoutFeedback
                    onPress={() => { this.onModalClose() }}
                >
                    <View>
                        <Text style={{ backgroundColor: 'rgba(0,0,0,0)', height: windowHeight * 0.15, width: windowWidth }}> </Text>
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
        paddingHorizontal: windowWidth * 0.1
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
    header: {
        backgroundColor: StyleVars.Colors.runawayAnimalPinBackground,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'space-between',
        paddingHorizontal: 10

    },
    headerText: {
        color: 'white',
        fontSize: 16
    },
    headerImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowIcon: {
        width: windowWidth * 0.06,
        height: windowHeight * 0.06
    },
    pinImage: {
        width: windowWidth * 0.8,
        height: windowHeight * 0.298,
        marginBottom: 5
    },
    commentOwnerNameText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5
    },
    commentText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 14
    },
    commentOwnerImage: {
        width: windowWidth * 0.17,
        height: windowWidth * 0.17,
        borderRadius: (windowWidth * 0.17) / 2,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5
    },
    listViewRowInfoContainer: {
        flexDirection: 'row',
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5

    },
    listViewRowContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5
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
    separatorContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    separator: {
        height: 1,
        marginTop: 3,
        marginBottom: 3,
        width: windowWidth * 0.75,
        backgroundColor: 'white'
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    infoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: StyleVars.Colors.secondary,
        width: windowWidth * 0.7,
        paddingVertical: 3,
        marginTop: 5
    },
    smallInfoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: StyleVars.Colors.secondary,
        width: windowWidth * 0.325,
        paddingVertical: 3,
        marginTop: 5,
        marginRight: 10,
        marginLeft: 10
    },
    infoText: {
        color: 'white',
        fontSize: 16
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
        marginBottom: 30,
        height: windowHeight * 0.7
    },
    footer: {
        backgroundColor: StyleVars.Colors.runawayAnimalPinBackground,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    footerIconImage: {
        width: windowWidth * 0.07,
        height: windowHeight * 0.03
    },
    buttomContainer: {
        alignItems: 'center',
        justifyContent: 'center'
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
    displayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
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
    userInfoDisplay: {
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        paddingVertical: 10,
        width: windowWidth * 0.75,
        height: windowHeight * 0.18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    userInfoNameContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    pinOwnerImage: {
        height: windowWidth * 0.22,
        width: windowWidth * 0.22,
        borderRadius: (windowWidth * 0.22) / 2
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    imageContainer: {
        justifyContent: 'center',
        marginBottom: 7,
        marginTop: 5,
        marginRight: 15
    },
    loadingText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5
    },
    rowText: {
        color: 'white',
        fontSize: 12
    },
    friendImage: {
        height: windowWidth * 0.22,
        width: windowWidth * 0.22,
        borderRadius: (windowWidth * 0.22) / 2
    }
})
