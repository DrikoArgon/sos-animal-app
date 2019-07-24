'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native'
import TabNavigator from 'react-native-tab-navigator'
import RootNavigator from '../navigation/RootNavigator'
import Routes from '../navigation/Routes'
import StyleVars from '../styles/StyleVars'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height



export default class MainScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            selectedTab: 'map',
            isMapSelected: true
        }
    }

    checkIfMapIsSelected(){
        if(this.state.selectedTab === "map"){
            this.setState({
                isMapSelected: true
            })
        } else{
            this.setState({
                isMapSelected: false
            })
        }
    }

    render(){
        return(
            <TabNavigator tabBarStyle={styles.tabBar}>

                <TabNavigator.Item 
                    selected={this.state.selectedTab === 'menu'}
                    onPress={() => {
                        this.setState({selectedTab: 'menu'})
                        this.checkIfMapIsSelected()
                    }}
                    renderIcon={() => <Image 
                                        source={require('../Resources/menuIcon.png')}
                                        style={styles.tabBarIcon2}
                                        resizeMode='contain'
                                        />}
                >
                <RootNavigator 
                        ref="menuNavigator" 
                        navigator={this.props.navigator}
                        initialRouteName="menu"
                        parentNavigator={this.navigator}          
                />
                </TabNavigator.Item>
{/* Will be added in the future
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'friends'}
                    onPress={() => {
                        this.setState({selectedTab: 'friends'})
                        this.checkIfMapIsSelected()
                    }}
                    renderIcon={() => <Image 
                                        source={require('../Resources/amigosOnlineIcon.png')}
                                        style={styles.tabBarIcon2}
                                        resizeMode='contain'
                                        />}
                >
                <RootNavigator 
                        ref="onlineFriendsNavigator" 
                        navigator={this.props.navigator}
                        initialRouteName="onlineFriends"
                        parentNavigator={this.navigator}          
                />
                </TabNavigator.Item>
*/}                
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'map'}
                    onPress={() => {
                        this.setState({selectedTab: 'map'})
                        this.checkIfMapIsSelected()
                    }}
                    renderIcon={() => <Image 
                                        source={require('../Resources/localizationIcon.png')}
                                        style={styles.tabBarIcon}
                                        resizeMode='contain'
                                        />}
                >
                    <RootNavigator 
                        ref="mapNavigator"
                        navigator={this.props.navigator} 
                        initialRouteName="map"
                        selectedTab={this.state.selectedTab}         
                    />  
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={this.state.selectedTab === 'pins'}
                    onPress={() => {
                        this.setState({selectedTab: 'pins'})
                        this.checkIfMapIsSelected()
                    }}
                    renderIcon={() => <Image 
                                        source={require('../Resources/pinsIcon.png')}
                                        style={styles.tabBarIcon}
                                        resizeMode='contain'
                                        />}
                >
                 <RootNavigator 
                        ref="pinNavigator"
                        navigator={this.props.navigator} 
                        initialRouteName="pin"          
                    />  
                </TabNavigator.Item>


            </TabNavigator>
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
        bottom: 0
    },
    tabBarIcon: {
        width: windowWidth * 0.10,
        height: windowHeight * 0.04,
        marginTop: 12
    },
    tabBarIcon2: {
        width: windowWidth * 0.12,
        height: windowHeight * 0.03,
        
    },
    tabBar:{
        backgroundColor: StyleVars.Colors.secondary
        
    }

})