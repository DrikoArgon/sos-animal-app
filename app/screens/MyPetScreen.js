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
    TextInput
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var myPets = []

var temporaryHomePets = []

export default class MyPetScreen extends Component{

    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
        this.searchString = ""
    

        this.state = {
            myPetsDataSource: ds.cloneWithRows(myPets),
            temporaryPetDataSource: ds.cloneWithRows(temporaryHomePets),
            selectedIndex: 0,
            loading: true,
            modalVisible: false,
            petsFound: true,
            temporaryPetsFound: true,
            myPetsSelected: true
        }

    }



    componentDidMount(){

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        // if (FirebaseRequest.getCurrentUserPets(false)) {

            
        //     myPets = FirebaseRequest.getCurrentUserPets(false)
        //     temporaryHomePets = FirebaseRequest.getCurrentUserPets(true)

        //     for(var i = 0; i < myPets.length; i++){
        //         console.log("Pet ID: ", myPets[i].key)
        //         for(var j = 0; i < myPets.length; j++){
        //             if(myPets[j].key === myPets[i].key){
        //                 console.log("Pet duplicado! ", myPets[j].key)
        //             }
        //         }
        //     }

        //     this.setState({
        //         myPetsDataSource: ds.cloneWithRows(myPets),
        //         temporaryPetDataSource: ds.cloneWithRows(temporaryHomePets),
        //         loading: false
        //     })

        //     FirebaseRequest.listenToNewPetsAdded(this.updatePetsListWhenAdded, this.updateTemporaryHomePetsListWhenAdded)
        // }
        FirebaseRequest.fetchUserPets(false)
            .then((petsArray) => {

                myPets = petsArray

                if(petsArray.length === 0){
                    myPets = []
                }

                this.setState({
                    myPetsDataSource: ds.cloneWithRows(myPets)
                })

            })
            .catch((err) => { console.error("Error fecthing user pets, ", err.message) })

        FirebaseRequest.fetchUserPets(true)
            .then((petsArray) => {

                temporaryHomePets = petsArray

                if (petsArray.length === 0) {
                    temporaryHomePets = []
                }

                this.setState({
                    temporaryPetDataSource: ds.cloneWithRows(temporaryHomePets),
                    loading: false
                })

                FirebaseRequest.listenToNewPetsAdded(this.updatePetsListWhenAdded, this.updateTemporaryHomePetsListWhenAdded)

            })
            .catch((err) => { console.error("Error fecthing user temporary pets, ", err.message) })
        

            FirebaseRequest.listenToUserPetRemoved(this.updatePetsListWhenRemoved)
            FirebaseRequest.listenToUserPetChanges(this.updatePetsListWhenChanged)
            FirebaseRequest.listenToUserTemporaryHomePetRemoved(this.updateTemporaryHomePetsListWhenRemoved)
            FirebaseRequest.listenToUserTemporaryHomePetChanges(this.updateTemporaryHomePetsListWhenChanged)
    }

    componentWillUnmount(){
        FirebaseRequest.removeNewPetsListener()
    }


    toPetProfile(petData){
        this.props.toRoute(Routes.petProfile(petData,true,false))
    }

    toAddPet() {
        this.props.toRoute(Routes.addNewPet())
    }

    changeListView = index => {
        index === 0 ? this.setState({ myPetsSelected: true, selectedIndex: index })
            : this.setState({ myPetsSelected: false, selectedIndex: index  })
    }

    updatePetsListWhenAdded = (newPet) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        myPets.push(newPet)

        this.setState({
            myPetsDataSource: ds.cloneWithRows(myPets)
        })
    }

    updatePetsListWhenChanged = (changedPet) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < myPets.length; i++) {
            if (myPets[i].key === changedPet.key) {
                myPets[i] = changedPet
                break
            }
        }

        this.setState({
            myPetsDataSource: ds.cloneWithRows(myPets)
        })
    }


    updatePetsListWhenRemoved = (removedPet) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for(var i = 0; i < myPets.length; i++){
            if(myPets[i].key === removedPet.key){
                index = i
                break
            }
        }

        if(index !== null){
            myPets.splice(index,1)
        }

        this.setState({
            myPetsDataSource: ds.cloneWithRows(myPets)
        })
    }

    updateTemporaryHomePetsListWhenAdded = (newTemporaryHomePet) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        temporaryHomePets.push(newTemporaryHomePet)

        this.setState({
            temporaryPetDataSource: ds.cloneWithRows(temporaryHomePets)
        })
    }

    updateTemporaryHomePetsListWhenChanged = (changedPet) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < temporaryHomePets.length; i++) {
            if (temporaryHomePets[i].key === changedPet.key) {
                temporaryHomePets[i] = changedPet
                break
            }
        }

        this.setState({
            temporaryPetDataSource: ds.cloneWithRows(temporaryHomePets)
        })
    }


    updateTemporaryHomePetsListWhenRemoved = (removedPet) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < temporaryHomePets.length; i++) {
            if (temporaryHomePets[i].key === removedPet.key) {
                index = i
                break
            }
        }

        if (index !== null) {
            temporaryHomePets.splice(index, 1)
        }

        this.setState({
            temporaryPetDataSource: ds.cloneWithRows(temporaryHomePets)
        })
    }

    _renderRow(rowData){

        rowData = Object.assign(rowData, {petSituation: 0})

        return(
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.petContainer}
                    onPress={() => this.toPetProfile(rowData)}
                >
                    <View style={styles.imageContainer}>
                        <Image 
                            source={ { uri: 'data:image/jpeg;base64,' + rowData.profilePhoto } }
                            style={styles.petImage}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.rowText}>{rowData.name}</Text>
                    </View>
                </TouchableOpacity>
            
        )
    }

    _renderTemporaryHomePetsRow(rowData) {

        rowData = Object.assign(rowData, { petSituation: 1 })

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.petContainer}
                onPress={() => this.toPetProfile(rowData)}
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

    searchPet(){

        let newArray = []

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})

        if(this.searchString == ""){

            if(this.state.myPetsSelected){
                this.setState({
                    myPetsDataSource: ds.cloneWithRows(myPets),
                    petsFound: true
                })
            }else{
                this.setState({
                    temporaryPetDataSource: ds.cloneWithRows(temporaryHomePets),
                    temporaryPetsFound: true
                })
            }
            
        }else{
            if(this.state.myPetsSelected){
                for(var i = 0; i < myPets.length; i++){
                    if(myPets[i].name.indexOf(this.searchString) !== -1){
                        newArray.push(myPets[i])
                    }
                }

                if(newArray.length > 0){
                
                    this.setState({
                        myPetsDataSource: ds.cloneWithRows(newArray),
                        petsFound: true
                    })

                }else{
                    this.setState({
                        myPetsDataSource: ds.cloneWithRows(newArray),
                        petsFound: false
                    })
                }


            }else{
                for(var i = 0; i < temporaryHomePets.length; i++){
                    if(temporaryHomePets[i].name.indexOf(this.searchString) !== -1){
                        newArray.push(temporaryHomePets[i])
                    }
                }


                if(newArray.length > 0){
                
                    this.setState({
                        temporaryPetDataSource: ds.cloneWithRows(newArray),
                        temporaryPetsFound: true
                    })
                    
                }else{
                    this.setState({
                        temporaryPetDataSource: ds.cloneWithRows(newArray),
                        temporaryPetsFound: false
                    })
                }
            }

            
        }
    }

    render(){
        return(
                <View style={styles.container}>
                    <View style={styles.searchBarContainer}>
                        <TextInput 
                            placeholder="Procurar pet"
                            placeholderTextColor="black"
                            selectionColor="black"
                            autoCapitalize="words"
                            autoCorrect={false}
                            style={styles.input}
                            onChangeText={(searchString) => {this.searchString = searchString}}
                            returnKeyType="done"
                            onSubmitEditing={() => {this.searchPet()}}
                        />
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.searchPet()}
                        >
                            <Image 
                                source={require("../Resources/searchIcon.png")}
                                style={styles.searchIcon}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </View>
                <TouchableOpacity
                    style={styles.searchButtonContainer}
                    activeOpacity={0.5}
                    onPress={() => this.toAddPet()}
                >
                    <View style={styles.searchButton}>
                        <Image
                            source={require("../Resources/plusIcon.png")}
                            style={styles.searchIcon}
                            resizeMode='contain'
                        />
                        <Text style={styles.searchButtonText}>  Adicionar Pet</Text>
                    </View>
                </TouchableOpacity>
                    <SegmentedControlTab
                        values={['Meus pets','Em lar temporário']}
                        selectedIndex={this.state.selectedIndex}
                        tabTextStyle={styles.tabTextStyle}
                        tabsContainerStyle={styles.tabContainerStyle}
                        tabStyle={styles.tabStyle}
                        activeTabStyle={styles.activeTabStyle}
                        onTabPress={this.changeListView}
                    />

                    { !this.state.loading ? 
                      (
                        this.state.myPetsSelected ? 
                        (
                            this.state.petsFound ? 
                            (
                                <ListView 
                                    dataSource={this.state.myPetsDataSource}
                                    renderRow={(rowData) => this._renderRow(rowData)}
                                    contentContainerStyle={styles.listView}
                                    removeClippedSubviews={false}
                                >
                                </ListView>
                            ) : 
                            (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.friendsNotFoundText}>Não foi possível encontrar</Text>
                                    <Text style={styles.friendsNotFoundText}>nenhum pet ):</Text>
                                </View>
                            )

                        ) : 
                        (
                            this.state.temporaryPetsFound ? (
                                <ListView 
                                    dataSource={this.state.temporaryPetDataSource}
                                    renderRow={(rowData) => this._renderTemporaryHomePetsRow(rowData)}
                                    contentContainerStyle={styles.listView}
                                    removeClippedSubviews={false}
                                >
                                </ListView>
                            ) : 
                            (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.friendsNotFoundText}>Não foi possível encontrar</Text>
                                    <Text style={styles.friendsNotFoundText}>nenhum pet ):</Text>
                                </View>
                            )
                        )
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
        borderRadius: (windowWidth * 0.22)/2
    },
    textContainer:{
        alignItems: 'center',
        justifyContent: 'center'
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
        alignItems: 'center',
        paddingHorizontal: 10,
        flexDirection: 'row'
    },
    searchButtonContainer: {
        paddingHorizontal: 70,
        paddingVertical: 15
    },
    searchButton: {
        borderRadius: 10,
        backgroundColor: 'green',
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    searchButtonText: {
        color: 'white',
        fontSize: 20
    },
    input: {
        flex: 1,
        color: 'black',
        fontSize: 14,
        alignItems: 'center'
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
        borderColor: 'rgba(255,255,255,0.5)',
        
    },
    activeTabStyle:{
        backgroundColor: StyleVars.Colors.primary
    },
    tabTextStyle:{
        color: "rgb(155, 157, 160)"
    },
    loadingView:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText:{
        color: 'white',
        fontSize: 16
    }




})