'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
// import SendMessageModal from '../components/SendMessageModal'
// import AdoptionCompleteModal from '../components/AdoptionCompleteModal'
import AdoptionPetOwnerInfoModal from '../components/AdoptionPetOwnerInfoModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import Routes from '../navigation/Routes'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class PetProfileScreen extends Component{

    constructor(props){
        super(props)

        this.data = this.props.data
        this.isOwnerGroup = false

        this.messageData = {
            name: this.props.data.ownerName,
            key: this.props.data.ownerKey,
            targetAnimal: this.props.data.name
        }

        if(this.props.data.situation === "Para Adoção"){
            this.messageData.accountType = "group" 
            this.isOwnerGroup = true
        }

        this.state = {
            messageModalVisible: false,
            adoptionCompleteModalVisible: false,
            adoptionPetOwnerInfoModalVisible: false,
            addingToFavorite: false,
            isFavorite: false,
            searchingIfFavorite: true,
            favoriteKey: '',
            loadingOwnerInfo: true,
            ownerInfo: {}
        }

        console.log("Data: " + this.props.data);
    }

    capitalizeFirstLetter(string) {

        return string && string.split(' ').map(function (word) {
            return word.replace(word[0], word[0].toUpperCase())
        }).join(' ')

    }

    componentDidMount() {

        var favouritePetsToAdoptArray = []

        if (FirebaseRequest.getCurrentUserFavoritePetsToAdopt()) {

            favouritePetsToAdoptArray = FirebaseRequest.getCurrentUserFavoritePetsToAdopt()

            for (var i = 0; i < favouritePetsToAdoptArray.length; i++) {

                if (favouritePetsToAdoptArray[i].key === this.data.key) {

                    this.setState({
                        isFavorite: true,
                        favoriteKey: favouritePetsToAdoptArray[i].favoriteKey
                    })
                    break
                }
            }

            this.setState({
                searchingIfFavorite: false
            })

        } else {
            FirebaseRequest.fetchUserFavoritePetsToAdopt()
                .then((petsToAdoptArray) => {
                    favouritePetsToAdoptArray = petsToAdoptArray

                    for (var i = 0; i < favouritePetsToAdoptArray.length; i++) {

                        if (favouritePetsToAdoptArray[i].key === this.data.key) {

                            this.setState({
                                isFavorite: true,
                                favoriteKey: favouritePetsToAdoptArray[i].favoriteKey
                            })
                            break
                        }
                    }

                    this.setState({
                        searchingIfFavorite: false
                    })

                })
                .catch((err) => {
                    Alert.alert('', "Erro ao coletar informações sobre os animais favoritos.",
                        [
                            {
                                text: 'Ok', onPress: () => { }
                            }
                        ],
                        { cancelable: false }
                    )
                })
        }

        if(this.isOwnerGroup){
            this.searchGroupInfo()
        } else {
            this.searchUserInfo()
        }

    }

    goToProfile(){

        if(this.isOwnerGroup){
            this.props.navigator.push(Routes.ongProfile(this.state.ownerInfo,false,false,true))
        } else {
            this.props.navigator.push(Routes.friendProfile(this.state.ownerInfo, false, false, true))
        }

    }

    searchUserInfo() {

        
        FirebaseRequest.fetchPersonInfo(this.props.data.ownerKey)
            .then((personInfo) => {
                this.setState({
                    ownerInfo: personInfo,
                    loadingOwnerInfo: false
                })
                console.log("Loading owner info? " + this.state.loadingOwnerInfo);
            })
            .catch((err) => { alert("Erro ao coletar informações sobre o dono do animal. " + err.message) })

    }

    searchGroupInfo() {

        FirebaseRequest.fetchGroupInfo(this.props.data.ownerKey)
            .then((groupInfo) => {
                this.setState({
                    ownerInfo: groupInfo,
                    loadingOwnerInfo: false
                })
            })
            .catch((err) => { alert("Erro ao coletar informações sobre o dono do animal. ") })

    }

    addToUserFavorites() {

        this.setState({
            addingToFavorite: true
        })

        FirebaseRequest.addAdoptionPetToFavorites(this.data.key,this.data.ownerKey,this.isOwnerGroup,this.data)
            .then((key) => {

                alert("Animal adicionado aos favoritos.")

                this.setState({
                    addingToFavorite: false,
                    isFavorite: true,
                    favoriteKey: key
                })
            })
            .catch((err) => { alert("Erro ao adicionar animal aos favoritos.") })
    } 

    removeFromUserFavorites(){

        Alert.alert('', 'Gostaria de remover este animal dos favoritos?',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {
                        this.setState({
                            addingToFavorite: true
                        })

                        FirebaseRequest.removePetFromFavorites(this.state.favoriteKey)
                            .then(() => {

                                this.setState({
                                    addingToFavorite: false,
                                    isFavorite: false
                                })

                                Alert.alert('Sucesso', 'Animal removido.')
                            })
                            .catch((err) => {
                                Alert.alert('Atenção', 'Erro ao remover animal.')
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

    showMessageModal(){
        this.setState({
            messageModalVisible: true
        })
    }

    showAdoptionPetOwnerInfoModal() {
        this.setState({
            adoptionPetOwnerInfoModalVisible: true
        })
    }

    changeModals(){
        this.setState({
            messageModalVisible: false,
            adoptionCompleteModalVisible: true
        })
    }

    hideModals(){
        this.setState({
            messageModalVisible: false,
            adoptionCompleteModalVisible: false,
            adoptionPetOwnerInfoModalVisible: false
        })
    }

    render(){
        return(
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
                            source={{ uri: 'data:image/jpeg;base64,' + this.data.profilePhoto }}
                            style={styles.profileImage}
                        />
                        <View style={styles.rowContainer}>
                            <Text style={styles.nameText}>{this.data.name}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.separator}></View>
                        </View>
                        <Text style={styles.locationText}>{this.capitalizeFirstLetter(this.data.city)}, {this.data.state.length > 2 ? this.capitalizeFirstLetter(this.data.state) : this.data.state.toUpperCase() }</Text>
                        <Text style={styles.locationText}>{this.capitalizeFirstLetter(this.data.country)}</Text>
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

                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Características</Text>
                    </View>
                    <View style={styles.caracteristicsContainer}>
                        <View style={styles.caractersticsInnerContainer}>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Idade</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.ageAmount} {this.props.data.ageType === 'Mês(meses)' ? this.props.data.ageAmount !== 1 ? "Meses" : "Mês" : this.props.data.ageType}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Sexo</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.gender}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Espécie</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.specie}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.caractersticsInnerContainer}>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Raça</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.breed}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Porte</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.size}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Cor</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.color}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.caractersticsInnerContainer}>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Castrado</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.castrated ? "Sim" : "Não"}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Vermifugado</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.dewormed ? "Sim" : "Não"}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Vacinado</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.vaccinated ? "Sim" : "Não"}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Este animal pertence a</Text>
                    </View>
                    {this.state.loadingOwnerInfo ?
                        (
                            <View style={styles.displayContainer}>
                                <View style={styles.userInfoDisplay}>
                                    <View style={styles.ownerTextContainer}>
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
                                    onPress={() => this.goToProfile()}
                                >
                                    <View style={styles.userInfoContainer}>
                                        <View style={styles.ownerImageContainer}>
                                            <Image
                                                source={
                                                    this.isOwnerGroup ? 
                                                        { uri: 'data:image/jpeg;base64,' + this.state.ownerInfo.logoImage }
                                                        :
                                                        this.state.ownerInfo.profileImage ? { uri: 'data:image/jpeg;base64,' + this.state.ownerInfo.profileImage } : require("../Resources/meuPerfilIcon.png")
                                                }
                                                style={styles.ownerImage}
                                            />
                                        </View>
                                        <View style={styles.userInfoNameContainer}>
                                            <Text style={styles.ownerRowText}>{this.state.ownerInfo.name} {this.state.ownerInfo.surname ? this.state.ownerInfo.surname : ''}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )

                    }
                </ScrollView>
                <View style={styles.footer}>
                {
                    this.state.loadingOwnerInfo ?
                    (
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.adoptButtonDisabled}
                            onPress={() => {} }
                        >
                            <Text style={styles.adoptButtonText}>QUERO ADOTAR</Text>
                        </TouchableOpacity>
                    )
                    :
                    (
                        <TouchableOpacity
                            activeOpacity={ 0.5 }
                            style={styles.adoptButton}
                            onPress={() => /* this.showMessageModal() */ this.showAdoptionPetOwnerInfoModal()}
                            >
                            <Text style={styles.adoptButtonText}>QUERO ADOTAR</Text>
                        </TouchableOpacity>
                    )
                }
                  
                </View>
                {/* <SendMessageModal
                    visible={this.state.messageModalVisible}
                    hideModals={() => this.hideModals()}
                    adoptionIntent={true}
                    changeModals={() => this.changeModals()}
                    data={this.messageData}
                />
                <AdoptionCompleteModal
                    visible={this.state.adoptionCompleteModalVisible}
                    hideModals={() => this.hideModals()}
                /> */}
                <AdoptionPetOwnerInfoModal
                    visible={this.state.adoptionPetOwnerInfoModalVisible}
                    hideModals={() => this.hideModals()}
                    data={this.state.ownerInfo}
                /> 
            </View>
        )
    }




}

const styles = StyleSheet.create({

    container:{
        flex: 1,
        backgroundColor: StyleVars.Colors.primary
    },
    innerContainer: {
        alignItems: 'center',
        paddingVertical: 6
    },
    profileImage:{
        height: windowWidth * 0.4,
        width: windowWidth * 0.4,
        borderRadius: (windowWidth * 0.4) / 2,
        marginBottom: 10,
        marginTop: 5
    },
    separator:{
        flex: 1,
        height: 2,
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 10,
        backgroundColor: 'white'
    },
    nameText:{
        fontSize: 20,
        color: 'white'
    },
    locationText:{
        fontSize: 16,
        color: 'white'
    },
    rowContainer:{
        flexDirection: 'row',
        justifyContent: 'center'
    },
    headerContainer:{
        flex: 1,
        backgroundColor: StyleVars.Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    headerText:{
        color: 'white',
        fontSize: 20
    },
    temporaryHomeHeaderContainer:{
        flex: 1,
        backgroundColor: StyleVars.Colors.animalStreetPinBackground,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    temporaryHomeHeaderText:{
        color: "gold",
        fontSize: 16
    },
    petContainer:{
        flexDirection: 'row',
        backgroundColor: StyleVars.Colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.5,
        height: windowHeight * 0.2

    },
    petImage:{
        height: windowHeight * 0.15,
        width:  windowWidth * 0.15
    },
    textContainer:{
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15
    },
    imageContainer:{
        justifyContent: 'center'
    },
    rowText:{
        color: 'white',
        fontSize: 10
    },
    caracteristicsContainer:{
        backgroundColor: StyleVars.Colors.listViewBackground,
        flex: 1,
        paddingHorizontal: 5
    },
    caractersticsInnerContainer:{
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 12
    },
    caracteristicsInfoContainer:{
        flex: 1,
        alignItems: 'center'
    },
    infoText:{
        color: "white",
        fontSize: 15,
        textAlign: 'center'
    },
    infoContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5,
        width: windowWidth * 0.29,
        height: windowHeight * 0.08,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer:{
        backgroundColor: StyleVars.Colors.secondary,
        alignItems: 'center',
        paddingVertical: 10
    },
    adoptButton:{
        backgroundColor: 'darkred',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 30
    },
    adoptButtonDisabled: {
        backgroundColor: 'rgba(139,0,0,0.2)',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 30
    },
    adoptButtonText:{
        color:'red',
        fontSize: 20
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
    heartIcon: {
        height: windowHeight * 0.05,
        width: windowWidth * 0.1
    },
    displayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
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
    ownerTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    ownerImageContainer: {
        justifyContent: 'center',
        marginBottom: 7,
        marginTop: 5,
        marginRight: 15
    },
    ownerImage: {
        height: windowWidth * 0.22,
        width: windowWidth * 0.22,
        borderRadius: (windowWidth * 0.22) / 2
    },
    userInfoNameContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    ownerRowText: {
        color: 'white',
        fontSize: 12
    },
    loadingText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5
    },   
})