'use strict'

import React, { Component } from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Modal,
    ListView,
    ScrollView,
    TouchableWithoutFeedback,
    TextInput,
    Image
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var clusteredPins = []

export default class ShowClusteredPinsModal extends Component {

    constructor(props) {
        super(props)

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })


        this.state = {
            dataSource: ds.cloneWithRows(clusteredPins)
        }

    }

    onModalOpen() {

        clusteredPins = this.props.clusteredPins
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.setState({
            dataSource: ds.cloneWithRows(clusteredPins)
        })

    }

    onModalClose() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        clusteredPins = null
        clusteredPins = []

        this.setState({
            dataSource: ds.cloneWithRows(clusteredPins)
        })

        this.props.hideModals()
    }


    hideModals() {
        this.setState({

        })
    }

    checkPinTypeImage(pin){

        switch (pin.type) {

            case 1:
                return require('../Resources/Pins/streetAnimalPin.png')
            case 2:
                return require('../Resources/Pins/temporaryHomePin.png')
            case 3:
                return require('../Resources/Pins/runawayAnimalPin.png')
            case 4:
                return require('../Resources/Pins/freeRidePin.png')
            case 5:
                return require('../Resources/Pins/milkEmptyPin.png')
            case 6:
                return require('../Resources/Pins/milkFullPin.png')
            case 7:
                return require('../Resources/Pins/farePin.png')
            case 8:
                if (marker.CRMV === '-') {
                    if (marker.featured) {
                        return require('../Resources/Pins/featuredServicePin.png')
                    } else {
                        return require('../Resources/Pins/servicePin.png')
                    }
                } else {
                    return require('../Resources/Pins/vetPin.png')
                }

        }
    }

    definePinTypeName(pin) {

        switch (pin.type) {

            case 1:
                return "Animal na Rua"
            case 2:
                return "Lar Temporário (Preciso)"
            case 3:
                return "Animal Fugiu"
            case 4:
                return "Transporte Solidário (Preciso)"
            case 5:
                return "Mãe de Leite (Preciso)"
            case 6:
                return "Mãe de Leite (Tenho)"
            case 7:
                return "Feira de Adoção"
            case 8:
                if (marker.CRMV === '-') {
                    if (marker.featured) {
                        return "Serviço"
                    } else {
                        return "Serviço"
                    }
                } else {
                    return "Serviço Veterinário"
                }

        }
    }

    _renderRow(rowData) {

        return (
            <View style={styles.listViewRowContainer}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.listViewRowInfoContainer}
                    onPress={() => {
                        
                        this.onModalClose();
                        this.props.showCorrectModal(rowData.properties.item)
                    }}
                >
                    <View style={styles.listViewRowImageContainer}>
                        <Image
                            source={this.checkPinTypeImage(rowData.properties.item)}
                            style={styles.pinImage}
                            resizeMode='contain'
                        />

                    </View>
                    <View style={styles.listViewRowTextContainer}>
                        <Text style={styles.commentText}>{this.definePinTypeName(rowData.properties.item)}</Text>
                        <Text style={styles.commentText}>{rowData.properties.item.pinOwnerName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onShow={() => { this.onModalOpen() }}
                onRequestClose={() => { this.onModalClose() }}
            >
                <TouchableWithoutFeedback
                    onPress={() => { this.onModalClose() }}
                >
                    <View>
                        <Text style={{ backgroundColor: 'rgba(0,0,0,0)', height: windowHeight * 0.15, width: windowWidth }}> </Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <View style={styles.innerModalContainer}>
                        <View style={styles.header}>
                            <View style={styles.headerTextContainer}>
                                <Text style={styles.headerText}>Pins Agrupados</Text>
                            </View>
                            <View>
                            </View>
                        </View>
                        <ScrollView
                            ref="scrollView"
                            keyboardShouldPersistTaps="never"
                            automaticallyAdjustContentInsects={true}
                            alwaysBounceVertical={true}
                            style={styles.scrollView}
                        >
                            <ListView
                                dataSource={this.state.dataSource}
                                renderRow={(rowData) => this._renderRow(rowData)}
                                enableEmptySections={true}
                            >
                            </ListView>
                        </ScrollView>
                        <View style={styles.footer}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => {this.onModalClose()}}
                            >
                                <Text style={styles.modalFooterText}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableWithoutFeedback
                    onPress={() => { this.onModalClose() }}
                >
                    <View>
                        <Text style={{ backgroundColor: 'rgba(0,0,0,0)', height: windowHeight * 0.15, width: windowWidth }}> </Text>
                    </View>
                </TouchableWithoutFeedback>
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
        paddingHorizontal: windowWidth * 0.1
    },
    scrollView: {
        flex: 1,
        paddingVertical: 5
    },
    modalTextContainerLight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    fromContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.5,
        marginLeft: 20
    },
    modalTextContainerDark: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    header: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5

    },
    headerText: {
        color: 'white',
        fontSize: 24
    },
    headerImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowIcon: {
        width: windowWidth * 0.06,
        height: windowHeight * 0.06
    },
    pinImage: {
        width: windowWidth * 0.08,
        height: windowHeight * 0.08
    },
    commentOwnerNameText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5
    },
    commentText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 14
    },
    listViewRowInfoContainer: {
        flexDirection: 'row',
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5

    },
    listViewRowContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    listViewRowTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 10
    },
    listViewRowImageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    modalText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5
    },
    innerModalContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        marginBottom: 30,
        height: windowHeight * 0.7
    },
    footer: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    modalFooterText:{
        color: 'white',
        fontSize: 18
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    imageContainer: {
        justifyContent: 'center',
        marginBottom: 7,
        marginTop: 5,
        marginRight: 15
    },
    rowText: {
        color: 'white',
        fontSize: 12
    }
})
