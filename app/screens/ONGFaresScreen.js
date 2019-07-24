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

export default class ONGFaresScreen extends Component {

    constructor(props){
        super(props)

    }


    render(){
        return(
            <View style={styles.container}>
                <View style={styles.innerContainer}> 
                    <TouchableOpacity 
                        style={styles.buttonContainer}
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.fareHistory())}
                    >
                        <View style={styles.historyButton}>
                            <Text style={styles.historyButtonText}>Histórico</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.buttonContainer}
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.newFare())}
                    >
                        <View style={styles.newFareButton}>
                            <Text style={styles.newFareButtonText}>Nova Feira</Text>
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
    },
    innerContainer:{
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60
    },
    historyButton:{
        backgroundColor: '#003000',
        borderRadius: 5,
        paddingVertical: 20,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    historyButtonText:{
        color: 'lime',
        fontSize: 35
    },
    newFareButton:{
        backgroundColor: 'rgb(103,46,1)',
        borderRadius: 5,
        paddingVertical: 20,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    newFareButtonText:{
        color: 'orange',
        fontSize: 35
    }
})