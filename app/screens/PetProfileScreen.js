'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class PetProfileScreen extends Component{

    constructor(props){
        super(props)

        this.data = this.props.data

    }


    capitalizeFirstLetter(string) {

        return string && string.split(' ').map(function (word) {
            return word.replace(word[0], word[0].toUpperCase())
        }).join(' ')

    }

    goToEditPet(){
        this.props.toRoute(Routes.editPet(this.data))
    }

    renderEditIcon() {

        return (
            this.props.data.isOwner ?
                (
                    <TouchableOpacity
                        style={styles.reportIconContainer}
                        activeOpacity={0.5}
                        onPress={() => this.goToEditPet()}
                    >
                        <Image
                            source={require("../Resources/penIcon.png")}
                            style={styles.reportIcon}
                            resizeMode='contain'
                        />
                    </TouchableOpacity> 
                )
                :
                (
                    <View></View>
                )
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
                        <Image 
                            source={{uri: 'data:image/jpeg;base64,' + this.data.profilePhoto}}
                            style={styles.profileImage}
                        />
                        <Text style={styles.nameText}>{this.data.name}</Text>
                        <View style={styles.rowContainer}>
                            <View style={styles.separator}></View>
                        </View>
                        <Text style={styles.locationText}>{this.capitalizeFirstLetter(this.data.city)}, {this.data.state.length > 2 ? this.capitalizeFirstLetter(this.data.state) : this.data.state.toUpperCase()}</Text>
                        <Text style={styles.locationText}>{this.capitalizeFirstLetter(this.data.country)}</Text>                     
                        {this.renderEditIcon()}
                    </View>

                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Características</Text>
                    </View>
                    <View style={styles.caracteristicsContainer}>
                        <View style={styles.caractersticsInnerContainer}>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Idade</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.ageAmount} {this.props.data.ageType === 'Mês(meses)' ? this.props.data.ageAmount !== 1 ? "Meses" : "Mês" : this.props.data.ageType}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Sexo</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.gender}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Espécie</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.specie}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.caractersticsInnerContainer}>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Raça</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.breed}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Porte</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.size}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Cor</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.color}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.caractersticsInnerContainer}>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Castrado</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.castrated ? "Sim" : "Não"}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Vermifugado</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.dewormed ? "Sim" : "Não"}</Text>
                                </View>
                            </View>
                            <View style={styles.caracteristicsInfoContainer}>
                                <Text style={styles.infoText}>Vacinado</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>{this.props.data.vaccinated ? "Sim" : "Não"}</Text>
                                </View>
                            </View>
                        </View>
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
    innerContainer: {
        alignItems: 'center',
        paddingVertical: 6
    },
    profileImage:{
        height: windowWidth * 0.4,
        width: windowWidth * 0.4,
        borderRadius: (windowWidth * 0.4)/2,
        marginBottom: 10,
        marginTop: 5
    },
    separator:{
        flex: 1,
        height: 2,
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 10,
        backgroundColor: 'white'
    },
    nameText:{
        fontSize: 20,
        color: 'white'
    },
    locationText:{
        fontSize: 16,
        color: 'white'
    },
    rowContainer:{
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    headerContainer:{
        flex: 1,
        backgroundColor: StyleVars.Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        marginTop: 5
    },
    headerText:{
        color: 'white',
        fontSize: 20
    },
    temporaryHomeHeaderContainer:{
        flex: 1,
        backgroundColor: StyleVars.Colors.animalStreetPinBackground,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    temporaryHomeHeaderText:{
        color: "gold",
        fontSize: 16
    },
    petContainer:{
        flexDirection: 'row',
        backgroundColor: StyleVars.Colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.5,
        height: windowHeight * 0.2

    },
    petImage:{
        height: windowHeight * 0.15,
        width:  windowWidth * 0.15
    },
    textContainer:{
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15
    },
    imageContainer:{
        justifyContent: 'center'
    },
    rowText:{
        color: 'white',
        fontSize: 10
    },
    caracteristicsContainer:{
        backgroundColor: StyleVars.Colors.listViewBackground,
        flex: 1,
        paddingHorizontal: 5
    },
    caractersticsInnerContainer:{
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 12
    },
    caracteristicsInfoContainer:{
        flex: 1,
        alignItems: 'center'
    },
    infoText:{
        color: "white",
        fontSize: 15,
        textAlign: 'center'
    },
    infoContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5,
        width: windowWidth * 0.29,
        height: windowHeight * 0.08,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reportIcon: {
        width: windowWidth * 0.06,
        height: windowHeight * 0.06
    },
    reportIconContainer: {
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingVertical: 3,
        width: windowWidth * 0.1,
        height: windowWidth * 0.1,
        marginLeft: windowWidth * 0.87

    }
})