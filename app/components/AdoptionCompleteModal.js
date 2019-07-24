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
    TextInput
} from 'react-native'

import StyleVars from '../styles/StyleVars'

const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class AdoptionCompleteModal extends Component{

    constructor(props){
        super(props)
        
        this.state = {
            to: "",
            adoptionIntent: this.props.adoptionIntent
        }

        this.text = null
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
                                        <Text style={styles.modalHeaderText}>PARABÉNS</Text>
                                    </View>
                                </View>
                                <View style={styles.modalTextContainerLight}>
                                    <Text style={styles.modalText}>Sua mensagem foi enviada!</Text>
                                </View>
                                <View style={styles.modalTextContainerLight}>
                                    <Text style={styles.modalText}>Obrigado pelo seu interesse em adotar um animal!</Text>
                                </View>
                                <View style={styles.modalTextContainerDark}>
                                    <Text style={styles.signaturePhrase}>"Podemos julgar o coração de um homem pela forma que ele trata os animais"</Text>
                                </View>
                                <View style={styles.signatureContainer}>
                                    <Text style={styles.signature}></Text>
                                    <Text style={styles.signature}>Immanuel Kant</Text>
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
    signaturePhrase:{
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
    },
    signature:{
        color: 'white',
        fontSize: 12
    }
    
})
