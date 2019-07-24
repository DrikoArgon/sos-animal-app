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
    Image,
    ScrollView,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import SendMessageModal from '../components/SendMessageModal'
import AdoptionCompleteModal from '../components/AdoptionCompleteModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class FareAnimalInfoModal extends Component {

    constructor(props) {
        super(props)

        this.isOwnerGroup = true


        this.state = {
            messageModalVisible: false,
            adoptionCompleteModalVisible: false,
            addingToFavorite: false,
            isFavorite: false,
            searchingIfFavorite: true,
            favoriteKey: '',

            messageData: {
                name: this.props.pinData.pinOwnerName,
                key: this.props.pinData.pinOwnerID,
                targetAnimal: this.props.petData.name,
                accountType: "group"
            }
        }
    }


    showMessageModal() {

        this.setState({

            messageData: {
                name: this.props.pinData.pinOwnerName,
                key: this.props.pinData.pinOwnerID,
                targetAnimal: this.props.petData.name,
                accountType: "group"
            },

            messageModalVisible: true
        })

    }

    changeModals() {
        this.setState({
            messageModalVisible: false,
            adoptionCompleteModalVisible: true
        })
    }


    hideModals() {
        this.setState({
            messageModalVisible: false,
            adoptionCompleteModalVisible: false
        })
    }

    checkFavorites(){

        var favouritePetsToAdoptArray = []

        this.setState({
            isFavorite: false,
            searchingIfFavorite: true,
            addingToFavorite: false
        })

        if (FirebaseRequest.getCurrentUserFavoritePetsToAdopt()) {

            favouritePetsToAdoptArray = FirebaseRequest.getCurrentUserFavoritePetsToAdopt()

            for (var i = 0; i < favouritePetsToAdoptArray.length; i++) {

                if (favouritePetsToAdoptArray[i].key === this.props.petData.key) {

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

                        if (favouritePetsToAdoptArray[i].key === this.props.petData.key) {

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
                .catch((err) => console.error("Error while fetching user favorite services. ", err.message))
        }
    }

    addToUserFavorites() {

        this.setState({
            addingToFavorite: true
        })

        FirebaseRequest.addAdoptionPetToFavorites(this.props.petData.key, this.props.pinData.pinOwnerID, true, this.props.petData)
            .then((key) => {

                Alert.alert('', 'Animal adicionado aos favoritos.',
                    [
                        {
                            text: 'Ok', onPress: () => { }
                        }
                    ],
                    { cancelable: false }
                )

                this.setState({
                    addingToFavorite: false,
                    isFavorite: true,
                    favoriteKey: key
                })
            })
            .catch((err) => { console.error("Error while adding animal to favorites. ", err.message) })
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
                                    addingFriend: false
                                })
                            })
                    }
                }
            ],
            { cancelable: false }
        )


    }


    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onShow={() => {this.checkFavorites()}}
                onRequestClose={() => { }}
            >
                    <View style={styles.modalContainer}>
                            <View style={styles.innerModalContainer}>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHeaderTextContainer}>
                                        <Text style={styles.modalHeaderText}>{this.props.petData.name}</Text>
                                    </View>
                                </View>
                                <ScrollView
                                    ref="scrollView"
                                    keyboardShouldPersistTaps="never"
                                    automaticallyAdjustContentInsects={true}
                                    alwaysBounceVertical={true}
                                    style={styles.scrollView}
                                >
                                    <View style={styles.innerContainer}>
                                        <Image
                                            source={{ uri: 'data:image/jpeg;base64,' + this.props.petData.profilePhoto }}
                                            style={styles.profileImage}
                                        />
                                        <View style={styles.rowContainer}>
                                            <Text style={styles.nameText}>{this.props.petData.name}</Text>
                                        </View>
                                        <View style={styles.rowContainer}>
                                            <View style={styles.separator}></View>
                                        </View>
                                        <Text style={styles.locationText}>{this.props.petData.city}, {this.props.petData.state}</Text>
                                        <Text style={styles.locationText}>{this.props.petData.country}</Text>
                                    </View>
                                    <View style={styles.caracteristicsContainer}>
                                        <View style={styles.caractersticsInnerContainer}>
                                            <View style={styles.caracteristicsInfoContainer}>
                                                <Text style={styles.infoText}>Idade</Text>
                                                <View style={styles.infoContainer}>
                                                    <Text style={styles.infoText}>{this.props.petData.ageAmount} {this.props.petData.ageType === 'Mês(meses)' ? this.props.petData.ageAmount !== 1 ? "Meses" : "Mês" : this.props.petData.ageType}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.caracteristicsInfoContainer}>
                                                <Text style={styles.infoText}>Sexo</Text>
                                                <View style={styles.infoContainer}>
                                                    <Text style={styles.infoText}>{this.props.petData.gender}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.caractersticsInnerContainer}>
                                            <View style={styles.caracteristicsInfoContainer}>
                                                <Text style={styles.infoText}>Espécie</Text>
                                                <View style={styles.infoContainer}>
                                                    <Text style={styles.infoText}>{this.props.petData.specie}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.caracteristicsInfoContainer}>
                                                <Text style={styles.infoText}>Raça</Text>
                                                <View style={styles.infoContainer}>
                                                    <Text style={styles.infoText}>{this.props.petData.breed}</Text>
                                                </View>
                                            </View>
                                        </View>
                                         <View style={styles.caractersticsInnerContainer}>
                                            <View style={styles.caracteristicsInfoContainer}>
                                                <Text style={styles.infoText}>Porte</Text>
                                                <View style={styles.infoContainer}>
                                                    <Text style={styles.infoText}>{this.props.petData.size}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.caracteristicsInfoContainer}>
                                                <Text style={styles.infoText}>Cor</Text>
                                                <View style={styles.infoContainer}>
                                                    <Text style={styles.infoText}>{this.props.petData.color}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.caractersticsInnerContainer}>
                                            <View style={styles.caracteristicsInfoContainer}>
                                                <Text style={styles.infoText}>Castrado</Text>
                                                <View style={styles.smallInfoContainer}>
                                                    <Text style={styles.infoText}>{this.props.petData.castrated ? "Sim" : "Não"}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.caracteristicsInfoContainer}>
                                                <Text style={styles.infoText}>Vermifugado</Text>
                                                <View style={styles.smallInfoContainer}>
                                                    <Text style={styles.infoText}>{this.props.petData.dewormed ? "Sim" : "Não"}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.caracteristicsInfoContainer}>
                                                <Text style={styles.infoText}>Vacinado</Text>
                                                <View style={styles.smallInfoContainer}>
                                                    <Text style={styles.infoText}>{this.props.petData.vaccinated ? "Sim" : "Não"}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.caractersticsInnerContainer}>

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
                                    <View style={styles.buttomContainer}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={styles.sendButtom}
                                            onPress={() => {this.showMessageModal()}}
                                        >
                                            <Text style={styles.modalFooterText}>Quero Adotar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
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
                    <SendMessageModal
                        visible={this.state.messageModalVisible}
                        hideModals={() => this.hideModals()}
                        adoptionIntent={true}
                        changeModals={() => this.changeModals()}
                        data={this.state.messageData}
                    />
                    <AdoptionCompleteModal
                        visible={this.state.adoptionCompleteModalVisible}
                        hideModals={() => this.hideModals()}
                    />
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
        alignItems: 'center',
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalTextContainerLight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    modalTextContainerDark: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10
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
        backgroundColor: 'rgb(29,105,175)',
        borderRadius: 5,
        paddingVertical: 8,
        width: windowWidth * 0.7,
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
    innerContainer: {
        alignItems: 'center',
        paddingVertical: 6
    },
    profileImage: {
        height: windowWidth * 0.4,
        width: windowWidth * 0.4,
        borderRadius: (windowWidth * 0.4) / 2,
        marginBottom: 10,
        marginTop: 5
    },
    separator: {
        flex: 1,
        height: 2,
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 10,
        backgroundColor: 'white'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    nameText: {
        fontSize: 20,
        color: 'white'
    },
    locationText: {
        fontSize: 16,
        color: 'white'
    },
    caracteristicsContainer: {
        backgroundColor: StyleVars.Colors.listViewBackground,
        flex: 1,
        paddingHorizontal: 5,
        marginTop: 5
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
    infoText: {
        color: "white",
        fontSize: 15,
        textAlign: 'center'
    },
    infoContainer: {
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
    smallInfoContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5,
        width: windowWidth * 0.24,
        height: windowHeight * 0.08,
        justifyContent: 'center',
        alignItems: 'center'
    },
    favouriteButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5
    },
    favouriteButton: {
        borderRadius: 10,
        backgroundColor: 'darkred',
        paddingHorizontal: windowWidth * 0.3,
        paddingVertical: 8
    },
    favoriteButtonDisabled: {
        borderRadius: 10,
        backgroundColor: 'rgba(139,0,0,0.2)',
        paddingHorizontal: windowWidth * 0.3,
        paddingVertical: 8
    },
    heartIcon: {
        height: windowHeight * 0.04,
        width: windowWidth * 0.1
    },

})
