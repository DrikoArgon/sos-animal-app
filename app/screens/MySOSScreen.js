'use strict'

import React, {Component} from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    ListView,
    StyleSheet,
    Dimensions,
    Image,
    Modal,
    TouchableWithoutFeedback,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import AnimalStreetModal from '../components/AnimalStreetModal'
import TemporaryHomeModal from '../components/TemporaryHomeModal'
import RunawayAnimalModal from '../components/RunawayAnimalModal'
import FreeRideModal from '../components/FreeRideModal'
import MilkEmptyModal from '../components/MilkEmptyModal'
import MilkFullModal from '../components/MilkFullModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var mySOS = []

export default class MySOSScreen extends Component{

    constructor(props){
        super(props)

        this.pointsForPinCreation = 3

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
        this.state = {
            dataSource: ds.cloneWithRows(mySOS),
            animalStreetModalVisible: false,
            temporaryHomeModalVisible: false,
            runawayAnimalModalVisible: false,
            freeRideModalVisible: false,
            milkEmptyModalVisible: false,
            milkFullModalVisible: false,

            animalStreetData: {
                date: "12/12/2012",
                specie: "Cão",
                size: "Pequeno",
                ageAmount: "1",
                ageType: "ano(s)",
                qtd: "2",
                location: "Rio de Janeiro, RJ",
                solved: false
            },
            temporaryHomeData: {
                date: "12/12/2012",
                specie: "Cão",
                size: "Pequeno",
                ageAmount: "1",
                ageType: "ano(s)",
                qtd: "2",
                solved: false
            },
            runawayAnimalData: {
                date: "12/12/2012",
                runawayDate: "10/12/2012",
                name: "Solaire",
                specie: "Cão",
                breed: "Corgy",
                gender: "Macho",
                size: "Pequeno",
                ageAmount: "1",
                ageType: "ano(s)",
                qtd: "1",
                solved: false
            },
            freeRideData: {
                date: "12/12/2012",
                from: "Saída",
                destination: "Chegada",
                specie: "Cão",
                size: "Pequeno",
                ageAmount: "1",
                ageType: "ano(s)",
                qtd: "2",
                solved: false
            },
            milkEmptyData: {
                date: "12/12/2012",
                specie: "Cão",
                ageAmount: "5",
                ageType: "dia(s)",
                qtd: "2",
                solved: false
            },
            milkFullData: {
                date: "12/12/2012",
                specie: "Cão",
                size: "Pequeno",
                ageAmount: "1",
                ageType: "ano(s)",
                newborn: true,
                solved: false
            },

            loading: true
        }

        this.darkRow = false

    }

    componentWillMount(){

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        FirebaseRequest.fetchUserPins()
        .then((pinArray) => {
            
            mySOS = pinArray

            this.setState({
                dataSource: ds.cloneWithRows(mySOS),
                loading: false
            })
        })
        .catch((err) => {console.error('Error while trying to fetch user pins: ', err.message)})

        FirebaseRequest.listenToUserPinChanges(this.updatePinListWhenChanged)
        FirebaseRequest.listenToUserPinRemoved(this.updatePinListWhenRemoved)


    }

    updatePinListWhenChanged = (changedPin) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < mySOS.length; i++) {
            if (mySOS[i].key === changedPin.key) {
                mySOS[i] = changedPin
                break
            }
        }

        this.setState({
            dataSource: ds.cloneWithRows(mySOS)
        })

    }

    updatePinListWhenRemoved = (pinRemoved) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < mySOS.length; i++) {
            if (mySOS[i].key === pinRemoved.key) {
                index = i
            }
        }

        if (index !== null) {
            mySOS.splice(index, 1)
        }

        this.setState({
            dataSource: ds.cloneWithRows(mySOS)
        })

    }

    

    _renderAnimalStreetRow(rowData,rowBackgroundColor){

        return(

            rowData.solved ? 
            (
                <View style={[styles.rowStyle, rowBackgroundColor]}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require("../Resources/animalStreetIcon.png")}
                            style={styles.rowIcon}
                            resizeMode='contain'
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.rowText}>{rowData.specie}</Text>
                        <Text style={styles.rowText}>{rowData.ageAmount} {rowData.ageType}, {rowData.size}</Text>
                    </View>
                    <Image
                        source={require("../Resources/check.png")}
                        style={styles.checkImage}
                        resizeMode='contain'
                    />
                </View>
            ) 
            : 
            (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={ [styles.rowStyle, rowBackgroundColor]}
                    onPress= {() => this.showModal(rowData)}
                >
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require("../Resources/animalStreetIcon.png")}
                            style={styles.rowIcon}
                            resizeMode='contain'
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.rowText}>{rowData.specie}</Text>
                        <Text style={styles.rowText}>{rowData.ageAmount} {rowData.ageType}, {rowData.size}</Text>
                    </View>
                    <Image
                        source={require("../Resources/x.png")}
                        style={styles.checkImage}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )
        )
    }

    _renderTemporaryHomeRow(rowData,rowBackgroundColor){

        return(

            rowData.solved ?
                (
                    <View style={[styles.rowStyle, rowBackgroundColor]}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../Resources/temporaryHomeIcon.png")}
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowText}>{rowData.specie}</Text>
                            <Text style={styles.rowText}>{rowData.ageAmount} {rowData.ageType}, {rowData.size}</Text>
                        </View>
                        <Image
                            source={require("../Resources/check.png")}
                            style={styles.checkImage}
                            resizeMode='contain'
                        />
                    </View>
                )
                :
                (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.rowStyle, rowBackgroundColor]}
                        onPress={() => this.showModal(rowData)}
                    >
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../Resources/temporaryHomeIcon.png")}
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowText}>{rowData.specie}</Text>
                            <Text style={styles.rowText}>{rowData.ageAmount} {rowData.ageType}, {rowData.size}</Text>
                        </View>
                        <Image
                            source={require("../Resources/x.png")}
                            style={styles.checkImage}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                )
        )

    }

    _renderRunawayAnimalRow(rowData,rowBackgroundColor){

        return(

            rowData.solved ?
                (
                    <View style={[styles.rowStyle, rowBackgroundColor]}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../Resources/runawayAnimalIcon.png")}
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowText}>{rowData.name}, {rowData.ageAmount} {rowData.ageType}</Text>
                            <Text style={styles.rowText}>{rowData.size}</Text>
                        </View>
                        <Image
                            source={require("../Resources/check.png")}
                            style={styles.checkImage}
                            resizeMode='contain'
                        />
                    </View>
                )
                :
                (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.rowStyle, rowBackgroundColor]}
                        onPress={() => this.showModal(rowData)}
                    >
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../Resources/runawayAnimalIcon.png")}
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowText}>{rowData.name}, {rowData.ageAmount} {rowData.ageType}</Text>
                            <Text style={styles.rowText}>{rowData.size}</Text>
                        </View>
                        <Image
                            source={require("../Resources/x.png")}
                            style={styles.checkImage}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                )
        )
    }

    _renderFreeRideRow(rowData,rowBackgroundColor){

        return(

            rowData.solved ?
                (
                    <View style={[styles.rowStyle, rowBackgroundColor]}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../Resources/freeRideIcon.png")}
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowText}>Para {rowData.destination}</Text>
                            <Text style={styles.rowText}>{rowData.specie}</Text>
                        </View>
                        <Image
                            source={require("../Resources/check.png")}
                            style={styles.checkImage}
                            resizeMode='contain'
                        />
                    </View>
                )
                :
                (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.rowStyle, rowBackgroundColor]}
                        onPress={() => this.showModal(rowData)}
                    >
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../Resources/freeRideIcon.png")}
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowText}>Para {rowData.destination}</Text>
                            <Text style={styles.rowText}>{rowData.specie}</Text>
                        </View>
                        <Image
                            source={require("../Resources/x.png")}
                            style={styles.checkImage}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                )
        )
    }

    _renderMilkEmptyRow(rowData,rowBackgroundColor){

        return(


            rowData.solved ?
                (
                    <View style={[styles.rowStyle, rowBackgroundColor]}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../Resources/milkEmptyIcon.png")}
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowText}>{rowData.specie}, {rowData.ageAmount} {rowData.ageType}</Text>
                            <Text style={styles.rowText}>{rowData.qtd} filhotes.</Text>
                        </View>
                        <Image
                            source={require("../Resources/check.png")}
                            style={styles.checkImage}
                            resizeMode='contain'
                        />
                    </View>
                )
                :
                (

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.rowStyle, rowBackgroundColor]}
                        onPress={() => this.showModal(rowData)}
                    >
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../Resources/milkEmptyIcon.png")}
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowText}>{rowData.specie}, {rowData.ageAmount} {rowData.ageType}</Text>
                            <Text style={styles.rowText}>{rowData.qtd} filhotes.</Text>
                        </View>
                        <Image
                            source={require("../Resources/x.png")}
                            style={styles.checkImage}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                )
        )
    }

    _renderMilkFullRow(rowData,rowBackgroundColor){

        return(


            rowData.solved ?
                (
                    <View style={[styles.rowStyle, rowBackgroundColor]}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../Resources/milkFullIcon.png")}
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowText}>{rowData.specie}</Text>
                            <Text style={styles.rowText}>{rowData.newborn ? "com filhotes" : "sem filhotes"} </Text>
                        </View>
                        <Image
                            source={require("../Resources/check.png")}
                            style={styles.checkImage}
                            resizeMode='contain'
                        />
                    </View>
                )
                :
                (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.rowStyle, rowBackgroundColor]}
                        onPress={() => this.showModal(rowData)}
                    >
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{rowData.creationDay + "/" + rowData.creationMonth + "/" + rowData.creationYear}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("../Resources/milkFullIcon.png")}
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.rowText}>{rowData.specie}</Text>
                            <Text style={styles.rowText}>{rowData.newborn ? "com filhotes" : "sem filhotes"} </Text>
                        </View>
                        <Image
                            source={require("../Resources/x.png")}
                            style={styles.checkImage}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                )
        )
    }

    _renderHiddenRow(rowData) {

        let rowBackgroundColor = this.darkRow ? { backgroundColor: StyleVars.Colors.secondary }
            : { backgroundColor: StyleVars.Colors.primary }

        this.darkRow = !this.darkRow

        return (
            <View style={[styles.hiddenRow, rowBackgroundColor]}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.solveButton}
                    onPress={() => this.solvePin(rowData)}
                >

                    <Text style={styles.rowText}>Resolvido</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.deleteButton}
                    onPress={() => this.removePin(rowData)}
                >

                    <Text style={styles.rowText}>Deletar</Text>
                </TouchableOpacity>
               
            </View>

        )
    }

    _renderHiddenSolvedRow(rowData) {

        let rowBackgroundColor = this.darkRow ? { backgroundColor: StyleVars.Colors.secondary }
            : { backgroundColor: StyleVars.Colors.primary }

        this.darkRow = !this.darkRow

        return (
            <View style={[styles.hiddenRow, rowBackgroundColor]}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.deleteButton}
                    onPress={() => this.removePin(rowData)}
                >

                    <Text style={styles.rowText}>Deletar</Text>
                </TouchableOpacity>
            </View>

        )
    }

    removePin(rowData){


        Alert.alert('Atenção', 'Deseja deletar este pin? Os pontos adquiridos com este pin serão removidos do seu total de pontos.',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {

                        FirebaseRequest.removeUserPin(rowData.key, rowData.pinID)
                            .then(() => {
                                FirebaseRequest.removePointsFromUser(this.pointsForPinCreation, this.decreaseUserCoins)
                            })
                            .catch((err) => { alert('Erro ao deletar pin.') })
                    }
                }
            ],
            { cancelable: false }
        )   

    }

    decreaseUserCoins = () => {

        FirebaseRequest.removePointsFromCurrentUser(this.pointsForPinCreation)
        FirebaseRequest.removeCoinsFromUser(this.pointsForPinCreation, this.checkUserLevel)

    }

    checkUserLevel = () => {

        FirebaseRequest.removeCoinsFromCurrentUser(this.pointsForPinCreation)
        FirebaseRequest.updateUserLevel()
            .then(() => {

            })
            .catch((err) => { console.error('Erro no sistema de pontos e níveis.', err.message) })

    } 

    solvePin(rowData){

        Alert.alert('Tem certeza?', 'Ao clicar em resolvido, as informações deste pin não poderão ser alteradas ou visualizadas.',
            [

                {
                    text: 'Cancelar', onPress: () => { }
                },
                {
                    text: 'Ok', onPress: () => {
                      
                        FirebaseRequest.updateUserPinSolvedStatus(rowData.key, rowData.pinID)
                        .then(() => {

                        })
                        .catch((err) => alert('Erro ao solucionar pin'))
                    }
                }
            ],
            { cancelable: false }
        )   

   
    }


    _setupAnimalStreetModal(rowData){


        this.setState({
            animalStreetData: {
                creationDay: rowData.creationDay,
                creationMonth: rowData.creationMonth,
                creationYear: rowData.creationYear,
                specie: rowData.specie,
                size: rowData.size,
                ageAmount: rowData.ageAmount,
                ageType: rowData.ageType,
                qtd: rowData.qtd,
                pinID: rowData.pinID,
                key: rowData.key,
                image1: rowData.image1,
                image2: rowData.image2,
                image3: rowData.image3,
                image4: rowData.image4
            }
        })
    }

    _setupTemporaryHomeModal(rowData){
        this.setState({
            temporaryHomeData: {
                creationDay: rowData.creationDay,
                creationMonth: rowData.creationMonth,
                creationYear: rowData.creationYear,
                specie: rowData.specie,
                size: rowData.size,
                ageAmount: rowData.ageAmount,
                ageType: rowData.ageType,
                qtd: rowData.qtd,
                pinID: rowData.pinID,
                key: rowData.key,
                image1: rowData.image1,
                image2: rowData.image2,
                image3: rowData.image3,
                image4: rowData.image4
            }
        })
    }

    _setupRunawayAnimalModal(rowData){
        this.setState({
            runawayAnimalData: {
                creationDay: rowData.creationDay,
                creationMonth: rowData.creationMonth,
                creationYear: rowData.creationYear,
                runawayDate: rowData.runawayDate,
                name: rowData.name,
                specie: rowData.specie,
                breed: rowData.breed,
                gender: rowData.gender,
                size: rowData.size,
                ageAmount: rowData.ageAmount,
                ageType: rowData.ageType,
                qtd: rowData.qtd,
                pinID: rowData.pinID,
                key: rowData.key,
                image1: rowData.image1,
                image2: rowData.image2,
                image3: rowData.image3,
                image4: rowData.image4
            }
        })
    }

     _setupFreeRideModal(rowData){
        this.setState({
            freeRideData: {
                creationDay: rowData.creationDay,
                creationMonth: rowData.creationMonth,
                creationYear: rowData.creationYear,
                to: rowData.destination,
                specie: rowData.specie,
                size: rowData.size,
                ageAmount: rowData.ageAmount,
                ageType: rowData.ageType,
                qtd: rowData.qtd,
                pinID: rowData.pinID,
                key: rowData.key,
                image1: rowData.image1,
                image2: rowData.image2,
                image3: rowData.image3,
                image4: rowData.image4
            }
        })
    }

    _setupMilkEmptyModal(rowData){
        this.setState({
            milkEmptyData: {
                creationDay: rowData.creationDay,
                creationMonth: rowData.creationMonth,
                creationYear: rowData.creationYear,
                specie: rowData.specie,
                ageAmount: rowData.ageAmount,
                ageType: rowData.ageType,
                qtd: rowData.qtd,
                pinID: rowData.pinID,
                key: rowData.key,
                image1: rowData.image1,
                image2: rowData.image2,
                image3: rowData.image3,
                image4: rowData.image4
            }
        })
    }

    _setupMilkFullModal(rowData){
        this.setState({
            milkFullData: {
                creationDay: rowData.creationDay,
                creationMonth: rowData.creationMonth,
                creationYear: rowData.creationYear,
                specie: rowData.specie,
                size: rowData.size,
                ageAmount: rowData.ageAmount,
                ageType: rowData.ageType,
                newborn: rowData.newborn,
                pinID: rowData.pinID,
                key: rowData.key,
                image1: rowData.image1,
                image2: rowData.image2,
                image3: rowData.image3,
                image4: rowData.image4
            }
        })
    }


    showModal(rowData){

        switch(rowData.type){
            case 1:
                this._setupAnimalStreetModal(rowData)
                this.setState({animalStreetModalVisible: true})
                return
            case 2:
                this._setupTemporaryHomeModal(rowData)
                this.setState({temporaryHomeModalVisible: true})
                return
            case 3:
                this._setupRunawayAnimalModal(rowData)
                this.setState({runawayAnimalModalVisible: true})
                return
            case 4:
                this._setupFreeRideModal(rowData)
                this.setState({freeRideModalVisible: true})
                return
            case 5:
                this._setupMilkEmptyModal(rowData)
                this.setState({milkEmptyModalVisible: true})
                return
            case 6:
                this._setupMilkFullModal(rowData)
                this.setState({milkFullModalVisible: true})
                return
        }

    }

    hideModals(){
        this.setState({
            animalStreetModalVisible: false,
            temporaryHomeModalVisible: false,
            runawayAnimalModalVisible: false,
            freeRideModalVisible: false,
            milkEmptyModalVisible: false,
            milkFullModalVisible: false
        })
    }

    _renderRow(rowData){

        let rowBackgroundColor = this.darkRow ? {backgroundColor: StyleVars.Colors.secondary} 
                                              : {backgroundColor: StyleVars.Colors.primary}

        this.darkRow = !this.darkRow

        switch(rowData.type){
            case 1:
                return(this._renderAnimalStreetRow(rowData,rowBackgroundColor))

            case 2:
                 return(this._renderTemporaryHomeRow(rowData,rowBackgroundColor))

            case 3:
                return(this._renderRunawayAnimalRow(rowData,rowBackgroundColor))
            
            case 4:
                return(this._renderFreeRideRow(rowData,rowBackgroundColor))

            case 5:
                return(this._renderMilkEmptyRow(rowData,rowBackgroundColor))

            case 6:
                return(this._renderMilkFullRow(rowData,rowBackgroundColor))

        }


    }


    render(){
        return(
            <View style={styles.container}>
                {!this.state.loading ? 
                    (
                        <SwipeListView
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => this._renderRow(rowData)}
                            renderHiddenRow={(rowData) => rowData.solved ? (this._renderHiddenSolvedRow(rowData)): (this._renderHiddenRow(rowData)) }
                            leftOpenValue={0}
                            style={styles.container}
                            rightOpenValue={-(windowWidth * 0.5)}
                        >
                        </SwipeListView>
                    )
                    : 
                    (
                        <View style={styles.loadingView}>
                            <Text style={styles.loadingText}>Carregando...</Text>
                        </View>
                    )
                }
                
                <AnimalStreetModal
                    visible={this.state.animalStreetModalVisible}
                    data={this.state.animalStreetData}
                    hideModals={() => this.hideModals()}
                />
                <TemporaryHomeModal
                    visible={this.state.temporaryHomeModalVisible}
                    data={this.state.temporaryHomeData}
                    hideModals={() => this.hideModals()}
                />
                <RunawayAnimalModal
                    visible={this.state.runawayAnimalModalVisible}
                    data={this.state.runawayAnimalData}
                    hideModals={() => this.hideModals()}
                />
                <FreeRideModal
                    visible={this.state.freeRideModalVisible}
                    data={this.state.freeRideData}
                    hideModals={() => this.hideModals()}
                />
                <MilkEmptyModal
                    visible={this.state.milkEmptyModalVisible}
                    data={this.state.milkEmptyData}
                    hideModals={() => this.hideModals()}
                />
                <MilkFullModal
                    visible={this.state.milkFullModalVisible}
                    data={this.state.milkFullData}
                    hideModals={() => this.hideModals()}
                />
            </View>

        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.listViewBackground
    },
    modalContainer:{
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalTextContainerLight:{
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    modalTextContainerDark:{
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    modalHeader:{
        backgroundColor: StyleVars.Colors.animalStreetPinBackground,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10

    },
    modalHeaderTextContainer:{
       flex: 2,
       justifyContent: 'center'
    },
    modalHeaderText:{
        color: 'white',
        fontSize: 20
    },
    modalText:{
        color: 'white',
        fontSize: 16
    },
    innerModalContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10
    },
    modalFooter:{
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    modalFooterText:{
        color: 'white',
        fontSize: 18
    },
    modalSaveButtonText:{
        color: StyleVars.Colors.animalStreetPinBackground,
        fontSize: 18
    },
    modalHeaderImageContainer:{
        alignItems: 'center',
        flex: 1
    }, 
    rowStyle:{
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        paddingVertical: 5
    },
    rowText:{
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
    },
    dateText:{
        color: 'white',
        fontSize: 12
    },
    textContainer:{
        flex: 3,
        alignItems: 'center',
        paddingVertical: 10
    },
    dateContainer:{
        alignItems: 'center',
        paddingVertical: 10
    },
    imageContainer:{
        flex: 2,
        alignItems: 'center'
    },
    rowIcon:{
        width: windowWidth * 0.10,
        height: windowHeight * 0.10
    },
    checkImage:{
        width: windowWidth * 0.10,
        height: windowHeight * 0.02
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
    hiddenRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    deleteButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        width: windowWidth * 0.25,
        height: windowHeight * 0.13
    },
    solveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
        width: windowWidth * 0.25,
        height: windowHeight * 0.13
    }
})