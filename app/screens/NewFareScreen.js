'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
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
import FirebaseRequest from '../Firebase/FirebaseRequest'
import FarePaymentModal from '../components/FarePaymentModal'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var selectedAnimals = []

export default class NewFareScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            startingTimeDropdownSelection: 'Selecione',
            endingTimeDropdownSelection: 'Selecione',
            paymentModalVisible: false,
            creatingFare: false,
            notes: null,
        }
    }

    showSalePaymentModal() {

        if (this.state.startingTimeDropdownSelection === 'Selecione' ||
            this.state.endingTimeDropdownSelection === 'Selecione') {
            Alert.alert('', "Faltam informações",
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }

        if(selectedAnimals.length === 0){
            Alert.alert('', "Nenhum animal selecionado",
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }

        this.setState({
            paymentModalVisible: true
        })
    }

    hideModals() {
        this.setState({
            paymentModalVisible: false
        })
    }

    addAnimalToArray = (selectedAnimal) => {

        selectedAnimals.push(selectedAnimal)

    }

    removeAnimalFromArray = (selectedAnimal) => {

        var index = null

        for (var i = 0; i < selectedAnimals.length; i++){
            if(selectedAnimals[i].key === selectedAnimal.key){
                index = i
                break
            }
        }

        if(index !== null){
            selectedAnimals.splice(index,1)
        }

    }


    acceptPayment(){

        this.hideModals()
        this.addNewFare()
    }
    
    addNewFare(){

        this.setState({
            creatingFare: true
        })

        let currentDate = new Date()

        var startingTimeSelected = this.state.startingTimeDropdownSelection
        var endingTimeSelected = this.state.endingTimeDropdownSelection

        navigator.geolocation.getCurrentPosition((position) => {

            FirebaseRequest.addNewFarePin({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                creationDay: currentDate.getDate(),
                creationMonth: currentDate.getMonth() + 1,
                creationYear: currentDate.getFullYear(),
                startingTime: startingTimeSelected,
                endingTime: endingTimeSelected,
                type: 7
            },selectedAnimals)
            .then(() => {
                this.setState({
                    creatingFare: false
                })

                this.props.back()
            })
            .catch((err) => {
                alert('Erro ao criar feira.')
                this.setState({
                    creatingFare: false
                })
            })

        },
            (error) => alert(JSON.stringify(error)),
            { enableHighAccuracy: true }
        )
    }

    render(){

        return(
            <MenuContext style={{flex:1}} ref="MenuContext" lazyRender={200}>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Horário de Início</Text>
                            <Menu 
                                style={styles.dropdown}
                                onSelect={(value) => this.setState({startingTimeDropdownSelection: value})}
                            >
                                <MenuTrigger>
                                    <View style={styles.triggerView}>
                                        <Text style={styles.dropdownText}>{this.state.startingTimeDropdownSelection}</Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions 
                                    optionsContainerStyle={styles.dropdownOptions}
                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                >
                                    <MenuOption value="7:00">
                                        <Text style={styles.dropdownText}>7:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="8:00">
                                        <Text style={styles.dropdownText}>8:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="9:00">
                                        <Text style={styles.dropdownText}>9:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="10:00">
                                        <Text style={styles.dropdownText}>10:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="12:00">
                                        <Text style={styles.dropdownText}>12:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="13:00">
                                        <Text style={styles.dropdownText}>13:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="14:00">
                                        <Text style={styles.dropdownText}>14:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="15:00">
                                        <Text style={styles.dropdownText}>15:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="16:00">
                                        <Text style={styles.dropdownText}>16:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="17:00">
                                        <Text style={styles.dropdownText}>17:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="18:00">
                                        <Text style={styles.dropdownText}>18:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="19:00">
                                        <Text style={styles.dropdownText}>19:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="20:00">
                                        <Text style={styles.dropdownText}>20:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="21:00">
                                        <Text style={styles.dropdownText}>21:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="22:00">
                                        <Text style={styles.dropdownText}>22:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="23:00">
                                        <Text style={styles.dropdownText}>23:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="00:00">
                                        <Text style={styles.dropdownText}>00:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                    </View>
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Horário de Término</Text>
                        <Menu 
                            style={styles.dropdown}
                            onSelect={(value) => this.setState({endingTimeDropdownSelection: value})}
                        >
                            <MenuTrigger>
                                <View style={styles.triggerView}>
                                    <Text style={styles.dropdownText}>{this.state.endingTimeDropdownSelection}</Text>
                                </View>
                            </MenuTrigger>
                            <MenuOptions 
                                optionsContainerStyle={styles.dropdownOptions}
                                renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                            >
                                <MenuOption value="7:00">
                                    <Text style={styles.dropdownText}>7:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="8:00">
                                    <Text style={styles.dropdownText}>8:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="9:00">
                                    <Text style={styles.dropdownText}>9:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="10:00">
                                    <Text style={styles.dropdownText}>10:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="12:00">
                                    <Text style={styles.dropdownText}>12:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="13:00">
                                    <Text style={styles.dropdownText}>13:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="14:00">
                                    <Text style={styles.dropdownText}>14:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="15:00">
                                    <Text style={styles.dropdownText}>15:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="16:00">
                                    <Text style={styles.dropdownText}>16:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="17:00">
                                    <Text style={styles.dropdownText}>17:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="18:00">
                                    <Text style={styles.dropdownText}>18:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="19:00">
                                    <Text style={styles.dropdownText}>19:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="20:00">
                                    <Text style={styles.dropdownText}>20:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="21:00">
                                    <Text style={styles.dropdownText}>21:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="22:00">
                                    <Text style={styles.dropdownText}>22:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="23:00">
                                    <Text style={styles.dropdownText}>23:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                                <MenuOption value="00:00">
                                    <Text style={styles.dropdownText}>00:00</Text>
                                    <View style={styles.separator}></View>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                    <Text style={styles.adviceText}>A feira será criada em sua localização atual e ficará ativa no mapa até as 00:00 horas do próximo dia.</Text>
                <TouchableOpacity 
                        style={styles.animalsButtonContainer}
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.selectFareAnimal(this.addAnimalToArray,this.removeAnimalFromArray))}    
                    >
                        <View style={styles.animalsButton}>
                            <Text style={styles.animalsButtonText}>Animais Presentes</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.newFareButtonContainer}
                        activeOpacity={0.5}   
                        onPress={() => this.showSalePaymentModal()} 
                    >
                        <View style={styles.newFareButton}>
                            <Text style={styles.newFareButtonText}>{this.state.creatingFare ? 'Criando...' : 'Criar Feira'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <FarePaymentModal
                    visible={this.state.paymentModalVisible}
                    hideModals={() => this.hideModals()}
                    acceptPayment={() => this.acceptPayment()}
                />
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
        flex: 1
    },
    innerContainer:{
        paddingHorizontal: 5,
        alignItems: 'center',
        paddingVertical: 20,
        flex: 1
    },
    infoText:{
        color: 'white',
        fontSize: 20,
        marginBottom: 5
    },
    adviceText:{
         color: 'white',
        fontSize: 14,
        marginTop: 15,
        textAlign: 'center',
        paddingHorizontal: 15
    },
    
    assinatureText:{
        textAlign: 'right',
        marginLeft: windowWidth * 0.8,
        color: 'white',
        fontSize: 14
    },
    animalsButtonContainer:{
        paddingHorizontal: 60,
        paddingVertical: 10,
        marginTop: 15
    },
    animalsButton: {
        borderRadius: 10,
        backgroundColor: 'navy',
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    animalsButtonText:{
        color: 'dodgerblue',
        fontSize: 20
    },
    newFareButtonContainer:{
        paddingHorizontal: 60,
        paddingVertical: 15
    },
    newFareButton: {
        borderRadius: 10,
        backgroundColor: 'darkgreen',
        padding: 10,
        alignItems: 'center'
    },
    newFareButtonText:{
        color: 'lime',
        fontSize: 20
    },
    dropdown:{
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        width: windowWidth * 0.8,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 10
    },
    dropdownOptions:{
        marginTop: 42,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        width: windowWidth * 0.8,
        height: windowHeight * 0.28,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 5
    },
    dropdownText:{
        color: 'white',
        fontSize: 16
    },
    separator: {
        height: 0.5,
        marginTop: 5,
        backgroundColor: '#CCC',
    },
    triggerView:{
        width: windowWidth * 0.8,
        borderRadius: 10,
        alignItems: 'center'
    }
})