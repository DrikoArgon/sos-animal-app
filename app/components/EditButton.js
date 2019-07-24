'use strict'
import React, {Component} from 'react'
import {
  Text,
  TouchableOpacity

} from 'react-native'

import Routes from '../navigation/Routes'

export default class EditButton extends Component{

  onPress(){
    this.props.navigator.push(Routes.edit())
  }

  render(){
    let style = { marginRight: 10, color: 'white'}

    return(
      <TouchableOpacity
        style={this.props.style}
        activeOpacity={0.5}
        onPress={() => this.onPress()}
      >
        <Text style={style}>
          Edit
        </Text>
      </TouchableOpacity>
    )

  }
}