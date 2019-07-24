'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import ImagePicker from 'react-native-image-picker'

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager
} = FBSDK;


const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height


export default class ProfileScreen extends Component{

    constructor(props){
        super(props)

        this.state = {
            userInfo: FirebaseRequest.getCurrentUser(),
            loadingImage: false,
            levelTextBackgroundColor: 'darkgreen',
            levelNameBackgroundColor: 'forestgreen',
            totalPointsBackgroundColor: 'mediumseagreen',
            levelName: ''

        }

        

    }

    capitalizeFirstLetter(string){

        return string.split(' ').map(function(word){
            return word.replace(word[0],word[0].toUpperCase())
        }).join(' ')

    }

    componentWillMount(){

        const userInfo = this.state.userInfo

        userInfo.city = this.capitalizeFirstLetter(userInfo.city);
        userInfo.state = userInfo.state.length > 2 ? this.capitalizeFirstLetter(userInfo.state) : userInfo.state.toUpperCase();
        userInfo.country = this.capitalizeFirstLetter(userInfo.country);

        this.setState({
            userInfo: userInfo
        })
    }

    componentDidMount(){

        this.defineLevel()

    }

    toMyLevelScreen(){
        this.props.toRoute(Routes.myLevel(this.state.levelName))
    }

    toMySOSScreen(){
        this.props.toRoute(Routes.mySOS())
    }

    toEditInfoScreen() {
        this.props.toRoute(Routes.edit())
    }

    toMyFriendsScreen(){
        this.props.toRoute(Routes.myFriends())
    }

    selectPhotoTapped(){
        const options = {
            title: 'Selecione uma opção',
            takePhotoButtonTitle: 'Tirar Foto...',
            chooseFromLibraryButtonTitle: 'Escolher da Biblioteca...',
            quality: 0.5,

        }

        ImagePicker.showImagePicker(options, (response) => {

            if(response.didCancel){
               
            }
            else if(response.error){
                console.warn('Image Picker error', response.error)
            }
            else{

                let source = {uri: response.uri}

                this.setState({
                    loadingImage: true
                })
                
                FirebaseRequest.updateUserProfile({
                    profileImage: response.data
                })
                .then(() => {
                    this.setState({
                        userInfo: FirebaseRequest.getCurrentUser(),
                        loadingImage: false
                    })
                })
                .catch((err) => { 

                    this.setState({
                        loadingImage: false
                    })
                    console.error("Error changing profile image ", err.message) })

            }
        })

    }

    logout(){

        LoginManager.logOut()
        
        FirebaseRequest.logout()

        this.props.parentNavigator.pop()

    }

    defineLevel(){

        switch(this.state.userInfo.protectionLevel){

            case 1: 
                this.setState({
                    levelName: 'Formiga',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor1,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor1,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor1
                })
                break
            case 2:
                this.setState({
                    levelName: 'Abelha',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor2,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor2,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor2
                })
                break
            case 3:
                this.setState({
                    levelName: 'Borboleta',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor3,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor3,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor3
                })
                break
            case 4:
                this.setState({
                    levelName: 'Tatu',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor4,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor4,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor4
                })
                break
            case 5:
                this.setState({
                    levelName: 'Coelho',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor5,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor5,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor5
                })
                break
            case 6:
                this.setState({
                    levelName: 'Gato',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor6,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor6,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor6
                })
                break
            case 7:
                this.setState({
                    levelName: 'Cachorro',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor7,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor7,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor7
                })
                break
            case 8:
                this.setState({
                    levelName: 'Águia',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor8,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor8,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor8
                })
                break
            case 9:
                this.setState({
                    levelName: 'Javali',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor9,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor9,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor9
                })
                break
            case 10:
                this.setState({
                    levelName: 'Lhama',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor10,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor10,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor10
                })
                break
            case 11:
                this.setState({
                    levelName: 'Cavalo',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor11,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor11,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor11
                })
                break
            case 12:
                this.setState({
                    levelName: 'Búfalo',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor12,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor12,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor12
                })
                break
            case 13:
                this.setState({
                    levelName: 'Hiena',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor13,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor13,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor13
                })
                break
            case 14:
                this.setState({
                    levelName: 'Pantera',
                    levelNameBackgroundColor: StyleVars.Colors.levelNameBackgroundColor14,
                    levelTextBackgroundColor: StyleVars.Colors.levelTextBackgroundColor14,
                    totalPointsBackgroundColor: StyleVars.Colors.totalPointsBackgroundColor14
                })
                break

            
        }


    }


    render(){

        this.state.userInfo = FirebaseRequest.getCurrentUser()

        return(
            <View style={styles.container}>
                <ScrollView
                ref="scrollView"
                keyboardShouldPersistTaps="never"
                automaticallyAdjustContentInsects={true}
                alwaysBounceVertical={true}
                style={styles.scrollView}
                >
                    <View style={styles.innerContainer}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.profileImageContainer}
                            onPress={() => this.selectPhotoTapped()}
                        >
                        {this.state.loadingImage ? 
                            (
                                <View style={styles.noPhotoBackground}>
                                    <Text style={styles.noPhotoBackgroundText}>Carregando foto...</Text>
                                </View>
                            ) : 
                            (
                                <Image 
                                    source={ this.state.userInfo.profileImage ? { uri: 'data:image/jpeg;base64,' + this.state.userInfo.profileImage } : require("../Resources/meuPerfilIcon.png") }
                                    style={styles.profileImage}
                                    resizeMode={this.state.userInfo.profileImage ? null : 'contain'}
                                />
                            )
                        }
                        </TouchableOpacity>
                        <Text style={styles.nameText}>{this.state.userInfo.name} {this.state.userInfo.surname}</Text>
                        <View style={styles.rowContainer}>
                            <View style={styles.separator}></View>
                        </View>
                        <Text style={styles.locationText}>{this.state.userInfo.city}, {this.state.userInfo.state}</Text>
                        <Text style={styles.locationText}>{this.state.userInfo.country}</Text>
                        <View style={[styles.levelTextContainer,{backgroundColor: this.state.levelTextBackgroundColor}]}>
                            <Text style={styles.levelText}>Nível de Proteção Animal</Text>
                        </View>    
                        <View style={[styles.levelNameContainer, { backgroundColor: this.state.levelNameBackgroundColor }]}>
                            <Text style={styles.levelText}>{this.state.levelName}</Text>
                        </View>
                        <View style={[styles.totalPointsContainer, { backgroundColor: this.state.totalPointsBackgroundColor }]}>
                            <Text style={styles.levelText}>{this.state.userInfo.totalPoints} pontos</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.coinDisplayContainer}>
                                <View style={styles.coinAmountDisplay}>
                                    <Image 
                                        source={require('../Resources/coinsIcon.png')}
                                        style={styles.coinIcon}
                                        resizeMode='contain'
                                    />
                                    <Text style={styles.buttonText}>{this.state.userInfo.coinsAmount}</Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                activeOpacity={0.5}
                                style={styles.smallbuttonContainer}
                                onPress={() => this.toMyLevelScreen()}
                            >
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Meu nível</Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rowContainer}>
                            <TouchableOpacity 
                                    activeOpacity={0.5}
                                    style={styles.bigButtonContainer}
                                    onPress={() => this.toMySOSScreen()}
                                >
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Meus SOS</Text>
                                </View>
                            </TouchableOpacity>  
                        </View>
                        <View style={styles.rowContainer}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.bigButtonContainer}
                                onPress={() => this.toEditInfoScreen()}
                            >
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Editar Informações</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
{/*
                        <View style={styles.rowContainer}>
                            <TouchableOpacity 
                                    activeOpacity={0.5}
                                    style={styles.bigButtonContainer}
                                    onPress={() => this.toMyFriendsScreen()}
                                >
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Meus Amigos</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
*/}
                        <View style={styles.rowContainer}>
                            <TouchableOpacity 
                                    activeOpacity={0.5}
                                    style={styles.bigButtonContainer}
                                    onPress={() => {this.logout()}}
                                >
                                <View style={styles.leaveButton}>
                                    <Text style={styles.leaveButtonText}>Sair</Text>
                                </View>
                            </TouchableOpacity>  
                        </View>  
                    </View>
                </ScrollView>
            </View>
        )
    }




}

const styles = StyleSheet.create({

    container:{
        flex: 1,
        backgroundColor: StyleVars.Colors.primary
    },
    innerContainer: {
        alignItems: 'center',
        paddingVertical: 6
    },
    profileImageContainer:{
        width: windowWidth * 0.4,
        height: windowHeight * 0.3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileImage:{
        width: windowWidth * 0.4,
        height: windowWidth * 0.4,
        borderRadius: (windowWidth * 0.4) / 2,
    },
    separator:{
        flex: 1,
        height: 2,
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 10,
        backgroundColor: 'white'
    },
    nameText:{
        fontSize: 20,
        color: 'white'
    },
    locationText:{
        fontSize: 16,
        color: 'white'
    },
    rowContainer:{
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingHorizontal: 10
    },
    buttonText:{
        color: 'white',
        fontSize: 18
    },
    smallbuttonContainer: {
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 20
    },
    coinDisplayContainer: {
        flex: 0.5,
        paddingHorizontal: 10,
        marginTop: 20
    },
    bigButtonContainer: {
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 25
    },
    coinAmountDisplay:{
        alignItems: 'center',
        height: 40,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    coinIcon:{
        width: windowWidth * 0.08,
        height: windowHeight * 0.08,
        marginRight: 10
    },
    leaveButtonText:{
        color: 'red',
        fontSize: 18
    },
    leaveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: StyleVars.Colors.redButtonBackground,
        borderRadius: 5,
        paddingHorizontal: 20
    },
    noPhotoBackground: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: StyleVars.Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    noPhotoBackgroundText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
    },
    levelText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    levelTextContainer:{
        width: windowWidth,
        paddingVertical: 5,
        marginTop: 10
    },
    levelNameContainer:{
        width: windowWidth,
        paddingVertical: 5
    },
    totalPointsContainer:{
        width: windowWidth,
        paddingVertical: 5
    }

})