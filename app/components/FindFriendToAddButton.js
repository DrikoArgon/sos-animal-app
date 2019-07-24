'use strict'
import React, {Component} from 'react'
import {
  Text,
  TouchableOpacity,
  Dimensions,
  Image

} from 'react-native'

import Routes from '../navigation/Routes'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class FindFriendToAddButton extends Component{

  onPress(){
    this.props.navigator.push(Routes.findFriendToAdd())
  }

  render(){
    let style = { 
        width: windowWidth * 0.15,
        height: windowHeight * 0.03,
        marginTop: 2
    }

    return(
      <TouchableOpacity
        style={this.props.style}
        activeOpacity={0.5}
        onPress={() => this.onPress()}
      >
        <Image 
            source={require("../Resources/plusIcon.png")}
            style={style}
            resizeMode='contain'
        />
      </TouchableOpacity>
    )

  }
}