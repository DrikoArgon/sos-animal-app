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
    TextInput,
    Alert
} from 'react-native'

import Menu, {
    MenuContext,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-menu'

import SegmentedControlTab from 'react-native-segmented-control-tab'
import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import ImagePicker from 'react-native-image-picker'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class PetEditScreen extends Component {

    constructor(props) {
        super(props)

        this.ageAmount = this.props.data.ageAmount
        this.name = this.props.data.name

        if(this.props.data.petSituation === 0){

            this.petSituation = 0
            this.oldPetSituation = 0
        }else {
            this.petSituation = 1
            this.oldPetSituation = 1
        }

        this.state = {
            selectedIndex: this.petSituation,
            specieDropdownSelection: this.props.data.specie,
            breedDropdownSelection: this.props.data.breed,
            sizeDropdownSelection: this.props.data.size,
            ageTypeDropdownSelection: this.props.data.ageType,
            genderDropdownSelection: this.props.data.gender,
            colorDropdownSelection: this.props.data.color,
            vaccinatedDropdownSelection: this.props.data.vaccinated,
            dewormedDropdownSelection: this.props.data.dewormed,
            castratedDropdownSelection: this.props.data.castrated,
            profilePhoto: this.props.data.profilePhoto,
            loading: false,
            removing: false

        }
    }

    selectPhotoTapped() {
        const options = {
            title: 'Selecione uma opção',
            takePhotoButtonTitle: 'Tirar Foto...',
            chooseFromLibraryButtonTitle: 'Escolher da Biblioteca...',
            quality: 0.5,

        }

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {

            }
            else if (response.error) {
                console.warn('Image Picker error', response.error)
            }
            else {

                let source = { uri: response.uri }

                this.setState({
                    profilePhoto: response.data
                })

            }
        })
    }

    defineBreedDropdown() {
        if (this.state.specieDropdownSelection === 'Cão') {
            return (
                <Menu
                    style={styles.dropdown3}
                    onSelect={(value) => this.setState({ breedDropdownSelection: value })}
                >
                    <MenuTrigger>
                        <Text style={styles.dropdownText3}>{this.state.breedDropdownSelection}</Text>
                    </MenuTrigger>
                    <MenuOptions
                        optionsContainerStyle={styles.rightDropdownOptions}
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
                    style={styles.dropdown3}
                    onSelect={(value) => this.setState({ breedDropdownSelection: value })}
                >
                    <MenuTrigger>
                        <Text style={styles.dropdownText3}>{this.state.breedDropdownSelection}</Text>
                    </MenuTrigger>
                    <MenuOptions
                        optionsContainerStyle={styles.rightDropdownOptions}
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

    showTemporaryHomeAlert() {

        Alert.alert('Atenção', 'Ao adicionar um animal como lar temporário, serão necessárias novas informações de contato. Estas informações serão utilizadas caso algum usuário tiver interesse em adotar este animal.',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {
                        this.props.toRoute(Routes.addAdditionalContactInfo({
                            name: this.name,
                            ageAmount: this.ageAmount,
                            ageType: this.state.ageTypeDropdownSelection,
                            specie: this.state.specieDropdownSelection,
                            breed: this.state.breedDropdownSelection,
                            size: this.state.sizeDropdownSelection,
                            gender: this.state.genderDropdownSelection,
                            color: this.state.colorDropdownSelection,
                            vaccinated: this.state.vaccinatedDropdownSelection,
                            dewormed: this.state.dewormedDropdownSelection,
                            castrated: this.state.castratedDropdownSelection,
                            petSituation: this.petSituation,
                            profilePhoto: this.state.profilePhoto
                        }))
                    }
                }
            ],
            { cancelable: false }
        )
    }


    updatePet() {

        if (this.state.specieDropdownSelection === 'Selecione'
            || this.state.sizeDropdownSelection === 'Seleciione'
            || this.state.ageTypeDropdownSelection === 'D/M/A'
            || this.state.genderDropdownSelection === 'Selecione'
            || this.state.colorDropdownSelection === 'Selecione'
            || this.state.vaccinatedDropdownSelection === 'Selecione'
            || this.state.dewormedDropdownSelection === 'Selecione'
            || this.state.castratedDropdownSelection === 'Selecione'
            || this.name === null
            || this.ageAmount === null) {
            Alert.alert('', "Faltam informações.",
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }


        if (this.state.specieDropdownSelection === 'Cão' || this.state.specieDropdownSelection === 'Gato') {
            if (this.state.breedDropdownSelection === 'Selecione') {
                Alert.alert('', "Faltam informações.",
                    [
                        {
                            text: 'Ok', onPress: () => { }
                        }
                    ],
                    { cancelable: false }
                )
            }
        } else {
            this.state.breedDropdownSelection = '-'
        }

        this.setState({
            loading: true
        })

        if ((this.petSituation === 1) && ((FirebaseRequest.getCurrentUser().phone === '-' && FirebaseRequest.getCurrentUser().celphone === '-'))) {

            this.showTemporaryHomeAlert()

        } else{
            FirebaseRequest.updateUserPetProfile({
                name: this.name,
                ageAmount: this.ageAmount,
                ageType: this.state.ageTypeDropdownSelection,
                specie: this.state.specieDropdownSelection,
                breed: this.state.breedDropdownSelection,
                size: this.state.sizeDropdownSelection,
                gender: this.state.genderDropdownSelection,
                color: this.state.colorDropdownSelection,
                vaccinated: this.state.vaccinatedDropdownSelection,
                dewormed: this.state.dewormedDropdownSelection,
                castrated: this.state.castratedDropdownSelection,
                petSituation: this.petSituation,
                profilePhoto: this.state.profilePhoto

            }, this.oldPetSituation, this.props.data.key)
                .then(() => {
                    this.setState({
                        loading: false
                    })
                    this.props.backByNScenes(2)
                })
                .catch((err) => { console.error("Failed to update pet information, ", err.message) })

        }

    }

    removePet(){

        Alert.alert('', 'Deseja mesmo excluir este animal?',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {

                        this.setState({
                            removing: true
                        })

                        if (this.oldPetSituation === 0) {

                            FirebaseRequest.removeUserPet(this.props.data.key)
                                .then(() => {
                                    this.setState({
                                        removing: false
                                    })
                                    this.props.backByNScenes(2)

                                })
                                .catch((err) => {
                                    console.error("Error: ", err.message)
                                    Alert.alert('', "Erro ao excluir animal.",
                                        [
                                            {
                                                text: 'Ok', onPress: () => { }
                                            }
                                        ],
                                        { cancelable: false }
                                    )
                                    this.setState({
                                        removing: false
                                    })
                                })
                        } else {

                            FirebaseRequest.removeUserTemporaryHomePet(this.props.data.key)
                                .then(() => {
                                    this.setState({
                                        removing: false
                                    })
                                    this.props.backByNScenes(2)

                                })
                                .catch((err) => {
                                    console.error("Error: ", err.message)
                                    Alert.alert('', "Erro ao excluir animal.",
                                        [
                                            {
                                                text: 'Ok', onPress: () => { }
                                            }
                                        ],
                                        { cancelable: false }
                                    )
                                    this.setState({
                                        removing: false
                                    })
                                })
                        }


                    }
                }
            ],
            { cancelable: false }
        )


    }


    render() {

        return (
            <MenuContext style={{ flex: 1 }} ref="MenuContext" lazyRender={200}>
                <View style={styles.container}>
                    <ScrollView
                        ref="scrollView"
                        keyboardShouldPersistTaps="never"
                        automaticallyAdjustContentInsects={true}
                        alwaysBounceVertical={true}
                        style={styles.scrollView}
                    >
                        <View style={styles.rowContainer}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.profileImageContainer}
                                onPress={() => this.selectPhotoTapped()}
                            >
                                <Image
                                    source={{ uri: 'data:image/jpeg;base64,' + this.state.profilePhoto }}
                                    style={styles.profileImage}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.bigInfoText}>Nome</Text>
                            </View>
                        </View>
                        <View style={styles.innerContainer}>
                            <View style={styles.bigInputContainer}>
                                <TextInput
                                    placeholder={this.props.data.name}
                                    placeholderTextColor="white"
                                    maxLength={20}
                                    defaultValue={this.props.data.name}
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(name) => { this.name = name }}
                                    returnKeyType="go"
                                    onSubmitEditing={() => { }}
                                />
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.bigInfoText}>Idade</Text>
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <View style={styles.smallContainer}>
                                    <TextInput
                                        placeholder={this.props.data.ageAmount}
                                        keyboardType="numeric"
                                        placeholderTextColor="white"
                                        defaultValue={this.props.data.ageAmount}
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(ageAmount) => { this.ageAmount = ageAmount }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._qtdRef.focus()}
                                    />
                                </View>
                            </View>
                            <View style={styles.innerContainer}>
                                <Menu
                                    style={styles.dropdown3}
                                    onSelect={(value) => this.setState({ ageTypeDropdownSelection: value })}
                                >
                                    <MenuTrigger>
                                        <View style={styles.triggerView}>
                                            <Text style={styles.dropdownText3}>{this.state.ageTypeDropdownSelection}</Text>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions
                                        optionsContainerStyle={styles.rightDropdownOptions}
                                        renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                    >
                                        <MenuOption value="Dia(s)">
                                            <Text style={styles.dropdownText3}>Dia(s)</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Mês(meses)">
                                            <Text style={styles.dropdownText3}>Mês(meses)</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Ano(s)">
                                            <Text style={styles.dropdownText3}>Ano(s)</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Espécie</Text>
                                <Menu
                                    style={styles.dropdown3}
                                    onSelect={(value) => this.setState({ specieDropdownSelection: value })}
                                >
                                    <MenuTrigger>
                                        <View style={styles.triggerView}>
                                            <Text style={styles.dropdownText3}>{this.state.specieDropdownSelection}</Text>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions
                                        optionsContainerStyle={styles.leftDropdownOptions}
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
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Raça</Text>
                                {this.defineBreedDropdown()}
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Porte</Text>
                                <Menu
                                    style={styles.dropdown3}
                                    onSelect={(value) => this.setState({ sizeDropdownSelection: value })}
                                >
                                    <MenuTrigger>
                                        <View style={styles.triggerView}>
                                            <Text style={styles.dropdownText3}>{this.state.sizeDropdownSelection}</Text>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions
                                        optionsContainerStyle={styles.leftDropdownOptions}
                                        renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                    >
                                        <MenuOption value="Pequeno">
                                            <Text style={styles.dropdownText3}>Pequeno</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Médio">
                                            <Text style={styles.dropdownText3}>Médio</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Grande">
                                            <Text style={styles.dropdownText3}>Grande</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            </View>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Sexo</Text>
                                <Menu
                                    style={styles.dropdown3}
                                    onSelect={(value) => this.setState({ genderDropdownSelection: value })}
                                >
                                    <MenuTrigger>
                                        <View style={styles.triggerView}>
                                            <Text style={styles.dropdownText3}>{this.state.genderDropdownSelection}</Text>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions
                                        optionsContainerStyle={styles.rightDropdownOptions}
                                        renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                    >
                                        <MenuOption value="Macho">
                                            <Text style={styles.dropdownText3}>Macho</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Fêmea">
                                            <Text style={styles.dropdownText3}>Fêmea</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Cor</Text>
                                <Menu
                                    style={styles.dropdown3}
                                    onSelect={(value) => this.setState({ colorDropdownSelection: value })}
                                >
                                    <MenuTrigger>
                                        <View style={styles.triggerView}>
                                            <Text style={styles.dropdownText3}>{this.state.colorDropdownSelection}</Text>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions
                                        optionsContainerStyle={styles.leftDropdownOptions}
                                        renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                    >
                                        <MenuOption value="Preto">
                                            <Text style={styles.dropdownText3}>Preto</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Branco">
                                            <Text style={styles.dropdownText3}>Branco</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Cinza">
                                            <Text style={styles.dropdownText3}>Cinza</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Marrom">
                                            <Text style={styles.dropdownText3}>Marrom</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Misto">
                                            <Text style={styles.dropdownText3}>Misto</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Amarelo">
                                            <Text style={styles.dropdownText3}>Amarelo</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            </View>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Vacinado</Text>
                                <Menu
                                    style={styles.dropdown3}
                                    onSelect={(value) => this.setState({ vaccinatedDropdownSelection: value })}
                                >
                                    <MenuTrigger>
                                        <View style={styles.triggerView}>
                                            <Text style={styles.dropdownText3}>{this.state.vaccinatedDropdownSelection}</Text>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions
                                        optionsContainerStyle={styles.rightDropdownOptions}
                                        renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                    >
                                        <MenuOption value="Sim">
                                            <Text style={styles.dropdownText3}>Sim</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Não">
                                            <Text style={styles.dropdownText3}>Não</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Vermifugado</Text>
                                <Menu
                                    style={styles.dropdown3}
                                    onSelect={(value) => this.setState({ dewormedDropdownSelection: value })}
                                >
                                    <MenuTrigger>
                                        <View style={styles.triggerView}>
                                            <Text style={styles.dropdownText3}>{this.state.dewormedDropdownSelection}</Text>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions
                                        optionsContainerStyle={styles.leftDropdownOptions}
                                        renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                    >
                                        <MenuOption value="Sim">
                                            <Text style={styles.dropdownText3}>Sim</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Não">
                                            <Text style={styles.dropdownText3}>Não</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            </View>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Castrado</Text>
                                <Menu
                                    style={styles.dropdown3}
                                    onSelect={(value) => this.setState({ castratedDropdownSelection: value })}
                                >
                                    <MenuTrigger>
                                        <View style={styles.triggerView}>
                                            <Text style={styles.dropdownText3}>{this.state.castratedDropdownSelection}</Text>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions
                                        optionsContainerStyle={styles.rightDropdownOptions}
                                        renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                    >
                                        <MenuOption value="Sim">
                                            <Text style={styles.dropdownText3}>Sim</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                        <MenuOption value="Não">
                                            <Text style={styles.dropdownText3}>Não</Text>
                                            <View style={styles.separator}></View>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            </View>
                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.bigInfoText}>Situação</Text>
                        </View>
                        <SegmentedControlTab
                            values={['Meu Pet', 'Em lar temporário']}
                            selectedIndex={this.state.selectedIndex}
                            tabTextStyle={styles.tabTextStyle}
                            tabsContainerStyle={styles.tabContainerStyle}
                            tabStyle={styles.tabStyle}
                            activeTabStyle={styles.activeTabStyle}
                            onTabPress={index => {
                                this.petSituation = index
                                this.setState({
                                    selectedIndex: index
                                })
                            } }
                        />
                        <TouchableOpacity
                            style={styles.addButtonContainer}
                            activeOpacity={0.5}
                            onPress={() => this.updatePet()}
                        >
                            <View style={styles.addButton}>
                                <Text style={styles.addButtonText}>{this.state.loading ? 'Alterando...' : 'Alterar'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.removeButtonContainer}
                            activeOpacity={0.5}
                            onPress={() => this.removePet()}
                        >
                            <View style={styles.removeButton}>
                                <Text style={styles.removeButtonText}>{this.state.removing ? 'Excluindo...' : 'Excluir'}</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </MenuContext>

        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.primary
    },
    rowContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'center'
    },
    innerContainer: {
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 5
    },
    dropdown: {
        backgroundColor: StyleVars.Colors.secondary
    },
    dropdownText: {
        color: 'white',
        fontSize: 14
    },
    dropdownOption: {
        backgroundColor: StyleVars.Colors.secondary
    },
    addButtonContainer: {
        paddingHorizontal: 70,
        paddingVertical: 10,
        marginTop: 15
    },
    addButton: {
        borderRadius: 10,
        backgroundColor: '#003000',
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    addButtonText: {
        color: 'lime',
        fontSize: 20
    },
    removeButtonContainer: {
        paddingHorizontal: 70,
        paddingVertical: 10,
        marginBottom: 10
    },
    removeButton: {
        borderRadius: 10,
        backgroundColor: 'darkred',
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    removeButtonText: {
        color: 'red',
        fontSize: 20
    },
    dropdownStyle: {
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        width: windowWidth * 0.45,
        paddingVertical: 10,
        alignItems: 'center'
    },
    dropdown3: {
        width: windowWidth * 0.45,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftDropdownOptions: {
        marginTop: 42,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        width: windowWidth * 0.45,
        height: windowHeight * 0.2,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 5,
        position: 'absolute',
        left: windowWidth * 0.04
    },
    rightDropdownOptions: {
        marginTop: 42,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        width: windowWidth * 0.45,
        height: windowHeight * 0.2,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 5,
        position: 'absolute',
        right: windowWidth * 0.04
    },
    dropdownText3: {
        color: 'white',
        fontSize: 14
    },
    separator: {
        height: 0.5,
        marginTop: 5,
        backgroundColor: '#CCC',
    },
    triggerView: {
        width: windowWidth * 0.45,
        borderRadius: 10,
        alignItems: 'center'
    },
    input: {
        alignItems: 'center',
        height: 37,
        backgroundColor: StyleVars.Colors.secondary,
        color: 'white',
        fontSize: 14,
        borderRadius: 10,
        textAlign: 'center'
    },
    smallContainer: {
        width: windowWidth * 0.45,
    },
    bigInputContainer: {
        width: windowWidth * 0.8,
        paddingVertical: 10
    },
    bigInfoText: {
        color: 'white',
        fontSize: 18,
        marginTop: 3
    },
    tabContainerStyle: {
        paddingHorizontal: 20,
        marginTop: 15,

    },
    tabStyle: {
        backgroundColor: StyleVars.Colors.secondary,
        borderColor: 'rgba(255,255,255,0.5)'
    },
    activeTabStyle: {
        backgroundColor: StyleVars.Colors.primary
    },
    tabTextStyle: {
        color: "rgb(155, 157, 160)"
    },
    profileImageContainer: {
        width: windowWidth * 0.4,
        height: windowHeight * 0.3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImage: {
        width: 128,
        height: 128,
        borderRadius: 64
    },
    noPhotoBackground: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: StyleVars.Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    noPhotoBackgroundText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
    },
    disabledInput: {
        width: windowWidth * 0.45,
        backgroundColor: StyleVars.Colors.listViewBackground,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }

})