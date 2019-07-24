'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    TextInput
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class AnnouncerCodeValidationScreen extends Component {

    constructor(props){
        super(props)
        
        this.state = {
            code: null
        }
    }


    render(){
        return(
            <View style={styles.container}>
                <View style={styles.innerContainer}> 
                    <Text style={styles.planExpirationText}>Digitar Código Promocional</Text>
                    <View  style={styles.buttonContainer}>
                        <View style={styles.expirationDateDisplay}>
                             <TextInput 
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoFocus={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(code) => {this.code = code}}
                                returnKeyType="next"
                                onSubmitEditing={() => this._surnameRef.focus()}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Dados da Troca</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Nome do Usuário</Text>
                    <Text style={styles.infoText}>Promoção</Text>
                    <Text style={styles.infoText}>Valor</Text>
                    <Text style={styles.infoText}>Data da troca</Text>
                </View>
                <View style={styles.innerContainer}> 
                    
                    <TouchableOpacity  
                        style={styles.buttonContainer}
                        activeOpacity={0.5}
    
                    >
                        <View style={styles.validadeCodeButton}>
                            <Text style={styles.validadeCodeButtonText}>Validar Código</Text>
                        </View>
                    </TouchableOpacity>
                 </View>   
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
        paddingVertical: 10,
        alignItems: 'center'
    },
    buttonContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5
    },
    expirationDateDisplay:{
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    expirationDateDisplayText:{
        color: 'white',
        fontSize: 22
    },
    costText:{
        color: 'lime',
        fontSize: 22
    },
    planExpirationText:{
        color: 'white',
        fontSize: 20,
        marginBottom: 20
    },
    planChangeInfo:{
        color: 'white',
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 10
    },
     validadeCodeButton:{
        backgroundColor: '#003000',
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginTop: 30,
        alignItems: 'center'
    },
    validadeCodeButtonText: {
        color: 'lime',
        fontSize: 20
    },
    input: {
        flex: 1,
        alignItems: 'center',
        height: 40,
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    headerContainer:{
        backgroundColor: StyleVars.Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        marginTop: 5
    },
    headerText:{
        color: 'white',
        fontSize: 20
    },
    infoContainer:{
        backgroundColor: StyleVars.Colors.listViewBackground,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    },
    infoText:{
        color: 'white',
        fontSize: 14,
        marginBottom: 15
    }



})