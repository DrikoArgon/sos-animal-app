'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView,
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var myFavoritePets = []

export default class MyFavouritesAdoptPetScreen extends Component{

    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
        this.searchString = ""

        this.state = {
            myFavouriteDataSource: ds.cloneWithRows(myFavoritePets),
            loading: true
        }
    }

    componentDidMount() {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })


        FirebaseRequest.fetchUserFavoritePetsToAdopt()
        .then((petsToAdoptArray) => {

            myFavoritePets = petsToAdoptArray

            this.setState({
                myFavouriteDataSource: ds.cloneWithRows(myFavoritePets),
                loading: false
            })
        })
        .catch((err) => { console.error("Error fecthing user favorite services, ", err.message) })
        

        FirebaseRequest.listenToFavoritePetToAdoptRemoved(this.updateListWhenRemoved)

    }

    updateListWhenRemoved = (removedFavorite) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < myFavoritePets.length; i++) {
            if (myFavoritePets[i].favoriteKey === removedFavorite.favoriteKey) {
                index = i
                break
            }
        }

        if (index !== null) {
            myFavoritePets.splice(index, 1)
        }

        this.setState({
            myFavouriteDataSource: ds.cloneWithRows(myFavoritePets)
        })
    }



    toPetProfile(petData){
        this.props.toRoute(Routes.petToAdoptProfile(petData))
    }

    _renderRow(rowData) {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.petContainer}
                onPress={() => this.toPetProfile(rowData)}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: "data:image/jpeg;base64," + rowData.profilePhoto }}
                        style={styles.petImage}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.rowText}>{rowData.name}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.rowText}>{rowData.situation}</Text>
                </View>
            </TouchableOpacity>

        )
    }

    render(){
        return (
            <View style={styles.container}>
                {!this.state.loading ?
                    (
                        <ListView
                            dataSource={this.state.myFavouriteDataSource}
                            renderRow={(rowData) => this._renderRow(rowData)}
                            contentContainerStyle={styles.listView}
                            removeClippedSubviews={false}
                        >
                        </ListView>
                    ) :
                    (
                        <View style={styles.loadingView}>
                            <Text style={styles.loadingText}>Carregando...</Text>
                        </View>
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
    listView:{

        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10

    },
    rowText:{
        color: 'white',
        fontSize: 12
    },
    petContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.45,
        marginBottom: 15,
        alignItems: 'center'

    },
    petImage:{
        height: windowWidth * 0.22,
        width: windowWidth * 0.22,
        borderRadius: (windowWidth * 0.22) / 2
    },
    textContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    imageContainer:{
        justifyContent: 'center',
        marginBottom: 7,
        marginTop: 5
    },
    searchBarContainer:{
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
    friendsNotFoundText:{
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
    tabStyle:{
        backgroundColor: StyleVars.Colors.secondary,
        borderColor: 'rgba(255,255,255,0.5)'
    },
    activeTabStyle:{
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
    }




})