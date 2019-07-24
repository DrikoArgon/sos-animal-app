'use strict'

import React, {Component} from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    Modal,
    TouchableWithoutFeedback
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var myFares = []


export default class FareHistoryScreen extends Component{

    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
        this.state = {
            dataSource: ds.cloneWithRows(myFares),
            loading: true
        }

    }

    componentDidMount(){

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        FirebaseRequest.fetchGroupFares()
        .then((fareArray) => {
            myFares = fareArray

            this.setState({
                dataSource: ds.cloneWithRows(myFares),
                loading: false
            })

            FirebaseRequest.listenToGroupFareAdded(this.updateFareListWhenAdded)
            FirebaseRequest.listenToGroupFareChanges(this.updateFareListWhenChanged)
            FirebaseRequest.listenToGroupFareRemoved(this.updateFareListWhenRemoved)
        })
        .catch((err) => {
            this.setState({
                loading: false
            })
            alert('Erro ao procurar feiras.')
        })

    }

    updateFareListWhenAdded = (newFare) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        myFares.push(newFare)

        this.setState({
            dataSource: ds.cloneWithRows(newFare)
        })

    }

    updateFareListWhenChanged = (changedFare) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < myFares.length; i++) {
            if (myFares[i].key === changedFare.key) {
                myFares[i] = changedFare
                break
            }
        }

        this.setState({
            dataSource: ds.cloneWithRows(myFares)
        })

    }

    updateFareListWhenRemoved = (fareRemoved) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < myFares.length; i++) {
            if (myFares[i].key === fareRemoved.key) {
                index = i
            }
        }

        if (index !== null) {
            myFares.splice(index, 1)
        }

        this.setState({
            dataSource: ds.cloneWithRows(myFares)
        })

    }

    onRowPress(rowData){
            this.props.toRoute(Routes.fareDetails(rowData))
    }


    _renderRow(rowData){

        let rowBackgroundColor = rowData.active ? {backgroundColor: "darkgreen"} 
                                              : {backgroundColor: StyleVars.Colors.runawayAnimalPinBackground}

        let rowTextColor = rowData.active ? {color: 'lime'}  
                                          : {color: 'red'}                                 
        return(
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.rowStyle, rowBackgroundColor]}
                onPress={() => this.onRowPress(rowData) }
                
            >
                <View style={styles.dateContainer}>
                    <Text style={[styles.dateText,rowTextColor]}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.rowText, rowTextColor]}>{rowData.animalsForAdoptionAmount} {rowData.animalsForAdoptionAmount != 1 ? "animais" : "animal"} para adoção</Text>
                </View>
                <View style={styles.adoptedQtdContainer}>
                    <Text style={[styles.rowText,rowTextColor]}>{rowData.adoptedAnimalsAmount} adotado(s)</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render(){
        return(
            this.state.loading ? 
            (
                    <View style={styles.container}>
                        <View style={styles.loadingView}>
                            <Text style={styles.loadingText}>Carregando...</Text>
                        </View>
                    </View>
            ) 
            : 
            (
                <View style={styles.container}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) => this._renderRow(rowData)}
                        style={styles.container}
                    >
                    </ListView>
                </View >
            )
            
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.listViewBackground
    },
    rowStyle:{
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        paddingVertical: 10
    },
    rowText:{
        color: 'white',
        fontSize: 12
    },
    dateText:{
        color: 'white',
        fontSize: 12
    },
    textContainer:{
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    },
    adoptedQtdContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    },
    dateContainer:{
        alignItems: 'center',
        paddingVertical: 10
    },
    rowIcon:{
        width: windowWidth * 0.10,
        height: windowHeight * 0.10
    },
    checkImage:{
        width: windowWidth * 0.10,
        height: windowHeight * 0.02
    },
    loadingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        color: 'white',
        fontSize: 16
    }
})