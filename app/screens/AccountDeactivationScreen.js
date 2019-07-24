'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Picker,
    ScrollView,
    Alert
} from 'react-native'

import Routes from '../navigation/Routes'
import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager
} = FBSDK;

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class AccountDeactivationScreen extends Component{

    constructor(props){
        super(props)

        this.state = {
            motive: 'achei muito confuso',
            deletingAccount: false
        }
    }


    deactivateAccount(){

        Alert.alert('', 'Tem certeza que quer deletar sua conta?',
            [
               
                {
                    text: 'Cancelar', onPress: () => {}
                },
                {
                    text: 'Ok', onPress: () => {
                        this.setState({
                            deletingAccount: true
                        })

                        FirebaseRequest.deleteAccount(this.state.motive)
                        .then(() => {

                            LoginManager.logOut()

                            this.props.parentNavigator.pop()
                        })
                        .catch((err) => {
                            this.setState({
                                deletingAccount: false
                            })
                            alert('Erro ao tentar deletar conta.')
                        })
                        
                    }
                }
            ],
            { cancelable: false }
        )
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
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Você tem certeza que quer desativar</Text>
                        <Text style={styles.infoText}>a sua conta?</Text>
                    </View>
                        <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Ao desativar sua conta no</Text>
                        <Text style={styles.infoText}>SOS Animal App, você perderá</Text>
                        <Text style={styles.infoText}>todas as moedas acumuladas</Text>
                        <Text style={styles.infoText}>até hoje.</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Porque você está desativando</Text>
                        <Text style={styles.infoText}>a sua conta?</Text>
                    </View>
                    <View style={styles.innerContainer}>
                    <Picker
                        selectedValue={this.state.motive}
                        onValueChange={(motive) => this.setState({ motive: motive})}
                    >
                        <Picker.Item label='Achei muito confuso' value='achei muito confuso' />
                        <Picker.Item label='Não achei útil' value='Não achei útil' />
                        <Picker.Item label='Muitos problemas de uso' value='muitos problemas de uso' />
                        <Picker.Item label='Não gostei do aplicativo' value='não gostei do aplicativo' />
                        <Picker.Item label='Não uso muito' value='não uso muito' />
                        <Picker.Item label='Outros motivos' value='outros motivos' />
                    </Picker>
                    </View>
                    
                    <View style={styles.deactivateButtonContainer}>
                        <TouchableOpacity 
                            style={styles.deactivateButton}
                            activeOpacity={0.5}
                            onPress={() => this.deactivateAccount()}
                        >
                        <Text style={styles.deactivateButtonText}>{this.state.deletingAccount ? 'Deletando conta...' : 'Tenho Certeza' }</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: StyleVars.Colors.primary
    },
    infoText:{
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    innerContainer:{
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    deactivateButton: {
        paddingVertical: 12,
        width: windowWidth * 0.8,
        backgroundColor: StyleVars.Colors.redButtonBackground,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
     },
     deactivateButtonText: {
         fontSize: 20,
         color: 'red'
     },
     deactivateButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    }
})