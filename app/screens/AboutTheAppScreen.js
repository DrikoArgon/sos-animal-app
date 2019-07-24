'use strict'

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Image,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native'

import Share from 'react-native-share'
import StyleVars from '../styles/StyleVars'
import SendFeedbackModal from '../components/SendFeedbackModal'
import Routes from '../navigation/Routes'
import Mailer from 'react-native-mail'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const shareOptions = {
    title: 'Opções de divulgação',
    message: `Venha salvar a vida de um animal comigo!
O SOS Animal App é a forma mais rápida de dar visibilidade aos seus pedidos de ajuda.
Baixe o app e comece a fazer a diferença agora.`,
    url: 'https://www.facebook.com/sosanimalapp/',
    subject: 'Venha salvar a vida de um animal comigo!'
}

export default class AboutTheAppScreen extends Component{

    constructor(props){
        super(props)

        this.pointsForSharingApp = 2
        this.state = {
            sendFeedbackModalVisible: false,
            shareModalVisible: false
        }
    }

    handleEmail(){
        Mailer.mail({
            subject: '',
            recipients: ['contact@sosanimalapp.com'],
            ccRecipients: [],
            bccRecipients: [],
            body: '',
            isHTML: true
        }, (error, event) => {
            Alert.alert(
                'Atenção',
                'Ocorreu um erro',
                [
                    { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
                    { text: 'Cancelar', onPress: () => console.log('CANCEL: Email Error Response') }
                ],
                { cancelable: true }
            )
        });
    }

    showFeedbackModal(){
        this.setState({
            sendFeedbackModalVisible: true
        })
    }

    hideModals(){
        this.setState({
            sendFeedbackModalVisible: false,
            shareModalVisible: false
        })
    }

    shareSuccess(){

        FirebaseRequest.addPointsToUser(this.pointsForSharingApp, this.increaseUserCoins)
    }


    increaseUserCoins = () => {

        FirebaseRequest.addPointsToCurrentUser(this.pointsForSharingApp)
        FirebaseRequest.addCoinsToUser(this.pointsForSharingApp, this.checkUserLevel)

    }

    checkUserLevel = () => {

        FirebaseRequest.addCoinsToCurrentUser(this.pointsForSharingApp)
        FirebaseRequest.updateUserLevel()
            .then(() => {
                this.props.back()
            })
            .catch((err) => { console.error('Erro no sistema de pontos e níveis.', err.message) })

    } 


    render(){
        return(
            <View style={styles.container}>
                <ScrollView
                ref="scrollView"
                keyboardShouldPersistTaps='never'
                automaticallyAdjustContentInsects={true}
                alwaysBounceVertical={true}
                style={styles.scrollView}
                >
                <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>O SOS Animal App é um aplicativo que foi criado</Text>
                        <Text style={styles.textStyle}> com o objetivo de ajudar melhor e mais</Text>
                    <Text style={styles.textStyle}>rapidamente os animais. Todas as ferramentas</Text>
                    <Text style={styles.textStyle}>apresentadas nele estão em função</Text>
                        <Text style={styles.textStyle}>dos defensores e amadores dos animais.</Text>
                </View>
                <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Ao reportar um SOS, o usuário expõe no mapa</Text>
                        <Text style={styles.textStyle}>seus pedidos de ajuda e, em um instante, os</Text>
                        <Text style={styles.textStyle}>outros usuários conseguem visualizar o pedido</Text>
                        <Text style={styles.textStyle}> e unir forças para auxiliar da melhor forma</Text>
                        <Text style={styles.textStyle}> o animal em perigo.</Text>
                </View>
                <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Além dessa ferramenta, o usuário pode indicar</Text>
                        <Text style={styles.textStyle}>em seu perfil os animais que estão sob seu cuidado, </Text>
                        <Text style={styles.textStyle}>mesmo como lar temporário. Ao sinalizar essa opção,</Text>
                        <Text style={styles.textStyle}> o animal em lar temporário fica visível nos filtros</Text>
                        <Text style={styles.textStyle}>de busca de animais para adoção, Adote um Pet,</Text>
                        <Text style={styles.textStyle}>onde os usuários poderão pesquisar em </Text>
                        <Text style={styles.textStyle}>sua localidade os animais disponíveis para adoção</Text>
                        <Text style={styles.textStyle}>até encontrar um peludo para amar.</Text>
                </View>
                <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>Esperamos que o aplicativo venha a </Text>
                        <Text style={styles.textStyle}>salvar muitas vidas e que todos nós possamos nos</Text>
                        <Text style={styles.textStyle}>unir nessa causa tão nobre </Text>
                        <Text style={styles.textStyle}>e necessitada: a causa animal.</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.buttomContainer}
                        onPress={() => { this.props.toRoute(Routes.terms())} }
                >
                    <Text style={styles.buttomText}>Regulamento</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.buttomContainer}
                    onPress={() => this.handleEmail()}
                >
                    <Text style={styles.buttomText}>Queremos sua opinião</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.buttomContainer}
                    onPress={() => {
                        Share.open(shareOptions)
                            .then(this.shareSuccess)
                            .catch((err) => { })
                    }}
                >
                    <Text style={styles.buttomText}>Divulgue o App</Text>
                </TouchableOpacity>
                </ScrollView>
                <SendFeedbackModal
                    visible={this.state.sendFeedbackModalVisible}
                    hideModals={() => this.hideModals()}
                />
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        paddingVertical: 15
    },
    textStyle:{
        color: 'white',
        fontSize: 14,
        textAlign: 'center'
    },
    textContainer:{
        marginBottom: 20
    },
    buttomContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 5,
        alignItems:'center',
        paddingVertical: 5,
        marginBottom: 20
    },
    buttomText: {
        color: 'white',
        fontSize: 16
    }
})