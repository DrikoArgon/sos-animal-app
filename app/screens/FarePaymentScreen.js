'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class FarePaymentScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            cardNumber: null,
            cardName: null,
            expirationMonth: null,
            expirationYear: null,
            securityCode: null
        }

    }


    render(){
        return(
            <View style={styles.container}>
                 <ScrollView
                ref="scrollView"
                keyboardShouldPersistTaps={false}
                automaticallyAdjustContentInsects={true}
                alwaysBounceVertical={true}
                style={styles.scrollView}
                >
                    <View style={styles.innerContainer}> 
                        <Text style={styles.planExpirationText}>Para evitar a alocação de feiras falsas ou de forma indevida, será cobrado um valor simbólico por feira.</Text>
                        <Text style={styles.planExpirationText}>Valor a pagar</Text>
                        <View  style={styles.buttonContainer}>
                            <View style={styles.expirationDateDisplay}>
                                <Text style={styles.costText}>R$ 4,90</Text>
                            </View>
                        </View>
                        <Text style={styles.planExpirationText}>Escolha a forma de pagamento</Text>
                        <View  style={styles.buttonContainer}>
                            <View style={styles.expirationDateDisplay}>
                                <Text style={styles.expirationDateDisplayText}></Text>
                            </View>
                        </View>
                        <Text style={styles.planExpirationText}>Dados do Cartão</Text>
                       <View style={styles.bigInputContainer}>
                            <TextInput 
                                placeholder="Número do Cartão"
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(cardNumber) => {this.cardNumber = cardNumber}}
                                returnKeyType="next"
                                onSubmitEditing={() => {}}
                            />
                        </View>
                        <View style={styles.bigInputContainer}>
                            <TextInput 
                                placeholder="Nome impresso no cartão"
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(cardName) => {this.cardName = cardName}}
                                returnKeyType="next"
                                onSubmitEditing={() => {}}
                            />
                        </View>
                        <Text style={styles.cardDetailsInfo}>Vencimento</Text>
                        <View style={styles.rowContainer}>
                            <View style={styles.smallInputContainer}>
                                <TextInput 
                                    placeholder="Mês"
                                    placeholderTextColor="white"
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(expirationMonth) => {this.expirationMonth = expirationMonth}}
                                    returnKeyType="next"
                                    onSubmitEditing={() => {}}
                                />
                            </View>
                            <View style={styles.smallInputContainer}>
                                <TextInput 
                                    placeholder="Ano"
                                    placeholderTextColor="white"
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(expirationYear) => {this.expirationYear = expirationYear}}
                                    returnKeyType="next"
                                    onSubmitEditing={() => {}}
                                />
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View  style={styles.buttonContainer}>
                                <Text style={styles.cardDetailsInfo}>Código de Segurança</Text>
                                 <View style={styles.bigInputContainer}>
                            <TextInput 
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(securityCode) => {this.securityCode = securityCode}}
                                returnKeyType="next"
                                onSubmitEditing={() => {}}
                            />
                        </View>
                            </View>
                        </View>
                        <TouchableOpacity  
                            style={styles.buttonContainer}
                            activeOpacity={0.5}
                            onPress={() => this.props.toRoute(Routes.ongFares())}
                        >
                            <View style={styles.createFareButton}>
                                <Text style={styles.createFareButtonText}>Criar Feira</Text>
                            </View>
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
        backgroundColor: StyleVars.Colors.primary,
    },
    innerContainer:{
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        paddingHorizontal: 5
    },
    rowContainer:{
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    buttonContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        
    },
    
    expirationDateDisplay:{
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.8,
        marginBottom: 5,
        alignItems: 'center'
    },
    expirationDateDisplayText:{
        color: 'white',
        fontSize: 22
    },
    costText:{
        color: 'lime',
        fontSize: 20
    },
    planExpirationText:{
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center'
    },
    cardDetailsInfo:{
        color: 'black',
        fontSize: 12,
    },
    smallContainer:{
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.4,
        marginBottom: 5,
        alignItems: 'center',
        paddingHorizontal: 10
    },
     createFareButton:{
        backgroundColor: "darkgreen",
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginTop: 30,
        alignItems: 'center'
    },
    createFareButtonText: {
        color: 'lime',
        fontSize: 20
    },
     input: {
        flex: 1,
        alignItems: 'center',
        height: 30,
        backgroundColor: StyleVars.Colors.secondary,
        color: 'white',
        fontSize: 14,
        borderRadius: 5,
        textAlign: 'center'
    },
    bigInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: windowWidth * 0.8,
        paddingVertical: 10
        
    },
    smallInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: windowWidth * 0.43,
        paddingHorizontal: 10,
        paddingVertical: 10
        
    }


})