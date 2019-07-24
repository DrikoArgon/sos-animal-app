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
import Routes from '../navigation/Routes'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class AdoptPetScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            country: "Selecione",
            estate: "Selecione",
            city: "Selecione",
            district: "Selecione",

            specieDropdownSelection: 'Selecione',
            genderDropdownSelection: 'Selecione'
        }
    }


    defineFilters() {

        var specieFilter = null
        var genderFilter = null
        var cityFilter = null
        var stateFilter = null
        var countryFilter = null
        var districtFilter = null
        var filterCount = 0

        if (this.state.specieDropdownSelection !== "Selecione") {
            specieFilter = this.state.specieDropdownSelection
            filterCount++
        }

        if (this.state.genderDropdownSelection !== "Selecione") {
            genderFilter = this.state.genderDropdownSelection
            filterCount++
        }

        if (this.state.city !== "Selecione") {
            if (this.state.city.length > 1) {
                cityFilter = this.state.city
                filterCount++
            }
        }

        if (this.state.estate !== "Selecione") {
            if (this.state.estate.length > 1) {
                stateFilter = this.state.estate
                filterCount++
            }
        }

        if (this.state.country !== "Selecione") {
            if (this.state.country.length > 1) {
                countryFilter = this.state.country
                filterCount++
            }
        }

        if(filterCount === 0){
            Alert.alert('','Por favor, filtre por pelo menos uma categoria.',
                [
                    {
                        text: 'Ok', onPress: () => {}
                    }
                ],
                { cancelable: false }
            )
        } else {

            this.props.toRoute(Routes.petsToAdopt({
                specieFilter: specieFilter,
                genderFilter: genderFilter,
                cityFilter: cityFilter,
                stateFilter: stateFilter,
                countryFilter: countryFilter,
                districtFilter: districtFilter,
                filterCount: filterCount
            }))
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
                        <View style={styles.infosContainer}>
                            <View style={styles.rowContainer}>
                                <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>País</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder={"Selecione"}
                                            placeholderTextColor="white"
                                            selectionColor="white"
                                            style={styles.input}
                                            autoCapitalize="words"
                                            autoCorrect={false}
                                            onChangeText={(country) => { this.state.country = country }}
                                            returnKeyType="next"
                                            onSubmitEditing={() => { }}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.innerContainer}>
                                    <Text style={styles.infoText}>Estado ou Sigla do Estado</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder={"Selecione"}
                                            placeholderTextColor="white"
                                            selectionColor="white"
                                            style={styles.input}
                                            autoCapitalize="characters"
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
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder={"Selecione"}
                                            placeholderTextColor="white"
                                            selectionColor="white"
                                            style={styles.input}
                                            autoCapitalize="words"
                                            autoCorrect={false}
                                            onChangeText={(city) => { this.state.city = city }}
                                            returnKeyType="next"
                                            onSubmitEditing={() => { }}
                                        />
                                    </View> 
                                </View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={styles.innerContainer}>
                                    <Text style={styles.infoText}>Espécie</Text>
                                    <Menu 
                                        style={styles.dropdown3}
                                        onSelect={(value) => this.setState({specieDropdownSelection: value})}
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
                                                <Text style={styles.dropdownText3}>Ave</Text>
                                                <View style={styles.separator}></View>
                                            </MenuOption>
                                            <MenuOption value="Cão">
                                                <Text style={styles.dropdownText3}>Cão</Text>
                                                <View style={styles.separator}></View>
                                            </MenuOption>
                                            <MenuOption value="Cavalo">
                                                <Text style={styles.dropdownText3}>Cavalo</Text>
                                                <View style={styles.separator}></View>
                                            </MenuOption>
                                            <MenuOption value="Coelho">
                                                <Text style={styles.dropdownText3}>Coelho</Text>
                                                <View style={styles.separator}></View>
                                            </MenuOption>
                                            <MenuOption value="Gato">
                                                <Text style={styles.dropdownText3}>Gato</Text>
                                                <View style={styles.separator}></View>
                                            </MenuOption>
                                            <MenuOption value="Mamífero">
                                                <Text style={styles.dropdownText3}>Mamífero</Text>
                                                <View style={styles.separator}></View>
                                            </MenuOption>
                                            <MenuOption value="Peixe">
                                                <Text style={styles.dropdownText3}>Peixe</Text>
                                                <View style={styles.separator}></View>
                                            </MenuOption>
                                            <MenuOption value="Suíno">
                                                <Text style={styles.dropdownText3}>Suíno</Text>
                                                <View style={styles.separator}></View>
                                            </MenuOption>
                                            <MenuOption value="Réptil">
                                                <Text style={styles.dropdownText3}>Réptil</Text>
                                                <View style={styles.separator}></View>
                                            </MenuOption>
                                            <MenuOption value="Roedor">
                                                <Text style={styles.dropdownText3}>Roedor</Text>
                                                <View style={styles.separator}></View>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu>
                                </View>
                                <View style={styles.innerContainer}>
                                    <Text style={styles.infoText}>Sexo</Text>
                                    <Menu 
                                        style={styles.dropdown3}
                                        onSelect={(value) => this.setState({genderDropdownSelection: value})}
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
                            <View style={styles.innerContainer}>
                                <Text style={[styles.infoText, {textAlign: 'center',marginTop:20}]}>"A beleza agrada aos olhos, mas a doçura das ações que encanta a alma"</Text>
                                <Text style={styles.assinatureText}>Voltaire</Text>
                            </View>
                        <TouchableOpacity 
                                style={styles.searchButtonContainer}
                                activeOpacity={0.5}
                                onPress={() => this.defineFilters()}    
                            >
                                <View style={styles.searchButton}>
                                    <Image 
                                            source={require("../Resources/searchIcon.png")}
                                            style={styles.searchIcon}
                                            resizeMode='contain'
                                    />
                                    <Text style={styles.searchButtonText}>Pesquisar</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.favouriteButtonContainer}
                                activeOpacity={0.5}   
                                onPress={() => this.props.toRoute(Routes.myFavouriteAdoptPet())} 
                            >
                                <View style={styles.favouriteButton}>
                                    <Text style={styles.favouriteButtonText}>Meus Favoritos</Text>
                                </View>
                            </TouchableOpacity>
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
        backgroundColor: StyleVars.Colors.primary
    },
    rowContainer:{
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
       
    },
    infosContainer:{
        marginTop: 5
    },
    innerContainer:{
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
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
        paddingVertical: 15
    },
    searchButton: {
        borderRadius: 10,
        backgroundColor: 'sienna',
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
        paddingHorizontal: 80,
        paddingVertical: 5
    },
    favouriteButton: {
        borderRadius: 10,
        backgroundColor: 'navy',
        padding: 10,
        alignItems: 'center'
    },
    favouriteButtonText:{
        color: 'white',
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
    rightDropdownOptions:{
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
    inputContainer: {
        width: windowWidth * 0.9,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
    },
    input: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        height: windowHeight * 0.06,
    }
})