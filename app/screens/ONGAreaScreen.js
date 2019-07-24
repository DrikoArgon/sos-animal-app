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
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class ONGAreaScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            amountOfMessagesAndNotifications: 0
        }

    }


    componentWillMount() {

        this.setState({
            amountOfMessagesAndNotifications: FirebaseRequest.getCurrentGroupMessagesAndNotificationsAmount()
        })

        FirebaseRequest.listenToNewGroupMessageOrNotificationReceived(this.increaseMessagesAndNotificationsAmount)
 
    }

    increaseMessagesAndNotificationsAmount = () => {

        var totalAmount = this.state.amountOfMessagesAndNotifications + 1

        if (totalAmount > 99) {
            totalAmount = 99
        }

        this.setState({
            amountOfMessagesAndNotifications: totalAmount
        })
    }

    decreaseMessagesAndNotificationsAmount = () => {

        var totalAmount = this.state.amountOfMessagesAndNotifications - 1

        this.setState({
            amountOfMessagesAndNotifications: totalAmount
        })
    }


    render(){
        return(
            <View style={styles.container}>
                <View style={styles.innerContainer}> 
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.ongChangeData())}
                    >
                        <View style={styles.changeDataButton}>
                            <Text style={styles.changeDataButtonText}>Alterar Dados</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.buttonContainer}
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.ongAnimals())}
                    >
                        <View style={styles.myPlanButton}>
                            <Text style={styles.myPlanButtonText}>Nossos Animais</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.buttonContainer}
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.ongFares())}
                    >
                        <View style={styles.fareButton}>
                            <Text style={styles.fareButtonText}>Nossas Feiras</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.buttonContainer}
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.ongMembers())}
                    >
                        
                        <View style={styles.membersButton}>
                            <Text style={styles.membersButtonText}>Membros</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.buttonContainer}
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.ongMessage(this.increaseMessagesAndNotificationsAmount,this.decreaseMessagesAndNotificationsAmount))}
                    >
                        <View style={styles.messagesButton}>
                            <Text style={styles.messagesButtonText}>Mensagens</Text>
                            <View style={styles.redCircle}>
                                <Text style={styles.amountOfMessagesText}>{this.state.amountOfMessagesAndNotifications}</Text>
                            </View>
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
        marginBottom: 30
    },
    changeDataButton: {
        backgroundColor: StyleVars.Colors.milkFullPinBackground,
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        marginTop: 25,
        alignItems: 'center'
    },
    changeDataButtonText: {
        color: 'aqua',
        fontSize: 22
    },
    myPlanButton:{
        backgroundColor: 'navy',
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    myPlanButtonText:{
        color: 'dodgerblue',
        fontSize: 22
    },
    mySalesButton:{
        backgroundColor: 'darkgreen',
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    mySalesButtonText:{
        color: 'lime',
        fontSize: 22
    },
    messagesButton:{
        backgroundColor: 'darkgoldenrod',
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    messagesButtonText:{
        color: 'gold',
        fontSize: 22
    },
    codeButton:{
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    codeButtonText:{
        color: 'white',
        fontSize: 22
    },
    fareButton:{
        backgroundColor: StyleVars.Colors.runawayAnimalPinBackground,
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    fareButtonText:{
        color: 'red',
        fontSize: 22
    },
    membersButton:{
        backgroundColor: 'darkgreen',
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    membersButtonText:{
        color: 'lime',
        fontSize: 22
    },
    redCircle: {
        height: 25,
        width: 25,
        borderRadius: 25 / 2,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: windowWidth * 0.65,
        marginTop: -windowHeight * 0.015,
        position: 'absolute'
    },
    amountOfMessagesText: {
        color: 'white',
        fontSize: 13
    }

})