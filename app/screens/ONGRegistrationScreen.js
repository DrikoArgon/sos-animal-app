'use strict'

import React, {Component} from 'react'
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

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class ONGRegistrationScreen extends Component{

    constructor(props){
        super(props)

        this.name = null
        this.socialMission = null
        this.owner = null
        this.cpf = null
        this.activityType = null
        this.adress = null
        this.cep = null
        this.district = null
        this.city = null
        this.State = null
        this.country = null
        this.phone = null
        this.celphone = null
        this.email = null
        this.website = null
        this.password = null
        this.passwordConfirmation = null


    }

    submitForm(){

        this.activityType = "ONG/OSCIPS/Grupo de Proteção Animal"

        if (!this.name ||
            !this.owner ||
            !this.cpf ||
            !this.activityType ||
            !this.adress ||
            !this.cep ||
            !this.district ||
            !this.city ||
            !this.State ||
            !this.country ||
            !this.phone ||
            !this.celphone ||
            !this.email ||
            !this.website ||
            !this.password ||
            !this.passwordConfirmation) {

            return (alert("Faltam campos a serem preenchidos."))
        }

        if (this.password !== this.passwordConfirmation) {
            return (alert("As senhas não são iguais."))
        }

        if (this.socialMission === null || this.socialMission === "") {
            this.socialMission = "-"
        }


        this.props.toRoute(Routes.defineGroupImages({
            name: this.name,
            socialMission: this.socialMission,
            owner: this.owner,
            cpf: this.cpf,
            activityType: this.activityType,
            adress: this.adress,
            cep: this.cep,
            district: this.district,
            city: this.city,
            state: this.state,
            country: this.country,
            phone: this.phone,
            celphone: this.celphone,
            email: this.email,
            website: this.website,
            password: this.password,
        }))

    }

    render(){
        return(
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
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(name) => {this.name = name}}
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
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(socialMission) => {this.socialMission = socialMission}}
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
                                ref={(ref) => this._loginRef = ref}
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(owner) => {this.owner = owner}}
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
                                placeholderTextColor="white"
                                keyboardType="numeric"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(cpf) => {this.cpf = cpf}}
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
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(adress) => {this.adress = adress}}
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
                                placeholderTextColor="white"
                                keyboardType="numeric"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(cep) => {this.cep = cep}}
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
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(district) => {this.district = district}}
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
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(city) => {this.city = city}}
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
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(state) => {this.State = state}}
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
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(country) => {this.country = country}}
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
                                placeholderTextColor="white"
                                keyboardType="numeric"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(phone) => {this.phone = phone}}
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
                                placeholderTextColor="white"
                                keyboardType="numeric"
                                selectionColor="white"
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(celphone) => {this.celphone = celphone}}
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
                                    placeholderTextColor="white"
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(email) => {this.email = email}}
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
                                    placeholderTextColor="white"
                                    selectionColor="white"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(website) => {this.website = website}}
                                    returnKeyType="next"
                                    onSubmitEditing={() => this._passwordRef.focus()}
                                />
                            </View>
                    </View>
                </View>
                

                {/*Password and Confirm Password Fields */}

                 <View style={styles.rowContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Senha</Text>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                ref={(ref) => this._passwordRef = ref}
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                secureTextEntry={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(password) => {this.password = password}}
                                returnKeyType="next"
                                onSubmitEditing={() => this._confirmPasswordRef.focus()}
                            />
                        </View>
                    </View>
                    <View style={styles.innerContainer}>
                        <Text style={styles.infoText}>Confirmar Senha</Text>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                ref={(ref) => this._confirmPasswordRef = ref}
                                placeholderTextColor="white"
                                selectionColor="white"
                                style={styles.input}
                                secureTextEntry={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(passwordConfirmation) => {this.passwordConfirmation = passwordConfirmation}}
                                returnKeyType="go"
                                onSubmitEditing={() => this.submitForm()}
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
                        <Text style={styles.signupButtonText}>Definir fotos de logo e fundo</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </View>
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
        height: windowHeight * 0.07,
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
        alignItems: 'center',
        marginBottom: 20
    },
    signupButton: {
        paddingVertical: 12,
        width: windowWidth * 0.8,
        backgroundColor: 'rgb(103,46,1)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
     },
     signupButtonText: {
         fontSize: 16,
         color: 'orange'
     }

})