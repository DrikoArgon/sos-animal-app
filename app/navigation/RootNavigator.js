'use strict'

import React, { Component } from 'react'
import {
  StatusBar,
  StyleSheet,
  Dimensions,
  View,
  Text
} from 'react-native'

import { Navigator }  from 'react-native-deprecated-custom-components'
import StyleVars from '../styles/StyleVars'
import SharedStyles from '../styles/SharedStyles'
import Routes from './Routes'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const NavigationBarRouteMapper = {
  LeftButton: (route, navigator, index, navState) => {
    return route.leftButton ? (
      <route.leftButton
        style={styles.buttonStyle}
        navigator={navigator}
        route={route}
        data={route.data}
      />
    ) : null
  },
  Title:(route, navigator, index, navState) => {
    return route.title ? (
      <Text
        style={[styles.titleStyle, SharedStyles.navBarTitleText]}
        numberOfLines={1}
      >{route.title}</Text>
    ) : null
  },
  RightButton: (route, navigator, index, navState) => {
    return route.rightButton ? (
      <route.rightButton
        style={styles.buttonStyle}
        navigator={navigator}
        route={route}
        data={route.data}
      />
    ) : null
  }
}

export default class RootNavigator extends Component{

  constructor(props){
    super(props)

    this.state = {
      hideNavigationBar: false,
    }

  }

  componentDidMount(){
    this._setupRoute(this._getInitialRoute())
  }

  componentWillUnmount(){
    if(this._listeners)
      this._listeners.forEach( (listener) => listener.remove())
  }

  onNavWillFocus(route){
    this._setupRoute(route.currentTarget.currentRoute)
  }

  renderScene(route,navigator){
    let style = route.hideNavigationBar ? { paddingTop: 0 } : {};
    return(
      <View style={[styles.sceneContainer, style]}>
        <route.component
          navigator={navigator}
          parentNavigator={this.props.navigator}
          back={() => this.back()}
          backToHome={ () => this.backToHome()}
          toRoute={(route,args) => this.toRoute(route, args)}
          replaceRoute={(route,args) => this.replaceRoute(route,args)}
          backToBeginning={() => this.backToBeginning()}
          getCurrentStackLength={() => this.getCurrentStackLength()}
          backByNScenes={(number) => this.backByNScenes(number)}
          data={route.data}
          selectedTab={this.props.selectedTab}
        />
      </View>
    )
  }

  back(){
    this.navigator.pop()
  }

  backToHome(){
    this.navigator.popToTop()
  }

  backByNScenes(number){
    this.navigator.popN(number)
  }


  toRoute(route,args){
    if("string" !=  typeof route || (route = Routes.get(route,args)))
      this.navigator.push(route)
  }

  replaceRoute(route,args){
    if("string" !=  typeof route || (route = Routes.get(route,args)))
      this.navigator.replace(route)
  }

  backToBeginning(){
    if(this.parentNavigator){
     this.parentNavigator.popToTop()
    }
  }

  _getInitialRoute(){

    switch(this.props.initialRouteName) {
      case "login":
        return Routes.login()
      case "main":
        return Routes.main()
      case "map":
        return Routes.map()
      case "menu":
        return Routes.menu()
      case "pin":
        return Routes.pin()
      case "onlineFriends":
        return Routes.onlineFriends()
      case "mapFilter":
        return Routes.mapFilter()

      default:
        return Routes.login()
    }
  }

  _setNavigatorRef(navigator){
    if(navigator != this.navigator){
      this.navigator = navigator;

      if(navigator){
        this._listeners = [
          navigator.navigationContext.addListener("willfocus",this.onNavWillFocus.bind(this))
        ]
      }else{
        if(this._listeners){
          this._listeners.forEach((listener) => listener.remove())
        }
      }
    }
  }

  _setupRoute(route){
    if(route){

      var state = {}

      if(route.hideNavigationBar !== undefined && this.state.hideNavigationBar !== route.hideNavigationBar){
        state.hideNavigationBar = route.hideNavigationBar
      }

      if(route.statusBarStyle && this.state.statusBarStyle !== route.statusBarStyle){
        state.statusBarStyle = route.statusBarStyle
        StatusBar.setBarStyle(route.statusBarStyle, true)
        StatusBar.setHidden(false,"slide")
      }

      this.setState(state)
    }

  }

  render(){

    let navigationBar = (
      <Navigator.NavigationBar
        routeMapper={NavigationBarRouteMapper}
        navigationStyles={Navigator.NavigationBar.StylesIOS}
        style={styles.navBar}
      />
    )

    return(
      <Navigator
        ref={(navigator) => this._setNavigatorRef(navigator)}
        initialRoute={this._getInitialRoute()}
        renderScene={(route,navigator) => this.renderScene(route,navigator)}
        navigationBar={this.state.hideNavigationBar ? null : navigationBar}
      />
    )
  }

}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: StyleVars.Colors.navBarBackground
  },
  buttonStyle: {
    marginTop: 13,
    width: windowWidth * 0.2,
    alignItems: 'center' 
  },
  titleStyle: {
    marginTop: 10,
    justifyContent: 'center'
  },
  sceneContainer: {
    flex: 1,
    paddingTop: Navigator.NavigationBar.Styles.General.TotalNavHeight
  }

})


