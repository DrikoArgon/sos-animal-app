'use strict'

import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class ShareAppScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }


    }

    componentWillMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {}}
                    >
                        <View style={styles.iconContainer}>
                            <Image
                                source={require("../Resources/meuPerfilIcon.png")}
                                style={styles.icon}
                                resizeMode='contain'
                            />
                            <Text style={styles.iconDescriptionText}>Facebook</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => { }}
                    >
                        <View style={styles.iconContainer}>
                            <Image
                                source={require("../Resources/meuPetIcon.png")}
                                style={styles.icon}
                                resizeMode='contain'
                            />
                            <Text style={styles.iconDescriptionText}>Twitter</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.innerContainer}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => { }}
                    >
                        <View style={styles.iconContainer}>
                            <Image
                                source={require("../Resources/adoteUmPetIcon.png")}
                                style={styles.icon}
                                resizeMode='contain'
                            />
                            <Text style={styles.iconDescriptionText}>Outro</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {}}
                    >
                        <View style={styles.iconContainer}>
                            <Image
                                source={require("../Resources/sobreOAppIcon.png")}
                                style={styles.icon}
                                resizeMode='contain'
                            />
                            <Text style={styles.iconDescriptionText}>Sobre o App</Text>
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
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingVertical: 120
    },
    innerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    iconContainer: {
        borderRadius: 10,
        backgroundColor: StyleVars.Colors.secondary,
        height: windowHeight * 0.20,
        width: windowWidth * 0.35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: windowWidth * 0.20,
        height: windowHeight * 0.15,
        alignItems: 'center',
        justifyContent: 'center'

    },
    icon2: {
        width: windowWidth * 0.15,
        height: windowHeight * 0.15,

    },
    icon3: {
        width: windowWidth * 0.25,
        height: windowHeight * 0.15,

    },
    iconDescriptionText: {
        fontSize: 16,
        color: 'white'
    },

})