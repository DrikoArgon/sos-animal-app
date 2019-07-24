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

const myMembers = []

export default class ONGMembersScreen extends Component{

    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
        this.searchString = ""

        this.state = {
            dataSource: ds.cloneWithRows(myMembers),
            modalVisible: false,
            membersFound: true,
            loading: true
        }
    }

    componentDidMount() {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        if (FirebaseRequest.getCurrentGroupMembers()) {

            myMembers = FirebaseRequest.getCurrentGroupMembers()

            this.setState({
                dataSource: ds.cloneWithRows(myMembers),
                loading: false
            })

            FirebaseRequest.listenToNewMembersAdded(this.updateMembersList)
        }
        else {

            FirebaseRequest.fetchGroupMembers()
                .then((membersArray) => {

                    myMembers = membersArray

                    this.setState({
                        dataSource: ds.cloneWithRows(myMembers),
                        loading: false
                    })

                    FirebaseRequest.listenToNewMembersAdded(this.updateMembersList)
                })
                .catch((err) => { console.error("Error fecthing group members, ", err.message) })
        }

        FirebaseRequest.listenToRemovedGroupMember(this.updateMembersListWhenRemoved)
    }

    updateMembersList = (newMember) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        

        this.setState({
            dataSource: ds.cloneWithRows(myMembers)
        })


    }

    updateMembersListWhenRemoved = (memberRemoved) => {


        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < myMembers.length; i++) {
            if (myMembers[i].key === memberRemoved.key) {
                index = i
                break
            }
        }

        if (index !== null) {
            myMembers.splice(index, 1)
        }

        this.setState({
            dataSource: ds.cloneWithRows(myMembers)
        })

    }

    toFriendProfile(friendData){

        friendData.isGroupLooking = true

        this.props.toRoute(Routes.friendProfile(friendData,true,true,false))
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
                            source={rowData.profileImage ? { uri: 'data:image/jpeg;base64,' + rowData.profileImage } : require("../Resources/meuPerfilIcon.png")}
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
                dataSource: ds.cloneWithRows(myMembers),
                membersFound: true
            })

        }else{
            for(var i = 0; i < myMembers.length; i++){
                if(myMembers[i].name.indexOf(this.searchString) !== -1){
                    newArray.push(myMembers[i])
                }
            }

            const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})

            if(newArray.length > 0){
                
                this.setState({
                    dataSource: ds.cloneWithRows(newArray),
                    membersFound: true
                })
            }else{
                this.setState({
                    dataSource: ds.cloneWithRows(newArray),
                    membersFound: false
                })
            }
        }
    }

    render(){
        return(
                <View style={styles.container}>
                    <View style={styles.searchBarContainer}>
                        <TextInput 
                            placeholder="Procurar membros"
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
                    {!this.state.loading ?
                        (
                            this.state.membersFound ?
                                (
                                    <ListView
                                        dataSource={this.state.dataSource}
                                        renderRow={(rowData) => this._renderRow(rowData)}
                                        contentContainerStyle={styles.listView}
                                        removeClippedSubviews={false}
                                    >
                                    </ListView>
                                ) :
                                (
                                    <View style={styles.errorContainer}>
                                        <Text style={styles.friendsNotFoundText}>Não foi possível encontrar</Text>
                                        <Text style={styles.friendsNotFoundText}>nenhum membro ):</Text>
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