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
import Routes from '../navigation/Routes'
import AnnouncerModal from '../components/AnnouncerModal'
import ONGModal from '../components/ONGModal'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class PetServicesScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            country: "Selecione",
            estate: "Selecione",
            city: "Selecione",
            district: "Selecione",

            announcerModalVisible: false,
            ongModalVisible: false,

            ratingDropdownSelection: 'Selecione',
            typeDropdownSelection: 'Selecione',
            cityDropdownSelection: 'Selecione'
        }

    }

    showAnnouncerModal(){
        this.setState({
            announcerModalVisible: true
        })
    }

    showONGModal(){
        this.setState({
            ongModalVisible: true
        })
    }

    hideModals(){
        this.setState({
            announcerModalVisible: false,
            ongModalVisible: false
        })
    }

    goToAnnouncerArea(){
        this.hideModals()
        this.props.toRoute(Routes.announcerLogin())
    }

    goToGroupArea(){
        this.hideModals()
        this.props.toRoute(Routes.ongLogin())
    }

    defineFilters(isSaleSelected){

        var activityFilter = null
        var ratingFilter = null
        var cityFilter = null
        var stateFilter = null
        var districtFilter = null
        var filterCount = 0
        var saleFilter = null

        if(this.state.typeDropdownSelection !== "Selecione"){
            activityFilter = this.state.typeDropdownSelection
            filterCount++
        }

        if(this.state.ratingDropdownSelection !== "Selecione"){
            ratingFilter = this.state.ratingDropdownSelection
            filterCount++
        }

        if (this.state.cityDropdownSelection !== "Selecione") {
            cityFilter = this.state.cityDropdownSelection
            filterCount++
        }

        if (this.state.district !== "Selecione") {
            if (this.state.district.length > 1){
                console.warn(this.state.district.length)
                districtFilter = this.state.district
                filterCount++
            }
        }

        if (this.state.estate !== "Selecione"){
            if(this.state.estate.length > 1){
                stateFilter = this.state.estate
                filterCount++
            } 
        }

        if(isSaleSelected){
            saleFilter = true,
            filterCount++
        }


        this.props.toRoute(Routes.petServicesSearch({
            activityFilter: activityFilter,
            ratingFilter: ratingFilter,
            cityFilter: cityFilter,
            stateFilter: stateFilter,
            countryFilter: null,
            districtFilter: districtFilter,
            saleFilter: saleFilter,
            filterCount: filterCount
        }))

    }

    render(){


        return(
            <MenuContext style={{flex:1}} ref="MenuContext" lazyRender={200}>
                <View style={styles.container}>
                    <View style={styles.rowContainer}>
                        <View style={styles.innerContainer}>              
                            <Text style={styles.infoText}>País</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder={"Selecione"}
                                    placeholderTextColor="white"
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(country) => { this.state.country = country }}
                                    returnKeyType="next"
                                    onSubmitEditing={() => { }}
                                />
                            </View>
                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Estado</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder={"Selecione"}
                                    placeholderTextColor="white"
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(estate) => { this.state.estate = estate }}
                                    returnKeyType="next"
                                    onSubmitEditing={() => { }}
                                />
                            </View>    
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Cidade</Text>
                            <Menu
                                style={styles.dropdown3}
                                onSelect={(value) => this.setState({ cityDropdownSelection: value })}
                            >
                                <MenuTrigger>
                                    <View style={styles.triggerView}>
                                        <Text style={styles.dropdownText3}>{this.state.cityDropdownSelection}</Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions
                                    optionsContainerStyle={styles.dropdownOptions}
                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                >
                                    <MenuOption value="Rio de Janeiro">
                                        <Text style={styles.dropdownText3}>Rio de Janeiro</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Belo Horizonte">
                                        <Text style={styles.dropdownText3}>Belo Horizonte</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="São Paulo">
                                        <Text style={styles.dropdownText3}>São Paulo</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                               </MenuOptions>
                            </Menu>
                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Bairro</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder={"Selecione"}
                                    placeholderTextColor="white"
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(district) => { this.state.district = district }}
                                    returnKeyType="next"
                                    onSubmitEditing={() => { }}
                                />
                            </View>  
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Tipo</Text>
                            <Menu 
                                style={styles.dropdown3}
                                onSelect={(value) => this.setState({typeDropdownSelection: value})}
                            >
                                <MenuTrigger>
                                    <View style={styles.triggerView}>
                                        <Text style={styles.dropdownText3}>{this.state.typeDropdownSelection}</Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions 
                                    optionsContainerStyle={styles.dropdownOptions}
                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                >
                                    <MenuOption value="Pet Shop">
                                        <Text style={styles.dropdownText3}>Pet Shop</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Veterinário">
                                        <Text style={styles.dropdownText3}>Veterinário</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Clínica Veterinária">
                                        <Text style={styles.dropdownText3}>Clínica Veterinária</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Consultório Veterinário">
                                        <Text style={styles.dropdownText3}>Consultório Veterinário</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Hospital Veterinário">
                                        <Text style={styles.dropdownText3}>Hospital Veterinário</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Resgate">
                                        <Text style={styles.dropdownText3}>Resgate</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Passeador">
                                        <Text style={styles.dropdownText3}>Passeador</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Fotografia">
                                        <Text style={styles.dropdownText3}>Fotografia</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Salão de Beleza">
                                        <Text style={styles.dropdownText3}>Salão de Beleza</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Hotel/Day Care">
                                        <Text style={styles.dropdownText3}>Hotel/Day Care</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Cemitério/Crematório">
                                        <Text style={styles.dropdownText3}>Cemitério/Crematório</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Adestrador">
                                        <Text style={styles.dropdownText3}>Adestrador</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Acessórios e Roupas Pet">
                                        <Text style={styles.dropdownText3}>Acessórios e Roupas Pet</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Transporte e Acessórios">
                                        <Text style={styles.dropdownText3}>Transporte e Acessórios</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="ONG/OSCIPS/Grupo de Proteção Animal">
                                        <Text style={styles.dropdownText3}>ONG/OSCIPS/Grupo de Proteção Animal</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Pet Sitting">
                                        <Text style={styles.dropdownText3}>Pet Sitting</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Creche">
                                        <Text style={styles.dropdownText3}>Creche</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Terapia">
                                        <Text style={styles.dropdownText3}>Terapia</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Eventos">
                                        <Text style={styles.dropdownText3}>Eventos</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Buffets">
                                        <Text style={styles.dropdownText3}>Buffets</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Plano de Saúde">
                                        <Text style={styles.dropdownText3}>Plano de Saúde</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Fisioterapia">
                                        <Text style={styles.dropdownText3}>Fisioterapia</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Acampamento/Clube">
                                        <Text style={styles.dropdownText3}>Acampamento/Clube</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Groomer">
                                        <Text style={styles.dropdownText3}>Groomer</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Mobiliário e Decoração Pet">
                                        <Text style={styles.dropdownText3}>Mobiliário e Decoração Pet</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Higiene/Saúde/Beleza">
                                        <Text style={styles.dropdownText3}>Higiene/Saúde/Beleza</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Brinquedos e Jogos para Pets">
                                        <Text style={styles.dropdownText3}>Brinquedos e Jogos para Pets</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Alimentos e Acessórios">
                                        <Text style={styles.dropdownText3}>Alimentos e Acessórios</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Literatura">
                                        <Text style={styles.dropdownText3}>Literatura</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Acupuntura">
                                        <Text style={styles.dropdownText3}>Acupuntura</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Centro de Diagnóstico">
                                        <Text style={styles.dropdownText3}>Centro de Diagnóstico</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Especialidades Médicas">
                                        <Text style={styles.dropdownText3}>Especialidades Médicas</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Farmácia">
                                        <Text style={styles.dropdownText3}>Farmácia</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Homeopatia">
                                        <Text style={styles.dropdownText3}>Homeopatia</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Academia/Esporte">
                                        <Text style={styles.dropdownText3}>Academia/Esporte</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Avaliação</Text>
                            <Menu 
                                style={styles.dropdown3}
                                onSelect={(value) => this.setState({ratingDropdownSelection: value})}
                            >
                                <MenuTrigger>
                                    <View style={styles.triggerView}>
                                        <Text style={styles.dropdownText3}>{this.state.ratingDropdownSelection}</Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions 
                                    optionsContainerStyle={styles.dropdownOptions}
                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                >
                                    <MenuOption value="1">
                                        <Text style={styles.dropdownText3}>1</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="2">
                                        <Text style={styles.dropdownText3}>2</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="3">
                                        <Text style={styles.dropdownText3}>3</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="4">
                                        <Text style={styles.dropdownText3}>4</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="5">
                                        <Text style={styles.dropdownText3}>5</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                    </View>
                    <View style={styles.searchButtonContainer}>
                        <TouchableOpacity style={styles.searchButton}
                            activeOpacity={0.5}
                            onPress={() => this.defineFilters(false)}  
                        >
                            <Image 
                                    source={require("../Resources/searchIcon.png")}
                                    style={styles.searchIcon}
                                    resizeMode='contain'
                            />
                            <Text style={styles.searchButtonText}>Pesquisar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.saleButtonContainer}>
                            <TouchableOpacity 
                                style={styles.saleButton}
                                activeOpacity={0.5}
                                onPress={() => this.defineFilters(true)}
                            >
                                <Text style={styles.saleButtonText}>Destaques Pet</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.favouriteButtonContainer}>
                            <TouchableOpacity 
                                style={styles.favouriteButton}
                                activeOpacity={0.5}
                                onPress={() => this.props.toRoute(Routes.myFavouritesPetServices())} 
                            >
                                <Text style={styles.favouriteButtonText}>Meus Favoritos</Text>
                            </TouchableOpacity>
                        </View>   
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.announcerButtonContainer}>
                            <TouchableOpacity 
                                style={styles.announcerButton}
                                activeOpacity={0.5}
                                onPress={() => { this.showAnnouncerModal() }} 
                            >
                                <Text style={styles.announcerButtonText}>Espaço</Text>
                                <Text style={styles.announcerButtonText}>Anunciante</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.ongButtonContainer} >
                            <TouchableOpacity 
                                style={styles.ongButton}
                                activeOpacity={0.5}
                                onPress={() => { this.showONGModal() }}
                            >
                                <Text style={styles.ongButtonText}>Espaço</Text>
                                <Text style={styles.ongButtonText}>ONG/Grupos</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <AnnouncerModal
                        visible={this.state.announcerModalVisible}
                        hideModals={() => this.hideModals()}
                        goToAnnouncerArea={() => this.goToAnnouncerArea()}
                    />
                    <ONGModal
                        visible={this.state.ongModalVisible}
                        hideModals={() => this.hideModals()}
                        goToGroupArea={() => this.goToGroupArea()}
                    />
                </View>
            </MenuContext>
            
        )
    }


}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: StyleVars.Colors.primary
    },
    rowContainer:{
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'center'
    },
    innerContainer:{
        paddingHorizontal: 5
    },
    infoText:{
        color: 'white',
        fontSize: 16,
        marginBottom: 5
    },
    dropdown:{
        backgroundColor: StyleVars.Colors.secondary
    },
    dropdownText:{
        color: 'white',
        fontSize: 14
    },
    dropdownOption:{
        backgroundColor: StyleVars.Colors.secondary
    },
    assinatureText:{
        textAlign: 'right',
        marginLeft: windowWidth * 0.8,
        color: 'white',
        fontSize: 14
    },
    searchButtonContainer:{
        paddingHorizontal: 70,
        paddingVertical: 10,
        marginTop: 15
    },
    searchButton: {
        borderRadius: 10,
        backgroundColor: 'grey',
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    searchButtonText:{
        color: 'white',
        fontSize: 20
    },
    favouriteButtonContainer:{
        paddingHorizontal: 8,
        paddingVertical: 5
    },
    favouriteButton: {
        borderRadius: 10,
        backgroundColor: 'navy',
        width: windowWidth * 0.4,
        paddingVertical: 15,
        alignItems: 'center'
    },
    favouriteButtonText:{
        color: 'dodgerblue',
        fontSize: 16
    },
    saleButtonContainer: {
        paddingHorizontal: 8,
        paddingVertical: 5
    },
    saleButton: {
        borderRadius: 10,
        backgroundColor: 'darkgreen',
        width: windowWidth * 0.4,
        paddingVertical: 15,
        alignItems: 'center'
    },
    saleButtonText: {
        color: 'lime',
        fontSize: 16
    },
    popoverStyle:{
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        padding: 3,
        margin: 10
    },
    popoverText:{
        color: 'white',
        fontSize: 14,
        margin: 10
    },
    dropdownStyle:{
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        width: windowWidth * 0.45,
        paddingVertical: 10,
        alignItems: 'center'

    },
    dropdownText2: {
        color: "white",
        fontSize: 14
    },
    announcerButtonContainer:{
        paddingHorizontal: 8,
        paddingVertical: 5
    },
    announcerButton: {
        borderRadius: 10,
        backgroundColor: 'rgb(103,46,1)',
        width: windowWidth * 0.4,
        paddingVertical: 10,
        alignItems: 'center'
    },
    announcerButtonText:{
        color: 'orange',
        fontSize: 16
    },
    ongButtonContainer:{
        paddingHorizontal: 8,
        paddingVertical: 5
    },
    ongButton: {
        borderRadius: 10,
        backgroundColor: 'darkgoldenrod',
        width: windowWidth * 0.4,
        paddingVertical: 10,
        alignItems: 'center'
    },
    ongButtonText:{
        color: 'yellow',
        fontSize: 16
    },
    searchIcon:{
        width: windowWidth * 0.05,
        height: windowHeight * 0.05,
        marginRight: 20
    },

    dropdown3:{
        width: windowWidth * 0.45,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dropdownOptions:{
        marginTop: 42,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        width: windowWidth * 0.45,
        height: windowHeight * 0.2,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 5
    },
    dropdownText3:{
        color: 'white',
        fontSize: 14
    },
    separator: {
        height: 0.5,
        marginTop: 5,
        backgroundColor: '#CCC',
    },
    triggerView:{
        width: windowWidth * 0.45,
        borderRadius: 10,
        alignItems: 'center'
    },
    inputContainer:{
        width: windowWidth * 0.45,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
    },
    input:{
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        height: windowHeight * 0.065,
    }
})