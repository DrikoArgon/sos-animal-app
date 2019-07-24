'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class AnnouncerPlanScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            currentServiceInfo: FirebaseRequest.getCurrentService()
        }

    }
    


    render(){
        return(
            <View style={styles.container}>
                <View style={styles.innerContainer}> 
                    <Text style={styles.planExpirationText}>Aniversário do Plano</Text>
                    <View  style={styles.buttonContainer}>
                        <View style={styles.expirationDateDisplay}>
                            <Text style={styles.expirationDateDisplayText}>{this.state.currentServiceInfo.planExpirationDay + "/" + this.state.currentServiceInfo.planExpirationMonth + "/" + this.state.currentServiceInfo.planExpirationYear}</Text>
                        </View>
                    </View>
                    <Text style={styles.planChangeInfo}>O plano pode ser alterado a qualquer momento. O valor de cobrança será alterado após o pagamento da próxima fatura</Text>
                    <Text style={styles.planExpirationText}>Plano Atual</Text>
                    <View  style={styles.buttonContainer}>
                        <View style={styles.expirationDateDisplay}>
                            <Text style={styles.expirationDateDisplayText}>Plano {this.state.currentServiceInfo.planType}</Text>
                        </View>
                    </View>
                    <Text style={styles.planExpirationText}>Valor</Text>
                     <View  style={styles.buttonContainer}>
                        <View style={styles.expirationDateDisplay}>
                            <Text style={styles.costText}>{this.state.currentServiceInfo.planCost}</Text>
                        </View>
                    </View>
                    <TouchableOpacity  
                        style={styles.buttonContainer}
                        activeOpacity={0.5}
    
                    >
                        <View style={styles.changePlanButton}>
                            <Text style={styles.changePlanButtonText}>Alterar Plano</Text>
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
        flex: 1,
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
        marginBottom: 10
    },
    planChangeInfo:{
        color: 'white',
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 10
    },
     changePlanButton:{
        backgroundColor: StyleVars.Colors.runawayAnimalPinBackground,
        borderRadius: 5,
        paddingVertical: 10,
        width: windowWidth * 0.7,
        marginTop: 30,
        alignItems: 'center'
    },
    changePlanButtonText: {
        color: 'red',
        fontSize: 20
    }


})