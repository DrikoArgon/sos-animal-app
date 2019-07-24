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
    Image,
    AsyncStorage
} from 'react-native'

import StyleVars from '../styles/StyleVars'


const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class FilterSelectionModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            animalStreetActive: this.props.data.animalStreetActive,
            temporaryHomeActive: this.props.data.temporaryHomeActive,
            runawayAnimalActive: this.props.data.runawayAnimalActive,
            freeRideActive: this.props.data.freeRideActive,
            milkEmptyActive: this.props.data.milkEmptyActive,
            milkFullActive: this.props.data.milkFullActive,
            filterChanged: false

        }
    }

    onModalOpen(){
        this.setState({
            animalStreetActive: this.props.data.animalStreetActive,
            temporaryHomeActive: this.props.data.temporaryHomeActive,
            runawayAnimalActive: this.props.data.runawayAnimalActive,
            freeRideActive: this.props.data.freeRideActive,
            milkEmptyActive: this.props.data.milkEmptyActive,
            milkFullActive: this.props.data.milkFullActive,
            filterChanged: false
        })
    }

    changeActivationStatus(id) {
        switch (id) {
            case 1:
                this.setState({
                    animalStreetActive: !this.state.animalStreetActive,
                    filterChanged: true
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
                    temporaryHomeActive: !this.state.temporaryHomeActive,
                    filterChanged: true
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
                    runawayAnimalActive: !this.state.runawayAnimalActive,
                    filterChanged: true
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
                    freeRideActive: !this.state.freeRideActive,
                    filterChanged: true
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
                    milkEmptyActive: !this.state.milkEmptyActive,
                    filterChanged: true
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
                    milkFullActive: !this.state.milkFullActive,
                    filterChanged: true
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

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onShow={() => { this.onModalOpen() }}
                onRequestClose={() => { }}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        if(this.state.filterChanged){
                            this.props.updateFilters()
                        }
                            this.props.hideModals()
                        }}
                >
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback
                            onPress={() => dismissKeyboard()}>
                            <View style={styles.innerModalContainer}>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHeaderTextContainer}>
                                        <Text style={styles.modalHeaderText}>FILTROS</Text>
                                    </View>
                                </View>
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
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => {
                                            if (this.state.filterChanged) {
                                                this.props.updateFilters()
                                            }
                                            this.props.hideModals()
                                        }}
                                    >
                                        <Text style={styles.modalFooterText}>Sair</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.listViewBackground
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalTextContainerLight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    modalTextContainerDark: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    modalHeader: {
        backgroundColor: StyleVars.Colors.secondary,
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
        fontSize: 16,
        textAlign: 'center'
    },
    innerModalContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10
    },
    modalFooter: {
        backgroundColor: StyleVars.Colors.secondary,
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
    innerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    rowIcon: {
        width: windowWidth * 0.08,
        height: windowHeight * 0.06
    },
    checkImage: {
        width: windowWidth * 0.10,
        height: windowHeight * 0.02
    },
    innerDarkContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: StyleVars.Colors.listViewBackground
    },
    pinDescriptionText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
    }

})
