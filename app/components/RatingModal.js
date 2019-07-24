'use strict'

import React, {Component} from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    Image
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'


const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class RatingModal extends Component{

    constructor(props){
        super(props)

        this.text = null

        this.state = {
            star1Full: false,
            star2Full: false,
            star3Full: false,
            star4Full: false,
            star5Full: false,

            chosenRating: 0,
            sendingRating: false

        }

    }

    manageStarTouch(starNumber){
        switch(starNumber){
            case 1:
                this.setState({
                    star1Full: true,
                    star2Full: false,
                    star3Full: false,
                    star4Full: false,
                    star5Full: false,
                    chosenRating: 1
                })  
                break

            case 2:
                this.setState({
                    star1Full: true,
                    star2Full: true,
                    star3Full: false,
                    star4Full: false,
                    star5Full: false,
                    chosenRating: 2
                })  
                break

            case 3:
                this.setState({
                    star1Full: true,
                    star2Full: true,
                    star3Full: true,
                    star4Full: false,
                    star5Full: false,
                    chosenRating: 3
                })  
                break

            case 4:
                this.setState({
                    star1Full: true,
                    star2Full: true,
                    star3Full: true,
                    star4Full: true,
                    star5Full: false,
                    chosenRating: 4
                })  
                break  
            case 5:
                 this.setState({
                    star1Full: true,
                    star2Full: true,
                    star3Full: true,
                    star4Full: true,
                    star5Full: true,
                    chosenRating: 5
                })  
                break 

            default:
                this.setState({
                    star1Full: false,
                    star2Full: false,
                    star3Full: false,
                    star4Full: false,
                    star5Full: false,
                    chosenRating: 0
                })  
                break      


        }
    }

    rate(){

        this.setState({
            sendingRating: true
        })

        FirebaseRequest.addRating(this.props.ID, this.state.chosenRating, this.updateAverageRating,this.props.isGroup)

    }

    updateAverageRating = () => {

        FirebaseRequest.calculateNewRating(this.props.ID,this.props.isGroup)
        .then(() => {
            this.setState({
                sendingRating: false
            })

            this.props.hideModals()
        })
        .catch((err) => {
            console.error("Error trying to calculate new rating average", err.message)
            this.setState({
                sendingRating: false
            })
        })
    }


    render(){
        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={()=> {}}
                 >
                    <TouchableWithoutFeedback 
                        onPress={() => this.props.hideModals()}
                    >
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback
                            onPress={() => dismissKeyboard()}>
                            <View style={styles.innerModalContainer}>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHeaderTextContainer}>
                                        <Text style={styles.modalHeaderText}>AVALIAR</Text>
                                    </View>
                                </View>
                                <View style={styles.messageTextContainer}>
                                    <Text style={styles.modalText}>Toque nas estrelas para avaliar</Text>
                                    <View style={styles.starsContainer}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => this.manageStarTouch(1)}
                                        >
                                            <Image 
                                                source={this.state.star1Full ? require("../Resources/Stars/fullStar.png") : require("../Resources/Stars/emptyStar.png")}
                                                style={styles.starsImage}
                                                resizeMode='contain'
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => this.manageStarTouch(2)}
                                        >
                                            <Image 
                                                source={this.state.star2Full ? require("../Resources/Stars/fullStar.png") : require("../Resources/Stars/emptyStar.png")}
                                                style={styles.starsImage}
                                                resizeMode='contain'
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => this.manageStarTouch(3)}
                                        >
                                            <Image 
                                                source={this.state.star3Full ? require("../Resources/Stars/fullStar.png") : require("../Resources/Stars/emptyStar.png")}
                                                style={styles.starsImage}
                                                resizeMode='contain'
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => this.manageStarTouch(4)}
                                        >
                                            <Image 
                                                source={this.state.star4Full ? require("../Resources/Stars/fullStar.png") : require("../Resources/Stars/emptyStar.png")}
                                                style={styles.starsImage}
                                                resizeMode='contain'
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => this.manageStarTouch(5)}
                                        >
                                            <Image 
                                                source={this.state.star5Full ? require("../Resources/Stars/fullStar.png") : require("../Resources/Stars/emptyStar.png")}
                                                style={styles.starsImage}
                                                resizeMode='contain'
                                            />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                <View style={styles.buttomContainer}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={this.state.chosenRating !== 0 ? styles.sendButtom : styles.disabledSendButton}
                                        onPress={() => { this.state.chosenRating !== 0 ? this.rate() : {}}}
                                    >
                                        <Text style={styles.modalFooterText}>{this.state.sendingRating ? "Avaliando..." : "Avaliar"}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => this.props.hideModals()}
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
        backgroundColor: StyleVars.Colors.listViewBackground,
    },
    modalContainer:{
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalTextContainerLight:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    fromContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.5,
        marginLeft: 20
    },
    modalTextContainerDark:{
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    modalHeader:{
        backgroundColor: 'darkgoldenrod',
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center'
    },
    modalHeaderTextContainer:{
       justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    modalHeaderText:{
        color: 'white',
        fontSize: 20
    },
    modalText:{
        color: 'white',
        fontSize: 14
    },
    innerModalContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        marginBottom: 30
    },
    modalFooter:{
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    modalFooterText:{
        color: 'white',
        fontSize: 18
    },
    messageTextContainer:{
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        height: windowHeight * 0.2,
        alignItems: 'center'
    },
    buttomContainer:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendButtom:{
        backgroundColor: 'rgb(29,105,175)',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    },
    starsImage:{
        height: windowHeight * 0.1,
        width: windowWidth * 0.12,
        marginTop: 10,
        marginRight: 4
    },
    starsContainer:{
        flexDirection: 'row'
    },
    disabledSendButton:{
        backgroundColor: 'rgba(29,105,175,0.5)',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    }
    
})
