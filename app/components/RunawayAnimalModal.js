'use strict'

import React, {Component} from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Image,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'

import Menu, {
    MenuContext,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-menu'

import ImagePicker from 'react-native-image-picker'
import DatePicker from 'react-native-datepicker'



const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class RunawayAnimalModal extends Component{

    constructor(props){
        super(props)


        var currentDate = new Date()

        this.currentMonth = currentDate.getMonth() + 1
        this.currentYear = currentDate.getFullYear()
        this.currentDay = currentDate.getDate()

        if (this.currentMonth < 10) {
            this.dateLimit = this.currentDay + '-0' + this.currentMonth + '-' + this.currentYear
        } else {
            this.dateLimit = this.currentDay + '-' + this.currentMonth + '-' + this.currentYear
        }


        this.state = {
            runawayDate: this.props.data.runawayDate,
            name: this.props.data.name,
            ageAmount: this.props.data.ageAmount,
            specieDropdownSelection: this.props.data.specie,
            sizeDropdownSelection: this.props.data.size,
            ageTypeDropdownSelection: this.props.data.ageType,
            breedDropdownSelection: this.props.data.breed,
            genderDropdownSelection: this.props.data.gender,
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            specieChanged: false,
            ageTypeChanged: false,
            sizeChanged: false,
            breedChanged: false,
            genderChanged: false,
            nameChanged: false,
            runawayDateChanged: false,
            ageAmountChanged: false,
            image1Changed: false,
            image2Changed: false,
            image3Changed: false,
            image4Changed: false,
            loading: false
        }

        if (this.props.data.image1) {
            this.state.image1 = this.props.data.image1
        }

        if (this.props.data.image2) {
            this.state.image2 = this.props.data.image2
        }

        if (this.props.data.image3) {
            this.state.image3 = this.props.data.image3
        }

        if (this.props.data.image4) {
            this.state.image4 = this.props.data.image4
        }

    }

    onModalOpen(){
        this.setState({
            runawayDate: this.props.data.runawayDate,
            name: this.props.data.name,
            ageAmount: this.props.data.ageAmount
        })
    }

    hide() {

        this.setState({
            specieChanged: false,
            ageTypeChanged: false,
            sizeChanged: false,
            breedChanged: false,
            genderChanged: false,
            nameChanged: false,
            runawayDateChanged: false,
            ageAmountChanged: false,
            image1Changed: false,
            image2Changed: false,
            image3Changed: false,
            image4Changed: false
        })

        this.props.hideModals()
    }

    selectPhotoTapped(imageTapped) {
        const options = {
            title: 'Select an Option',
            quality: 0.5,

        }

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {

            }
            else if (response.error) {
                console.warn('Image Picker error', response.error)
            }
            else {

                if (imageTapped === 0) {

                    if (!this.props.data.image1 && !this.state.image1Changed) {
                        this.setState({
                            image1: response.data,
                            image1Changed: true
                        })
                    } else if (!this.props.data.image2 && !this.state.image2Changed) {
                        this.setState({
                            image2: response.data,
                            image2Changed: true
                        })
                    } else if (!this.props.data.image3 && !this.state.image3Changed) {
                        this.setState({
                            image3: response.data,
                            image3Changed: true
                        })
                    } else {
                        this.setState({
                            image4: response.data,
                            image4Changed: true
                        })
                    }

                } else if (imageTapped === 1) {
                    this.setState({
                        image1: response.data,
                        image1Changed: true
                    })
                } else if (imageTapped === 2) {
                    this.setState({
                        image2: response.data,
                        image2Changed: true
                    })
                } else if (imageTapped === 3) {
                    this.setState({
                        image3: response.data,
                        image3Changed: true
                    })
                } else if (imageTapped === 4) {
                    this.setState({
                        image4: response.data,
                        image4Changed: true
                    })
                }

            }
        })
    }

    updatePin() {

        this.setState({
            loading: true
        })

        var oldImage1 = null
        var oldImage2 = null
        var oldImage3 = null
        var oldImage4 = null

        if (this.props.data.image1) {
            oldImage1 = this.props.data.image1
        }

        if (this.props.data.image2) {
            oldImage2 = this.props.data.image2
        }

        if (this.props.data.image3) {
            oldImage3 = this.props.data.image3
        }

        if (this.props.data.image4) {
            oldImage4 = this.props.data.image4
        }

        FirebaseRequest.updatePin({
            specie: this.state.specieChanged ? this.state.specieDropdownSelection : this.props.data.specie,
            size: this.state.sizeChanged ? this.state.sizeDropdownSelection : this.props.data.size,
            ageType: this.state.ageTypeChanged ? this.state.ageTypeDropdownSelection : this.props.data.ageType,
            ageAmount: this.state.ageAmountChanged ? this.state.ageAmount : this.props.data.ageAmount,
            name: this.state.nameChanged ? this.state.name : this.props.data.name,
            runawayDate: this.state.runawayDateChanged ? this.state.runawayDate : this.props.data.runawayDate,
            gender: this.state.genderChanged ? this.state.genderDropdownSelection : this.props.data.gender,
            breed: this.state.breedChanged ? this.state.breedDropdownSelection : this.props.data.breed,
            image1: this.state.image1Changed ? this.state.image1 : oldImage1,
            image2: this.state.image2Changed ? this.state.image2 : oldImage2,
            image3: this.state.image3Changed ? this.state.image3 : oldImage3,
            image4: this.state.image4Changed ? this.state.image4 : oldImage4
        }, this.props.data.pinID, this.props.data.key)
            .then(() => {
                this.setState({
                    loading: false
                })
                this.hide()
            })
            .catch((err) => { 
                Alert.alert('', 'Erro ao tentar atualizar informações do pin.',
                    [
                        {
                            text: 'Ok', onPress: () => { }
                        }
                    ],
                    { cancelable: false }
                )
                this.setState({
                    loading: false
                })
            })
    }

    defineBreedDropdown() {
        if (this.state.specieDropdownSelection === 'Cão') {
            return (
                <Menu
                    style={styles.dropdown}
                    onSelect={(value) => {                       
                        this.setState({ 
                            breedDropdownSelection: value, 
                            breedChanged: true
                        })
                    }}
                >
                    <MenuTrigger>
                        <Text style={styles.dropdownText}>{this.state.breedChanged ? this.state.breedDropdownSelection : this.props.data.breed}</Text>
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

        } else if (this.state.specieDropdownSelection === 'Gato') {
            return (
                <Menu
                    style={styles.dropdown}
                    onSelect={(value) => {
                        this.setState({
                            breedDropdownSelection: value,
                            breedChanged: true
                        })
                    }}
                >
                    <MenuTrigger>
                        <Text style={styles.dropdownText}>{this.state.breedChanged ? this.state.breedDropdownSelection : this.props.data.breed}</Text>
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
        } else {
            return (
                <View style={styles.disabledInput}>
                    <Text style={styles.dropdownText}>-</Text>
                </View>
            )
        }
    }

    handleBreedChanging(value){

        if(this.state.breedChanged){
            if(value === 'Cão'){
                this.setState({
                    breedDropdownSelection: "Affenpinscher"
                })
            } else if (value === 'Gato'){
                this.setState({
                    breedDropdownSelection: "Abissínio"
                })
            }
        }else{
            if (this.props.data.specie === "Gato" && value === "Cão") {
                this.setState({
                    breedDropdownSelection: "Affenpinscher",
                    breedChanged: true
                })
            } else if (this.props.data.specie === "Cão" && value === "Gato") {
                this.setState({
                    breedDropdownSelection: "Abissínio",
                    breedChanged: true
                })
            }

        }

        if (value !== 'Cão' && value !== 'Gato') {
            this.setState({
                breedDropdownSelection: "-",
                breedChanged: true
            })
        }

    }


    render(){

        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onShow={() => this.onModalOpen()}
                onRequestClose={()=> {}}
                 >
                <MenuContext style={{ flex: 1 }} ref="MenuContext" lazyRender={200}>
                    <TouchableWithoutFeedback 
                        onPress={() => this.hide()}
                    >
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback
                                onPress={() => dismissKeyboard()}
                            >
                                <View style={styles.innerModalContainer}>
                                    <View style={styles.modalHeader}>
                                        <View style={styles.modalHeaderImageContainer}>
                                            <Image 
                                                source={require("../Resources/runawayAnimalIcon.png")}
                                                style={styles.rowIcon}
                                                resizeMode='contain'
                                            />
                                        </View>
                                        <View style={styles.modalHeaderTextContainer}>
                                            <Text style={styles.modalHeaderText}>ANIMAL FUGIU</Text>
                                        </View>
                                    </View>
                                    <View style={styles.modalTextContainerDark}>
                                        <Text style={styles.modalText}>Data:</Text>
                                        <Text style={styles.infoText}>{this.props.data.creationDay + "/" + this.props.data.creationMonth + "/" + this.props.data.creationYear}</Text>
                                    </View>
                                    <View style={styles.modalTextContainerLight}>
                                        <Text style={styles.modalText}>Data que fugiu:</Text>
                                        <DatePicker
                                            style={styles.bigInputContainer}
                                            date={this.state.runawayDate}
                                            mode="date"
                                            showIcon={true}
                                            placeholder="Selecione"
                                            format="DD/MM/YYYY"
                                            minDate="01-01-1950"
                                            maxDate={this.dateLimit}
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: windowWidth * 0.4,
                                                    top: 3,
                                                    marginLeft: 0
                                                },
                                                dateInput: {
                                                    width: windowWidth * 0.4,
                                                    marginLeft: 5,
                                                    marginTop: 2,
                                                    height: windowHeight * 0.06,
                                                    borderWidth: 0,
                                                    alignItems: 'flex-start'
                                                },
                                                placeholderText: {
                                                    color: 'white',
                                                    fontSize: 14
                                                },
                                                dateText: {
                                                    color: 'white',
                                                    fontSize: 14
                                                }
                                                // ... You can check the source to find the other keys.
                                            }}
                                            onDateChange={(runawayDate) => { this.setState({ runawayDate: runawayDate, runawayDateChanged: true }) }}
                                        />
                                    </View>
                                    <View style={styles.modalTextContainerDark}>
                                        <Text style={styles.modalText}>Nome:</Text>
                                        <TextInput 
                                            ref={(ref) => this._nameRef = ref}
                                            placeholder={this.props.data.name}
                                            placeholderTextColor="white"
                                            selectionColor="white"
                                            style={styles.biggerInput}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            onChangeText={(name) => {
                                                                        this.setState({
                                                                            nameChanged: true,
                                                                            name: name
                                                                        })
                                                                    }
                                                         }
                                            returnKeyType="next"
                                            onSubmitEditing={() => {}}
                                        />
                                    </View>
                                    <View style={styles.modalTextContainerLight}>
                                        <Text style={styles.modalText}>Espécie:</Text>
                                        <Menu
                                            style={styles.dropdown}
                                            onSelect={(value) => {

                                                this.handleBreedChanging(value)
                                    
                                                this.setState({ 
                                                    specieDropdownSelection: value, 
                                                    specieChanged: true
                                                    })          
                                                }}
                                        >
                                            <MenuTrigger>
                                                <Text style={styles.dropdownText}>{this.state.specieChanged ? this.state.specieDropdownSelection : this.props.data.specie}</Text>
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
                                    </View>
                                    <View style={styles.modalTextContainerDark}>
                                        <Text style={styles.modalText}>Raça:</Text>
                                        {this.defineBreedDropdown()}
                                    </View>
                                    <View style={styles.modalTextContainerLight}>
                                        <Text style={styles.modalText}>Sexo:</Text>
                                        <Menu
                                            style={styles.dropdown}
                                            onSelect={(value) => this.setState({ genderDropdownSelection: value, genderChanged: true })}
                                        >
                                            <MenuTrigger>
                                                <Text style={styles.dropdownText}>{this.state.genderChanged ? this.state.genderDropdownSelection : this.props.data.gender}</Text>
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
                                    </View>
                                    <View style={styles.modalTextContainerDark}>
                                        <Text style={styles.modalText}>Porte:</Text>
                                        <Menu
                                            style={styles.dropdown}
                                            onSelect={(value) => this.setState({ sizeDropdownSelection: value, sizeChanged: true  })}
                                        >
                                            <MenuTrigger>
                                                <Text style={styles.dropdownText}>{this.state.sizeChanged ? this.state.sizeDropdownSelection : this.props.data.size}</Text>
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
                                    </View>
                                    <View style={styles.modalTextContainerLight}>
                                        <Text style={styles.modalText}>Idade:</Text>
                                        <TextInput 
                                            ref={(ref) => this._ageAmountRef = ref}
                                            placeholder={this.props.data.ageAmount}
                                            placeholderTextColor="white"
                                            selectionColor="white"
                                            keyboardType="numeric"
                                            style={styles.input}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            onChangeText={(ageAmount) => {
                                                                            this.setState({
                                                                                ageAmountChanged: true,
                                                                                ageAmount: ageAmount
                                                                            })}}
                                            returnKeyType="next"
                                            onSubmitEditing={() => {}}
                                        />
                                        <Menu
                                            style={styles.dropdown}
                                            onSelect={(value) => this.setState({ ageTypeDropdownSelection: value, ageTypeChanged: true })}
                                        >
                                            <MenuTrigger>
                                                <Text style={styles.dropdownText}>{this.state.ageTypeChanged ? this.state.ageTypeDropdownSelection : this.props.data.ageType}</Text>
                                            </MenuTrigger>
                                            <MenuOptions
                                                optionsContainerStyle={styles.dropdownOptions}
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
                                    <View style={styles.modalTextContainerDark}>
                                        <Text style={styles.modalText}>Fotos:</Text>
                                    </View>
                                    <View style={styles.imagesContainer}>
                                        {this.props.data.image1 ?
                                            (
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    style={styles.profileImageContainer}
                                                    onPress={() => this.selectPhotoTapped(1)}
                                                >
                                                    {this.state.image1Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image1 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.props.data.image1 }}
                                                                style={styles.profileImage}
                                                            />
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            ) :
                                            (
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    style={styles.profileImageContainer}
                                                    onPress={() => this.state.image1Changed ? (this.selectPhotoTapped(1)) : (this.selectPhotoTapped(0))}
                                                >
                                                    {this.state.image1Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image1 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <View style={styles.noPhotoBackground}>
                                                                <Text style={styles.noPhotoBackgroundText}>+</Text>
                                                            </View>
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            )
                                        }
                                        {this.props.data.image2 ?
                                            (
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    style={styles.profileImageContainer}
                                                    onPress={() => this.selectPhotoTapped(2)}
                                                >
                                                    {this.state.image2Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image2 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.props.data.image2 }}
                                                                style={styles.profileImage}
                                                            />
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            ) :
                                            (
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    style={styles.profileImageContainer}
                                                    onPress={() => this.state.image2Changed ? (this.selectPhotoTapped(2)) : (this.selectPhotoTapped(0))}
                                                >
                                                    {this.state.image2Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image2 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <View style={styles.noPhotoBackground}>
                                                                <Text style={styles.noPhotoBackgroundText}>+</Text>
                                                            </View>
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            )
                                        }
                                        {this.props.data.image3 ?
                                            (
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    style={styles.profileImageContainer}
                                                    onPress={() => this.selectPhotoTapped(3)}
                                                >
                                                    {this.state.image3Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image3 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.props.data.image3 }}
                                                                style={styles.profileImage}
                                                            />
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            ) :
                                            (
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    style={styles.profileImageContainer}
                                                    onPress={() => this.state.image3Changed ? (this.selectPhotoTapped(3)) : (this.selectPhotoTapped(0))}
                                                >
                                                    {this.state.image3Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image3 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <View style={styles.noPhotoBackground}>
                                                                <Text style={styles.noPhotoBackgroundText}>+</Text>
                                                            </View>
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            )
                                        }
                                        {this.props.data.image4 ?
                                            (
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    style={styles.profileImageContainer}
                                                    onPress={() => this.selectPhotoTapped(4)}
                                                >
                                                    {this.state.image4Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image4 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.props.data.image4 }}
                                                                style={styles.profileImage}
                                                            />
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            ) :
                                            (
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    style={styles.profileImageContainer}
                                                    onPress={() => this.state.image4Changed ? (this.selectPhotoTapped(4)) : (this.selectPhotoTapped(0))}
                                                >
                                                    {this.state.image4Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image4 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <View style={styles.noPhotoBackground}>
                                                                <Text style={styles.noPhotoBackgroundText}>+</Text>
                                                            </View>
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            )
                                        }
                                    </View>
                                    <View style={styles.modalFooter}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => this.updatePin()}
                                        >
                                        <Text style={styles.modalSaveButtonText}>{this.state.loading ? "Salvando..." : "Salvar"}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                        >
                                            <Image 
                                                source={require("../Resources/shareIcon.png")}
                                                style={styles.footerImage}
                                                resizeMode='contain'
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => this.hide()}
                                        >
                                        <Text style={styles.modalFooterText}>Sair</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </MenuContext>
            </Modal>
        )
    }

}


const styles = StyleSheet.create({
    modalContainer:{
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalTextContainerLight:{
        flexDirection: 'row',
        paddingVertical: 4,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    modalTextContainerDark:{
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    modalHeader:{
        backgroundColor: StyleVars.Colors.runawayAnimalPinBackground,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10

    },
    modalHeaderTextContainer:{
       flex: 3,
       justifyContent: 'center'
    },
    modalHeaderText:{
        color: 'white',
        fontSize: 18
    },
    modalText:{
        color: 'white',
        fontSize: 16
    },
    innerModalContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10
    },
    modalFooter:{
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    modalFooterText:{
        color: 'white',
        fontSize: 18
    },
    modalSaveButtonText:{
        color: "rgb(188, 5, 5)",
        fontSize: 18
    },
    modalHeaderImageContainer:{
        alignItems: 'center',
        flex: 2
    },
    rowIcon:{
        width: windowWidth * 0.10,
        height: windowHeight * 0.08
    },
    input: {
        width: windowWidth * 0.2,
        color: 'white',
        fontSize: 14,
        marginLeft: 5,
        marginTop: 6,
        height: windowHeight * 0.06,
        alignItems: 'center'
    },
    footerImage:{
        width: windowWidth * 0.06,
        height: windowHeight * 0.04
    },
    infoText: {
        color: 'white',
        fontSize: 14,
        marginLeft: 5,
        marginTop: 2
    },
    dropdown: {
        width: windowWidth * 0.4,
        marginLeft: 5,
        marginTop: 2
    },
    dropdownText: {
        color: 'white',
        fontSize: 14
    },
    dropdownOptions: {
        marginTop: 20,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        width: windowWidth * 0.4,
        height: windowHeight * 0.2,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 5
    },
    separator: {
        height: 0.5,
        marginTop: 5,
        backgroundColor: '#CCC'
    },
    disabledInput:{
        width: windowWidth * 0.4,
        marginLeft: 5,
        marginTop: 2
    },
    biggerInput:{
            width: windowWidth * 0.4,
            color: 'white',
            fontSize: 14,
            marginLeft: 5,
            marginTop: 6,
            height: windowHeight * 0.06,
            alignItems: 'center'
    },
    imagesContainer: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        backgroundColor: StyleVars.Colors.secondary
    },
    noPhotoBackground: {
        width: windowWidth * 0.17,
        height: windowWidth * 0.17,
        borderRadius: (windowWidth * 0.17) / 2,
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
        height: windowHeight * 0.12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    profileImage: {
        width: windowWidth * 0.17,
        height: windowWidth * 0.17,
        borderRadius: (windowWidth * 0.17) / 2,
    }
})
