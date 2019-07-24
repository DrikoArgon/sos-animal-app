'use strict'

import React, { Component } from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    Alert,
    Image
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'


const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class PinReportModal extends Component {

    constructor(props) {
        super(props)

        this.falseReportsThreshold = 20
        this.inapropriateContentReportsThreshold = 10
    }

    addFalseReport() {

        Alert.alert('', 'Tem certeza que quer denunciar este pin por conter informações falsas?',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {
                        FirebaseRequest.addFalseReportToPin(this.props.pinData.pinID, this.props.pinData.pinOwnerID, this.completedAddingFalseReport, this.failedAddingReport)
                    }
                }
            ],
            { cancelable: false }
        )       
    }

    addInapropriateContentReport(){

        Alert.alert('', 'Tem certeza que quer denunciar este pin por conter conteúdo impróprio?',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {
                        FirebaseRequest.addInapropriateContentReportToPin(this.props.pinData.pinID,this.props.pinData.pinOwnerID, this.completedAddingInapropriateContentReport, this.failedAddingReport)
                    }
                }
            ],
            { cancelable: false }
        )   
        
    }

    completedAddingFalseReport = () => {

        if (this.props.pinReportsData.falseReports === this.falseReportsThreshold){
            if(this.props.pinReportsData.isServicePin){
                FirebaseRequest.addPinReportToService(this.props.pinData.pinOwnerID, this.props.pinData.pinID, this.completedAddingPinReportToProfile)
            } else {
                FirebaseRequest.addPinReportToUser(this.props.pinData.pinOwnerID,this.props.pinData.pinID,this.completedAddingPinReportToProfile)
            }
        } else {

            Alert.alert('Sucesso', 'Sua denúncia foi realizada com sucesso.',
                [
                    {
                        text: 'Ok', onPress: () => {
                            this.props.hideModals()
                        }
                    }
                ],
                { cancelable: false }
            ) 
        }
    }

    completedAddingInapropriateContentReport = () => {

        if (this.props.pinReportsData.inapropriateContentReports === this.inapropriateContentReportsThreshold) {
            if (this.props.pinReportsData.isServicePin) {
                FirebaseRequest.addPinReportToService(this.props.pinData.pinOwnerID, this.props.pinData.pinID, this.completedAddingPinReportToProfile)
            } else {
                FirebaseRequest.addPinReportToUser(this.props.pinData.pinOwnerID, this.props.pinData.pinID, this.completedAddingPinReportToProfile)
            }
        }else{

            Alert.alert('Sucesso', 'Sua denúncia foi realizada com sucesso.',
                [
                    {
                        text: 'Ok', onPress: () => {
                            this.props.hideModals()
                        }
                    }
                ],
                { cancelable: false }
            ) 
        }
    }

    failedAddingReport = () => {

        Alert.alert('Houve um erro durante sua denúncia.', 'Verifique sua conexão ou se já denunciou este pin antes.',
            [
                {
                    text: 'Ok', onPress: () => {
                        this.props.hideModals()
                    }
                }
            ],
            { cancelable: false }
        ) 
    }

    completedAddingPinReportToProfile = () => {

        this.props.hideModals()

        FirebaseRequest.removePinFromMap(this.props.pinData.pinID,this.props.pinData.pinOwnerID)
        .then(() => {

            if(this.props.isServicePin){
                FirebaseRequest.sendMessageAsAdmToService({
                    message: 'Um pin seu foi denunciado por ser falso ou conter conteúdo impróprio. Por este motivo, foi adicionada uma denúncia em seu perfil e seu pin foi deletado. Pedimos encarecidamente que este comportamento não se repita, pois punições mais severas podem ocorrer.',
                    subject: 'Denúncia de pin',
                    receiverID: this.props.pinData.pinOwnerID
                })
                    .then(() => {

                    })
                    .catch((err) => { })
            } else{
                FirebaseRequest.sendMessageAsAdmToUser({
                    message: 'Um pin seu foi denunciado por ser falso ou conter conteúdo impróprio. Por este motivo, foi adicionada uma denúncia em seu perfil e seu pin foi deletado. Pedimos encarecidamente que este comportamento não se repita, pois punições mais severas podem ocorrer.',
                    subject:'Denúncia de pin',
                    receiverID: this.props.pinData.pinOwnerID
                })
                .then(() => {

                })
                .catch((err) => {})
            }
        })
        .catch((err) => {alert('Erro ao deletar pin')})
        
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => { }}
            >
                <TouchableWithoutFeedback
                    onPress={() => this.props.hideModals()}
                >
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback
                            onPress={() => dismissKeyboard()}>
                            <View style={styles.innerModalContainer}>
                                <View style={[styles.modalHeader, { backgroundColor: this.props.headerColor }]}>
                                    <View style={styles.modalHeaderTextContainer}>
                                        <Text style={styles.modalHeaderText}>DENUNCIAR</Text>
                                    </View>
                                </View>
                                <View style={styles.buttomContainer}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={styles.sendFalseReportButtom}
                                        onPress={() => this.addFalseReport()}
                                    >
                                        <Text style={styles.modalText}>Falso</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.buttomContainer}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={styles.sendInapropriateContentReportButtom}
                                        onPress={() => this.addInapropriateContentReport()}
                                    >
                                        <Text style={styles.modalText}>Conteúdo Impróprio</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.reportsAmountContainer}>
                                    <View style={styles.falseReportsAmountContainer}>
                                        <Image
                                            source={require("../Resources/yellowReportIcon.png")}
                                            style={styles.reportIcon}
                                            resizeMode='contain'
                                        />
                                        <Text style={styles.falseReportsAmountText}>{this.props.pinReportsData.falseReports}</Text>
                                    </View>
                                    <View style={styles.inapropriateContentReportsContainer}>
                                        <Image
                                            source={require("../Resources/redReportIcon.png")}
                                            style={styles.reportIcon}
                                            resizeMode='contain'
                                        />
                                        <Text style={styles.inapropriateContentReportsAmountText}>{this.props.pinReportsData.inapropriateContentReports}</Text>
                                    </View>
                                </View>
                                <View style={[styles.modalFooter, { backgroundColor: this.props.headerColor }]}>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalTextContainerLight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    fromContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.5,
        marginLeft: 20
    },
    modalTextContainerDark: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    modalHeader: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center'
    },
    modalHeaderTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    modalHeaderText: {
        color: 'white',
        fontSize: 20
    },
    modalText: {
        color: 'white',
        fontSize: 18
    },
    innerModalContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        marginBottom: 30
    },
    modalFooter: {
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    modalFooterText: {
        color: 'white',
        fontSize: 18
    },
    buttomContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendFalseReportButtom: {
        backgroundColor: 'goldenrod',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center'
    },
    sendInapropriateContentReportButtom: {
        backgroundColor: 'darkred',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center'
    },
    reportsAmountContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: windowWidth * 0.15,
        paddingVertical: 10
    },
    falseReportsAmountContainer:{
        flexDirection: 'row',
    },
    falseReportsAmountText:{
        color:'rgb(255,240,0)',
        fontSize: 14
    },
    inapropriateContentReportsContainer: {
        flexDirection: 'row',
    },
    inapropriateContentReportsAmountText: {
        color: 'rgb(215,0,0)',
        fontSize: 14
    },
    reportIcon: {
        width: windowWidth * 0.07,
        height: windowHeight * 0.03,
        marginRight: 5
    }

})
