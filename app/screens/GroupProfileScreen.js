'use strict'

import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ListView,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import CommentModal from '../components/CommentModal'
import RatingModal from '../components/RatingModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import Routes from '../navigation/Routes'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var comments = []
var members = []
var animals = []


export default class GroupProfileScreen extends Component {


    constructor(props) {
        super(props)

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.state = {

            dataSource: ds.cloneWithRows(comments),
            animalsDataSource: ds.cloneWithRows(animals),
            membersDataSource: ds.cloneWithRows(members),

            commentModalVisible: false,
            ratingModalVisible: false,
            addingToFavorite: false,
            isFavorite: false,
            searchingIfFavorite: true,
            loadingAnimals: true,
            loadingMembers: true,
            favoriteKey: ''
        }

        this.data = this.props.data
        comments = []
        members = []
        animals = []

    }

    componentDidMount() {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        comments = []
        members = []
        animals = []

        FirebaseRequest.fetchGroupComments(this.data.key, this.fillCommentArray)
        FirebaseRequest.listenToGroupRatingChanges(this.data.key, this.updateRating)

        var favouriteServicesAndGroupsArray = []

        if (FirebaseRequest.getCurrentUserFavoriteServicesAndGroups()) {

            favouriteServicesAndGroupsArray = FirebaseRequest.getCurrentUserFavoriteServicesAndGroups()

            for (var i = 0; i < favouriteServicesAndGroupsArray.length; i++) {

                if (favouriteServicesAndGroupsArray[i].key === this.data.key) {

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

                        if (favouriteServicesAndGroupsArray[i].key === this.data.key) {

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

        FirebaseRequest.fetchGroupAnimalsWithKey(this.data.key,false)
        .then((animalsArray) => {
            animals = animalsArray

            this.setState({
                animalsDataSource: ds.cloneWithRows(animals),
                loadingAnimals: false 
            })

        })
        .catch((err) => {
            this.setState({
                loadingAnimals: false
            })
            Alert.alert('', 'Ocorreu um erro ao procurar os animais deste grupo.',
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        })

        FirebaseRequest.fetchGroupMembersWithKey(this.data.key)
        .then((membersArray) => {

            members = membersArray

            this.setState({
                membersDataSource: ds.cloneWithRows(members),
                loadingMembers: false
            })
        })
        .catch((err) => {
            Alert.alert('', 'Ocorreu um erro ao procurar os membros deste grupo.',
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        })


    }

    componentWillUnmount() {

        FirebaseRequest.removeCommentsListener(this.data.key)
        FirebaseRequest.removeGroupRatingListener(this.data.key)

        comments = []
        members = []
        animals = []
    }

    updateRating = (newRating) => {
        this.data.rating.averageRating = newRating
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
            .catch((err) => { console.error("Error while trying to fetch comment author info: ", err.message) })
    }



    showCommentModal() {
        this.setState({
            commentModalVisible: true
        })
    }

    showRatingModal() {
        this.setState({
            ratingModalVisible: true
        })
    }


    hideModals() {
        this.setState({
            ratingModalVisible: false,
            commentModalVisible: false
        })
    }

    addToUserFavorites() {

        this.setState({
            addingToFavorite: true
        })

        FirebaseRequest.addServiceOrGroupToFavorites(this.data.key,true)
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

        Alert.alert('', 'Gostaria de remover este grupo dos favoritos?',
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

                                Alert.alert('Sucesso', 'Grupo removido.')
                            })
                            .catch((err) => {
                                Alert.alert('Atenção', 'Erro ao remover grupo.')
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

    toFriendProfile(friendData) {

        this.props.toRoute(Routes.friendProfile(friendData, false, false, true))
    }


    toPetProfile(petData) {

        petData = Object.assign(petData, {})
        this.props.toRoute(Routes.petToAdoptProfile(petData))
    }


    _renderRow(rowData) {

        return (
            <View style={styles.listViewRowContainer}>
                <View style={styles.listViewRowInfoContainer}>
                    <View style={styles.listViewRowImageContainer}>
                        <Image
                            source={{ uri: "data:image/jpeg;base64," + rowData.ownerProfileImage }}
                            style={styles.commentOwnerImage}
                        />

                    </View>
                    <View style={styles.listViewRowTextContainer}>
                        <Text style={styles.commentText}>{rowData.message}</Text>
                        <Text style={styles.commentOwnerNameText}>{rowData.ownerName}</Text>
                    </View>

                </View>
            </View>
        )
    }

    _renderMemberRow(rowData) {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.friendContainer}
                onPress={() => this.toFriendProfile(rowData)}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={rowData.profileImage ? { uri: 'data:image/jpeg;base64,' + rowData.profileImage } : require("../Resources/meuPerfilIcon.png")}
                        style={styles.friendImage}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.rowText}>{rowData.name} {rowData.surname}</Text>
                </View>
            </TouchableOpacity>

        )
    }

    _renderAnimalRow(rowData) {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.friendContainer}
                onPress={() => this.toPetProfile(rowData)}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'data:image/jpeg;base64,' + rowData.profilePhoto }}
                        style={styles.friendImage}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.rowText}>{rowData.name}</Text>
                </View>
            </TouchableOpacity>

        )
    }
    renderStars() {

        if (0 <= this.data.rating.averageRating && this.data.rating.averageRating < 0.5) {
            return (
                <Image
                    source={require("../Resources/Stars/none.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (5 <= this.data.rating.averageRating && this.data.rating.averageRating < 1.0) {
            return (
                <Image
                    source={require("../Resources/Stars/half.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (1.0 <= this.data.rating.averageRating && this.data.rating.averageRating < 1.5) {
            return (
                <Image
                    source={require("../Resources/Stars/one.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (1.5 <= this.data.rating.averageRating && this.data.rating.averageRating < 2.0) {
            return (
                <Image
                    source={require("../Resources/Stars/oneAndAHalf.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (2.0 <= this.data.rating.averageRating && this.data.rating.averageRating < 2.5) {
            return (
                <Image
                    source={require("../Resources/Stars/two.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (2.5 <= this.data.rating.averageRating && this.data.rating.averageRating < 3.0) {
            return (
                <Image
                    source={require("../Resources/Stars/twoAndAHalf.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (3.0 <= this.data.rating.averageRating && this.data.rating.averageRating < 3.5) {
            return (
                <Image
                    source={require("../Resources/Stars/three.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (3.5 <= this.data.rating.averageRating && this.data.rating.averageRating < 4.0) {
            return (
                <Image
                    source={require("../Resources/Stars/threeAndAHalf.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (4.0 <= this.data.rating.averageRating && this.data.rating.averageRating < 4.5) {
            return (
                <Image
                    source={require("../Resources/Stars/four.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if (4.5 <= this.data.rating.averageRating && this.data.rating.averageRating < 5.0) {
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

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    ref="scrollView"
                    keyboardShouldPersistTaps="never"
                    automaticallyAdjustContentInsects={true}
                    alwaysBounceVertical={true}
                    style={styles.scrollView}
                >
                    <View style={styles.innerContainer}>
                        <Image
                            source={{ uri: "data:image/jpeg;base64," + this.data.backgroundImage }}
                            style={styles.profileImage}

                        />
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoDescriptionText}>Endereço: </Text>
                            <Text style={styles.infoText}>{this.data.adress}</Text>
                        </View>
                        <Text style={styles.infoText}>{this.data.district}, {this.data.city}, {this.data.state}, {this.data.country}</Text>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoDescriptionText}>Telefone: </Text>
                            <Text style={styles.infoText}>{this.data.phone}</Text>
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoDescriptionText}>Site: </Text>
                            <Text style={styles.infoText}>{this.data.website}</Text>
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoDescriptionText}>E-mail: </Text>
                            <Text style={styles.infoText}>{this.data.email}</Text>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>

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
                    <View style={styles.memberHeaderContainer}>
                        <Text style={styles.memberHeaderText}>Membros</Text>
                    </View>
                    <View style={styles.memberListContainer}>
                        {this.state.loadingMembers ? 
                            (
                                <View style={styles.loadingView}>
                                    <Text style={styles.loadingText}>Carregando...</Text>
                                </View>
                            ) 
                            : 
                            (
                                <ScrollView
                                    ref="scrollView"
                                    keyboardShouldPersistTaps="never"
                                    automaticallyAdjustContentInsects={true}
                                    alwaysBounceVertical={true}
                                    style={styles.scrollView}
                                >
                                    <ListView
                                        dataSource={ this.state.membersDataSource }
                                        renderRow={(rowData) => this._renderMemberRow(rowData)}
                                        contentContainerStyle={styles.listView}
                                        removeClippedSubviews={false}
                                    >
                                    </ListView>
                                </ScrollView>
                            )
                        }
                    </View>
                    <View style={styles.animalHeaderContainer}>
                        <Text style={styles.animalHeaderText}>Nossos Animais</Text>
                    </View>
                    <View style={styles.animalListContainer}>
                        {this.state.loadingAnimals ?
                            (
                                <View style={styles.loadingView}>
                                    <Text style={styles.loadingText}>Carregando...</Text>
                                </View>
                            )
                            :
                            (
                                <ScrollView
                                    ref="scrollView"
                                    keyboardShouldPersistTaps="never"
                                    automaticallyAdjustContentInsects={true}
                                    alwaysBounceVertical={true}
                                    style={styles.scrollView}
                                >
                                <ListView
                                    dataSource={this.state.animalsDataSource}
                                    renderRow={(rowData) => this._renderAnimalRow(rowData)}
                                    contentContainerStyle={styles.listView}
                                    removeClippedSubviews={false}
                                >
                                </ListView>
                                </ScrollView>
                            )
                        }
                    </View>
                    <View style={[styles.separatorContainer,{marginBottom: 5}]}>
                        <View style={styles.separator}></View>
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.spaceBetweenContainer}>
                            <Text style={styles.ratingText}>Avaliação: {this.data.rating.averageRating.toFixed(1)}</Text>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.showCommentModal()}
                            >
                                <Text style={styles.commentButtonText}>Comentar</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.rowContainer}
                            activeOpacity={0.5}
                            onPress={() => this.showRatingModal()}
                        >
                            {this.renderStars()}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separatorContainer}>
                        <View style={styles.separator}></View>
                    </View>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) => this._renderRow(rowData)}
                    >
                    </ListView>
                </ScrollView>
                <CommentModal
                    visible={this.state.commentModalVisible}
                    hideModals={() => this.hideModals()}
                    ID={this.data.key}
                    isGroup={true}
                />
                <RatingModal
                    visible={this.state.ratingModalVisible}
                    hideModals={() => this.hideModals()}
                    ID={this.data.key}
                    isGroup={true}
                />
            </View>
        )
    }




}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.primary
    },
    innerContainer: {
        alignItems: 'center'
    },
    infoContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: StyleVars.Colors.secondary
    },
    memberHeaderContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'rgb(103,46,1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    memberHeaderText:{
        color: 'orange',
        fontSize: 20
    },
    memberListContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: StyleVars.Colors.secondary,
        height: windowHeight * 0.4
    },
    animalHeaderContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'navy',
        justifyContent: 'center',
        alignItems: 'center'
    },
    animalHeaderText: {
        color: 'dodgerblue',
        fontSize: 20
    },
    animalListContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: StyleVars.Colors.secondary,
        height: windowHeight * 0.4
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 4
    },
    profileImage: {
        height: windowHeight * 0.4,
        width: windowWidth
    },
    moneyIcon: {
        height: windowHeight * 0.048,
        width: windowWidth * 0.1
    },
    heartIcon: {
        height: windowHeight * 0.05,
        width: windowWidth * 0.1
    },
    starsImage: {
        height: windowHeight * 0.1,
        width: windowWidth * 0.6
    },
    // separator: {
    //     flex: 1,
    //     height: 2,
    //     marginTop: 5,
    //     marginBottom: 5,
    //     marginHorizontal: 10,
    //     backgroundColor: 'white'
    // },
    nameText: {
        fontSize: 20,
        color: 'white'
    },
    locationText: {
        fontSize: 16,
        color: 'white'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    spaceBetweenContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    infoTextContainer: {
        flexDirection: 'row'
    },
    caracteristicsContainer: {
        backgroundColor: StyleVars.Colors.listViewBackground,
        flex: 1
    },
    caractersticsInnerContainer: {
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 12
    },
    caracteristicsInfoContainer: {
        flex: 1,
        alignItems: 'center'
    },
    saleButtonContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    saleButton: {
        borderRadius: 10,
        backgroundColor: 'darkgreen',
        paddingHorizontal: windowWidth * 0.17,
        paddingVertical: 20
    },
    favouriteButtonContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    favouriteButton: {
        borderRadius: 10,
        backgroundColor: 'darkred',
        paddingHorizontal: windowWidth * 0.4,
        paddingVertical: 20
    },
    favoriteButtonDisabled: {
        borderRadius: 10,
        backgroundColor: 'rgba(139,0,0,0.2)',
        paddingHorizontal: windowWidth * 0.4,
        paddingVertical: 20
    },
    ratingText: {
        color: 'yellow',
        fontSize: 14
    },
    commentButtonText: {
        color: 'deepskyblue',
        fontSize: 14
    },
    infoDescriptionText: {
        color: 'deepskyblue',
        fontSize: 16,
        marginBottom: 4
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
        marginTop: 7,
        marginBottom: 2,
        width: windowWidth * 0.95,
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
    loadingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20
    },
    listView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10

    },
    rowText: {
        color: 'white',
        fontSize: 12
    },
    friendContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.42,
        height: windowHeight * 0.2,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center'

    },
    friendImage: {
        height: windowWidth * 0.22,
        width: windowWidth * 0.22,
        borderRadius: (windowWidth * 0.22) / 2
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageContainer: {
        justifyContent: 'center',
        marginBottom: 7,
        marginTop: 5
    }

})