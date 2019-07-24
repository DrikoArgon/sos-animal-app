'use strict'

import React, { Component } from 'react'
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    StyleSheet,
    Dimensions
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FirebaseRequest from '../Firebase/FirebaseRequest'

import Menu, {
    MenuContext,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-menu'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class ONGChangeProfileDataScreen extends Component {

    constructor(props) {
        super(props)

        this.currentGroupInfo = FirebaseRequest.getCurrentGroup()

        this.name = this.currentGroupInfo.name
        this.socialMission = this.currentGroupInfo.socialMission
        this.owner = this.currentGroupInfo.owner
        this.cpf = this.currentGroupInfo.CPForCNPJ
        this.adress = this.currentGroupInfo.adress
        this.cep = this.currentGroupInfo.cep
        this.district = this.currentGroupInfo.district
        this.city = this.currentGroupInfo.city
        this.State = this.currentGroupInfo.state
        this.country = this.currentGroupInfo.country
        this.phone = this.currentGroupInfo.phone
        this.celphone = this.currentGroupInfo.celphone
        this.email = this.currentGroupInfo.email
        this.website = this.currentGroupInfo.website

        this.state = {
            loading: false
        }



    }


    submitForm() {


        if (this.socialMission === null || this.socialMission === "") {
            this.socialMission = "-"
        }

        this.setState({
            loading: true
        })

        FirebaseRequest.updateGroupProfile({
            name: this.name,
            socialMission: this.socialMission,
            owner: this.owner,
            CPForCNPJ: this.cpf,
            adress: this.adress,
            district: this.district,
            phone: this.phone,
            celphone: this.celphone,
            email: this.email,
            city: this.city,
            state: this.State,
            country: this.country,
            cep: this.cep,
            website: this.website
        })
            .then(() => this.props.back())
            .catch((err) => {
                this.setState({
                    loading: false
                })
                console.error("Error updating user group. ", err.message)
            })
    }

    render() {
        return (
            <MenuContext style={{ flex: 1 }} ref="MenuContext" lazyRender={200}>
                <View style={styles.container}>
                    <KeyboardAwareScrollView
                        ref="scrollView"
                        keyboardShouldPersistTaps="never"
                        automaticallyAdjustContentInsects={true}
                        alwaysBounceVertical={true}
                        style={styles.scrollView}
                    >

                        {/*Name Field */}

                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Nome</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        defaultValue={this.currentGroupInfo.name}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(name) => { this.name = name }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._socialMissionRef.focus()}
                                    />
                                </View>
                            </View>
                        </View>

                        {/*Social Mission */}

                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Razão Social</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._socialMissionRef = ref}
                                        defaultValue={this.currentGroupInfo.socialMission}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(socialMission) => { this.socialMission = socialMission }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._ownerRef.focus()}
                                    />
                                </View>
                            </View>
                        </View>

                        {/*Owner and CPF/CNPJ Fields */}

                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Responsável</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._ownerRef = ref}
                                        defaultValue={this.currentGroupInfo.owner}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(owner) => { this.owner = owner }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._cpfRef.focus()}
                                    />
                                </View>
                            </View>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>CNPJ ou CPF</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._cpfRef = ref}
                                        defaultValue={this.currentGroupInfo.CPForCNPJ}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(cpf) => { this.cpf = cpf }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._crmvRef.focus()}
                                    />
                                </View>
                            </View>
                        </View>

                        {/*Adress and CEP Fields */}

                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Endereço</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._adressRef = ref}
                                        defaultValue={this.currentGroupInfo.adress}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(adress) => { this.adress = adress }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._cepRef.focus()}
                                    />
                                </View>
                            </View>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>CEP</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._cepRef = ref}
                                        defaultValue={this.currentGroupInfo.cep}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(cep) => { this.cep = cep }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._districtRef.focus()}
                                    />
                                </View>
                            </View>
                        </View>

                        {/*District and City Fields */}

                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Bairro</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._districtRef = ref}
                                        defaultValue={this.currentGroupInfo.district}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(district) => { this.district = district }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._cityRef.focus()}
                                    />
                                </View>
                            </View>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Cidade</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._cityRef = ref}
                                        defaultValue={this.currentGroupInfo.city}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(city) => { this.city = city }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._stateRef.focus()}
                                    />
                                </View>
                            </View>
                        </View>

                        {/*State and Country Fields */}

                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Estado</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._stateRef = ref}
                                        defaultValue={this.currentGroupInfo.state}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(state) => { this.State = state }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._countryRef.focus()}
                                    />
                                </View>
                            </View>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>País</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._countryRef = ref}
                                        defaultValue={this.currentGroupInfo.country}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(country) => { this.country = country }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._phoneRef.focus()}
                                    />
                                </View>
                            </View>
                        </View>


                        {/*Phone and Celphone Fields */}

                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Telefone</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._phoneRef = ref}
                                        defaultValue={this.currentGroupInfo.phone}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(phone) => { this.phone = phone }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._celphoneRef.focus()}
                                    />
                                </View>
                            </View>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Celular</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._celphoneRef = ref}
                                        defaultValue={this.currentGroupInfo.celphone}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(celphone) => { this.celphone = celphone }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._emailRef.focus()}
                                    />
                                </View>
                            </View>
                        </View>

                        {/*Email and Website Fields */}

                        <View style={styles.rowContainer}>

                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._emailRef = ref}
                                        defaultValue={this.currentGroupInfo.email}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(email) => { this.email = email }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._websiteRef.focus()}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.innerContainer}>
                                <Text style={styles.infoText}>Endereço Virtual</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={(ref) => this._websiteRef = ref}
                                        defaultValue={this.currentGroupInfo.website}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(website) => { this.website = website }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._passwordRef.focus()}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.signupButtonContainer}>
                            <TouchableOpacity
                                style={styles.signupButton}
                                activeOpacity={0.5}
                                onPress={() => this.submitForm()}
                            >
                                <Text style={styles.signupButtonText}>{this.state.loading ? "Alterando..." : "Alterar"}</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </MenuContext>

        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.primary,

    },
    scrollView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        backgroundColor: StyleVars.Colors.primary,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row'

    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 10
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 5
    },
    input: {
        flex: 1,
        alignItems: 'center',
        height: 30,
        backgroundColor: StyleVars.Colors.secondary,
        color: 'white',
        fontSize: 14,
        borderRadius: 5
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'

    },
    signupButtonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    signupButton: {
        paddingVertical: 12,
        width: windowWidth * 0.8,
        backgroundColor: 'rgb(103,46,1)',
        borderRadius: 10,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signupButtonText: {
        fontSize: 16,
        color: 'orange'
    },
    dropdown: {
        height: 30,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dropdownOptions: {
        marginTop: 35,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        width: windowWidth * 0.44,
        height: windowHeight * 0.2,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 5
    },
    dropdownText: {
        color: 'white',
        fontSize: 14
    },
    separator: {
        height: 0.5,
        marginTop: 5,
        backgroundColor: '#CCC',
    },
    triggerView: {
        width: windowWidth * 0.44,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    disabledInput: {
        flex: 1,
        alignItems: 'center',
        height: 30,
        backgroundColor: StyleVars.Colors.listViewBackground,
        borderRadius: 5
    }

})