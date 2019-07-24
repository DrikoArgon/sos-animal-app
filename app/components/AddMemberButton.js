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

export default class AddMemberButton extends Component {

    constructor(props) {
        super(props)

        this.state = {
            memberAdded: false,
            addingMember: false
        }

    }

    onPress() {

        if (this.props.data.isUserLooking) {

            Alert.alert('', 'Gostaria de participar deste grupo?',
                [

                    {
                        text: 'Cancelar', onPress: () => { }
                    },
                    {
                        text: 'Ok', onPress: () => {
                            this.setState({
                                addingMember: true
                            })

                            FirebaseRequest.sendNewMemberRequestNotificationAsUser({
                                receiverID: this.props.data.key
                            })
                            .then(() => {

                                this.setState({
                                    memberAdded: true,
                                    addingMember: false
                                })

                                Alert.alert('Sucesso!', 'Solicitação enviada.')
                            })
                            .catch((err) => {
                                console.error('Error trying to send new member request, ', err.message)
                                this.setState({
                                    addingMember: false
                                })
                            })

                        }
                    }
                ],
                { cancelable: false }
            )   

        } else {

            Alert.alert('', 'Gostaria de adicionar este usuário ao seu grupo?',
                [

                    {
                        text: 'Cancelar', onPress: () => { }
                    },
                    {
                        text: 'Ok', onPress: () => {
                            this.setState({
                                addingMember: true
                            })


                            FirebaseRequest.sendNewMemberRequestNotificationAsGroup({
                                receiverID: this.props.data.key
                            })
                                .then(() => {

                                    this.setState({
                                        memberAdded: true,
                                        addingMember: false
                                    })

                                    Alert.alert('Sucesso!', 'Solicitação enviada.')
                                })
                                .catch((err) => {
                                    Alert.alert('Atenção', 'Erro ao enviar solicitação')
                                    this.setState({
                                        addingMember: false
                                    })
                                })

                        }
                    }
                ],
                { cancelable: false }
            )
        }
    }

    render() {
        let style = {
            width: windowWidth * 0.15,
            height: windowHeight * 0.03,
            marginTop: 2
        }

        return (

            <View>
                {!this.state.memberAdded ?
                    (
                        <TouchableOpacity
                            style={this.props.style}
                            activeOpacity={0.5}
                            onPress={() => { this.state.addingMember ? {} : this.onPress() }}
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