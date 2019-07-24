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

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import FirebaseRequest from '../Firebase/FirebaseRequest'


const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const levels = [
    {
        name: 'Pantera',
        pointsNeeded: '2000'
    },
    {
        name: 'Hiena',
        pointsNeeded: '1750'
    },
    {
        name: 'Búfalo',
        pointsNeeded: '1500'
    },
    {
        name: 'Cavalo',
        pointsNeeded: '1250'
    },
    {
        name: 'Lhama',
        pointsNeeded: '1000'
    },
    {
        name: 'Javali',
        pointsNeeded: '750'
    },
    {
        name: 'Águia',
        pointsNeeded: '500'
    },
    {
        name: 'Cachorro',
        pointsNeeded: '400'
    },
    {
        name: 'Gato',
        pointsNeeded: '300'
    },
    {
        name: 'Coelho',
        pointsNeeded: '200'
    },
    {
        name: 'Tatu',
        pointsNeeded: '150'
    },
    {
        name: 'Borboleta',
        pointsNeeded: '50'
    },
    {
        name: 'Abelha',
        pointsNeeded: '25'
    },
    {
        name: 'Formiga',
        pointsNeeded: '0'
    }

]


export default class LevelsScreen extends Component {

    constructor(props) {
        super(props)

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.state = {
            levelDatasource: ds.cloneWithRows(levels)
        }

    }



    _renderRow(rowData) {


        return (
            <View style={styles.levelInfoContainer}>
                <View style={styles.rowContainer}>
                    {this.props.data.protectionLevelName === rowData.name ? 
                        (
                            <View style={[styles.levelNameContainer, this.props.data.protectionLevelName === rowData.name ? { backgroundColor: 'rgb(46,128,138)' } : {}]}>
                                <View style={styles.rowContainer}>
                                    <Image
                                        source={ require("../Resources/Stars/fullStar.png")}
                                        style={styles.starsImage}
                                        resizeMode='contain'
                                    />
                                    <Text style={styles.levelNameText}>{rowData.name}</Text>
                                    <Image
                                        source={require("../Resources/Stars/fullStar.png")}
                                        style={styles.starsImage}
                                        resizeMode='contain'
                                    />
                                </View>
                            </View>
                        )
                        :
                        (
                            <View style={[styles.levelNameContainer, this.props.data.protectionLevelName === rowData.name ? { backgroundColor: 'rgb(46,128,138)' } : {}]}>
                                <Text style={styles.levelNameText}>{rowData.name}</Text>
                            </View>
                        )
                    }        
                    <View style={[styles.pointNeededContainer, this.props.data.protectionLevelName === rowData.name ? { backgroundColor: 'rgb(30,94,101)'} : {} ]}>
                        <Text style={styles.levelNameText}>{rowData.pointsNeeded}</Text>
                    </View>
                </View>
               
            </View>
        )
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
                        dataSource={this.state.levelDatasource}
                        renderRow={(rowData) => this._renderRow(rowData)}
                        style={styles.listView}
                    >
                    </ListView>
                    <View style={styles.rowContainer}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.bigButtonContainer}
                            onPress={() => this.props.toRoute(Routes.howToEarnPoints())}
                        >
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Como consigo pontos?</Text>
                            </View>
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
        backgroundColor: 'rgb(12,62,68)'
    },
    innerContainer: {
        alignItems: 'center',
        paddingVertical: 6
    },
    listView: {
        marginTop: 5
    },
    separator: {
        flex: 1,
        height: 2,
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 10,
        backgroundColor: 'white'
    },
    nameText: {
        fontSize: 20,
        color: 'white'
    },
    locationText: {
        fontSize: 16,
        color: 'white'
    },
    rowContainer: {
        flexDirection: 'row',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    },
    bigButtonContainer: {
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 25
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
    levelInfoContainer:{
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    levelNameText:{
        color: 'white',
        fontSize: 18
    },
    starsImage: {
        height: windowHeight * 0.04,
        width: windowWidth * 0.12,
    }

})