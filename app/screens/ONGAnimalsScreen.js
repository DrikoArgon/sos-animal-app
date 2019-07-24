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

const myAnimals = []

const myAdoptedAnimals = []

export default class ONGAnimalsScreen extends Component{

    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
        this.searchString = ""

        this.state = {
            myAnimalsDataSource: ds.cloneWithRows(myAnimals),
            myAdoptedAnimalsDataSource: ds.cloneWithRows(myAdoptedAnimals),

            modalVisible: false,
            petsFound: true,
            temporaryPetsFound: true,
            myAnimalsSelected: true,
            loading: true
        }
    }

    componentDidMount() {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        if (FirebaseRequest.getCurrentGroupAnimals(false)) {

            myAnimals = FirebaseRequest.getCurrentGroupAnimals(false)
            myAdoptedAnimals = FirebaseRequest.getCurrentGroupAnimals(true)

            this.setState({
                myAnimalsDataSource: ds.cloneWithRows(myAnimals),
                myAdoptedAnimalsDataSource: ds.cloneWithRows(myAdoptedAnimals),
                loading: false
            })

            FirebaseRequest.listenToNewGroupAnimalsAdded(this.updateAnimalsListWhenAdded, this.updateAdoptedAnimalsListWhenAdded)

        }
        else {

            FirebaseRequest.fetchGroupAnimals(false)
                .then((animalsArray) => {

                    myAnimals = animalsArray

                    this.setState({
                        myAnimalsDataSource: ds.cloneWithRows(myAnimals)
                    })

                })
                .catch((err) => { console.error("Error fecthing group animals, ", err.message) })

            FirebaseRequest.fetchGroupAnimals(true)
                .then((animalsArray) => {

                    myAdoptedAnimals = animalsArray

                    this.setState({
                        myAdoptedAnimalsDataSource: ds.cloneWithRows(myAdoptedAnimals),
                        loading: false
                    })

                    FirebaseRequest.listenToNewGroupAnimalsAdded(this.updateAnimalsListWhenAdded, this.updateAdoptedAnimalsListWhenAdded)
                })
                .catch((err) => { console.error("Error fecthing group adopted animals, ", err.message) })

        }

        FirebaseRequest.listenToGroupAnimalRemoved(this.updateAnimalsListWhenRemoved)
        FirebaseRequest.listenToGroupAnimalChanges(this.updateAnimalsListWhenChanged)
        FirebaseRequest.listenToGroupAdoptedAnimalRemoved(this.updateAdoptedAnimalsListWhenRemoved)
        FirebaseRequest.listenToGroupAdoptedAnimalChanges(this.updateAdoptedAnimalsListWhenChanged)
    }


    toPetProfile(petData){
        this.props.toRoute(Routes.petProfile(petData,true,true))
    }


    updateAnimalsListWhenAdded = (newAnimal) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        myAnimals.push(newAnimal)

        this.setState({
            myAnimalsDataSource: ds.cloneWithRows(myAnimals)
        })

    }

    updateAnimalsListWhenChanged = (changedPet) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < myAnimals.length; i++) {
            if (myAnimals[i].key === changedPet.key) {
                myAnimals[i] = changedPet
                break
            }
        }

        this.setState({
            myAnimalsDataSource: ds.cloneWithRows(myAnimals)
        })
    }


    updateAnimalsListWhenRemoved = (removedPet) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < myAnimals.length; i++) {
            if (myAnimals[i].key === removedPet.key) {
                index = i
                break
            }
        }

        if (index !== null) {
            myAnimals.splice(index, 1)
        }

        this.setState({
            myAnimalsDataSource: ds.cloneWithRows(myAnimals)
        })
    }

    updateAdoptedAnimalsListWhenAdded = (newAdoptedAnimal) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        myAdoptedAnimals.push(newAdoptedAnimal)

        this.setState({
            myAdoptedAnimalsDataSource: ds.cloneWithRows(myAdoptedAnimals)
        })


    }  

    updateAdoptedAnimalsListWhenChanged = (changedPet) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < myAdoptedAnimals.length; i++) {
            if (myAdoptedAnimals[i].key === changedPet.key) {
                myAdoptedAnimals[i] = changedPet
                break
            }
        }

        this.setState({
            myAdoptedAnimalsDataSource: ds.cloneWithRows(myAdoptedAnimals)
        })
    }


    updateAdoptedAnimalsListWhenRemoved = (removedPet) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < myAdoptedAnimals.length; i++) {
            if (myAdoptedAnimals[i].key === removedPet.key) {
                index = i
                break
            }
        }

        if (index !== null) {
            myAdoptedAnimals.splice(index, 1)
        }

        this.setState({
            myAdoptedAnimalsDataSource: ds.cloneWithRows(myAdoptedAnimals)
        })
    }

    _renderRow(rowData){

        rowData = Object.assign(rowData, { petSituation: 0 })

        return(
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.petContainer}
                    onPress={() => this.toPetProfile(rowData)}
                >
                    <View style={styles.imageContainer}>
                        <Image 
                            source={ { uri: 'data:image/jpeg;base64,' + rowData.profilePhoto }}
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

            if(this.state.myAnimalsSelected){
                this.setState({
                    myAnimalsDataSource: ds.cloneWithRows(myAnimals),
                    petsFound: true
                })
            }else{
                this.setState({
                    myAdoptedAnimalsDataSource: ds.cloneWithRows(myAdoptedAnimals),
                    temporaryPetsFound: true
                })
            }

        }else{
            if(this.state.myAnimalsSelected){
                for(var i = 0; i < myAnimals.length; i++){
                    if(myAnimals[i].name.indexOf(this.searchString) !== -1){
                        newArray.push(myAnimals[i])
                    }
                }

                if(newArray.length > 0){
                
                    this.setState({
                        myAnimalsDataSource: ds.cloneWithRows(newArray),
                        petsFound: true
                    })

                }else{
                    this.setState({
                        myAnimalsDataSource: ds.cloneWithRows(newArray),
                        petsFound: false
                    })
                }


            }else{
                for(var i = 0; i < myAdoptedAnimals.length; i++){
                    if(myAdoptedAnimals[i].name.indexOf(this.searchString) !== -1){
                        newArray.push(myAdoptedAnimals[i])
                    }
                }


                if(newArray.length > 0){
                
                    this.setState({
                        myAdoptedAnimalsDataSource: ds.cloneWithRows(newArray),
                        temporaryPetsFound: true
                    })
                    
                }else{
                    this.setState({
                        myAdoptedAnimalsDataSource: ds.cloneWithRows(newArray),
                        temporaryPetsFound: false
                    })
                }
            }

            
        }
    }

    changeListView(index){
        index === 0 ? this.setState({myAnimalsSelected: true})
            : this.setState({myAnimalsSelected: false})
    }

    render(){
        return(
                <View style={styles.container}>
                    <View style={styles.searchBarContainer}>
                        <TextInput 
                            placeholder="Procurar animal"
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
                    <SegmentedControlTab
                        values={['Para Adoção','Adotados']}
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
                            this.state.petsFound ? 
                            (
                                <ListView 
                                    dataSource={this.state.myAnimalsDataSource}
                                    renderRow={(rowData) => this._renderRow(rowData)}
                                    contentContainerStyle={styles.listView}
                                    removeClippedSubviews={false}
                                >
                                </ListView>
                            ) : 
                            (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.friendsNotFoundText}>Não foi possível encontrar</Text>
                                    <Text style={styles.friendsNotFoundText}>nenhum animal ):</Text>
                                </View>
                            )

                         ) : 
                         (
                            this.state.temporaryPetsFound ? 
                            (
                                <ListView 
                                    dataSource={this.state.myAdoptedAnimalsDataSource}
                                    renderRow={(rowData) => this._renderAdoptetAnimalsRow(rowData)}
                                    contentContainerStyle={styles.listView}
                                >
                                </ListView>
                            ) : 
                            (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.friendsNotFoundText}>Não foi possível encontrar</Text>
                                    <Text style={styles.friendsNotFoundText}>nenhum animal ):</Text>
                                </View>
                            )
                         )
                      ) :
                      (
                        <View style={styles.loadingView}>
                            <Text style={styles.loadingText}>Carregando...</Text>
                        </View>
                      )}
                    
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