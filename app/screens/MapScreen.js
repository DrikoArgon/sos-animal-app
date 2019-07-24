'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TabBar,
    Dimensions,
    AppState,
    AsyncStorage,
    TouchableOpacity,
    Image,
    Platform,
    ScrollView,
    Alert
} from 'react-native'

import MapView, { Marker, Callout} from 'react-native-maps'
import ClusteredMapView from 'react-native-maps-super-cluster'
import StyleVars from '../styles/StyleVars'

import StreetAnimalPinCalloutAndroid from '../components/StreetAnimalPinCalloutAndroid'

import TemporaryHomePinCalloutAndroid from '../components/TemporaryHomePinCalloutAndroid'

import RunawayAnimalPinCalloutAndroid from '../components/RunawayAnimalPinCalloutAndroid'

import FreeRidePinCalloutAndroid from '../components/FreeRidePinCalloutAndroid'

import MilkFullPinCalloutAndroid from '../components/MilkFullPinCalloutAndroid'

import MilkEmptyPinCalloutAndroid from '../components/MilkEmptyPinCalloutAndroid'
import ShowClusteredPinsModal from '../components/ShowClusteredPinsModal'

import FilterSelectionModal from '../components/FilterSelectionModal'
import TutorialModal from '../components/TutorialModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const ASPECT_RATIO = windowWidth / windowHeight
const LATITUDE = 37.78825
const LONGITUDE = -122.4324
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const SPACE = 0.01
const COORDINATE_LIMIT_TO_FETCH = 0.09
const COORDINATE_DELTA_LIMIT_TO_SHOW = 0.06
var pins = []

var streetAnimalPinImageSource;

var maxLatitude = 0
var minLatitude = 0
var maxLongitude = 0
var minLongitude = 0

export default class MapScreen extends Component {

    constructor(props){
        super(props)
        
        this.state = {
            currentRegion: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            filters:{
                animalStreetActive: true,
                temporaryHomeActive: true,
                runawayAnimalActive: true,
                freeRideActive: true,
                milkEmptyActive: true,
                milkFullActive: true,
            },
            filterSelectionModalVisible: false,
            tutorialModalVisible: false,
            streetAnimalAndroidPinCalloutModalVisile: false,
            temporaryHomeAndroidPinCalloutModalVisile: false,
            runawayAnimalAndroidPinCalloutModalVisile: false,
            freeRideAndroidPinCalloutModalVisile: false,
            milkEmptyAndroidPinCalloutModalVisile: false,
            milkFullAndroidPinCalloutModalVisile: false,
            showClusteredPinsModalVisible: false,
            markers: pins,
            firstMapLoad: true,
            selectedPinData: {
            },
            pinFecthingLimitPoint1: {
                latitude: 0,
                longitude: 0
            },
            pinFecthingLimitPoint2: {
                latitude: 0,
                longitude: 0
            },
            pinFecthingLimitPoint3: {
                latitude: 0,
                longitude: 0
            },
            pinFecthingLimitPoint4: {
                latitude: 0,
                longitude: 0
            },
            selectedClusterPins:{

            },
            appState: AppState.currentState,
            updatePins: false
        }

        this.defineFilters(false)

        streetAnimalPinImageSource = <Image source={require('../Resources/Pins/streetAnimalPin.png')} resizeMode='contain' />
        this.renderMarker = this.renderMarker.bind(this)
        this.renderCluster = this.renderCluster.bind(this)
    }

    componentDidMount(){
        console.log("Pin image loaded: ", streetAnimalPinImageSource)
        AppState.addEventListener('change', this._handleAppStateChange);

        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                currentRegion:{
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                },
                currentUserPosition: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
            })

            this.map.getMapRef().animateToRegion({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },1);

            this.maxLatitude = position.coords.latitude + 0.2
            this.minLatitude = position.coords.latitude - 0.2

            this.maxLongitude = position.coords.longitude + 0.2
            this.minLongitude = position.coords.longitude - 0.2

            this.setState({
                pinFecthingLimitPoint1: {
                    latitude: this.maxLatitude,
                    longitude: this.maxLongitude
                },
                pinFecthingLimitPoint2: {
                    latitude: this.minLatitude,
                    longitude: this.minLongitude
                }
            }) 

            FirebaseRequest.fetchPins(this.maxLatitude, this.maxLongitude, this.minLatitude, this.minLongitude)
                .then((pinArray) => {
                    pins = pinArray


                    this.setState({
                        markers: pins
                    }) 

                    console.log("Pins after fetch: ", pins);
                    console.log("Markers after fetch: ", this.state.markers);
                    this.setState({
                        firstMapLoad: false
                    })
                    
                    AsyncStorage.getItem('TUTORIAL_SEEN')
                        .then((hasSeenTutorial) => {
                            if (hasSeenTutorial !== "1") {
                                this.showTutorialModal();                               
                            }
                        })
                        .catch((err) => { })

                })
                .catch((err) => { 
                    this.showTutorialModal();
                    console.error('Error while trying to fetch pins: ', err.message) 
                })

        },
        (error) => {
            Alert.alert('', error.message,
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        },
        {enableHighAccuracy: true})

        FirebaseRequest.listenToNewPinsAdded(this.updateMapPinsWhenAdded)
        FirebaseRequest.listenToPinRemoved(this.updateMapPinsWhenRemoved)

    }


    // componentDidUpdate(prevProps,prevState){
     

    //     if (this.props.selectedTab === "map"){
    //         if (this.state.updatePins){
            
    //             console.log("There's new info!");
    //             this.setState({
    //                 updatePins: false,
    //                 markers: pins
    //             })
    //         }
    //     }
    // }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {

            this.setState({
                markers: pins
            })
        }
        this.setState({ appState: nextAppState });
    }

    showFilterSelectionModal(){
        this.setState({
            filterSelectionModalVisible: true
        })
    }

    showTutorialModal() {
        this.setState({
            tutorialModalVisible: true
        })
    }

    showStreetAnimalPinCalloutModal() {
        this.setState({
            streetAnimalAndroidPinCalloutModalVisile: true
        })
    }

    showTemporaryHomePinCalloutModal() {
        this.setState({
            temporaryHomeAndroidPinCalloutModalVisile: true
        })
    }

    showRunawayAnimalPinCalloutModal() {
        this.setState({
            runawayAnimalAndroidPinCalloutModalVisile: true
        })
    }

    showFreeRidePinCalloutModal() {
        this.setState({
            freeRideAndroidPinCalloutModalVisile: true
        })
    }

    showMilkEmptyPinCalloutModal() {
        this.setState({
            milkEmptyAndroidPinCalloutModalVisile: true
        })
    }

    showMilkFullPinCalloutModal() {
        this.setState({
            milkFullAndroidPinCalloutModalVisile: true
        })
    }

    showClusteredPinsModal(clusteredPins) {

        this.setState({
            selectedClusterPins: clusteredPins,
            showClusteredPinsModalVisible: true
        })
    }

    hideModals(){
        this.setState({
            filterSelectionModalVisible: false,
            streetAnimalAndroidPinCalloutModalVisile: false,
            temporaryHomeAndroidPinCalloutModalVisile: false,
            runawayAnimalAndroidPinCalloutModalVisile: false,
            freeRideAndroidPinCalloutModalVisile: false,
            milkEmptyAndroidPinCalloutModalVisile: false,
            milkFullAndroidPinCalloutModalVisile: false,
            showClusteredPinsModalVisible: false,
            tutorialModalVisible: false
        })
    }

    updateMapPinsWhenAdded = (newPin) => {

        if (this.checkInsideFetchingArea(newPin)){
            // pins.push(newPin)

            // console.log("New pin inside fetching area added!");
            // this.setState({
            //     markers: pins,
            //     updatePins: true
            // })

            // console.log("Pins after new pin: ", pins);
            // console.log("Markers after new pin: ", this.state.markers);
            this.definePinFetchingLimits(this.state.currentRegion);
        }
    }

    updateMapPinsWhenRemoved = (removedPin) => {

        var index = null

       if(this.checkInsideFetchingArea(removedPin)){
        //    for (var i = 0; i < pins.length; i++) {
        //        if (removedPin.key === pins[i].pinID) {
        //            index = i
        //        }
        //    }

        //    if (index !== null) {
        //        pins.splice(index, 1)
        //    }

        //    this.setState({
        //        markers: pins,
        //        updatePins: true
        //    })
       

        //    console.log("Pin inside fetching area removed!");
        //    console.log("Pins after pin removed: ", pins);
        //    console.log("Markers after pin removed: ", this.state.markers);
           this.definePinFetchingLimits(this.state.currentRegion);
       }

    }

    onRegionChangeComplete(region){

        this.setState({
             currentRegion: region
        })

        console.log("New region: ", region)

        if(!this.state.firstMapLoad){
            if ((region.latitude > this.state.pinFecthingLimitPoint1.latitude)
                || (region.longitude > this.state.pinFecthingLimitPoint1.longitude)
                || (region.latitude < this.state.pinFecthingLimitPoint2.latitude)
                || (region.longitude < this.state.pinFecthingLimitPoint2.longitude) ) {
                    this.definePinFetchingLimits(region)
            }
        }
    }

    definePinImage(marker){
        switch(marker.type){
            
            case 1:
                return require('../Resources/Pins/streetAnimalPin.png')
            case 2:
                return require('../Resources/Pins/temporaryHomePin.png')
            case 3:
                return require('../Resources/Pins/runawayAnimalPin.png')
            case 4:
                return require('../Resources/Pins/freeRidePin.png')
            case 5:
                return require('../Resources/Pins/milkEmptyPin.png')
            case 6:
                return require('../Resources/Pins/milkFullPin.png')
            case 7:
                return require('../Resources/Pins/farePin.png')
            case 8:
                if(marker.CRMV === '-'){
                    if (marker.featured) {
                        return require('../Resources/Pins/featuredServicePin.png')
                    } else {
                        return require('../Resources/Pins/servicePin.png')
                    }
                } else {
                    return require('../Resources/Pins/vetPin.png')
                }
                
        }
    }

 /*   definePinCallout(marker){

        switch(marker.type){
            
            case 1:
                return (<StreetAnimalPinCallout data={marker}></StreetAnimalPinCallout>)
            
            case 2:
                return (<TemporaryHomePinCallout data={marker}></TemporaryHomePinCallout>)
            
            case 3:
                return (<RunawayAnimalPinCallout data={marker}></RunawayAnimalPinCallout>)
            
            case 4:
                return (<FreeRidePinCallout data={marker}></FreeRidePinCallout>)
            
            case 5:
                return (<MilkEmptyPinCallout data={marker}></MilkEmptyPinCallout>)
            
            case 6:
                return (<MilkFullPinCallout data={marker}></MilkFullPinCallout>)
            case 7:
                return (<FarePinCallout data={marker}></FarePinCallout>)
            case 8:
                return (<ServicePinCallout data={marker}></ServicePinCallout>)
            
        }
    }*/

    defineCustomCalloutSize(marker){
    
         switch(marker.type){
            
            case 1:
                return styles.customView
            
            case 2:
                return styles.customViewMilkFull
            
            case 3:
                return styles.customViewRunawayAnimal
            
            case 4:
                return styles.customView
            
            case 5:
                return styles.customViewMilkFull
            
            case 6:
                return styles.customViewMilkFull
            case 7:
                return styles.customView
            case 8:
                return styles.customView
            
        }
    }

    defineFilters(reloadMap){

        var isStreetAnimalActive = true
        var isTemporaryHomeActive = true
        var isRunawayAnimalActive = true
        var isFreeRideActive = true
        var isMilkEmptyActive = true
        var isMilkFullActive = true

        AsyncStorage.getItem('SHOW_STREET_ANIMAL')
            .then((streetAnimalFilter) => {
                if (streetAnimalFilter) {
                    isStreetAnimalActive = JSON.parse(streetAnimalFilter)
                    var filterValue = JSON.parse(streetAnimalFilter)
                    console.log('Street Animal Filter  current value: ', filterValue)
                }
                AsyncStorage.getItem('SHOW_TEMPORARY_HOME')
                    .then((temporaryHomeFilter) => {
                        if (temporaryHomeFilter) {
                            isTemporaryHomeActive = JSON.parse(temporaryHomeFilter)
                        }
                        AsyncStorage.getItem('SHOW_RUNAWAY_ANIMAL')
                            .then((runawayAnimalFilter) => {
                                if (runawayAnimalFilter) {
                                    isRunawayAnimalActive = JSON.parse(runawayAnimalFilter)
                                }
                                AsyncStorage.getItem('SHOW_FREE_RIDE')
                                    .then((freeRideFilter) => {
                                        if (freeRideFilter) {
                                            isFreeRideActive = JSON.parse(freeRideFilter)
                                        }
                                        AsyncStorage.getItem('SHOW_MILK_EMPTY')
                                            .then((milkEmptyFilter) => {
                                                if (milkEmptyFilter) {
                                                    isMilkEmptyActive = JSON.parse(milkEmptyFilter)
                                                }
                                                AsyncStorage.getItem('SHOW_MILK_FULL')
                                                    .then((milkFullFilter) => {
                                                        if (milkFullFilter) {
                                                            isMilkFullActive = JSON.parse(milkFullFilter)
                                                        }

                                                        this.setState({
                                                            filters:{
                                                                animalStreetActive: isStreetAnimalActive,
                                                                temporaryHomeActive: isTemporaryHomeActive,
                                                                runawayAnimalActive: isRunawayAnimalActive,
                                                                freeRideActive: isFreeRideActive,
                                                                milkEmptyActive: isMilkEmptyActive,
                                                                milkFullActive: isMilkFullActive
                                                            }
                                                        })

                                                        if (reloadMap) {
                                                            this.setState({
                                                                markers: pins
                                                            })
                                                        }
                                                    })
                                            })
                                    })
                            })
                    })
            })
    }

    checkFilters(marker){

        switch (marker.type) {

            case 1:
                return this.state.filters.animalStreetActive
            case 2:
                return this.state.filters.temporaryHomeActive

            case 3:
                return this.state.filters.runawayAnimalActive

            case 4:
                return this.state.filters.freeRideActive

            case 5:
                return this.state.filters.milkEmptyActive

            case 6:
                return this.state.filters.milkFullActive
            case 7:
                return true
            case 8:
                return true

        }

    }

    checkInsideFetchingArea(position){

        if ((position.latitude <= this.state.pinFecthingLimitPoint1.latitude)
            && (position.longitude <= this.state.pinFecthingLimitPoint1.longitude)
            && (position.latitude >= this.state.pinFecthingLimitPoint2.latitude)
            && (position.longitude >= this.state.pinFecthingLimitPoint2.longitude)) {

            return true;
        } else {
            return false
        }
    }

    definePinFetchingLimits(region){

        if(this.state.firstMapLoad){
            this.setState({
                firstMapLoad: false
            })
        }
        
        this.maxLatitude = region.latitude + 0.2
        this.minLatitude = region.latitude - 0.2

        this.maxLongitude = region.longitude + 0.2
        this.minLongitude = region.longitude - 0.2

        this.setState({
            pinFecthingLimitPoint1: { 
                latitude: this.maxLatitude, 
                longitude: this.maxLongitude
            },
            pinFecthingLimitPoint2: {
                latitude: this.minLatitude,
                longitude: this.minLongitude
            }
        })

        console.log("Pin Fetching Limits changed. ", this.state.pinFecthingLimitPoint1, this.state.pinFecthingLimitPoint2 ) 

        if (this.state.pinFecthingLimitPoint1.latitude !== 0 && this.state.pinFecthingLimitPoint2.latitude !== 0){
            
            FirebaseRequest.fetchPins(this.maxLatitude, this.maxLongitude, this.minLatitude, this.minLongitude)
                .then((pinArray) => {

                    pins = pinArray

                    this.setState({
                        markers: pins
                    })


                })
                .catch((err) => { console.error('Error while trying to fetch pins: ', err.message) })
        }


    }

    showCorrectModal(marker){

        console.log("Show Correct Modal Called with type: ", marker.type)
        this.setState({
            selectedPinData: marker
        })
        //show the correct modal for each type of pin
        switch (marker.type) {

            case 1:   
                return this.showStreetAnimalPinCalloutModal()
            case 2:
                return this.showTemporaryHomePinCalloutModal()
            case 3:
                return this.showRunawayAnimalPinCalloutModal()
            case 4:
                return this.showFreeRidePinCalloutModal()
            case 5:
                return this.showMilkEmptyPinCalloutModal()
            case 6:
                return this.showMilkFullPinCalloutModal()
        }
    }

    renderMarker = (pin) => {
    
        if (this.checkFilters(pin)) {
            return (

                Platform.OS === 'ios' ?
                    (
                        <Marker coordinate={pin.location}
                            key={pin.key}
                            onPress={e => { this.showCorrectModal(pin) }}
                        >
                            <Image
                                source={this.definePinImage(pin)}
                                resizeMode='contain'
                                style={{ width: 32, height: 32 }}
                            />
                        </Marker>
                    )
                    :
                    (
                        <Marker coordinate={pin.location}
                            image={this.definePinImage(pin)}
                            key={pin.key}
                            onPress={e => { this.showCorrectModal(pin) }}
                        >
                        </Marker>
                    )
            )
        }
    }

    renderUserPositionMarker(){

    }

    renderCluster = (cluster, onPress) => {

        const coordinate = cluster.coordinate,
            clusterId = cluster.clusterId

        var pointCount = cluster.pointCount;

        if(this.map){
            const clusterEngine = this.map.getClusteringEngine();

            var  clusteredPoints = clusterEngine.getLeaves(clusterId, 100)

            var clusteredPointsAfterFilter = [];


            for (var i = 0; i < cluster.pointCount; i++){
                var p = clusteredPoints[i];
        
                if (this.checkFilters(p.properties.item)) {
                    clusteredPointsAfterFilter.push(p);
                } else {
                    pointCount -= 1;
                }
            }

            if(pointCount == 1){

                return this.renderMarker(clusteredPointsAfterFilter[0].properties.item);
            }else if(pointCount == 0){
                return null;
            }else{
                return (
                    Platform.OS === 'ios' ?
                        (
                            <Marker coordinate={coordinate}
                                key={cluster.clusterId}
                                onPress={e => this.showClusteredPinsModal(clusteredPointsAfterFilter)}
                            >
                                <Image
                                    source={require('../Resources/clusterIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 32, height: 32 }}
                                >
                                </Image>                          
                            </Marker>
                        )
                        :
                        (
                            <Marker onPress={e => this.showClusteredPinsModal(clusteredPointsAfterFilter)}
                                coordinate={coordinate}
                                key={cluster.clusterId}
                                image={require('../Resources/clusterIcon.png')}
                            >
                            </Marker>
                        )
                )
            }
        }else{
            return null
        }
    }

    render(){
        return(
            <View style={styles.container2}>
                <StreetAnimalPinCalloutAndroid
                    visible={this.state.streetAnimalAndroidPinCalloutModalVisile}
                    hideModals={() => this.hideModals()}
                    data={this.state.selectedPinData}
                />
                <TemporaryHomePinCalloutAndroid
                    visible={this.state.temporaryHomeAndroidPinCalloutModalVisile}
                    hideModals={() => this.hideModals()}
                    data={this.state.selectedPinData}
                />
                <RunawayAnimalPinCalloutAndroid
                    visible={this.state.runawayAnimalAndroidPinCalloutModalVisile}
                    hideModals={() => this.hideModals()}
                    data={this.state.selectedPinData}
                />
                <FreeRidePinCalloutAndroid
                    visible={this.state.freeRideAndroidPinCalloutModalVisile}
                    hideModals={() => this.hideModals()}
                    data={this.state.selectedPinData}
                />
                <MilkEmptyPinCalloutAndroid
                    visible={this.state.milkEmptyAndroidPinCalloutModalVisile}
                    hideModals={() => this.hideModals()}
                    data={this.state.selectedPinData}
                />
                <MilkFullPinCalloutAndroid
                    visible={this.state.milkFullAndroidPinCalloutModalVisile}
                    hideModals={() => this.hideModals()}
                    data={this.state.selectedPinData}
                />
                <FilterSelectionModal
                    visible={this.state.filterSelectionModalVisible}
                    hideModals={() => this.hideModals()}
                    updateFilters={() => this.defineFilters(true)}
                    data={this.state.filters}
                />
                <TutorialModal
                    visible={this.state.tutorialModalVisible}
                    hideModals={() => this.hideModals()}
                />
                <ShowClusteredPinsModal
                    visible={this.state.showClusteredPinsModalVisible}
                    hideModals={() => this.hideModals()}
                    showCorrectModal={(marker) => this.showCorrectModal(marker)}
                    clusteredPins={this.state.selectedClusterPins}
                /> 
                <TouchableOpacity
                    style={styles.filtersButton}
                    activeOpacity={0.8}
                    onPress={() => {this.showFilterSelectionModal() }}
                >
                    <Image
                        source={require('../Resources/filtro.png')}
                        style={styles.filterIcon}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                {/* <MapView 
                    style={styles.map2}
                    region={this.state.currentRegion}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    onRegionChangeComplete={(region) => this.onRegionChangeComplete(region)}
                 >
                */}
                 {/*this.state.markers.map((marker) => {

                    if(this.checkFilters(marker) /* && this.checkInsideShowingArea(marker) */ /*){
                         /*return (
                             
                            Platform.OS === 'ios' ? 
                                (
                                     <Marker {...marker}
                                         //image={this.definePinImage(marker)}
                                         key={marker.key}
                                         onPress={e => { this.showCorrectModal(marker, e) }}
                                     >
                                        <Image 
                                            source={this.definePinImage(marker)}
                                             resizeMode='contain'
                                            style={{width: 32, height: 32}}
                                        />
                                         {/* <MapView.Callout tooltip={true} style={this.defineCustomCalloutSize(marker)}{...marker}>
                                             {this.definePinCallout(marker)}
                                         </MapView.Callout> */ /*}
                                    </Marker>
                                ) 
                                : 
                                (
                                     <Marker {...marker}
                                         //image={this.definePinImage(marker)}
                                         key={marker.key}
                                         onPress={e => {this.showCorrectModal(marker,e)} }
                                     >
                                         <Image
                                             source={this.definePinImage(marker)}
                                             resizeMode='contain'
                                             style={{ width: 32, height: 32 }}
                                         />
                                     </Marker> 
                                )  
                        )
                    }
                })} 
                </MapView>*/} 
                <ClusteredMapView
                    style={{flex: 1, width: windowWidth, height: windowHeight}}
                    data={this.state.markers}
                    ref={r => {this.state.firstMapLoad ? this.map = r : {}}}
                    textStyle={{color: '#65bc46'}}
                    showsUserLocation={true}
                    renderMarker={this.renderMarker}
                    renderCluster={this.renderCluster}
                    onClusterPress={() => {}}
                    preserveClusterPressBehavior={false}
                    edgePadding={{top: 32, left: 10, right: 64, bottom: 64}}
                    initialRegion={this.state.currentRegion}
                    onRegionChangeComplete={(region) => {this.onRegionChangeComplete(region)}}
                >
                </ClusteredMapView>
            </View>
        ) 
    }


}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    container2:{
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    map2:{
        ...StyleSheet.absoluteFillObject
    },
    map: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    marker:{
        width: 60
    },
    markerText:{
        color: '#EEE',
        fontWeight: 'bold'
    },
    customView:{
        width: windowWidth * 0.8,
        height: windowHeight * 0.75,
        zIndex: 5
    },
    customViewMilkFull:{
        width: windowWidth * 0.8,
        height: windowHeight * 0.7,
        zIndex: 5
    },
    customViewRunawayAnimal:{
        width: windowWidth * 0.8,
        height: windowHeight * 0.7,
        zIndex: 5
    },
    filtersButton:{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: (windowWidth * 0.15) / 2,
        width: windowWidth * 0.15,
        height: windowWidth * 0.15,
        left: windowWidth * 0.8,
        right: 0,
        top: windowHeight * 0.68,
        bottom: 0,
        backgroundColor: StyleVars.Colors.secondary,
        zIndex: 10
    },
    filterIcon: {
        width: windowWidth * 0.08,
        height: windowHeight * 0.03
    },
    clusterContainer: {
        marginTop: 2,
        marginLeft: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    clusterImage:{
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center'
    },
    counterText:{
        color: 'white',
        fontSize: 12,
        fontWeight: '400'
    },
    calloutStyle:{
        width: windowWidth * 0.8,
        height: windowHeight * 0.7,
        padding: 8,
        borderRadius: 8,
        borderColor: '#65bc46',
        backgroundColor: StyleVars.Colors.secondary
    }

})