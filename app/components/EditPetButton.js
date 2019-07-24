'use strict'
import React, { Component } from 'react'
import {
    Text,
    TouchableOpacity

} from 'react-native'

import Routes from '../navigation/Routes'

export default class EditPetButton extends Component {

    onPress() {
        this.props.navigator.push(Routes.editPet(this.props.data))
    }

    render() {
        let style = { marginRight: 10, color: 'white' }

        return (
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