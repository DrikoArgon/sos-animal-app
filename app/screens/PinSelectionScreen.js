'use strict'

import React, {Component} from 'react'
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

export default class PinSelectionScreen extends Component {

    constructor(props){
        super(props)

    }


    render(){
        return(
            <View style={styles.container}>
                <View style={styles.innerContainer}> 
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.pinCreationStreetAnimal())}
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/animalStreetIcon.png")}
                            style={styles.icon}
                            resizeMode='contain'
                        />
                        <Text style={styles.iconDescriptionText}>Animal na Rua</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5} 
                        onPress={() => this.props.toRoute(Routes.pinCreationTemporaryHome())}
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/temporaryHomeIcon.png")}
                            style={styles.icon2}
                            resizeMode='contain'
                        />
                        <Text style={styles.iconDescriptionText2}>Lar Temporário</Text>
                        <Text style={styles.iconDescriptionText2}>(Preciso)</Text>
                    </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.innerContainer}> 
                    <TouchableOpacity
                        activeOpacity={0.5} 
                        onPress={() => this.props.toRoute(Routes.pinCreationRunawayAnimal())}
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/runawayAnimalIcon.png")}
                            style={styles.icon}
                            resizeMode='contain'
                        />
                        <Text style={styles.iconDescriptionText}>Animal Fugiu</Text>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5} 
                        onPress={() => this.props.toRoute(Routes.pinCreationFreeRide())}
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/freeRideIcon.png")}
                            style={styles.icon2}
                            resizeMode='contain'
                        />
                        <Text style={styles.iconDescriptionText2}>Transporte Solidário</Text>
                        <Text style={styles.iconDescriptionText2}>(Preciso)</Text>
                    </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.innerContainer}>
                    <TouchableOpacity
                        activeOpacity={0.5} 
                        onPress={() => this.props.toRoute(Routes.pinCreationMilkEmpty())}
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/milkEmptyIcon.png")}
                            style={styles.icon2}
                            resizeMode='contain'
                        />
                        <Text style={styles.iconDescriptionText2}>Mãe de Leite</Text>
                        <Text style={styles.iconDescriptionText2}>(Preciso)</Text>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5} 
                        onPress={() => this.props.toRoute(Routes.pinCreationMilkFull())}
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/milkFullIcon.png")}
                            style={styles.icon2}
                            resizeMode='contain'
                        />
                        <Text style={styles.iconDescriptionText2}>Mãe de Leite</Text>
                        <Text style={styles.iconDescriptionText2}>(Tenho)</Text>
                    </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: StyleVars.Colors.primary,
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingVertical: 40
    },
    innerContainer:{
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
    icon:{
        width: windowWidth * 0.20,
        height: windowHeight * 0.14,
        
    },
    icon2:{
        width: windowWidth * 0.18,
        height: windowHeight * 0.15,
        marginTop: 2
       
    },
    icon3:{
        width: windowWidth * 0.25,
        height: windowHeight * 0.14,
        
    },
    icon4:{
        width: windowWidth * 0.20,
        height: windowHeight * 0.14,
        
    },
    iconDescriptionText:{
        fontSize: 12,
        color: 'white'
    },
    iconDescriptionText2:{
        fontSize: 10,
        color: 'white'
    }

})