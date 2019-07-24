'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    AsyncStorage
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class MapFiltersScreen extends Component{


    constructor(props){
        super(props)


        this.state = {
            animalStreetActive: true,
            temporaryHomeActive: true,
            runawayAnimalActive: true,
            freeRideActive: true,
            milkEmptyActive: true,
            milkFullActive: true

        }
    }

    componentDidMount(){

        var isStreetAnimalActive = true
        var isTemporaryHomeActive = true
        var isRunawayAnimalActive = true
        var isFreeRideActive = true
        var isMilkEmptyActive = true
        var isMilkFullActive = true

        AsyncStorage.getItem('SHOW_STREET_ANIMAL')
            .then((streetAnimalFilter) => {
                if (streetAnimalFilter) {
                    isStreetAnimalActive = JSON.parse(streetAnimalFilter)
                }
                AsyncStorage.getItem('SHOW_TEMPORARY_HOME')
                    .then((temporaryHomeFilter) => {
                        if (temporaryHomeFilter) {
                            isTemporaryHomeActive = JSON.parse(temporaryHomeFilter)
                        }
                        AsyncStorage.getItem('SHOW_RUNAWAY_ANIMAL')
                            .then((runawayAnimalFilter) => {
                                if (runawayAnimalFilter) {
                                    isRunawayAnimalActive = JSON.parse(runawayAnimalFilter)
                                }
                                AsyncStorage.getItem('SHOW_FREE_RIDE')
                                    .then((freeRideFilter) => {
                                        if (freeRideFilter) {
                                            isFreeRideActive = JSON.parse(freeRideFilter)
                                        }
                                        AsyncStorage.getItem('SHOW_MILK_EMPTY')
                                            .then((milkEmptyFilter) => {
                                                if (milkEmptyFilter) {
                                                    isMilkEmptyActive = JSON.parse(milkEmptyFilter)
                                                }
                                                AsyncStorage.getItem('SHOW_MILK_FULL')
                                                    .then((milkFullFilter) => {
                                                        if (milkFullFilter) {
                                                            isMilkFullActive = JSON.parse(milkFullFilter)
                                                        }

                                                        this.setState({
                                                            animalStreetActive: isStreetAnimalActive,
                                                            temporaryHomeActive: isTemporaryHomeActive,
                                                            runawayAnimalActive: isRunawayAnimalActive,
                                                            freeRideActive: isFreeRideActive,
                                                            milkEmptyActive: isMilkEmptyActive,
                                                            milkFullActive: isMilkFullActive
                                                        })
                                                    })
                                            })
                                    })
                            })
                    })
            })
    }

    changeActivationStatus(id){
        switch(id){
            case 1:
                this.setState({
                    animalStreetActive: !this.state.animalStreetActive
                 })
                AsyncStorage.getItem('SHOW_STREET_ANIMAL')
                    .then((streetAnimalFilter) => {
                        if (streetAnimalFilter) {
                            var filterValue = JSON.parse(streetAnimalFilter)
                            console.log('Filter  current value: ', filterValue)
                            console.log('Filter value after: ', !filterValue)
                            AsyncStorage.setItem('SHOW_STREET_ANIMAL', JSON.stringify(!filterValue))
                        } else {
                            console.log("Street animal filter é nulo")
                            AsyncStorage.setItem('SHOW_STREET_ANIMAL', JSON.stringify(false))
                        }
                    })
                break
            case 2:
                this.setState({
                    temporaryHomeActive: !this.state.temporaryHomeActive
                 })
                AsyncStorage.getItem('SHOW_TEMPORARY_HOME')
                    .then((temporaryHomeFilter) => {
                        if (temporaryHomeFilter) {
                            var filterValue = JSON.parse(temporaryHomeFilter)
                            AsyncStorage.setItem('SHOW_TEMPORARY_HOME', JSON.stringify(!filterValue))
                        } else {
                            AsyncStorage.setItem('SHOW_TEMPORARY_HOME', JSON.stringify(false))
                        }
                    })
                break
            case 3:
                this.setState({
                    runawayAnimalActive: !this.state.runawayAnimalActive
                 })
                AsyncStorage.getItem('SHOW_RUNAWAY_ANIMAL')
                    .then((runawayAnimalFilter) => {
                        if (runawayAnimalFilter) {
                            var filterValue = JSON.parse(runawayAnimalFilter)
                            AsyncStorage.setItem('SHOW_RUNAWAY_ANIMAL', JSON.stringify(!filterValue))
                        } else {
                            AsyncStorage.setItem('SHOW_RUNAWAY_ANIMAL', JSON.stringify(false))
                        }
                    })
                break
            case 4:
                this.setState({
                    freeRideActive: !this.state.freeRideActive
                 })
                AsyncStorage.getItem('SHOW_FREE_RIDE')
                    .then((freeRideFilter) => {
                        if (freeRideFilter) {
                            var filterValue = JSON.parse(freeRideFilter)
                            AsyncStorage.setItem('SHOW_FREE_RIDE', JSON.stringify(!filterValue))
                        } else {
                            AsyncStorage.setItem('SHOW_FREE_RIDE', JSON.stringify(false))
                        }
                    })
                break
            case 5:
                this.setState({
                    milkEmptyActive: !this.state.milkEmptyActive
                 })
                AsyncStorage.getItem('SHOW_MILK_EMPTY')
                    .then((milkEmptyFilter) => {
                        if (milkEmptyFilter) {
                            var filterValue = JSON.parse(milkEmptyFilter)
                            AsyncStorage.setItem('SHOW_MILK_EMPTY', JSON.stringify(!filterValue))
                        } else {
                            AsyncStorage.setItem('SHOW_MILK_EMPTY', JSON.stringify(false))
                        }
                    })
                break
            case 6:
                this.setState({
                    milkFullActive: !this.state.milkFullActive
                 })
                AsyncStorage.getItem('SHOW_MILK_FULL')
                    .then((milkFullFilter) => {
                        if (milkFullFilter) {
                            var filterValue = JSON.parse(milkFullFilter)
                            AsyncStorage.setItem('SHOW_MILK_FULL', JSON.stringify(!filterValue))
                        } else {
                            AsyncStorage.setItem('SHOW_MILK_FULL', JSON.stringify(false))
                        }
                    })
                break
                
        }
    }


    render(){

        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.innerContainer}
                    activeOpacity={0.5}
                    onPress={() => this.changeActivationStatus(1)}
                >
                    <Image 
                        source={require("../Resources/animalStreetIcon.png")}
                        style={styles.rowIcon}
                        resizeMode='contain'
                    />
                    <Text style={styles.pinDescriptionText}>Animal na Rua</Text>
                    {this.state.animalStreetActive ? 
                        (
                            <Image 
                                source={require("../Resources/check.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        ) 
                        : 
                        (
                            <Image 
                                source={require("../Resources/x.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        )
                    }
                </TouchableOpacity>
                <TouchableOpacity style={styles.innerDarkContainer}
                    activeOpacity={0.5}
                    onPress={() => this.changeActivationStatus(2)}
                >
                    <Image 
                        source={require("../Resources/temporaryHomeIcon.png")}
                        style={styles.rowIcon}
                        resizeMode='contain'
                    />
                    <Text style={styles.pinDescriptionText}>Lar Temporário</Text>
                    {this.state.temporaryHomeActive ? 
                        (
                            <Image 
                                source={require("../Resources/check.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        ) 
                        : 
                        (
                            <Image 
                                source={require("../Resources/x.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        )
                    }
                </TouchableOpacity>
                <TouchableOpacity style={styles.innerContainer}
                    activeOpacity={0.5}
                    onPress={() => this.changeActivationStatus(3)}
                >
                    <Image 
                        source={require("../Resources/runawayAnimalIcon.png")}
                        style={styles.rowIcon}
                        resizeMode='contain'
                    />
                    <Text style={styles.pinDescriptionText}>Animal Fugiu</Text>
                    {this.state.runawayAnimalActive ? 
                        (
                            <Image 
                                source={require("../Resources/check.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        ) 
                        : 
                        (
                            <Image 
                                source={require("../Resources/x.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        )
                    }
                </TouchableOpacity>
                <TouchableOpacity style={styles.innerDarkContainer}
                    activeOpacity={0.5}
                    onPress={() => this.changeActivationStatus(4)}
                >
                    <Image 
                        source={require("../Resources/freeRideIcon.png")}
                        style={styles.rowIcon}
                        resizeMode='contain'
                    />
                    <Text style={styles.pinDescriptionText}>Transporte Solidário (Preciso)</Text>
                    {this.state.freeRideActive ? 
                        (
                            <Image 
                                source={require("../Resources/check.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        ) 
                        : 
                        (
                            <Image 
                                source={require("../Resources/x.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        )
                    }
                </TouchableOpacity>
                <TouchableOpacity style={styles.innerContainer}
                    activeOpacity={0.5}
                    onPress={() => this.changeActivationStatus(5)}
                    
                >
                    <Image 
                        source={require("../Resources/milkEmptyIcon.png")}
                        style={styles.rowIcon}
                        resizeMode='contain'
                    />
                    <Text style={styles.pinDescriptionText}>Mãe de Leite (Preciso)</Text>
                    {this.state.milkEmptyActive ? 
                        (
                            <Image 
                                source={require("../Resources/check.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        ) 
                        : 
                        (
                            <Image 
                                source={require("../Resources/x.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        )
                    }
                </TouchableOpacity>
                 <TouchableOpacity style={styles.innerDarkContainer}
                    activeOpacity={0.5}
                    onPress={() => this.changeActivationStatus(6)}
                >
                    <Image 
                        source={require("../Resources/milkFullIcon.png")}
                        style={styles.rowIcon}
                        resizeMode='contain'
                    />
                    <Text style={styles.pinDescriptionText}>Mãe de Leite (Tenho)</Text>
                    {this.state.milkFullActive ? 
                        (
                            <Image 
                                source={require("../Resources/check.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        ) 
                        : 
                        (
                            <Image 
                                source={require("../Resources/x.png")}
                                style={styles.checkImage}
                                resizeMode='contain'
                            />
                        )
                    }
                </TouchableOpacity>

            </View>
        )

    }



}

const styles = StyleSheet.create({
    container:{
        backgroundColor: StyleVars.Colors.primary,
        flex: 1
    },
    innerContainer:{
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    rowIcon:{
        width: windowWidth * 0.10,
        height: windowHeight * 0.10
    },
    checkImage:{
        width: windowWidth * 0.10,
        height: windowHeight * 0.02
    },
    innerDarkContainer:{
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: StyleVars.Colors.secondary
    },
    pinDescriptionText:{
        color: 'white',
        fontSize: 14,
        textAlign: 'center'
    }

})