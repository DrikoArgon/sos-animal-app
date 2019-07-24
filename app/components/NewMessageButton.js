'use strict'
import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet
} from 'react-native'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

import SendMessageModal from '../components/SendMessageModal'

export default class NewMessageButton extends Component{

    constructor(props){
        super(props)

        this.state = {
            newMessageModalVisible: false
        }
    }

  onPress(){

    this.setState({
        newMessageModalVisible: true
    })
  }

  hideModals(){
      this.setState({
          newMessageModalVisible: false
      })
  }

  render(){
    let style = { marginLeft: 10, color: 'white'}

    return(
    <View>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.5}
        onPress={() => this.onPress()}
      >
        <Image
          source={require("../Resources/messageIcon.png")}
          style={styles.image}
          resizeMode='contain'
        />
      </TouchableOpacity>
      <SendMessageModal
        visible={this.state.newMessageModalVisible}
        hideModals={() => this.hideModals()}
        data={this.props.data}
      />
    </View>
    )

  }
}
const styles = StyleSheet.create({
  image:{
    width: windowWidth * 0.07,
    height: windowHeight * 0.07,
    marginRight: 10
  },
  container: {
    alignItems: "center",
    justifyContent: 'center'
  }
})
