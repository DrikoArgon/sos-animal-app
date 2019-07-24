'use strict'

import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ListView
} from 'react-native'

import Share from 'react-native-share'
import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import FirebaseRequest from '../Firebase/FirebaseRequest'


const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const shareOptions = {
    title: 'Opções de divulgação',
    message: `Venha salvar a vida de um animal comigo!
O SOS Animal App é a forma mais rápida de dar visibilidade aos seus pedidos de ajuda.
Baixe o app e comece a fazer a diferença agora.`,
    url: 'https://www.facebook.com/sosanimalapp/'   
}

    

const howToEarnPointsList = [
    {
        name: 'Divulgar o app',
        pointsEarned: '2'
    },
    {
        name: 'Criar um pin',
        pointsEarned: '3'
    }
    
]


export default class HowToEarnPointsScreen extends Component {

    constructor(props) {
        super(props)

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.state = {
            dataSource: ds.cloneWithRows(howToEarnPointsList)
        }

    }



    _renderRow(rowData) {


        return (
            <View style={styles.levelInfoContainer}>
                <View style={styles.rowContainer}>            
                    <View style={styles.levelNameContainer}>
                        <Text style={styles.levelNameText}>{rowData.name}</Text>
                    </View>   
                    <View style={styles.pointNeededContainer}>
                        <Text style={styles.levelNameText}>{rowData.pointsEarned}</Text>
                    </View>
                </View>

            </View>
        )
    }

    shareSuccess() {

        FirebaseRequest.addPointsToUser(this.pointsForSharingApp, this.increaseUserCoins)
    }


    render() {


        return (
            <View style={styles.container}>
                <ScrollView
                    ref="scrollView"
                    keyboardShouldPersistTaps="never"
                    automaticallyAdjustContentInsects={true}
                    alwaysBounceVertical={true}
                    style={styles.scrollView}
                >
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) => this._renderRow(rowData)}
                        style={styles.listView}
                    >
                    </ListView>
                    <View style={styles.separator}></View>
                    <View style={styles.shareButtonContainer}>
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

                    </View>

                </ScrollView>
            </View>
        )
    }




}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.primary
    },
    innerContainer: {
        alignItems: 'center',
        paddingVertical: 6
    },
    listView: {
        marginTop: 15
    },
    separator: {
        flex: 1,
        height: 2,
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 10,
        backgroundColor: 'white'
    },
    locationText: {
        fontSize: 16,
        color: 'white'
    },
    rowContainer: {
        flexDirection: 'row',
    },
    shareButtonContainer:{
        alignItems: 'center'
    },
    buttomContainer: {
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        alignItems: 'center',
        paddingVertical: 10,
        width: windowWidth * 0.8,
        marginTop: 20
    },
    buttomText: {
        color: 'white',
        fontSize: 18
    },
    coinDisplayContainer: {
        flex: 0.5,
        paddingHorizontal: 10,
        marginTop: 20
    },
    coinAmountDisplay: {
        alignItems: 'center',
        height: 40,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    levelText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    levelTextContainer: {
        width: windowWidth,
        paddingVertical: 5,
        marginTop: 10
    },
    levelNameContainer: {
        width: windowWidth * 0.72,
        backgroundColor: StyleVars.Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5

    },
    pointNeededContainer: {
        width: windowWidth * 0.2,
        backgroundColor: StyleVars.Colors.listViewBackground,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    levelInfoContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    levelNameText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    }

})