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
    Image
} from 'react-native'

import StyleVars from '../styles/StyleVars'


const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class AnnouncerModal extends Component{

    constructor(props){
        super(props)
        
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
                                        <Text style={styles.modalHeaderText}>ESPAÇO ANUNCIANTE</Text>
                                    </View>
                                </View>
                                <View style={styles.modalTextContainerLight}>
                                    <Text style={styles.modalText}>Seja Bem Vindo!</Text>      
                                </View>
                                <View style={styles.modalTextContainerLight}>
                                    <Text style={styles.modalText}>Este espaço foi criado especialmente para os serviços do mundo pet.</Text>      
                                </View>
                                <View style={styles.bulletContainer}>
                                    <View style={styles.iconContainer}>
                                        <Image 
                                                source={require("../Resources/pawnIcon.png")}
                                                style={styles.icon}
                                                resizeMode='contain'
                                        />
                                    </View>
                                    <View style={styles.bulletTextContainer}>
                                        <Text style={styles.bulletText}>Anuncie seu serviço nos filtros de busca</Text>    
                                    </View>  
                                </View>
                                <View style={styles.bulletContainer}>
                                    <View style={styles.iconContainer}>
                                        <Image 
                                                source={require("../Resources/pawnIcon.png")}
                                                style={styles.icon}
                                                resizeMode='contain'
                                        />
                                    </View>
                                    <View style={styles.bulletTextContainer}>
                                        <Text style={styles.bulletText}>Interaja com a sua clientela</Text>
                                    </View>      
                                </View>
                                <View style={styles.bulletContainer}>
                                   <View style={styles.iconContainer}>
                                        <Image 
                                                source={require("../Resources/pawnIcon.png")}
                                                style={styles.icon}
                                                resizeMode='contain'
                                        />
                                    </View>
                                    <View style={styles.bulletTextContainer}>
                                        <Text style={styles.bulletText}>Aloque seu estabelecimento no mapa e ganhe maior visibilidade</Text> 
                                    </View>     
                                </View>
                                <View style={styles.bulletContainer}>
                                    <View style={styles.iconContainer}>
                                        <Image 
                                                source={require("../Resources/pawnIcon.png")}
                                                style={styles.icon}
                                                resizeMode='contain'
                                        />
                                    </View>
                                    <View style={styles.bulletTextContainer}>
                                        <Text style={styles.bulletText}>Troque descontos por moedas e atraia mais clientela</Text>
                                    </View>      
                                </View>
                                <View style={styles.buttomContainer}>
                                    <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={styles.sendButtom}
                                            onPress={() => {this.props.goToAnnouncerArea()}}
                                        >
                                        <Text style={styles.buttomText}>Quero Anunciar</Text>
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
        backgroundColor: StyleVars.Colors.listViewBackground
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
        paddingHorizontal: 15
    },
    bulletContainer:{
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    bulletTextContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        
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
        color: 'white',
        fontSize: 20
    },
    modalText:{
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    bulletText:{
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
    },
    innerModalContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10
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
    buttomContainer:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendButtom:{
        backgroundColor: '#003000',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center'
    },
    buttomText:{
        color: 'lime',
        fontSize: 18
    },
    iconContainer:{
        paddingHorizontal: 10
    },
    icon:{
        width: windowWidth * 0.05,
        height: windowHeight * 0.05
    }
    
})
