'use strict'
import React, { Component } from 'react'
import {
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    View,
    Alert

} from 'react-native'

import Routes from '../navigation/Routes'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class AddFriendButton extends Component {

    constructor(props){
        super(props)

        this.state = {
            friendAdded: false,
            addingFriend: false
        }

    }

    onPress() {

        Alert.alert('', 'Gostaria de adicionar esta pessoa como amigo?',
            [
               
                {
                    text: 'Cancelar', onPress: () => {}
                },
                {
                    text: 'Ok', onPress: () => {
                        this.setState({
                            addingFriend: true
                        })

                        FirebaseRequest.sendNewFriendshipRequestNotification({
                            receiverID: this.props.data.key
                        })
                            .then(() => {

                                this.setState({
                                    friendAdded: true,
                                    addingFriend: false
                                })

                                Alert.alert('Sucesso', 'Solicitação de amizade enviada.')
                            })
                            .catch((err) => {
                                Alert.alert('Atenção', 'Erro ao enviar solicitação')
                                this.setState({
                                    addingFriend: false
                                })
                            })
                    }
                }
            ],
            { cancelable: false }
        )   

        
    }

    render() {
        let style = {
            width: windowWidth * 0.15,
            height: windowHeight * 0.03,
            marginTop: 2
        }

        return (

            <View>
                {!this.state.friendAdded ?
                    ( 
                        <TouchableOpacity
                            style={this.props.style}
                            activeOpacity={0.5}
                            onPress={() => {this.state.addingFriend ? {} : this.onPress()}}
                        >
                            <Image
                                source={require("../Resources/plusIcon.png")}
                                style={style}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    ) :
                    (
                            <View></View>
                    )
                }
            </View>
            
        )

    }
}