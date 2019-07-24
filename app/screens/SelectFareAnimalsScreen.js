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

export default class SelectFareAnimalsScreen extends Component{

    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
        this.searchString = ""

        this.state = {
            myPetDataSource: ds.cloneWithRows(myPets),
            petsFound: true,
            loading: true

        }
    }

    componentDidMount(){

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        FirebaseRequest.fetchGroupAnimals(false)
        .then((animalArray) => {
            myPets = animalArray

            this.setState({
                myPetDataSource: ds.cloneWithRows(myPets),
                loading: false
            })
        })
        .catch((err) => alert('Erro ao buscar animais.'))

    }

    selectPet(rowData){

        if(rowData.selected){
            for (var i = 0; i < myPets.length; i++) {
                if (rowData.key === myPets[i].key) {
                    myPets[i].selected = false
                    break
                }
            }

            this.props.data.removeAnimalFromArray(rowData)

        }
        else{
            for (var i = 0; i < myPets.length; i++) {
                if (rowData.key === myPets[i].key) {
                    
                    this.props.data.addAnimalToArray({
                        ageAmount: rowData.ageAmount,
                        ageType: rowData.ageType,
                        breed: rowData.breed,
                        castrated: rowData.castrated,
                        city: rowData.city,
                        color: rowData.color,
                        country: rowData.country,
                        dewormed: rowData.dewormed,
                        gender: rowData.gender,
                        key: rowData.key,
                        name: rowData.name,
                        profilePhoto: rowData.profilePhoto,
                        size: rowData.size,
                        specie: rowData.specie,
                        state: rowData.state,
                        vaccinated: rowData.vaccinated
                    })
                    myPets[i] = Object.assign(myPets[i], { selected: true })
                    break
                }
            }

            
        }

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.setState({
            myPetDataSource: ds.cloneWithRows(myPets)
        })

    }


    _renderRow(rowData) {

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.petContainer,rowData.selected ? {backgroundColor: 'darkgreen'} : {}]}
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

    searchPet(){

        let newArray = []

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})

        if(this.searchString == ""){

                this.setState({
                    myPetDataSource: ds.cloneWithRows(myPets),
                    petsFound: true
                })

        }else{
           
            for(var i = 0; i < myPets.length; i++){
                if(myPets[i].name.indexOf(this.searchString) !== -1){
                    newArray.push(myPets[i])
                }
            }

            if(newArray.length > 0){
            
                this.setState({
                    myPetDataSource: ds.cloneWithRows(newArray),
                    petsFound: true
                })

            }else{
                this.setState({
                    myPetDataSource: ds.cloneWithRows(newArray),
                    petsFound: false
                })
            }         
            
        }
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
                    {this.state.loading ? 
                        (
                            <View style={styles.loadingView}>
                                <Text style={styles.loadingText}>Carregando...</Text>
                            </View>
                        ) 
                        : 
                        (
                            this.state.petsFound ? (
                                <ListView
                                    dataSource={this.state.myPetDataSource}
                                    renderRow={(rowData) => this._renderRow(rowData)}
                                    contentContainerStyle={styles.listView}
                                >
                                </ListView>
                            ) 
                            : 
                            (
                            <View style={styles.errorContainer}>
                                <Text style={styles.friendsNotFoundText}>Não foi possível encontrar</Text>
                                <Text style={styles.friendsNotFoundText}>nenhum animal ):</Text>
                            </View>
                            ) 
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