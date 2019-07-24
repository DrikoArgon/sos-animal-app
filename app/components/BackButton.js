'use strict'
import React, {Component} from 'react'
import {
  Text,
  TouchableOpacity

} from 'react-native'

export default class BackButton extends Component{

  onPress(){
    this.props.navigator.pop()
  }

  render(){
    let style = { color: 'white'}

    return(
      <TouchableOpacity
        style={this.props.style}
        activeOpacity={0.5}
        onPress={() => this.onPress()}
      >
        <Text style={style}>
          Back
        </Text>
      </TouchableOpacity>
    )

  }
}