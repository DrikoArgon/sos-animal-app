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
    TextInput,
    Alert
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
import DatePicker from 'react-native-datepicker'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class RunawayAnimalPinCreationScreen extends Component{



    constructor(props){
        super(props)

        this.ageAmount = null
        this.qtd = null
        this.name = null
        this.breed = null
        this.pointsForPinCreation = 3
        this.dateLimit = ''

        var currentDate = new Date()

        this.currentMonth = currentDate.getMonth() + 1
        this.currentYear = currentDate.getFullYear()
        this.currentDay = currentDate.getDate()

        if(this.currentMonth < 10){
            this.dateLimit = this.currentDay + '-0' + this.currentMonth + '-' + this.currentYear
        } else{
            this.dateLimit = this.currentDay + '-' + this.currentMonth + '-' + this.currentYear
        }
        
        console.log("date limit: " + this.dateLimit)
        this.state = {
            specieDropdownSelection: 'Selecione',
            breedDropdownSelection: 'Selecione',
            genderDropdownSelection: 'Selecione',
            sizeDropdownSelection: 'Selecione',
            ageTypeDropdownSelection: 'D/M/A',
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            numberOfImages: 0,
            creatingPin: false,
            runawayDate: ''
        }

    }


    selectPhotoTapped(index) {
        var options = {}

        if ((index === 1 && this.state.image1 !== null) ||
            (index === 2 && this.state.image2 !== null) ||
            (index === 3 && this.state.image3 !== null) ||
            (index === 4 && this.state.image4 !== null)) {
            options = {
                title: 'Selecione uma opção',
                takePhotoButtonTitle: 'Tirar Foto...',
                chooseFromLibraryButtonTitle: 'Escolher da Biblioteca...',
                quality: 0.5,
                cancelButtonTitle: 'Remover foto'
            }
        }
        else {
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
            this.state.genderDropdownSelection === 'Selecione' ||
            this.state.ageTypeDropdownSelection === 'D/M/A' ||
            this.ageAmount === null ||
            this.name === null ||
            this.state.runawayDate === '') {
            Alert.alert('', "Faltam informações",
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }

        if (this.state.image1 === null && this.state.image2 === null && this.state.image3 === null && this.state.image4 === null){
            Alert.alert('', "Faltam informações",
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }

        if (this.state.specieDropdownSelection === 'Cão' || this.state.specieDropdownSelection === 'Gato'){
            if(this.state.breedDropdownSelection === 'Selecione'){
                Alert.alert('', "Faltam informações",
                    [
                        {
                            text: 'Ok', onPress: () => { }
                        }
                    ],
                    { cancelable: false }
                )
            }
        } else{
            this.state.breedDropdownSelection = '-'
        }

        this.setState({
            creatingPin: true
        })

        var specieSelected = this.state.specieDropdownSelection
        var sizeSelected = this.state.sizeDropdownSelection
        var ageTypeSelected = this.state.ageTypeDropdownSelection
        var ageAmountSelected = this.ageAmount
        var nameSelected = this.name
        var genderSelected = this.state.genderDropdownSelection
        var runawayDateSelected = this.state.runawayDate
        var breedSelected = this.state.breedDropdownSelection
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
                name: nameSelected,
                runawayDate: runawayDateSelected,
                breed: breedSelected,
                gender: genderSelected,
                type: 3,
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

    defineBreedDropdown(){
        if(this.state.specieDropdownSelection === 'Cão'){
            return(
                <Menu
                    style={styles.dropdown}
                    onSelect={(value) => this.setState({ breedDropdownSelection: value })}
                >
                    <MenuTrigger>
                        <View style={styles.bigTriggerView}>
                            <Text style={styles.dropdownText}>{this.state.breedDropdownSelection}</Text>
                        </View>
                    </MenuTrigger>
                    <MenuOptions
                        optionsContainerStyle={styles.dropdownOptions}
                        renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                    >
                        <MenuOption value="Affenpinscher">
                            <Text style={styles.dropdownText}>Affenpinscher</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Afgan Hound">
                            <Text style={styles.dropdownText}>Afgan Hound</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Airedale Terrier">
                            <Text style={styles.dropdownText}>Airedale Terrier</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Akita Americano">
                            <Text style={styles.dropdownText}>Akita Americano</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Barbet">
                            <Text style={styles.dropdownText}>Barbet</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Barzoi">
                            <Text style={styles.dropdownText}>Barzoi</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Basset Hound">
                            <Text style={styles.dropdownText}>Basset Hound</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Beagle">
                            <Text style={styles.dropdownText}>Beagle</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Bernese Mountain Dog">
                            <Text style={styles.dropdownText}>Bernese Mountain Dog</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Bichon Frisé">
                            <Text style={styles.dropdownText}>Bichon Frisé</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Border Collie">
                            <Text style={styles.dropdownText}>Border Collie</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Boxer">
                            <Text style={styles.dropdownText}>Boxer</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Bullmastiff">
                            <Text style={styles.dropdownText}>Bullmastiff</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Bull Terrier">
                            <Text style={styles.dropdownText}>Bull Terrier</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Bulldog Francês">
                            <Text style={styles.dropdownText}>Bulldog Francês</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Bulldog Inglês">
                            <Text style={styles.dropdownText}>Bulldog Inglês</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Cane Corso">
                            <Text style={styles.dropdownText}>Cane Corso</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Chihuahua">
                            <Text style={styles.dropdownText}>Chihuahua</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Chow Chow">
                            <Text style={styles.dropdownText}>Chow Chow</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Cocker Americano">
                            <Text style={styles.dropdownText}>Cocker Americano</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Cocker Spaniel">
                            <Text style={styles.dropdownText}>Cocker Spaniel</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Collie">
                            <Text style={styles.dropdownText}>Collie</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Dachshund">
                            <Text style={styles.dropdownText}>Dachshund</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Dálmata">
                            <Text style={styles.dropdownText}>Dálmata</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Deerhound">
                            <Text style={styles.dropdownText}>Deerhound</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Doberman">
                            <Text style={styles.dropdownText}>Doberman</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Dogue Alemão">
                            <Text style={styles.dropdownText}>Boxer</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Fila Brasileiro">
                            <Text style={styles.dropdownText}>Fila Brasileiro</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Foxhound Inglês">
                            <Text style={styles.dropdownText}>Foxhound Inglês</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Fox Terrier Pelo Duro">
                            <Text style={styles.dropdownText}>Fox Terrier Pelo Duro</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Fox Terrier Pelo Liso">
                            <Text style={styles.dropdownText}>Fox Terrier Pelo Liso</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Golden Retriever">
                            <Text style={styles.dropdownText}>Golden Retriever</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Husky Siberiano">
                            <Text style={styles.dropdownText}>Husky Siberiano</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Kooiker">
                            <Text style={styles.dropdownText}>Kooiker</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Kuvasz">
                            <Text style={styles.dropdownText}>Kuvasz</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Labrador">
                            <Text style={styles.dropdownText}>Labrador</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Laika">
                            <Text style={styles.dropdownText}>Laika</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Lhasa Apso">
                            <Text style={styles.dropdownText}>Lhasa Apso</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Lulu da Pomerânea">
                            <Text style={styles.dropdownText}>Lulu da Pomerânea</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Maltês">
                            <Text style={styles.dropdownText}>Maltês</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Mastiff">
                            <Text style={styles.dropdownText}>Mastiff</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Mastim Napolitano">
                            <Text style={styles.dropdownText}>Mastim Napolitano</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Mastim Tibetano">
                            <Text style={styles.dropdownText}>Mastim Tibetano</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="O.E Sheepdog">
                            <Text style={styles.dropdownText}>O.E Sheepdog</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Pastor Alemão">
                            <Text style={styles.dropdownText}>Pastor Alemão</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Pastor de Brie">
                            <Text style={styles.dropdownText}>Pastor de Brie</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Pit Bull">
                            <Text style={styles.dropdownText}>Pit Bull</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Pointer Inglês">
                            <Text style={styles.dropdownText}>Pointer Inglês</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Poodle">
                            <Text style={styles.dropdownText}>Poodle</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Pug">
                            <Text style={styles.dropdownText}>Pug</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Rottweiler">
                            <Text style={styles.dropdownText}>Rottweiler</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Saluski">
                            <Text style={styles.dropdownText}>Saluski</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Samoieda">
                            <Text style={styles.dropdownText}>Samoieda</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="São Bernardo">
                            <Text style={styles.dropdownText}>São Bernardo</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Schnauzer Gigante">
                            <Text style={styles.dropdownText}>Schnauzer Gigante</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Schnauzer Minitatura">
                            <Text style={styles.dropdownText}>Schnauzer Minitatura</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Schnauzer Standard">
                            <Text style={styles.dropdownText}>Schnauzer Standard</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Setter Inglês">
                            <Text style={styles.dropdownText}>Setter Inglês</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Setter Irlandês">
                            <Text style={styles.dropdownText}>Setter Irlandês</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Shar Pei">
                            <Text style={styles.dropdownText}>Shar Pei</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Shih Tzu">
                            <Text style={styles.dropdownText}>Shih Tzu</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Spitz de Norboten">
                            <Text style={styles.dropdownText}>Spitz de Norboten</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Staffbull Terrier">
                            <Text style={styles.dropdownText}>Staffbull Terrier</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Teckel">
                            <Text style={styles.dropdownText}>Teckel</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Terra Nova">
                            <Text style={styles.dropdownText}>Terra Nova</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Terrier Brasileiro">
                            <Text style={styles.dropdownText}>Terrier Brasileiro</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Volpino">
                            <Text style={styles.dropdownText}>Volpino</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Yorkshire Terrier">
                            <Text style={styles.dropdownText}>Yorkshire Terrier</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Welsh Corgi">
                            <Text style={styles.dropdownText}>Welsh Corgi</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Sem Raça Definida">
                            <Text style={styles.dropdownText}>Sem Raça Definida</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                    </MenuOptions>
                </Menu>  
            )

        } else if (this.state.specieDropdownSelection === 'Gato'){
            return(
                <Menu
                    style={styles.dropdown}
                    onSelect={(value) => this.setState({ breedDropdownSelection: value })}
                >
                    <MenuTrigger>
                        <View style={styles.bigTriggerView}>
                            <Text style={styles.dropdownText}>{this.state.breedDropdownSelection}</Text>
                        </View>
                    </MenuTrigger>
                    <MenuOptions
                        optionsContainerStyle={styles.dropdownOptions}
                        renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                    >
                        <MenuOption value="Abissínio">
                            <Text style={styles.dropdownText}>Abissínio</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="American Shorthair">
                            <Text style={styles.dropdownText}>American Shorthair</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Angorá">
                            <Text style={styles.dropdownText}>Angorá</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Ashera">
                            <Text style={styles.dropdownText}>Ashera</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Azul Russo">
                            <Text style={styles.dropdownText}>Azul Russo</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Bengal">
                            <Text style={styles.dropdownText}>Bengal</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Brazilian Shorthair">
                            <Text style={styles.dropdownText}>Brazilian Shorthair</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Burmese">
                            <Text style={styles.dropdownText}>Burmese</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Cornish Rex">
                            <Text style={styles.dropdownText}>Cornish Rex</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Devon Rex">
                            <Text style={styles.dropdownText}>Devon Rex</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Egyptian Mau">
                            <Text style={styles.dropdownText}>Egyptian Mau</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="European Short Hair">
                            <Text style={styles.dropdownText}>European Short Hair</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Exótico">
                            <Text style={styles.dropdownText}>Exótico</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Himalaia">
                            <Text style={styles.dropdownText}>Himalaia</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Maine Coon">
                            <Text style={styles.dropdownText}>Maine Coon</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Munchkin">
                            <Text style={styles.dropdownText}>Munchkin</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Norwegian Forest">
                            <Text style={styles.dropdownText}>Norwegian Forest</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Oriental">
                            <Text style={styles.dropdownText}>Oriental</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Persa">
                            <Text style={styles.dropdownText}>Persa</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Ragdoll">
                            <Text style={styles.dropdownText}>Ragdoll</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Sagrado da Birmânia">
                            <Text style={styles.dropdownText}>Sagrado da Birmânia</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Savannah">
                            <Text style={styles.dropdownText}>Savannah</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Scottish Fold">
                            <Text style={styles.dropdownText}>Scottish Fold</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Siamês">
                            <Text style={styles.dropdownText}>Siamês</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Sphynx">
                            <Text style={styles.dropdownText}>Sphynx</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                        <MenuOption value="Sem Raça Definida">
                            <Text style={styles.dropdownText}>Sem Raça Definida</Text>
                            <View style={styles.separator}></View>
                        </MenuOption>
                    </MenuOptions>
                </Menu>  
            )
        } else{
            return(
                <View style={styles.disabledInput}>
                    <Text style={styles.dropdownText}>-</Text>
                </View>
            )    
        }
    }

    render(){
        return(
            <MenuContext style={{flex:1}} ref="MenuContext" lazyRender={500}>
                <View style={styles.container}>
                    <ScrollView
                    ref="scrollView"
                    keyboardShouldPersistTaps="never"
                    automaticallyAdjustContentInsects={true}
                    alwaysBounceVertical={true}
                    style={styles.scrollView}
                    >
                        <View style={styles.innerContainer}> 
                            <Text style={styles.infoText}>Data que fugiu</Text>
                            {/* <View style={styles.bigInputContainer}>
                                <TextInput 
                                    ref={(ref) => this._runawayDate = ref}
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    keyboardType='numeric'
                                    autoCorrect={false}
                                    value={this.state.runawayDate}
                                    onChangeText={(runawayDate) => {this.dataFomatter(runawayDate)}}
                                    returnKeyType="next"
                                    onSubmitEditing={() => this._nameRef.focus()}
                                />
                            </View> */}
                            <DatePicker
                                style={styles.bigInputContainer}
                                date={this.state.runawayDate}
                                mode="date"
                                placeholder="Selecione"
                                format="DD/MM/YYYY"
                                minDate="01-01-1950"
                                maxDate={this.dateLimit}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 4,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        width: windowWidth * 0.8,
                                        paddingVertical: 10,
                                        height: windowHeight * 0.06,
                                        backgroundColor: StyleVars.Colors.secondary,
                                        borderRadius: 5,
                                        borderWidth: 0
                                    },
                                    placeholderText:{
                                        color:'white',
                                        fontSize: 16
                                    },
                                    dateText:{
                                        color: 'white'
                                    }
                                    // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(runawayDate) => { this.setState({ runawayDate: runawayDate }) }}
                            />
                            <Text style={styles.infoText}>Nome</Text>
                            <View style={styles.bigInputContainer}> 
                                <TextInput 
                                    ref={(ref) => this._nameRef = ref}
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(name) => {this.name = name}}
                                    returnKeyType="next"
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
                            <Text style={styles.infoText}>Raça</Text>
                            {this.defineBreedDropdown()}
                            <Text style={styles.infoText}>Sexo</Text>
                            <Menu 
                                style={styles.dropdown}
                                onSelect={(value) => this.setState({genderDropdownSelection: value})}
                            >
                                <MenuTrigger>
                                    <View style={styles.bigTriggerView}>
                                        <Text style={styles.dropdownText}>{this.state.genderDropdownSelection}</Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions 
                                    optionsContainerStyle={styles.dropdownOptions}
                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                >
                                    <MenuOption value="Macho">
                                        <Text style={styles.dropdownText}>Macho</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Fêmea">
                                        <Text style={styles.dropdownText}>Fêmea</Text>
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
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(ageAmount) => {this.ageAmount = ageAmount}}
                                        returnKeyType="next"
                                        onSubmitEditing={() => {}}
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
                                    source={require("../Resources/pinCompleteRunawayAnimal.png")}
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
        backgroundColor: StyleVars.Colors.runawayAnimalPinBackground,
    },
    innerContainer:{
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
        paddingHorizontal: 5
    },
    rowContainer:{
        flexDirection: 'row',
        paddingHorizontal: 5
    },
    buttonContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        
    },
    smallContainer:{
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.435,
        marginBottom: 5,
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
        height: windowHeight * 0.06,
        backgroundColor: StyleVars.Colors.secondary,
        color: 'white',
        fontSize: 14,
        borderRadius: 5,
        textAlign: 'center'
    },
    bigInputContainer: {
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
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        height: windowHeight * 0.06,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'center'
    },
    dropdownOptions:{
        marginTop: 40,
        backgroundColor: StyleVars.Colors.secondary,
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
        backgroundColor: StyleVars.Colors.secondary,
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
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        width: windowWidth * 0.4,
        height: windowHeight * 0.2,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 5,
        position: 'absolute',
        right: windowWidth * 0.1
    },
    disabledInput:{
        width: windowWidth * 0.8,
        backgroundColor: StyleVars.Colors.listViewBackground,
        borderRadius: 5,
        height: 30,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'center'
    },
    noPhotoBackground: {
        width: windowWidth * 0.2,
        height: windowWidth * 0.2,
        borderRadius: (windowWidth * 0.2) / 2,
        backgroundColor: StyleVars.Colors.secondary,
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
