'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ListView,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var pets = []
var temporaryHomePets = []

export default class FriendProfileScreen extends Component{

    constructor(props){
        super(props)

        this.data = this.props.data
        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})

        if(this.data.userPets){
            pets = this.data.userPets
        }else{
            pets = []
        }

        if (this.data.userTemporaryHomePets){
            temporaryHomePets = this.data.userTemporaryHomePets
        } else{
            temporaryHomePets = []
        }

        this.state = {
            petsDataSource: ds.cloneWithRows(pets),
            temporaryHomeDataSource: ds.cloneWithRows(temporaryHomePets),
            levelTextBackgroundColor: 'darkgreen',
            levelNameBackgroundColor: 'forestgreen',
            totalPointsBackgroundColor: 'mediumseagreen',
            levelName: '',
            unfriending: false
        }
        
        this.petsDarkRow = true
        this.temporaryPetsDarkRow = true
    }

    componentDidMount() {
        this.defineLevel()
    }


     _renderRowPets(rowData){

         let rowBackgroundColor = this.petsDarkRow ? {backgroundColor: StyleVars.Colors.listViewBackground} 
                                              : {backgroundColor: StyleVars.Colors.midtone}

        this.petsDarkRow = !this.petsDarkRow

        return(
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={[styles.petContainer,rowBackgroundColor]}
                    onPress={() => this.props.toRoute(Routes.petProfile(rowData,false,false))}
                >
                    <View style={styles.imageContainer}>
                        <Image 
                            source={ { uri: 'data:image/jpeg;base64,' + rowData.profilePhoto }}
                            style={styles.petImage}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.rowText}>Nome: {rowData.name}</Text>
                        <Text style={styles.rowText}>Idade: {rowData.ageAmount} {rowData.ageType}</Text>
                    </View>
                </TouchableOpacity>
            
        )
    }

     _renderRowTemporaryPets(rowData){

         let rowBackgroundColor = this.temporaryPetsDarkRow ? {backgroundColor: StyleVars.Colors.midtone} 
                                              : {backgroundColor: StyleVars.Colors.listViewBackground}

        this.temporaryPetsDarkRow = !this.temporaryPetsDarkRow

        return(
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={[styles.petContainer,rowBackgroundColor]}
                    onPress={() => this.props.toRoute(Routes.petProfile(rowData,false,false))}
                >
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: 'data:image/jpeg;base64,' + rowData.profilePhoto }}
                            style={styles.petImage}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.rowText}>Nome: {rowData.name}</Text>
                        <Text style={styles.rowText}>Idade: {rowData.ageAmount} {rowData.ageType}</Text>
                    </View>
                </TouchableOpacity>
            
        )
    }

     defineLevel() {

         switch (this.props.data.protectionLevel) {

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

    unfriend(){

        Alert.alert('', 'Deseja mesmo remover esta pessoa da sua lista de amigos?',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {
                        
                        this.setState({
                            unfriending: true
                        })

                        FirebaseRequest.removeUserFriend(this.data.key)
                            .then(() => {
                                this.setState({
                                    unfriending: false
                                })
                                this.props.back()

                            })
                            .catch((err) => {
                                Alert.alert('', 'Erro ao desfazer amizade.',
                                    [
                                        {
                                            text: 'Ok', onPress: () => { }
                                        }
                                    ],
                                    { cancelable: false }
                                )
                                this.setState({
                                    unfriending: false
                                })
                            })

                    }
                }
            ],
            { cancelable: false }
        )

       

    }

    removeFromGroup() {

        Alert.alert('Atenção', 'Deseja mesmo remover do grupo?',
            [
                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {

                        this.setState({
                            unfriending: true
                        })

                        FirebaseRequest.removeMemberFromGroup(this.data.key)
                            .then(() => {
                                this.setState({
                                    unfriending: false
                                })
                                this.props.back()

                            })
                            .catch((err) => {
                                Alert.alert('Atenção','Erro ao remover do grupo.')
                                this.setState({
                                    unfriending: false
                                })
                            })
                    }
                }

            ],
            { cancelable: false }  
        )
            

    }

    renderReportIcon(){

        var isMyProfile = false

        if(FirebaseRequest.getCurrentUserID() === this.data.key){
            isMyProfile = true
        }

        return(
            isMyProfile ? 
            (
               <View></View> 
            ) 
            : 
            (
                <TouchableOpacity 
                    style={styles.reportIconContainer}
                    activeOpacity = { 0.5}
                    onPress={() => this.addProfileReport()}
                >
                    <Image
                        source={require("../Resources/redReportIcon.png")}
                        style={styles.reportIcon}
                        resizeMode='contain'
                    />
                </TouchableOpacity> 
            )
        )
    }

    addProfileReport() {

        Alert.alert('', 'Tem certeza que quer denunciar este perfil?',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {
                        Alert.alert('', 'Selecione o tipo de denúncia',
                            [

                                {
                                    text: 'Cancelar', onPress: () => { }
                                },
                                {
                                    text: 'Falso', onPress: () => {
                                        FirebaseRequest.addProfileReportToUser(this.data.key, 1, this.completedAddingReport, this.failedAddingReport)
                                    }
                                },
                                {
                                    text: 'Conteúdo impróprio', onPress: () => {
                                        FirebaseRequest.addProfileReportToUser(this.data.key, 2, this.completedAddingReport, this.failedAddingReport)
                                    }
                                }
                            ],
                            { cancelable: false }
                        )     
                    }
                }
            ],
            { cancelable: false }
        )
    }

    completedAddingReport = () => {
        Alert.alert('', 'Denúncia realizada com sucesso.',
            [
                {
                    text: 'Ok', onPress: () => { }
                }
            ],
            { cancelable: false }
        )

    }

    failedAddingReport = () => {

        Alert.alert('Erro ao realizar denúncia.', 'Verifique sua conexão ou se já denunciou este perfil.',
            [

                {
                    text: 'Ok', onPress: () => { }
                }
            ],
            { cancelable: false }
        )
    }

    capitalizeFirstLetter(string) {

        return string && string.split(' ').map(function (word) {
            return word.replace(word[0], word[0].toUpperCase())
        }).join(' ')

    }
    render(){
        return(
            <View style={styles.container}>
                <ScrollView
                ref="scrollView"
                keyboardShouldPersistTaps='never'
                //automaticallyAdjustContentInsects={true}
                alwaysBounceVertical={true}
                style={styles.scrollView}
                >
                    <View style={styles.innerContainer}>
                        <Image 
                            source={this.data.profileImage ? { uri: 'data:image/jpeg;base64,' + this.data.profileImage } : require("../Resources/meuPerfilIcon.png")}
                            style={styles.profileImage}
                        />
                        <Text style={styles.nameText}>{this.data.name} {this.data.surname}</Text>
                        <View style={styles.rowContainer}>
                            <View style={styles.separator}></View>
                        </View>
                        <Text style={styles.locationText}>{this.capitalizeFirstLetter(this.data.city)}, {this.data.state.length > 2 ? this.capitalizeFirstLetter(this.data.state) : this.data.state.toUpperCase()}</Text>
                        <Text style={styles.locationText}>{this.capitalizeFirstLetter(this.data.country)}</Text>
                        {this.renderReportIcon()}
                    </View>
                    <View style={[styles.levelTextContainer, { backgroundColor: this.state.levelTextBackgroundColor }]}>
                        <Text style={styles.levelText}>Nível de Proteção Animal</Text>
                    </View>
                    <View style={[styles.levelNameContainer, { backgroundColor: this.state.levelNameBackgroundColor }]}>
                        <Text style={styles.levelText}>{this.state.levelName}</Text>
                    </View>
                    <View style={[styles.totalPointsContainer, { backgroundColor: this.state.totalPointsBackgroundColor }]}>
                        <Text style={styles.levelText}>{this.data.totalPoints} pontos</Text>
                    </View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Pets</Text>
                    </View>

                    <ListView 
                        dataSource={this.state.petsDataSource}
                        renderRow={(rowData) => this._renderRowPets(rowData)}
                        contentContainerStyle={styles.listView}
                        horizontal={true}
                        enableEmptySections={true}
                    >
                    </ListView>

                    <View style={styles.temporaryHomeHeaderContainer}>
                        <Text style={styles.temporaryHomeHeaderText}>Em Lar Temporário</Text>
                    </View>
                    <ListView 
                        dataSource={this.state.temporaryHomeDataSource}
                        renderRow={(rowData) => this._renderRowTemporaryPets(rowData)}
                        contentContainerStyle={styles.listView}
                        horizontal={true}
                        enableEmptySections={true}
                    >
                    </ListView>
                    {this.props.data.isFriend ? 
                        (
                            <View style={styles.unFriendButtonContainer}>
                                <TouchableOpacity
                                    style={styles.unfriendButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.unfriend()}
                                >
                                    <Text style={styles.unfriendButtonText}>{this.state.unfriending ? 'Desfazendo amizade...' : 'Desfazer Amizade'}</Text>
                                </TouchableOpacity>
                            </View>
                        ) 
                        : 
                        (
                            <View></View>
                        )   
                    }
                    {this.props.data.isMember ?
                        (
                            <View style={styles.unFriendButtonContainer}>
                                <TouchableOpacity
                                    style={styles.unfriendButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.removeFromGroup()}
                                >
                                    <Text style={styles.unfriendButtonText}>{this.state.unfriending ? 'Removendo...' : 'Remover do grupo'}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                        :
                        (
                            <View></View>
                        )
                    }
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
    profileImage: {
        width: windowWidth * 0.4,
        height: windowWidth * 0.4,
        borderRadius: (windowWidth * 0.4)/2,
        marginTop: 5,
        marginBottom: 10
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
    headerContainer:{
        flex: 1,
        backgroundColor: StyleVars.Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        marginTop: 5
    },
    headerText:{
        color: 'white',
        fontSize: 16
    },
    temporaryHomeHeaderContainer:{
        flex: 1,
        backgroundColor: StyleVars.Colors.animalStreetPinBackground,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    temporaryHomeHeaderText:{
        color: "gold",
        fontSize: 16
    },
    petContainer:{
        flexDirection: 'row',
        backgroundColor: StyleVars.Colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: windowWidth * 0.5,
        height: windowHeight * 0.2

    },
    petImage:{
        width: windowWidth * 0.15,
        height: windowWidth * 0.15,
        borderRadius: (windowWidth * 0.15) / 2,
    },
    textContainer:{
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15
    },
    imageContainer:{
        justifyContent: 'center'
    },
    rowText:{
        color: 'white',
        fontSize: 10
    },
    unFriendButtonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    unfriendButton: {
        paddingVertical: 12,
        width: windowWidth * 0.8,
        backgroundColor: 'darkred',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    unfriendButtonText: {
        fontSize: 16,
        color: 'red'
    },
    levelText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    levelTextContainer: {
        width: windowWidth,
        paddingVertical: 5,
        marginTop: 10
    },
    levelNameContainer: {
        width: windowWidth,
        paddingVertical: 5
    },
    totalPointsContainer: {
        width: windowWidth,
        paddingVertical: 5,
        marginBottom: 10
    },
    reportIcon: {
        width: windowWidth * 0.06,
        height: windowHeight * 0.06
    },
    reportIconContainer:{
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingVertical: 3,
        width: windowWidth * 0.1,
        height: windowWidth * 0.1,
        marginLeft: windowWidth * 0.87
        
    }

})