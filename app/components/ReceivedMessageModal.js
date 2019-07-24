'use strict'

import React, {Component} from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableWithoutFeedback
} from 'react-native'

import StyleVars from '../styles/StyleVars'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class ReceivedMessageModal extends Component{

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
                        <TouchableWithoutFeedback>
                            <View style={styles.innerModalContainer}>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHeaderTextContainer}>
                                        <Text style={styles.modalHeaderText}>MENSAGEM RECEBIDA</Text>
                                    </View>
                                </View>
                                <View style={styles.modalTextContainerLight}>
                                    <Text style={styles.modalText}>De: </Text>
                                    <View style={styles.fromContainer}>
                                        <Text style={styles.fromNameText}>{this.props.data.from}</Text>
                                    </View>
                                </View>
                                <View style={styles.messageTextContainer}>
                                    <Text style={styles.modalText}>{this.props.data.message}</Text>
                                </View>
                                {this.props.data.messageFrom === 'adm' ? 
                                    (
                                        <View/>
                                    ) 
                                    : 
                                    (
                                        <View style={styles.buttomContainer}>
                                            <TouchableOpacity
                                                activeOpacity={0.5}
                                                style={styles.answerButtom}
                                                onPress={() => this.props.changeModals()}
                                            >
                                                <Text style={styles.modalFooterText}>Responder</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                                
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
        fontSize: 18
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
    messageTextContainer:{
        flexDirection: 'row',
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
    },
    buttomContainer:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    answerButtom:{
        backgroundColor: 'rgb(188,100,22)',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center'
    },
    fromNameText:{
        color: 'white',
        fontSize: 14
    }
    
})
