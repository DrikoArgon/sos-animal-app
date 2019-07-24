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
    Alert,
    ListView
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import SendMessageModal from '../components/SendMessageModal'
import PinOwnerPetInfoModal from '../components/PinOwnerPetInfoModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var pets = []
var temporaryHomePets = []
var temporaryHomePetIndex = 0;

export default class PinOwnerInfoModal extends Component {

    constructor(props) {
        super(props)

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })


        this.state = {
            messageModalVisible: false,
            petInfoModalVisible: false,

            messageData: {
                name: this.props.pinData.pinOwnerName,
                key: this.props.pinData.pinOwnerID
            },

            petsDataSource: ds.cloneWithRows(pets),
            temporaryHomeDataSource: ds.cloneWithRows(temporaryHomePets),
            levelTextBackgroundColor: 'darkgreen',
            levelNameBackgroundColor: 'forestgreen',
            totalPointsBackgroundColor: 'mediumseagreen',
            levelName: '',
            temporaryHomePetsKeys: null,
            temporaryHomePetSelected: false,
            selectedPet: {
                name: ''
            },
            selectedPetKey: ''
            
        }

        this.petsDarkRow = true
        this.temporaryPetsDarkRow = true
        temporaryHomePetIndex = 0;
    }


    capitalizeFirstLetter(string) {

        return string && string.split(' ').map(function (word) {
            return word.replace(word[0], word[0].toUpperCase())
        }).join(' ')
        

    }

    onModalOpen(){

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.petsDarkRow = true
        this.temporaryPetsDarkRow = true
        temporaryHomePetIndex = 0;

        if (this.props.pinOwnerData.userPets) {
            pets = this.props.pinOwnerData.userPets

        } else {
            pets = []
        }

        if (this.props.pinOwnerData.userTemporaryHomePets) {
            temporaryHomePets = this.props.pinOwnerData.userTemporaryHomePets
            this.setState({
                temporaryHomePetsKeys: Object.keys(temporaryHomePets)
            }) 
        } else {
            temporaryHomePets = []
        }

        this.setState({
            petsDataSource: ds.cloneWithRows(pets),
            temporaryHomeDataSource: ds.cloneWithRows(temporaryHomePets),
            messageData: {
                name: this.props.pinData.pinOwnerName,
                key: this.props.pinData.pinOwnerID
            }
        })

        this.defineLevel()

    }

    defineLevel() {

        switch (this.props.pinOwnerData.protectionLevel) {

            case 1:
                this.setState({
                    levelName: 'Formiga',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor1,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor1,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor1
                })
                break
            case 2:
                this.setState({
                    levelName: 'Abelha',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor2,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor2,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor2
                })
                break
            case 3:
                this.setState({
                    levelName: 'Borboleta',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor3,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor3,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor3
                })
                break
            case 4:
                this.setState({
                    levelName: 'Tatu',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor4,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor4,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor4
                })
                break
            case 5:
                this.setState({
                    levelName: 'Coelho',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor5,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor5,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor5
                })
                break
            case 6:
                this.setState({
                    levelName: 'Gato',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor6,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor6,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor6
                })
                break
            case 7:
                this.setState({
                    levelName: 'Cachorro',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor7,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor7,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor7
                })
                break
            case 8:
                this.setState({
                    levelName: 'Águia',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor8,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor8,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor8
                })
                break
            case 9:
                this.setState({
                    levelName: 'Javali',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor9,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor9,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor9
                })
                break
            case 10:
                this.setState({
                    levelName: 'Lhama',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor10,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor10,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor10
                })
                break
            case 11:
                this.setState({
                    levelName: 'Cavalo',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor11,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor11,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor11
                })
                break
            case 12:
                this.setState({
                    levelName: 'Búfalo',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor12,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor12,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor12
                })
                break
            case 13:
                this.setState({
                    levelName: 'Hiena',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor13,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor13,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor13
                })
                break
            case 14:
                this.setState({
                    levelName: 'Pantera',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor14,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor14,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor14
                })
                break


        }


    }

    _renderRowPets(rowData) {

        let rowBackgroundColor = this.petsDarkRow ? { backgroundColor: StyleVars.Colors.listViewBackground }
            : { backgroundColor: StyleVars.Colors.primary }

        this.petsDarkRow = !this.petsDarkRow

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.petContainer, rowBackgroundColor]}
                onPress={() => this.showPetInfoModal(rowData)}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'data:image/jpeg;base64,' + rowData.profilePhoto }}
                        style={styles.petImage}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.rowText}>Nome: {rowData.name}</Text>
                    <Text style={styles.rowText}>Idade: {rowData.ageAmount} {rowData.ageType}</Text>
                </View>
            </TouchableOpacity>

        )
    }

    _renderRowTemporaryPets(rowData) {

        let rowBackgroundColor = this.temporaryPetsDarkRow ? { backgroundColor: StyleVars.Colors.primary }
            : { backgroundColor: StyleVars.Colors.listViewBackground }

        this.temporaryPetsDarkRow = !this.temporaryPetsDarkRow

        var petKey = this.state.temporaryHomePetsKeys[temporaryHomePetIndex];

        temporaryHomePetIndex++;

        if (temporaryHomePetIndex >= this.state.temporaryHomePetsKeys.length){
            temporaryHomePetIndex = 0;
        }

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.petContainer, rowBackgroundColor]}
                onPress={() => this.showTemporaryHomePetInfoModal(rowData, petKey)}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'data:image/jpeg;base64,' + rowData.profilePhoto }}
                        style={styles.petImage}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.rowText}>Nome: {rowData.name}</Text>
                    <Text style={styles.rowText}>Idade: {rowData.ageAmount} {rowData.ageType}</Text>
                </View>
            </TouchableOpacity>

        )
    }

    renderReportIcon() {

        var isMyProfile = false

        if (FirebaseRequest.getCurrentUserID() === this.props.pinOwnerData.key) {
            isMyProfile = true
        }

        return (
            isMyProfile ?
                (
                    <View></View>
                )
                :
                (
                    <TouchableOpacity
                        style={styles.reportIconContainer}
                        activeOpacity={0.5}
                        onPress={() => this.addProfileReport()}
                    >
                        <Image
                            source={require("../Resources/redReportIcon.png")}
                            style={styles.reportIcon}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                )
        )
    }


    addProfileReport() {

        Alert.alert('', 'Tem certeza que quer denunciar este perfil?',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {
                        Alert.alert('', 'Selecione o tipo de denúncia',
                            [

                                {
                                    text: 'Cancelar', onPress: () => { }
                                },
                                {
                                    text: 'Falso', onPress: () => {
                                        FirebaseRequest.addProfileReportToUser(this.props.pinOwnerData.key, 1, this.completedAddingReport, this.failedAddingReport)
                                    }
                                },
                                {
                                    text: 'Conteúdo impróprio', onPress: () => {
                                        FirebaseRequest.addProfileReportToUser(this.props.pinOwnerData.key, 2, this.completedAddingReport, this.failedAddingReport)
                                    }
                                }
                            ],
                            { cancelable: false }
                        )
                    }
                }
            ],
            { cancelable: false }
        )
    }

    completedAddingReport = () => {
        Alert.alert('', 'Denúncia realizada com sucesso.',
            [
                {
                    text: 'Ok', onPress: () => { }
                }
            ],
            { cancelable: false }
        )
    }

    failedAddingReport = () => {
        
        Alert.alert('Erro ao realizar denúncia.', 'Verifique sua conexão ou se já denunciou este perfil.',
            [

                {
                    text: 'Ok', onPress: () => {}
                }
            ],
            { cancelable: false }
        )
    }

    showMessageModal() {

        this.setState({

            messageData: {
                name: this.props.pinData.pinOwnerName,
                key: this.props.pinData.pinOwnerID
            },

            messageModalVisible: true
        })

    }

    showPetInfoModal(rowData){
        this.setState({
            temporaryHomePetSelected: false,
            selectedPet: rowData,
            petInfoModalVisible: true
        })
    }

    showTemporaryHomePetInfoModal(rowData, petKey){

        this.setState({
            messageData: {
                name: this.props.pinData.pinOwnerName,
                key: this.props.pinData.pinOwnerID,
                targetAnimal: rowData.name
            },
            temporaryHomePetSelected: true,
            selectedPet: rowData,
            selectedPetKey: petKey,
            petInfoModalVisible: true
        })
    }

    changeModals() {
        this.setState({
            messageModalVisible: false,
        })
    }


    hideModals() {
        this.setState({
            messageModalVisible: false,
            adoptionCompleteModalVisible: false,
            petInfoModalVisible: false
        })
    }

   

    render() {
        var userState = '';
        if(this.props.pinOwnerData.state){
            if(this.props.pinOwnerData.state.length > 2){
                userState = this.capitalizeFirstLetter(this.props.pinOwnerData.state)
            } else{
                userState = this.props.pinOwnerData.state.toUpperCase()
            }
        }

        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onShow={() => { this.onModalOpen() }}
                onRequestClose={() => { }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.innerModalContainer}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderTextContainer}>
                                <Text style={styles.modalHeaderText}>{this.props.pinOwnerData.name}</Text>
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
                                    source={this.props.pinOwnerData.profileImage ? { uri: 'data:image/jpeg;base64,' + this.props.pinOwnerData.profileImage } : require("../Resources/meuPerfilIcon.png")}
                                    style={styles.profileImage}
                                />
                                <View style={styles.rowContainer}>
                                    <Text style={styles.nameText}>{this.props.pinOwnerData.name} {this.props.pinOwnerData.surname}</Text>
                                </View>
                                <View style={styles.rowContainer}>
                                    <View style={styles.separator}></View>
                                </View>
                                <Text style={styles.locationText}>{this.capitalizeFirstLetter(this.props.pinOwnerData.city)}, {userState}</Text>
                                {this.renderReportIcon()}
                                <Text style={[styles.locationText]}>{this.capitalizeFirstLetter(this.props.pinOwnerData.country)}</Text>
                            </View>
                            <View style={[styles.levelTextContainer, { backgroundColor: this.state.levelTextBackgroundColor }]}>
                                <Text style={styles.levelText}>Nível de Proteção Animal</Text>
                            </View>
                            <View style={[styles.levelNameContainer, { backgroundColor: this.state.levelNameBackgroundColor }]}>
                                <Text style={styles.levelText}>{this.state.levelName}</Text>
                            </View>
                            <View style={[styles.totalPointsContainer, { backgroundColor: this.state.totalPointsBackgroundColor }]}>
                                <Text style={styles.levelText}>{this.props.pinOwnerData.totalPoints} pontos</Text>
                            </View>
                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>Pets</Text>
                            </View>

                            <ListView
                                dataSource={this.state.petsDataSource}
                                renderRow={(rowData) => this._renderRowPets(rowData)}
                                contentContainerStyle={styles.listView}
                                horizontal={true}
                            >
                            </ListView>

                            <View style={styles.temporaryHomeHeaderContainer}>
                                <Text style={styles.temporaryHomeHeaderText}>Em Lar Temporário</Text>
                            </View>
                            <ListView
                                dataSource={this.state.temporaryHomeDataSource}
                                renderRow={(rowData) => this._renderRowTemporaryPets(rowData)}
                                contentContainerStyle={styles.listView}
                                horizontal={true}
                            >
                            </ListView>
                              
            
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
                <PinOwnerPetInfoModal
                    visible={this.state.petInfoModalVisible}
                    hideModals={() => this.hideModals()}
                    isTemporaryHomePet={this.state.temporaryHomePetSelected}
                    data={this.state.selectedPet}
                    messageData={this.state.messageData}
                    ownerInfo={this.props.pinOwnerData}
                    selectedPetKey={this.state.selectedPetKey}
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
    headerContainer: {
        flex: 1,
        backgroundColor: StyleVars.Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        marginTop: 5
    },
    headerText: {
        color: 'white',
        fontSize: 16
    },
    temporaryHomeHeaderContainer: {
        flex: 1,
        backgroundColor: StyleVars.Colors.animalStreetPinBackground,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    temporaryHomeHeaderText: {
        color: "gold",
        fontSize: 16
    },
    petContainer: {
        flexDirection: 'row',
        backgroundColor: StyleVars.Colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.5,
        height: windowHeight * 0.2

    },
    petImage: {
        width: windowWidth * 0.15,
        height: windowWidth * 0.15,
        borderRadius: (windowWidth * 0.15) / 2,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15
    },
    imageContainer: {
        justifyContent: 'center'
    },
    rowText: {
        color: 'white',
        fontSize: 10
    },
    levelText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    levelTextContainer: {
        width: windowWidth * 0.9,
        paddingVertical: 5,
        marginTop: 10
    },
    levelNameContainer: {
        width: windowWidth * 0.9,
        paddingVertical: 5
    },
    totalPointsContainer: {
        width: windowWidth * 0.9,
        paddingVertical: 5,
        marginBottom: 10
    },
    reportIcon: {
        width: windowWidth * 0.06,
        height: windowHeight * 0.06
    },
    reportIconContainer: {
        position: 'absolute',
        backgroundColor: StyleVars.Colors.secondary,
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
