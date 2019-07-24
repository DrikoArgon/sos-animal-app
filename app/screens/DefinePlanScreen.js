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
import PlanPaymentModal from '../components/PlanPaymentModal'
import Geocoder from 'react-native-geocoding'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class DefinePlanScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            loading: false,
            selectedPlanCost: 0,
            selectedPlanType: '',
            paymentModalVisible: false
        }

    }

    showSalePaymentModal(planInfo) {
        this.setState({
            selectedPlanCost: planInfo.planCost,
            selectedPlanType: planInfo.planType,
            paymentModalVisible: true
        })
    }

    hideModals() {
        this.setState({
            paymentModalVisible: false
        })
    }

    acceptPayment() {

        let currentDate = new Date()

        let expirationDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())

        FirebaseRequest.serviceSignup({
            name: this.props.data.name,
            socialMission: this.props.data.socialMission,
            owner: this.props.data.owner,
            cpf: this.props.data.cpf,
            activityType: this.props.data.activityType,
            crmv: this.props.data.crmv,
            adress: this.props.data.adress,
            district: this.props.data.district,
            phone: this.props.data.phone,
            celphone: this.props.data.celphone,
            email: this.props.data.email,
            city: this.props.data.city,
            state: this.props.data.state,
            country: this.props.data.country,
            cep: this.props.data.cep,
            website: this.props.data.website,
            logoImage: this.props.data.logoImage,
            backgroundImage: this.props.data.backgroundImage,
            password: this.props.data.password,
            planType: this.state.selectedPlanType,
            planCost: this.state.selectedPlanCost,
            planExpirationDay: expirationDate.getDate(),
            planExpirationMonth: expirationDate.getMonth() + 1,
            planExpirationYear: expirationDate.getFullYear(),
            openingHour: this.props.data.openingHour,
            closingHour: this.props.data.closingHour
        })
            .then((serviceID) => {

                if (this.state.selectedPlanType === "B") {

                    var formattedAdress = this.props.data.adress + " " + this.props.data.district + " " + this.props.data.city + " " + this.props.data.state + " " + this.props.data.country

                    console.log('Adress: ' ,formattedAdress)
                    console.log('Getting location')

                    Geocoder.getFromLocation(formattedAdress)
                    .then((json) => {
                        console.log(json.results[0].geometry.location)

                        FirebaseRequest.addNewServicePin(this.props.data, json.results[0].geometry.location.lat, json.results[0].geometry.location.lng, serviceID)
                        .then(() => {

                            FirebaseRequest.serviceLogin({
                                email: this.props.data.email,
                                password: this.props.data.password
                            })
                                .then((authData) => {
                                    FirebaseRequest.loadUserService(authData.uid)
                                        .then(() => {
                                            this.setState({
                                                loading: false,
                                                paymentModalVisible: false
                                            })
                                            this.props.toRoute(Routes.announcerArea({
                                                amountOfScenesToPop: 4
                                            }))
                                        })
                                        .catch((err) => {
                                            this.setState({
                                                loading: false
                                            })
                                            console.error("Error loading user service", err.message)
                                        })
                                })
                                .catch((err) => { console.error("Login failed with error ", err.message) })
                        })
                        .catch((err) => {
                            console.error('Error creating service pin.', err.message)
                        })
                    })
                    .catch((err) => {
                        console.log(err.message)
                    })      
                } else {

                    FirebaseRequest.login({
                        email: data.email,
                        password: data.password
                    })
                        .then((authData) => {
                            FirebaseRequest.loadUserService(authData.uid)
                                .then(() => {
                                    this.setState({
                                        loading: false,
                                        paymentModalVisible: false
                                    })
                                    this.props.toRoute(Routes.announcerArea({
                                        amountOfScenesToPop: 4
                                    }))
                                })
                                .catch((err) => {
                                    this.setState({
                                        loading: false
                                    })
                                    console.error("Error loading user service", err.message)
                                })
                        })
                        .catch((err) => { console.error("Login failed with error ", err.message) })
                }
            })
            .catch((err) => { console.error("Error Signing Service: ", err.message) })

    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.innerContainer}> 
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {this.showSalePaymentModal({
                            planCost: 'R$ 22,90',
                            planType: 'A'
                        })}} 
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/meuPerfilIcon.png")}
                            style={styles.icon}
                            resizeMode='contain'
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.iconDescriptionText}>Área exclusiva para anunciantes</Text>
                            <Text style={styles.iconDescriptionText}>Promoções ilimitadas para atrair clientela</Text>
                            <Text style={styles.iconDescriptionText}>Visibilidade nos filtros de busca de serviços pet</Text>
                            <Text style={styles.iconDescriptionText}>Interação direta com os clientes</Text>
                        </View>
                        <View style={styles.choosePlanButtonContainer}>
                            <View style={styles.choosePlanButton}>
                                <Text style={styles.choosePlanButtonText}>R$ 22,90</Text>
                            </View>
                        </View>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5} 
                        onPress={() => {this.showSalePaymentModal({
                            planCost: 'R$ 36,90',
                            planType: 'B'
                        })}}
                    >
                    <View style={styles.iconContainer}>
                        <Image 
                            source={require("../Resources/meuPerfilIcon.png")}
                            style={styles.icon}
                            resizeMode='contain'
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.iconDescriptionText}>Área exclusiva para anunciantes</Text>
                            <Text style={styles.iconDescriptionText}>Promoções ilimitadas para atrair clientela</Text>
                            <Text style={styles.iconDescriptionText}>Visibilidade nos filtros de busca de serviços pet</Text>
                            <Text style={styles.iconDescriptionText}>Interação direta com os clientes</Text>
                            <Text style={styles.iconDescriptionText}>Seu pin no mapa com sua logo onde fica seu estabelecimento</Text>
                        </View>
                        <View style={styles.choosePlanButtonContainer}>
                            <View style={styles.choosePlanButton}>
                                <Text style={styles.choosePlanButtonText}>R$ 36,90</Text>
                            </View>
                        </View>
                    </View>
                    </TouchableOpacity>
                </View>
                <PlanPaymentModal
                    visible={this.state.paymentModalVisible}
                    hideModals={() => this.hideModals()}
                    acceptPayment={() => this.acceptPayment()}
                    price={this.state.selectedPlanCost}
                />
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
        flexDirection: 'row',
        padding: 10,
        flex: 1
    },
    iconContainer: {
        borderRadius: 10,
        backgroundColor: StyleVars.Colors.secondary,
        width: windowWidth * 0.45,
        alignItems: 'center',
        paddingHorizontal: 10,
        flex: 1,
        marginRight: 10
    },
    icon:{
        width: windowWidth * 0.30,
        height: windowHeight * 0.25,
        
    },
    textContainer:{
        flex: 1,
        paddingVertical: 10,
        justifyContent: 'center'
    },
    iconDescriptionText:{
        fontSize: 12,
        color: 'white',
        textAlign: 'center',
        marginBottom: 15
    },
    choosePlanButtonContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5
    },
    choosePlanButton:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 5,
        alignItems: 'center'
    },
    choosePlanButtonText:{
        color: 'lime',
        fontSize: 16
    }

})