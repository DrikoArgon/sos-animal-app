import React, { PropTypes } from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScroolView,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    ListView,
    Alert
} from 'react-native';


import StyleVars from '../styles/StyleVars'
import SendMessageModal from '../components/SendMessageModal'
import EditPinCommentModal from '../components/EditPinCommentModal'
import DeleteCommentModal from '../components/DeleteCommentModal'
import PinCommentModal from '../components/PinCommentModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import PinReportModal from '../components/PinReportModal'
import RatingModal from '../components/RatingModal'


const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var comments = []


const propTypes = {
    style: PropTypes.object,
};

export default class ServicePinCallout extends React.Component {

    constructor(props) {
        super(props)

        this.windowColor = null
        this.data = this.props.data
        this.data = Object.assign(this.data,{accountType: 'service'})

        if(this.props.data.featured){
            this.windowColor = 'green'
        } else {
            this.windowColor = StyleVars.Colors.secondary
        }

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            dataSource: ds.cloneWithRows(comments),
            sendMessageModalVisible: false,
            commentModalVisible: false,
            deleteCommentModalVisible: false,
            editCommentModalVisible: false,
            reportModalVisible: false,
            selectedCommentMessage: null,
            selectedCommentID: null,
            ratingModalVisible: false,
            pinReports: {
                falseReports: this.data.reports.falseReports.falseReportsAmount,
                inapropriateContentReports: this.data.reports.inapropriateContentReports.inapropriateContentReportsAmount,
                isServicePin: true
            },
            averageRating: null,
            fetchingRating: true,
            addingToFavorite: false,
            isFavorite: false,
            searchingIfFavorite: true,
            favoriteKey: '',
            serviceInfo: this.props.data
        }

    }

    componentDidMount() {

        comments = []
        FirebaseRequest.fetchServiceComments(this.data.pinOwnerID, this.fillCommentArray)
        FirebaseRequest.listenToServicePinCommentChanges(this.data.pinOwnerID, this.updateCommentListWhenChanged)
        FirebaseRequest.listenToServicePinCommentRemoved(this.data.pinOwnerID, this.updateCommentListWhenRemoved)
        FirebaseRequest.listenToServiceInfoChanges(this.data.pinOwnerID,this.updateServiceInfo)
        FirebaseRequest.listenToPinFalseReportChanges(this.data.key, this.updateFalseReports)
        FirebaseRequest.listenToPinInapropriateContentReportChanges(this.data.key, this.updateInapropriateContentReports)
        FirebaseRequest.listenToRatingChanges(this.data.pinOwnerID, this.updateRating)

        FirebaseRequest.fetchServiceRating(this.data.pinOwnerID)
        .then((averageRating) => {
            this.setState({
                averageRating: averageRating,
                fetchingRating: false
            })
        })
        .catch((err) => {
            console.log('Erro ao pegar rating do serviço', err.message)
        })

        var favouriteServicesAndGroupsArray = []

        if (FirebaseRequest.getCurrentUserFavoriteServicesAndGroups()) {

            favouriteServicesAndGroupsArray = FirebaseRequest.getCurrentUserFavoriteServicesAndGroups()

            for (var i = 0; i < favouriteServicesAndGroupsArray.length; i++) {

                if (favouriteServicesAndGroupsArray[i].key === this.data.pinOwnerID) {

                    this.setState({
                        isFavorite: true,
                        favoriteKey: favouriteServicesAndGroupsArray[i].favoriteKey
                    })
                    break
                }
            }

            this.setState({
                searchingIfFavorite: false
            })

        } else {
            FirebaseRequest.fetchUserFavoriteServicesAndGroups()
                .then((servicesAndGroupsArray) => {
                    favouriteServicesAndGroupsArray = servicesAndGroupsArray

                    for (var i = 0; i < favouriteServicesAndGroupsArray.length; i++) {

                        if (favouriteServicesAndGroupsArray[i].key === this.data.pinOwnerID) {

                            this.setState({
                                isFavorite: true,
                                favoriteKey: favouriteServicesAndGroupsArray[i].favoriteKey
                            })
                            break
                        }
                    }

                    this.setState({
                        searchingIfFavorite: false
                    })

                })
                .catch((err) => console.error("Error while fetching user favorite services. ", err.message))
        }

    }

    updateRating = (newRating) => {
        this.state.averageRating = newRating
    }

    fillCommentArray = (comment) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        FirebaseRequest.fetchPersonInfo(comment.authorID)
            .then((personInfo) => {

                var commentInfo = {
                    ownerName: personInfo.name + ' ' + personInfo.surname,
                    ownerProfileImage: personInfo.profileImage,
                    message: comment.message
                }
                comments.push(commentInfo)

                this.setState({
                    dataSource: ds.cloneWithRows(comments)
                })

            })
            .catch((err) => { alert("Erro ao encontrar informação do autor do comentário") })
    }

    updateServiceInfo = (changedInfo) => {


        console.log("Old state: " ,Object.keys(this.state.serviceInfo))

        this.setState({
            serviceInfo: changedInfo
        })

        console.log("New state: ", Object.keys(this.state.serviceInfo))

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

    addToUserFavorites() {

        this.setState({
            addingToFavorite: true
        })

        FirebaseRequest.addServiceOrGroupToFavorites(this.data.pinOwnerID, false)
            .then((key) => {

                this.setState({
                    addingToFavorite: false,
                    isFavorite: true,
                    favoriteKey: key
                })
            })
            .catch((err) => { console.error("Error while adding service to favorites. ", err.message) })
    }  

    removeFromUserFavorites() {

        Alert.alert('', 'Gostaria de remover este serviço dos favoritos?',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {
                        this.setState({
                            addingToFavorite: true
                        })

                        FirebaseRequest.removeServiceOrGroupFromFavorites(this.state.favoriteKey)
                            .then(() => {

                                this.setState({
                                    addingToFavorite: false,
                                    isFavorite: false
                                })

                                Alert.alert('Sucesso', 'Serviço removido.')
                            })
                            .catch((err) => {
                                Alert.alert('Atenção', 'Erro ao remover serviço.')
                                this.setState({
                                    addingFriend: false
                                })
                            })
                    }
                }
            ],
            { cancelable: false }
        )


    }


    showRatingModal() {
        this.setState({
            ratingModalVisible: true
        })
    }

    showReportModal() {
        this.setState({
            reportModalVisible: true
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
            reportModalVisible: false,
            ratingModalVisible: false
        })
    }

    renderStars() {

        if (0 <= this.state.averageRating && this.state.averageRating < 0.5) {
            return (
                <Image
                    source={require("../Resources/Stars/none.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (5 <= this.state.averageRating && this.state.averageRating < 1.0) {
            return (
                <Image
                    source={require("../Resources/Stars/half.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (1.0 <= this.state.averageRating && this.state.averageRating < 1.5) {
            return (
                <Image
                    source={require("../Resources/Stars/one.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (1.5 <= this.state.averageRating && this.state.averageRating < 2.0) {
            return (
                <Image
                    source={require("../Resources/Stars/oneAndAHalf.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (2.0 <= this.state.averageRating && this.state.averageRating < 2.5) {
            return (
                <Image
                    source={require("../Resources/Stars/two.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (2.5 <= this.state.averageRating && this.state.averageRating < 3.0) {
            return (
                <Image
                    source={require("../Resources/Stars/twoAndAHalf.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (3.0 <= this.state.averageRating && this.state.averageRating < 3.5) {
            return (
                <Image
                    source={require("../Resources/Stars/three.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (3.5 <= this.state.averageRating && this.state.averageRating < 4.0) {
            return (
                <Image
                    source={require("../Resources/Stars/threeAndAHalf.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (4.0 <= this.state.averageRating && this.state.averageRating < 4.5) {
            return (
                <Image
                    source={require("../Resources/Stars/four.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (4.5 <= this.state.averageRating && this.state.averageRating < 5.0) {
            return (
                <Image
                    source={require("../Resources/Stars/fourAndAHalf.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else {
            return (
                <Image
                    source={require("../Resources/Stars/five.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }

    }

    _renderRow(rowData) {

        return (
            <View style={styles.listViewRowContainer}>
                {rowData.authorID === FirebaseRequest.getCurrentUserID() ?
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
                }
            </View>
        )
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>

                <View style={styles.bubble}>
                    <View style={styles.header}>
                        <View style={styles.headerImageContainer}>
                            <Image
                                source={
                                    this.state.serviceInfo.CRMV !== '-' ? 
                                    (
                                        require("../Resources/Pins/vetPin.png")
                                    )
                                    :
                                    (
                                        this.state.serviceInfo.featured ? 
                                        (
                                                require("../Resources/Pins/featuredServicePin.png")
                                        )
                                        :
                                        (
                                                require("../Resources/Pins/servicePin.png")
                                        )
                                    )
                                }
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerText}>{this.state.serviceInfo.pinOwnerName}</Text>
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
                        <Image
                            source={{ uri: "data:image/jpeg;base64," + this.state.serviceInfo.backgroundImage }}
                            style={styles.pinImage}
                            resizeMode='contain'
                        />
                        <View style={styles.infoContainer}>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoDescriptionText}>Endereço: </Text>
                                <Text style={styles.infoText}>{this.state.serviceInfo.adress}</Text>
                            </View>
                            <Text style={styles.infoText}>{this.state.serviceInfo.district}, {this.state.serviceInfo.city},</Text>
                            <Text style={styles.infoText}>{this.state.serviceInfo.state}, {this.state.serviceInfo.country}</Text>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoDescriptionText}>Telefone: </Text>
                                <Text style={styles.infoText}>{this.state.serviceInfo.phone}</Text>
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoDescriptionText}>Horário: </Text>
                                <Text style={styles.infoText}>{this.state.serviceInfo.openingHour} - {this.state.serviceInfo.closingHour}</Text>
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoDescriptionText}>Site: </Text>
                                <Text style={styles.infoText}>{this.state.serviceInfo.website}</Text>
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoDescriptionText}>E-mail: </Text>
                                <Text style={styles.infoText}>{this.state.serviceInfo.email}</Text>
                            </View>
                        </View>
                        <View style={[styles.rowContainer,{justifyContent: 'center'}]}>

                            {!this.state.searchingIfFavorite ?
                                (
                                    this.state.isFavorite ?
                                        (
                                            <TouchableOpacity
                                                activeOpacity={0.5}
                                                style={styles.favouriteButtonContainer}
                                                onPress={() => this.removeFromUserFavorites()}
                                            >
                                                <View style={styles.favoriteButtonDisabled}>
                                                    <Image
                                                        source={require("../Resources/brokenHeartIcon.png")}
                                                        style={styles.heartIcon}
                                                        resizeMode='contain'
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        ) :
                                        (
                                            this.state.addingToFavorite ?
                                                (
                                                    <View style={styles.favouriteButtonContainer}>
                                                        <View style={styles.favoriteButtonDisabled}>
                                                            <Image
                                                                source={require("../Resources/heartDisabledIcon.png")}
                                                                style={styles.heartIcon}
                                                                resizeMode='contain'
                                                            />
                                                        </View>
                                                    </View>
                                                ) :
                                                (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={styles.favouriteButtonContainer}
                                                        onPress={() => this.addToUserFavorites()}
                                                    >
                                                        <View style={styles.favouriteButton}>
                                                            <Image
                                                                source={require("../Resources/heartIcon2.png")}
                                                                style={styles.heartIcon}
                                                                resizeMode='contain'
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                        )
                                ) :
                                (
                                    <View style={styles.favouriteButtonContainer}>
                                        <View style={styles.favoriteButtonDisabled}>
                                            <Image
                                                source={require("../Resources/heartIcon2.png")}
                                                style={styles.heartIcon}
                                                resizeMode='contain'
                                            />
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                        {this.state.fetchingRating ? 
                            (
                                <View style={styles.infoContainer}>
                                    <Text style={styles.loadingText}>Carregando Avaliações...</Text>
                                </View>
                            ) 
                            : 
                            (
                                <View style={styles.infoContainer}>
                                    <View style={styles.spaceBetweenContainer}>
                                        <Text style={styles.ratingText}>Avaliação: {this.state.averageRating.toFixed(1)}</Text>
                                    </View>
                                    <View style={styles.starsContainer}>
                                        <TouchableOpacity
                                            style={styles.rowContainer}
                                            activeOpacity={0.5}
                                            onPress={() => this.showRatingModal()}
                                        >
                                            {this.renderStars()}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
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
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.showSendMessageModal()}
                        >
                            <Image
                                source={require("../Resources/messageIcon.png")}
                                style={styles.footerMessageImage}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.showCommentModal()}
                        >
                            <Image
                                source={require("../Resources/balloon.png")}
                                style={styles.footerChatImage}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}

                        >
                            <Image
                                source={require("../Resources/shareIcon.png")}
                                style={styles.footerChatImage}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.showReportModal()}
                        >
                            <Image
                                source={require("../Resources/reportIcon.png")}
                                style={styles.footerChatImage}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.arrow} />
                <SendMessageModal
                    visible={this.state.sendMessageModalVisible}
                    hideModals={() => this.hideModals()}
                    isMessageFromPin={true}
                    data={this.state.serviceInfo}
                />
                <PinCommentModal
                    visible={this.state.commentModalVisible}
                    hideModals={() => this.hideModals()}
                    headerColor={this.windowColor}
                    pinID={this.state.serviceInfo.pinOwnerID}
                    isServicePin={true}
                />
                <DeleteCommentModal
                    visible={this.state.deleteCommentModalVisible}
                    hideModals={() => this.hideModals()}
                    headerColor={this.windowColor}
                    pinID={this.state.serviceInfo.key}
                    commentID={this.state.selectedCommentID}
                />
                <EditPinCommentModal
                    visible={this.state.editCommentModalVisible}
                    hideModals={() => this.hideModals()}
                    headerColor={this.windowColor}
                    pinID={this.state.serviceInfo.key}
                    commentID={this.state.selectedCommentID}
                    message={this.state.selectedCommentMessage}
                />
                <PinReportModal
                    visible={this.state.reportModalVisible}
                    hideModals={() => this.hideModals()}
                    pinData={this.state.serviceInfo}
                    pinReportsData={this.state.pinReports}
                    headerColor={this.windowColor}
                />
                <RatingModal
                    visible={this.state.ratingModalVisible}
                    hideModals={() => this.hideModals()}
                    ID={this.state.serviceInfo.pinOwnerID}
                    isGroup={false}
                />
            </View>
        );
    }
}

ServicePinCallout.propTypes = propTypes;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bubble: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
    },
    amount: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row'
    },
    header: {
        backgroundColor: StyleVars.Colors.secondary,
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
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    infoContainer: {
        paddingVertical: 5,
        paddingHorizontal: 5,
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
    footer: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    modalFooterText: {
        color: 'white',
        fontSize: 16
    },
    modalSaveButtonText: {
        color: 'white',
        fontSize: 16
    },
    arrow: {
        backgroundColor: 'transparent',
        borderWidth: 16,
        borderColor: 'transparent',
        borderTopColor: StyleVars.Colors.secondary,
        alignSelf: 'center',
        marginTop: 0
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderWidth: 16,
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        alignSelf: 'center',
        marginTop: -.5,
    },
    footerMessageImage: {
        width: windowWidth * 0.07,
        height: windowHeight * 0.03
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
    commentText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 12
    },
    listViewRowTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 10
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
    listViewRowImageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentOwnerNameText: {
        color: 'white',
        fontSize: 10,
        marginTop: 5
    },
    footerChatImage: {
        width: windowWidth * 0.07,
        height: windowHeight * 0.03
    },
    pinImage: {
        width: windowWidth * 0.8,
        height: windowHeight * 0.298,
        marginBottom: 5
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
    pinOwnerImage: {
        height: windowWidth * 0.22,
        width: windowWidth * 0.22,
        borderRadius: (windowWidth * 0.22) / 2
    },
    userInfoNameContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowText: {
        color: 'white',
        fontSize: 12
    },
    loadingText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5
    },
    infoTextContainer: {
        flexDirection: 'row'
    },
    infoDescriptionText: {
        color: 'deepskyblue',
        fontSize: 14,
        marginBottom: 4
    },
    infoText: {
        color: 'white',
        fontSize: 14,
        marginBottom: 4
    },
    ratingText: {
        color: 'yellow',
        fontSize: 14
    },
    spaceBetweenContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 3
        
    },
    starsImage: {
        height: windowHeight * 0.1,
        width: windowWidth * 0.6
    },
    starsContainer: {
       justifyContent: 'center',
       alignItems: 'center'
    },
    favouriteButtonContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    favouriteButton: {
        borderRadius: 10,
        backgroundColor: 'darkred',
        paddingHorizontal: windowWidth * 0.3,
        paddingVertical: 10
    },
    favoriteButtonDisabled: {
        borderRadius: 10,
        backgroundColor: 'rgba(139,0,0,0.2)',
        paddingHorizontal: windowWidth * 0.3,
        paddingVertical: 10
    },
    heartIcon: {
        height: windowHeight * 0.05,
        width: windowWidth * 0.1
    }


});
