'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    Dimensions,
    ScrollView,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import SendMessageModal from '../components/SendMessageModal'
import AdoptionCompleteModal from '../components/AdoptionCompleteModal'
import AdoptionPetOwnerInfoModal from '../components/AdoptionPetOwnerInfoModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const dismissKeyboard = require("dismissKeyboard")


export default class PinOwnerPetInfoModal extends Component{

    constructor(props){
        super(props)

        this.data = this.props.data
        this.isOwnerGroup = false

        this.state = {
            messageModalVisible: false,
            adoptionCompleteModalVisible: false,
            adoptionPetOwnerInfoModalVisible: false,
            isFavorite: false,
            searchingIfFavorite: true,
            favoriteKey: '',
            addingToFavorite: false,
            adoptionIntentMessageData: {
                name: this.props.messageData.name,
                key: this.props.messageData.key,
                targetAnimal: this.props.data.name
            }
        }

    }

    showMessageModal(){

        this.setState({
             messageModalVisible: true
        })
    }

    showAdoptionPetOwnerInfoModal(){
        this.setState({
            adoptionPetOwnerInfoModalVisible: true
        })
    }

    hideModals(){
        this.setState({
             messageModalVisible: false,
             adoptionCompleteModalVisible: false,
             adoptionPetOwnerInfoModalVisible: false
        })
    }

    changeModals() {
        this.setState({
            messageModalVisible: false,
            adoptionCompleteModalVisible: true
        })
    }


    capitalizeFirstLetter(string) {

        return string && string.split(' ').map(function (word) {
            return word.replace(word[0], word[0].toUpperCase())
        }).join(' ')

    }

    onModalOpen(){

         this.setState({

              adoptionIntentMessageData: {
                name: this.props.messageData.name,
                key: this.props.messageData.key,
                targetAnimal: this.props.data.name
            }
        })

        console.log(this.props.data);
        console.log(this.props.selectedPetKey);
        var favouritePetsToAdoptArray = []

        if (FirebaseRequest.getCurrentUserFavoritePetsToAdopt()) {

            favouritePetsToAdoptArray = FirebaseRequest.getCurrentUserFavoritePetsToAdopt()

            for (var i = 0; i < favouritePetsToAdoptArray.length; i++) {

                if (favouritePetsToAdoptArray[i].key === this.props.selectedPetKey) {
                    console.log("É favorito!");
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

                        if (favouritePetsToAdoptArray[i].key === this.props.selectedPetKey) {

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
                    console.log("acho os favorito tudo");

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
    }

    addToUserFavorites() {

        this.setState({
            addingToFavorite: true
        })

        FirebaseRequest.addAdoptionPetToFavorites(this.props.selectedPetKey, this.props.ownerInfo.key, this.isOwnerGroup, this.props.data)
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

    removeFromUserFavorites() {

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
                                    addingToFavorite: false
                                })
                            })
                    }
                }
            ],
            { cancelable: false }
        )


    }

    renderFavouriteIcon() {


        return (          
            this.props.isTemporaryHomePet ?
                (
                    !this.state.searchingIfFavorite ?
                        (
                            this.state.isFavorite ?
                                (
                                    <TouchableOpacity
                                        style={styles.favouriteIconContainerDisabled}
                                        activeOpacity={0.5}
                                        onPress={() => { this.removeFromUserFavorites()}}
                                    >
                                        <Image
                                            source={require("../Resources/brokenHeartIcon.png")}
                                            style={styles.favouriteIcon}
                                            resizeMode='contain'
                                        />
                                    </TouchableOpacity>
                                ) :
                                (
                                    this.state.addingToFavorite ?
                                        (
                                            <TouchableOpacity
                                                style={styles.favouriteIconContainerDisabled}
                                                activeOpacity={0.5}
                                                onPress={() => { }}
                                            >
                                                <Image
                                                    source={require("../Resources/heartDisabledIcon.png")}
                                                    style={styles.favouriteIcon}
                                                    resizeMode='contain'
                                                />
                                            </TouchableOpacity>
                                        ) :
                                        (
                                            <TouchableOpacity
                                                style={styles.favouriteIconContainer}
                                                activeOpacity={0.5}
                                                onPress={() => {this.addToUserFavorites() }}
                                            >
                                                <Image
                                                    source={require("../Resources/heartIcon2.png")}
                                                    style={styles.favouriteIcon}
                                                    resizeMode='contain'
                                                />
                                            </TouchableOpacity>
                                        )
                                )
                        ) :
                        (
                            <View style={styles.favouriteIconContainerDisabled}>
                                <Image
                                    source={require("../Resources/heartIcon2.png")}
                                    style={styles.favouriteIcon}
                                    resizeMode='contain'
                                />
                            </View>                        
                        )
                )
                :
                (
                    <View></View>
                )
        )
    }

    render(){

        var petState = '';
        if (this.props.data.state) {
            if (this.props.data.state.length > 2) {
                petState = this.capitalizeFirstLetter(this.props.data.state)
            } else {
                petState = this.props.data.state.toUpperCase()
            }
        }

        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onShow={() => {this.onModalOpen()}}
                onRequestClose={() => { }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.innerModalContainer}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderTextContainer}>
                                <Text style={styles.modalHeaderText}>{this.props.data.name}</Text>
                            </View>
                        </View>
                        <ScrollView
                        ref="scrollView"
                        keyboardShouldPersistTaps='never'
                        automaticallyAdjustContentInsects={true}
                        alwaysBounceVertical={true}
                        style={styles.scrollView}
                        >
                            <View style={styles.innerContainer}>
                                <Image 
                                    source={{uri: 'data:image/jpeg;base64,' + this.props.data.profilePhoto}}
                                    style={styles.profileImage}
                                />
                                <Text style={styles.nameText}>{this.props.data.name}</Text>
                                <View style={styles.rowContainer}>
                                    <View style={styles.separator}></View>
                                </View>
                                <Text style={styles.locationText}>{this.capitalizeFirstLetter(this.props.data.city)}, {petState}</Text>
                                <Text style={styles.locationText}>{this.capitalizeFirstLetter(this.props.data.country)}</Text>
                            </View>
                            {this.renderFavouriteIcon()}
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
                        </ScrollView>
                        {this.props.isTemporaryHomePet ? 
                            (
                                <View style={styles.footer}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={styles.adoptButton}
                                        onPress={() => this.showAdoptionPetOwnerInfoModal()}
                                    >
                                        <Text style={styles.adoptButtonText}>QUERO ADOTAR</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                            :
                            (
                                <View/>
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
                </View>
                {/* <SendMessageModal
                    visible={this.state.messageModalVisible}
                    hideModals={() => this.hideModals()}
                    adoptionIntent={true}
                    changeModals={() => this.changeModals()}
                    data={this.props.messageData}
                />
                <AdoptionCompleteModal
                    visible={this.state.adoptionCompleteModalVisible}
                    hideModals={() => this.hideModals()}
                /> */}
                <AdoptionPetOwnerInfoModal
                    visible={this.state.adoptionPetOwnerInfoModalVisible}
                    hideModals={() => this.hideModals()}
                    data={this.props.ownerInfo}
                /> 
            </Modal>
        )
    }




}

const styles = StyleSheet.create({

    container:{
        flex: 1,
        backgroundColor: StyleVars.Colors.primary
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
     modalHeader: {
        backgroundColor: StyleVars.Colors.milkEmptyPinBackground,
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
        fontSize: 18
    },
    innerModalContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        marginBottom: 30,
        height: windowHeight * 0.8,
        width: windowWidth * 0.9
    },
    modalFooter: {
        backgroundColor: StyleVars.Colors.milkEmptyPinBackground,
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
    innerContainer: {
        alignItems: 'center',
        paddingVertical: 6
    },
    profileImage:{
        height: windowWidth * 0.4,
        width: windowWidth * 0.4,
        borderRadius: (windowWidth * 0.4)/2,
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
        paddingHorizontal: 20
    },
    headerContainer:{
        flex: 1,
        backgroundColor: StyleVars.Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        marginTop: 5
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
        fontSize: 13,
        textAlign: 'center'
    },
    infoContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5,
        width: windowWidth * 0.26,
        height: windowHeight * 0.08,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer:{
        backgroundColor: StyleVars.Colors.secondary,
        alignItems: 'center',
        paddingVertical: 10
    },
    favouriteButtonContainer:{
        backgroundColor: StyleVars.Colors.primary,
        alignItems: 'center',
        paddingVertical: 10
    },
    adoptButton:{
        backgroundColor: 'darkred',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 30
    },
    adoptButtonText:{
        color:'red',
        fontSize: 20
    },
    favouriteIcon: {
        width: windowWidth * 0.06,
        height: windowHeight * 0.06
    },
    favouriteIconContainer: {
        position: 'absolute',
        backgroundColor: 'darkred',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingVertical: 3,
        width: windowWidth * 0.1,
        height: windowWidth * 0.1,
        left: windowWidth * 0.75,
        top: windowHeight * 0.2

    },
        favouriteIconContainerDisabled: {
        position: 'absolute',
        backgroundColor: 'rgba(139,0,0,0.2)',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingVertical: 3,
        width: windowWidth * 0.1,
        height: windowWidth * 0.1,
        left: windowWidth * 0.75,
        top: windowHeight * 0.2

    }

})