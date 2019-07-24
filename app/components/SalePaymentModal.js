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
    Image
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'


const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class SalePaymentModal extends Component {

    constructor(props) {
        super(props)


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
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHeaderTextContainer}>
                                        <Text style={styles.modalHeaderText}>Anúncio de Promoção</Text>
                                    </View>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.modalText}>Garanta uma posição de destaque nos filtros de busca e no mapa.</Text>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.modalText}>Esta funcionalidade permite que seu estabelecimento apareça no filtro especial "Promoções Pet" e possua um pin diferenciado no mapa.</Text>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.biggerText}>Valor a pagar</Text>
                                </View>
                                <View style={styles.displayContainer}>
                                    <View style={styles.paymentValueDisplay}>
                                        <Text style={styles.valueText}>R$ 9,90</Text>
                                    </View>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.modalText}>Válido por 1 (um) mês, à partir da data da compra.</Text>
                                </View>
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={styles.closeButtom}
                                        onPress={() => this.props.hideModals()}
                                    >
                                        <Text style={styles.modalFooterText}>Sair</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={styles.sendButtom}
                                        onPress={() => {this.props.acceptPayment()}}
                                    >
                                        <Text style={styles.modalFooterText}>Confirmar</Text>
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
        padding: 20,
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
        backgroundColor: 'darkgreen',
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
        color: 'lime',
        fontSize: 20
    },
    modalText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 5
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
    sendButtom: {
        backgroundColor: 'rgb(29,105,175)',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.35,
        marginTop: 5,
        marginBottom: 5,
        alignItems: 'center'
    },
    closeButtom: {
        backgroundColor: 'darkred',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.35,
        marginTop: 5,
        marginBottom: 5,
        alignItems: 'center'
    },
    disabledSendButton: {
        backgroundColor: 'rgba(29,105,175,0.5)',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    },
    textContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    biggerText:{
        color: 'white',
        fontSize: 22,
        textAlign: 'center'
    },
    valueText: {
        color: 'lime',
        fontSize: 20,
        textAlign: 'center'
    },
    paymentValueDisplay: {
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        paddingVertical: 10,
        width: windowWidth * 0.6,
        alignItems: 'center'
    },
    displayContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 10
    }

})
