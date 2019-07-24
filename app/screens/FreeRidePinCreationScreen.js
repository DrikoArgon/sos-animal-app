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
    TextInput
} from 'react-native'

import Menu, {
    MenuContext,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-menu'

import StyleVars from '../styles/StyleVars'
import ImagePicker from 'react-native-image-picker'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height


export default class FreeRidePinCreationScreen extends Component{



    constructor(props){
        super(props)

        this.ageAmount = null
        this.qtd = null,
        this.destination = null
        this.pointsForPinCreation = 3

        this.state = {
            specieDropdownSelection: 'Selecione',
            sizeDropdownSelection: 'Selecione',
            ageTypeDropdownSelection: 'D/M/A',
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            numberOfImages: 0,
            creatingPin: false
        }
    }

    selectPhotoTapped(index) {

        var options = {}

        if ((index === 1 && this.state.image1 !== null) ||
            (index === 2 && this.state.image2 !== null) ||
            (index === 3 && this.state.image3 !== null) ||
            (index === 4 && this.state.image4 !== null)) 
        {   
            options = {
                title: 'Selecione uma opção',
                takePhotoButtonTitle: 'Tirar Foto...',
                chooseFromLibraryButtonTitle: 'Escolher da Biblioteca...',
                quality: 0.5,
                cancelButtonTitle: 'Remover foto'
            }
        }
        else{
            options = {
                title: 'Selecione uma opção',
                takePhotoButtonTitle: 'Tirar Foto...',
                chooseFromLibraryButtonTitle: 'Escolher da Biblioteca...',
                quality: 0.5,
                cancelButtonTitle: 'Cancelar'
            }
        }

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                if (index === 1 && this.state.image1 !== null) {
                    this.setState({
                        image1: null,
                        numberOfImages: this.state.numberOfImages - 1
                    })
                } else if (index === 2 && this.state.image2 !== null) {
                    this.setState({
                        image2: null,
                        numberOfImages: this.state.numberOfImages - 1
                    })
                } else if (index === 3 && this.state.image3 !== null) {
                    this.setState({
                        image3: null,
                        numberOfImages: this.state.numberOfImages - 1
                    })
                } else if (index === 4 && this.state.image4 !== null) {
                    this.setState({
                        image4: null,
                        numberOfImages: this.state.numberOfImages - 1
                    })
                }
            }
            else if (response.error) {
                console.warn('Image Picker error', response.error)
            }
            else {

                if (index === 1 && this.state.image1 !== null) {
                    this.setState({
                        image1: response.data
                    })
                } else if (index === 2 && this.state.image2 !== null) {
                    this.setState({
                        image2: response.data
                    })
                } else if (index === 3 && this.state.image3 !== null) {
                    this.setState({
                        image3: response.data
                    })
                } else if (index === 4 && this.state.image4 !== null) {
                    this.setState({
                        image4: response.data
                    })
                } else {
                    if (this.state.image1 === null) {
                        this.setState({
                            image1: response.data,
                            numberOfImages: this.state.numberOfImages + 1
                        })
                    } else if (this.state.image2 === null) {
                        this.setState({
                            image2: response.data,
                            numberOfImages: this.state.numberOfImages + 1
                        })
                    } else if (this.state.image3 === null) {
                        this.setState({
                            image3: response.data,
                            numberOfImages: this.state.numberOfImages + 1
                        })
                    } else {
                        this.setState({
                            image4: response.data,
                            numberOfImages: this.state.numberOfImages + 1
                        })
                    }
                }

            }
        })
    }

    createPin() {

        if (this.state.specieDropdownSelection === 'Selecione' ||
            this.state.sizeDropdownSelection === 'Selecione' ||
            this.state.ageTypeDropdownSelection === 'D/M/A' ||
            this.ageAmount === null ||
            this.qtd === null ||
            this.destination === null ||
            this.state.image1 === null ) {
            return (alert('Faltam informações'))
        }

        this.setState({
            creatingPin: true
        })

        var specieSelected = this.state.specieDropdownSelection
        var sizeSelected = this.state.sizeDropdownSelection
        var ageTypeSelected = this.state.ageTypeDropdownSelection
        var ageAmountSelected = this.ageAmount
        var qtdSelected = this.qtd
        var destinationSelected = this.destination
        var image1Selected = this.state.image1
        var image2Selected = this.state.image2
        var image3Selected = this.state.image3
        var image4Selected = this.state.image4

        let currentDate = new Date()

        navigator.geolocation.getCurrentPosition((position) => {

            FirebaseRequest.addNewPin({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                specie: specieSelected,
                size: sizeSelected,
                ageType: ageTypeSelected,
                ageAmount: ageAmountSelected,
                creationDay: currentDate.getDate(),
                creationMonth: currentDate.getMonth() + 1,
                creationYear: currentDate.getFullYear(),
                qtd: qtdSelected,
                destination: destinationSelected,
                type: 4,
                image1: image1Selected,
                image2: image2Selected,
                image3: image3Selected,
                image4: image4Selected
            })
                .then(() => {
                    FirebaseRequest.addPointsToUser(this.pointsForPinCreation, this.increaseUserCoins)
                })
                .catch((err) => { console.error('Error while trying to add new pin ', err.message) })


        },
            (error) => alert(JSON.stringify(error)),
            { enableHighAccuracy: true }
        )

    }

    increaseUserCoins = () => {

        FirebaseRequest.addPointsToCurrentUser(this.pointsForPinCreation)
        FirebaseRequest.addCoinsToUser(this.pointsForPinCreation, this.checkUserLevel)

    }

    checkUserLevel = () => {

        FirebaseRequest.addCoinsToCurrentUser(this.pointsForPinCreation)
        FirebaseRequest.updateUserLevel()
            .then(() => {

                this.setState({
                    creatingPin: false
                })

                this.props.back()
            })
            .catch((err) => { console.error('Erro no sistema de pontos e níveis.', err.message) })

    } 

    render(){
        return(
             <MenuContext style={{flex:1}} ref="MenuContext" lazyRender={200}>
                <View style={styles.container}>
                    <ScrollView
                        ref="scrollView"
                        keyboardShouldPersistTaps="never"
                        automaticallyAdjustContentInsects={true}
                        alwaysBounceVertical={true}
                        style={styles.scrollView}
                    >
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Destino</Text>
                            <View style={styles.bigInputContainer}>
                                <TextInput
                                    placeholderTextColor="white"
                                    selectionColor="white"
                                    underlineColorAndroid={StyleVars.Colors.primary}
                                    style={styles.input}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    onChangeText={(destination) => { this.destination = destination }}
                                    returnKeyType="done"
                                    onSubmitEditing={() => {}}
                                />
                            </View> 
                            <Text style={styles.infoText}>Espécie</Text>
                            <Menu 
                                style={styles.dropdown}
                                onSelect={(value) => this.setState({specieDropdownSelection: value})}
                            >
                                <MenuTrigger>
                                    <View style={styles.bigTriggerView}>
                                    <Text style={styles.dropdownText}>{this.state.specieDropdownSelection}</Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions 
                                    optionsContainerStyle={styles.dropdownOptions}
                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                >
                                    <MenuOption value="Ave">
                                        <Text style={styles.dropdownText}>Ave</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Cão">
                                        <Text style={styles.dropdownText}>Cão</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Cavalo">
                                        <Text style={styles.dropdownText}>Cavalo</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Coelho">
                                        <Text style={styles.dropdownText}>Coelho</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Gato">
                                        <Text style={styles.dropdownText}>Gato</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Mamífero">
                                        <Text style={styles.dropdownText}>Mamífero</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Peixe">
                                        <Text style={styles.dropdownText}>Peixe</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Suíno">
                                        <Text style={styles.dropdownText}>Suíno</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Réptil">
                                        <Text style={styles.dropdownText}>Réptil</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Roedor">
                                        <Text style={styles.dropdownText}>Roedor</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>   
                            <Text style={styles.infoText}>Porte</Text>
                            <Menu 
                                style={styles.dropdown}
                                onSelect={(value) => this.setState({sizeDropdownSelection: value})}
                            >
                                <MenuTrigger>
                                    <View style={styles.bigTriggerView}>
                                    <Text style={styles.dropdownText}>{this.state.sizeDropdownSelection}</Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions 
                                    optionsContainerStyle={styles.dropdownOptions}
                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                >
                                    <MenuOption value="Pequeno">
                                        <Text style={styles.dropdownText}>Pequeno</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Médio">
                                        <Text style={styles.dropdownText}>Médio</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Grande">
                                        <Text style={styles.dropdownText}>Grande</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                            <Text style={styles.infoText}>Idade</Text>
                            <View style={styles.rowContainer}>
                                <View style={styles.smallContainer}>
                                    <TextInput 
                                        ref={(ref) => this._ageAmountRef = ref}
                                        keyboardType="numeric"
                                        placeholderTextColor="white"
                                        underlineColorAndroid={StyleVars.Colors.primary}
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(ageAmount) => {this.ageAmount = ageAmount}}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._qtdRef.focus()}
                                    />
                                </View>
                                <Menu 
                                    style={styles.smallDropdown}
                                    onSelect={(value) => this.setState({ageTypeDropdownSelection: value})}
                                >
                                    <MenuTrigger>
                                        <View style={styles.smallTriggerView}>
                                        <Text style={styles.dropdownText}>{this.state.ageTypeDropdownSelection}</Text>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions 
                                        optionsContainerStyle={styles.smallDropdownOptions}
                                        renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                    >
                                        <MenuOption value="Dia(s)">
                                            <Text style={styles.dropdownText}>Dia(s)</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Mês(meses)">
                                            <Text style={styles.dropdownText}>Mês(meses)</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Ano(s)">
                                            <Text style={styles.dropdownText}>Ano(s)</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            </View>
                            <Text style={styles.infoText}>Quantidade</Text>
                            <View style={styles.bigInputContainer}>
                                <TextInput 
                                    ref={(ref) => this._qtdRef = ref}
                                    keyboardType="numeric"
                                    placeholderTextColor="white"
                                    underlineColorAndroid={StyleVars.Colors.primary}
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(qtd) => {this.qtd = qtd}}
                                    returnKeyType="done"
                                    onSubmitEditing={() => {}}
                                />
                            </View>
                            <Text style={styles.infoText}>Adicione pelo menos 1 foto</Text>
                            <View style={styles.imagesContainer}>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={styles.profileImageContainer}
                                    onPress={() => this.selectPhotoTapped(1)}
                                >
                                    {this.state.image1 ? (
                                        <Image
                                            source={{ uri: "data:image/jpeg;base64," + this.state.image1 }}
                                            style={styles.profileImage}
                                        />
                                    ) : (
                                            <View style={styles.noPhotoBackground}>
                                                <Text style={styles.noPhotoBackgroundText}>+</Text>
                                            </View>
                                        )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={styles.profileImageContainer}
                                    onPress={() => this.selectPhotoTapped(2)}
                                >
                                    {this.state.image2 ? (
                                        <Image
                                            source={{ uri: "data:image/jpeg;base64," + this.state.image2 }}
                                            style={styles.profileImage}
                                        />
                                    ) : (
                                            <View style={styles.noPhotoBackground}>
                                                <Text style={styles.noPhotoBackgroundText}>+</Text>
                                            </View>
                                        )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={styles.profileImageContainer}
                                    onPress={() => this.selectPhotoTapped(3)}
                                >
                                    {this.state.image3 ? (
                                        <Image
                                            source={{ uri: "data:image/jpeg;base64," + this.state.image3 }}
                                            style={styles.profileImage}
                                        />
                                    ) : (
                                            <View style={styles.noPhotoBackground}>
                                                <Text style={styles.noPhotoBackgroundText}>+</Text>
                                            </View>
                                        )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={styles.profileImageContainer}
                                    onPress={() => this.selectPhotoTapped(4)}
                                >
                                    {this.state.image4 ? (
                                        <Image
                                            source={{ uri: "data:image/jpeg;base64," + this.state.image4 }}
                                            style={styles.profileImage}
                                        />
                                    ) : (
                                            <View style={styles.noPhotoBackground}>
                                                <Text style={styles.noPhotoBackgroundText}>+</Text>
                                            </View>
                                        )}
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.createPin()}
                            >
                                    <Image 
                                        source={require("../Resources/pinCompleteFreeRide.png")}
                                        style={styles.icon}
                                        resizeMode='contain'
                                    />
                            </TouchableOpacity>
                            {this.state.creatingPin ?
                                (
                                    <Text style={styles.infoText}>Criando pin...</Text>
                                )
                                :
                                (
                                    <View />
                                )

                            }
                        </View>  
                    </ScrollView> 
                </View>
             </MenuContext>
        )

    }

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#003000",
    },
    innerContainer:{
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
        paddingHorizontal: 5
    },
    rowContainer:{
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    buttonContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        
    },
    smallContainer:{
        flexDirection: 'row',
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.435,
        marginBottom: 5,
        alignItems: 'center',
        paddingHorizontal: 10
    },
    createPinButton:{
        backgroundColor: "darkgreen",
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginTop: 50,
        alignItems: 'center'
    },
    createPinButtonText: {
        color: 'lime',
        fontSize: 20
    },
    infoText:{
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    input: {
        flex: 1,
        alignItems: 'center',
        height: windowHeight * 0.06,
        backgroundColor: StyleVars.Colors.primary,
        color: 'white',
        fontSize: 14,
        borderRadius: 5,
        textAlign: 'center'
    },
    bigInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: windowWidth * 0.8,
        paddingVertical: 10
        
    },
    icon:{
        width: windowWidth * 0.30,
        height: windowHeight * 0.18,
        marginTop: 15
        
    },
    dropdown:{
        width: windowWidth * 0.8,
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 5,
        height: windowHeight * 0.06,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center'
    },
    dropdownOptions:{
        marginTop: 33,
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 5,
        width: windowWidth * 0.8,
        height: windowHeight * 0.2,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 5,
        position: 'absolute',
        left: windowWidth * 0.1
    },
    dropdownText:{
        color: 'white',
        fontSize: 16
    },
    bigTriggerView: {
        width: windowWidth * 0.8,
        borderRadius: 10,
        alignItems: 'center'
    },
    smallTriggerView: {
        width: windowWidth * 0.4,
        borderRadius: 10,
        alignItems: 'center'
    },
    separator: {
        height: 0.5,
        marginTop: 5,
        backgroundColor: '#CCC',
    },
    smallDropdown:{
        width: windowWidth * 0.4,
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 5,
        height: windowHeight * 0.06,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
        marginRight: 13
    },
    smallDropdownOptions:{
        marginTop: 33,
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 5,
        width: windowWidth * 0.4,
        height: windowHeight * 0.2,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 5,
        position: 'absolute',
        right: windowWidth * 0.1
    },
    noPhotoBackground: {
        width: windowWidth * 0.2,
        height: windowWidth * 0.2,
        borderRadius: (windowWidth * 0.2) / 2,
        backgroundColor: StyleVars.Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    noPhotoBackgroundText: {
        color: 'white',
        fontSize: 25,
        textAlign: 'center'
    },
    profileImageContainer: {
        width: windowWidth * 0.2,
        height: windowHeight * 0.18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: windowWidth * 0.115
    },
    profileImage: {
        width: windowWidth * 0.2,
        height: windowWidth * 0.2,
        borderRadius: (windowWidth * 0.2) / 2,
    },
    imagesContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 5
    }


})
