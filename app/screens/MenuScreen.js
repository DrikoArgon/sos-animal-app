'use strict'

import React, {Component} from 'react'
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
import Geocoder from 'react-native-geocoding'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class MenuScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            amountOfMessagesAndNotifications: 0
        }

        Geocoder.setApiKey('AIzaSyCCN5ZBd3oZIOtXGwWSsm7Wu4ctqbvQ1Bc')

    }

    componentWillMount(){

        this.setState({
            amountOfMessagesAndNotifications: FirebaseRequest.getCurrentUserMessagesAndNotificationsAmount()
        })

        FirebaseRequest.listenToNewUserMessageOrNotificationReceived(this.increaseMessagesAndNotificationsAmount)
        // FirebaseRequest.listenToUserNotificationOrMessageRemoved(this.decreaseMessagesAndNotificationsAmount)
        // FirebaseRequest.listenToUserNotificationOrMessageChanged(this.decreaseMessagesAndNotificationsAmount)
        
    }

    increaseMessagesAndNotificationsAmount = (isMessage,newMessageOrNotification) => {

        console.warn('Nova mensagem ou notificação recebida')

        var totalAmount = this.state.amountOfMessagesAndNotifications + 1

        if(totalAmount > 99){
            totalAmount = 99
        }

        this.setState({
            amountOfMessagesAndNotifications: totalAmount
        })

        if(isMessage){ 
            FirebaseRequest.addUserMessageToCurrentArray(newMessageOrNotification)
        } else {
            FirebaseRequest.addUserNotificationToCurrentArray(newMessageOrNotification)
        }
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
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.profile())} 
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/meuPerfilIcon.png")}
                            style={styles.icon}
                            resizeMode='contain'
                        />
                        <Text style={styles.iconDescriptionText}>Meu Perfil</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5} 
                        onPress={() => this.props.toRoute(Routes.myPet())}
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/meuPetIcon.png")}
                            style={styles.icon}
                            resizeMode='contain'
                        />
                        <Text style={styles.iconDescriptionText}>Meu Pet</Text>
                    </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.innerContainer}> 
{/*                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.messages(this.increaseMessagesAndNotificationsAmount,this.decreaseMessagesAndNotificationsAmount))} 
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/mensagensIcon.png")}
                            style={styles.icon}
                            resizeMode='contain'
                        >
                            
                        </Image>
                        <View style={styles.redCircle}>
                            <Text style={styles.amountOfMessagesText}>{this.state.amountOfMessagesAndNotifications}</Text>
                        </View>
                        <Text style={styles.iconDescriptionText}>Mensagens</Text>
                    </View>
                    </TouchableOpacity>
*/}
                    <TouchableOpacity
                        activeOpacity={0.5} 
                        onPress={() => this.props.toRoute(Routes.adoptPet())}
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/adoteUmPetIcon.png")}
                            style={styles.icon}
                            resizeMode='contain'
                        />
                        <Text style={styles.iconDescriptionText}>Adote um Pet</Text>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.props.toRoute(Routes.about())}
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
                <View style={styles.innerContainer}>
{/*                    <TouchableOpacity
                        activeOpacity={0.5} 
                        onPress={() => this.props.toRoute(Routes.petServices())}
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/servicosIcon.png")}
                            style={styles.icon3}
                            resizeMode='contain'
                        />
                        <Text style={styles.iconDescriptionText}>Serviços</Text>
                    </View>
                    </TouchableOpacity>
*/}                 

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
        paddingVertical: 100
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
        height: windowHeight * 0.15,
        alignItems: 'center',
        justifyContent: 'center'
        
    },
    icon2:{
        width: windowWidth * 0.15,
        height: windowHeight * 0.15,
       
    },
    icon3:{
        width: windowWidth * 0.25,
        height: windowHeight * 0.15,
        
    },
    iconDescriptionText:{
        fontSize: 16,
        color: 'white'
    },
    redCircle:{
        height: 25,
        width: 25,
        borderRadius: 25/2,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: windowWidth * 0.22,
        marginTop: windowHeight * 0.015,
        position: 'absolute'
    },
    amountOfMessagesText:{
        color:'white',
        fontSize: 13
    }

})