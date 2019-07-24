'use strict'

import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'


const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class ONGChangeDataMenuScreen extends Component {

    constructor(props) {
        super(props)

    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.ongChangeProfile())}
                    >
                        <View style={styles.myPlanButton}>
                            <Text style={styles.myPlanButtonText}>Dados Cadastrais</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.ongChangeImage())}
                    >
                        <View style={styles.messagesButton}>
                            <Text style={styles.messagesButtonText}>Imagens</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.primary,
    },
    innerContainer: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
    changeDataButton: {
        backgroundColor: StyleVars.Colors.runawayAnimalPinBackground,
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    changeDataButtonText: {
        color: 'red',
        fontSize: 22
    },
    myPlanButton: {
        backgroundColor: 'navy',
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    myPlanButtonText: {
        color: 'dodgerblue',
        fontSize: 22
    },
    mySalesButton: {
        backgroundColor: 'darkgreen',
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    mySalesButtonText: {
        color: 'lime',
        fontSize: 22
    },
    messagesButton: {
        backgroundColor: 'rgb(103,46,1)',
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    messagesButtonText: {
        color: 'orange',
        fontSize: 20
    },
    codeButton: {
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    codeButtonText: {
        color: 'white',
        fontSize: 22
    }

})