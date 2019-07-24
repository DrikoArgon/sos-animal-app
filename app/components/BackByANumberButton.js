'use strict'
import React, { Component } from 'react'
import {
    Text,
    TouchableOpacity

} from 'react-native'

export default class BackByANumberButton extends Component {

    constructor(props){
        super(props)
    }

    onPress() {
        this.props.navigator.popN(this.props.data.amountOfScenesToPop)
    }

    render() {
        let style = { marginLeft: 10, color: 'white' }

        return (
            <TouchableOpacity
                style={this.props.style}
                activeOpacity={0.5}
                onPress={() => this.onPress()}
            >
                <Text style={style}>Back</Text>
            </TouchableOpacity>
        )

    }
}