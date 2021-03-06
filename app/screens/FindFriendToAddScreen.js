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
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var peopleToAddArray = []

export default class FindFriendToAddScreen extends Component{

    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
        this.searchString = ""

        this.state = {
            dataSource: ds.cloneWithRows(peopleToAddArray),
            modalVisible: false,
            peopleFound: true,
            loading: true
        }
    }

    toFriendProfile(friendData){

        var friendsArray = FirebaseRequest.getCurrentUserFriends()
        var isFriend = false

        if(friendsArray){
            for(var i = 0; i < friendsArray.length; i++){

                if (friendsArray[i].key === friendData.key) {
                    
                    isFriend = true
                    break
                }
            }
        }
        this.props.toRoute(Routes.friendProfile(friendData,isFriend,false))
    }

    componentDidMount() {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })


        FirebaseRequest.fetchPeople(false)
            .then((peopleArray) => {

                peopleToAddArray = peopleArray

                this.setState({
                    dataSource: ds.cloneWithRows(peopleToAddArray),
                    loading: false
                })
            })
            .catch((err) => { console.error("Error fecthing users, ", err.message) })
        
    }

    _renderRow(rowData){
        return(
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.friendContainer}
                    onPress={() => this.toFriendProfile(rowData)}
                >
                    <View style={styles.imageContainer}>
                        <Image 
                            source={rowData.profileImage ? { uri: 'data:image/jpeg;base64,' + rowData.profileImage } : require("../Resources/meuPerfilIcon.png") }
                            style={styles.friendImage}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.rowText}>{rowData.name} {rowData.surname}</Text>
                    </View>
                </TouchableOpacity>
            
        )
    }

    searchFriend(){

        let newArray = []

        if(this.searchString == ""){
            const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
            this.setState({
                dataSource: ds.cloneWithRows(peopleToAddArray),
                peopleFound: true
            })

        }else{
            for(var i = 0; i < peopleToAddArray.length; i++){
                if(peopleToAddArray[i].name.indexOf(this.searchString) !== -1){
                    newArray.push(peopleToAddArray[i])
                }
            }

            const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})

            if(newArray.length > 0){
                
                this.setState({
                    dataSource: ds.cloneWithRows(newArray),
                    peopleFound: true
                })
            }else{
                this.setState({
                    dataSource: ds.cloneWithRows(newArray),
                    peopleFound: false
                })
            }
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.searchBarContainer}>
                    <TextInput 
                        placeholder="Procurar pessoas"
                        placeholderTextColor="black"
                        selectionColor="black"
                        autoCapitalize="words"
                        autoCorrect={false}
                        style={styles.input}
                        onChangeText={(searchString) => {this.searchString = searchString}}
                        returnKeyType="done"
                        onSubmitEditing={() => {this.searchFriend()}}
                    />
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.searchFriend()}
                    >
                        <Image 
                            source={require("../Resources/searchIcon.png")}
                            style={styles.searchIcon}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
                { !this.state.loading ? 
                  ( 
                    this.state.peopleFound ? 
                    (
                        <ListView 
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => this._renderRow(rowData)}
                            contentContainerStyle={styles.listView}
                        >
                        </ListView>
                    ) :
                    (
                        <View style={styles.errorContainer}>
                            <Text style={styles.friendsNotFoundText}>Não foi possível encontrar</Text>
                            <Text style={styles.friendsNotFoundText}>nenhuma pessoa ):</Text>
                        </View>
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
    friendContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.45,
        marginBottom: 15,
        alignItems: 'center'

    },
    friendImage:{
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