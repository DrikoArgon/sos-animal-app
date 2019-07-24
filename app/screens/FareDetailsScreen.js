'use strict'

import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView,
    TextInput
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var fareAnimals = []
var selectedAnimals = []
var adoptedAnimals = []

export default class FareDetailsScreen extends Component {

    constructor(props) {
        super(props)

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.state = {
            fareAnimalsDataSource: ds.cloneWithRows(fareAnimals),
            adoptedAnimalsDataSource: ds.cloneWithRows(adoptedAnimals),
            myAnimalsSelected: true,
            loading: true,
            updating: false
        }
    }

    componentDidMount(){

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        FirebaseRequest.fetchGroupFareAnimals(this.props.data.key,false)
        .then((animalArray) => {

            fareAnimals = animalArray

            FirebaseRequest.fetchGroupFareAnimals(this.props.data.key,true)
            .then((adoptedAnimalsArray) => {

                adoptedAnimals = adoptedAnimalsArray

                this.setState({
                    loading: false,
                    fareAnimalsDataSource: ds.cloneWithRows(fareAnimals),
                    adoptedAnimalsDataSource: ds.cloneWithRows(adoptedAnimals)
                })

            })
            .catch((err) => alert("Erro ao coletar dados dos animais adotados nesta feira."))

        })
        .catch((err) => {alert('Erro ao coletar dados de animais desta feira.')})


    }


    selectPet(rowData) {

        if (rowData.selected) {
            for (var i = 0; i < fareAnimals.length; i++) {
                if (rowData.key === fareAnimals[i].key) {
                    fareAnimals[i].selected = false
                    break
                }
            }

            for (var i = 0; i < selectedAnimals.length; i++) {
                if (rowData.key === selectedAnimals[i].key) {
                    selectedAnimals.splice(i,1)
                    break
                }
            }

        }
        else {
            for (var i = 0; i < fareAnimals.length; i++) {
                if (rowData.key === fareAnimals[i].key) {
                    if (rowData.selected) {
                        delete rowData.selected
                    }
                    selectedAnimals.push(fareAnimals[i])
                    fareAnimals[i] = Object.assign(fareAnimals[i], { selected: true })
                    break
                }
            }
        }


        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.setState({
            fareAnimalsDataSource: ds.cloneWithRows(fareAnimals)
        })

    }


    _renderRow(rowData) {

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.petContainer, rowData.selected ? { backgroundColor: 'darkgreen' } : {}]}
                onPress={() => this.selectPet(rowData)}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'data:image/jpeg;base64,' + rowData.profilePhoto }}
                        style={styles.petImage}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.rowText}>{rowData.name}</Text>
                </View>
            </TouchableOpacity>

        )
    }

    _renderAdoptetAnimalsRow(rowData) {

        rowData = Object.assign(rowData, { petSituation: 1 })

        return (
            <View style={styles.petContainer} >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'data:image/jpeg;base64,' + rowData.profilePhoto }}
                        style={styles.petImage}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.rowText}>{rowData.name}</Text>
                </View>
            </View>

        )
    }

    changeListView(index) {
        index === 0 ? this.setState({ myAnimalsSelected: true })
            : this.setState({ myAnimalsSelected: false })
    }

    changeAnimalStatus(){

        if(selectedAnimals.length === 0){
            return alert('Por favor, selecione pelo menos um animal.')
        }

        this.setState({
            updating: true
        })

        FirebaseRequest.updateFareAnimalAdoptionStatus(this.props.data.key,this.props.data.pinID,selectedAnimals)
        .then(() => {
            this.setState({
                updating: false
            })
            this.props.back()
        })
        .catch((err) => {
            this.setState({
                updating: false
            })
            console.error("Erro ao atualizar informações: ",err.message)
        })

    }

    render() {
        return (
            <View style={styles.container}>
                <SegmentedControlTab
                    values={['Para Adoção', 'Adotados']}
                    selectedIndex={0}
                    tabsContainerStyle={styles.tabContainerStyle}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.activeTabStyle}
                    onTabPress={index => this.changeListView(index)}
                />
                {!this.state.loading ? 
                    (
                        this.state.myAnimalsSelected ? 
                            (
                                <ListView
                                    dataSource={this.state.fareAnimalsDataSource}
                                    renderRow={(rowData) => this._renderRow(rowData)}
                                    contentContainerStyle={styles.listView}
                                >
                                </ListView>
                            ) 
                            : 
                            (
                                <ListView 
                                    dataSource={ this.state.adoptedAnimalsDataSource }
                                    renderRow={(rowData) => this._renderAdoptetAnimalsRow(rowData)}
                                    contentContainerStyle={styles.listView}
                                >
                                </ListView>
                            )
                    )
                    :
                    (
                        <View style={styles.loadingView}>
                            <Text style={styles.loadingText}>Carregando...</Text>
                        </View>
                    )  
                }
                {this.state.myAnimalsSelected ? 
                    (
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            activeOpacity={0.5}
                            onPress={() => { this.changeAnimalStatus() }}
                        >

                            <View style={styles.adoptionButton}>
                                <Text style={styles.adoptionButtonText}>{this.state.updating ? "Atualizando..." : "Marcar como Adotado"}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                    :
                    (
                        <View />
                    )

                }
            </View>
        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.listViewBackground
    },
    errorContainer: {
        flex: 1,
        backgroundColor: StyleVars.Colors.listViewBackground,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10

    },
    rowText: {
        color: 'white',
        fontSize: 12
    },
    petContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.45,
        marginBottom: 15,
        alignItems: 'center'

    },
    petImage: {
        height: windowWidth * 0.22,
        width: windowWidth * 0.22,
        borderRadius: (windowWidth * 0.22) / 2
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageContainer: {
        justifyContent: 'center',
        marginBottom: 7,
        marginTop: 5
    },
    searchBarContainer: {
        backgroundColor: "rgba(255,255,255,0.5)",
        marginBottom: 5,
        height: windowHeight * 0.06,
        justifyContent: 'center',
        paddingHorizontal: 10,
        flexDirection: 'row'
    },
    input: {
        flex: 1,
        color: 'black',
        fontSize: 14
    },
    friendsNotFoundText: {
        color: 'white',
        fontSize: 20
    },
    searchIcon: {
        width: windowWidth * 0.05,
        height: windowHeight * 0.05
    },
    tabContainerStyle: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 5,

    },
    tabStyle: {
        backgroundColor: StyleVars.Colors.secondary,
        borderColor: 'rgba(255,255,255,0.5)'
    },
    activeTabStyle: {
        backgroundColor: StyleVars.Colors.primary
    },
    loadingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        color: 'white',
        fontSize: 16
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
    adoptionButton: {
        backgroundColor: 'darkgreen',
        borderRadius: 10,
        paddingVertical: 15,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    adoptionButtonText: {
        color: 'white',
        fontSize: 16
    },

})