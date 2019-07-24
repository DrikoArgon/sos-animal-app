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
    Image,
    ImageBackground,
    AsyncStorage
} from 'react-native'

import StyleVars from '../styles/StyleVars'

const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var currentImageIndex = 1

export default class TutorialModal extends Component{

    constructor(props){
        super(props)
        currentImageIndex = 1;

        this.state = {
            currentImageURI: require("../Resources/Tutorial01.png")
        }

        this.changeImage = this.changeImage.bind(this);
    }


    render(){
        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={()=> {}}
                 >
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <ImageBackground
                                source={require("../Resources/TutorialPanel.png")}
                                style={styles.tutorialImage}
                                resizeMode={'contain'}
                            >
                                <ImageBackground
                                    source={this.state.currentImageURI}
                                    style={styles.tutorialImage}
                                    resizeMode={'contain'}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={this.changeImage}
                                    >
                                        {currentImageIndex < 8 ?
                                            (
                                                <Image
                                                    source={require("../Resources/TutorialArrow.png")}
                                                    style={styles.tutorialArrow}
                                                    resizeMode={'contain'}
                                                />
                                            ) :
                                            (
                                                <Image
                                                    source={require("../Resources/TutorialEndButtom.png")}
                                                    style={styles.tutorialEndButton}
                                                    resizeMode={'contain'}
                                                />
                                            )
                                        }
                                    </TouchableOpacity>
                                </ImageBackground>
                            </ImageBackground>               
                        </View>
                    </TouchableWithoutFeedback>
            </Modal>
        )
    }

    changeImage(){
        currentImageIndex++;

        if(currentImageIndex > 8){
            AsyncStorage.setItem('TUTORIAL_SEEN', "1")
            this.props.hideModals()
        }else{
            switch (currentImageIndex) {
                case 2:
                    this.setState({
                        currentImageURI: require("../Resources/Tutorial02.png")
                    })
                    break;
                case 3:
                    this.setState({
                        currentImageURI: require("../Resources/Tutorial03.png")
                    })
                    break;
                case 4:
                    this.setState({
                        currentImageURI: require("../Resources/Tutorial04.png")
                    })
                    break;
                case 5:
                    this.setState({
                        currentImageURI: require("../Resources/Tutorial05.png")
                    })
                    break;
                case 6:
                    this.setState({
                        currentImageURI: require("../Resources/Tutorial06.png")
                    })
                    break;
                case 7:
                    this.setState({
                        currentImageURI: require("../Resources/Tutorial07.png")
                    })
                    break;
                case 8:
                    this.setState({
                        currentImageURI: require("../Resources/Tutorial08.png")
                    })
                    break;
                default:
                    break;
            }
        }



    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.listViewBackground
    },
    tutorialImage:{
        height: windowHeight * 0.85,
        width: windowWidth * 0.85,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tutorialArrow: {
        marginTop: windowHeight * 0.5,
        height: windowHeight * 0.2,
        width: windowWidth * 0.2,

    },
    tutorialEndButton: {
        marginTop: windowHeight * 0.45,
        height: windowHeight * 0.4,
        width: windowWidth * 0.4,

    },
    modalContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalTextContainerLight:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    modalTextContainerDark:{
        backgroundColor: StyleVars.Colors.listViewBackground,
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    signatureContainer:{
        backgroundColor: StyleVars.Colors.listViewBackground,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    modalHeader:{
        backgroundColor: StyleVars.Colors.secondary,
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
        color: 'lime',
        fontSize: 20
    },
    modalText:{
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    innerModalContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10
    }
})
