'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import FirebaseRequest from '../Firebase/FirebaseRequest'


const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const servicesAndGroupsList = []

export default class MyFavouritesPetServicesScreen extends Component{

    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
        this.searchString = ""

        this.state = {
            servicesAndGroupsListDataSource: ds.cloneWithRows(servicesAndGroupsList),
            loading: true
        }
    }

    componentDidMount() {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        if (FirebaseRequest.getCurrentUserFavoriteServicesAndGroups()) {

            servicesAndGroupsList = FirebaseRequest.getCurrentUserFavoriteServicesAndGroups()

            this.setState({
                servicesAndGroupsListDataSource: ds.cloneWithRows(servicesAndGroupsList),
                loading: false
            })
        }
        else {

            FirebaseRequest.fetchUserFavoriteServicesAndGroups()
                .then((servicesAndGroupsArray) => {

                    servicesAndGroupsList = servicesAndGroupsArray

                    this.setState({
                        servicesAndGroupsListDataSource: ds.cloneWithRows(servicesAndGroupsList),
                        loading: false
                    })
                })
                .catch((err) => { console.error("Error fecthing user favorite services, ", err.message) })
        }

        FirebaseRequest.listenToFavoriteServiceOrGroupRemoved(this.updateListWhenRemoved)
    }

    updateListWhenRemoved = (removedFavorite) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < servicesAndGroupsList.length; i++) {
            if (servicesAndGroupsList[i].favoriteKey === removedFavorite.favoriteKey) {
                index = i
                break
            }
        }

        if (index !== null) {
            servicesAndGroupsList.splice(index, 1)
        }

        this.setState({
            servicesAndGroupsListDataSource: ds.cloneWithRows(servicesAndGroupsList)
        })
    }

    toProfile(rowData) {
        
        if (rowData.activityType === "ONG/OSCIPS/Grupo de Proteção Animal") {
            this.props.toRoute(Routes.ongProfile(rowData, rowData.isMember, false))
        } else {
            this.props.toRoute(Routes.serviceProfile(rowData))
        }
    }

    _renderRow(rowData){
        return(
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.serviceContainer}
                    onPress={() => this.toProfile(rowData)}
                >
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: "data:image/jpeg;base64," + rowData.logoImage }}
                            style={styles.serviceLogoImage}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.rowName}>{rowData.name}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.rowType}>{rowData.activityType}</Text>
                    </View>
                </TouchableOpacity>
            
        )
    }

    render(){

        return(
            <View style={styles.container}>
                {!this.state.loading ?
                    (
                        <ListView
                            dataSource={this.state.servicesAndGroupsListDataSource}
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
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10

    },
    rowName:{
        color: 'white',
        fontSize: 16
    },
    rowType:{
        color: 'white',
        fontSize: 12
    },
    serviceContainer: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.45,
        height: windowHeight * 0.27,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center'

    },
    serviceLogoImage: {
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