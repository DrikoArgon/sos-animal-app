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
import FirebaseRequest from '../Firebase/FirebaseRequest'

import Menu, {
    MenuContext,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-menu'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class AnnouncerChangeProfileDataScreen extends Component{

    constructor(props){
        super(props)

        var crmvWasNeeded = false

        this.currentServiceInfo = FirebaseRequest.getCurrentService()

        this.name = this.currentServiceInfo.name
        this.socialMission = this.currentServiceInfo.socialMission
        this.owner = this.currentServiceInfo.owner
        this.cpf = this.currentServiceInfo.CPForCNPJ
        this.crmv = this.currentServiceInfo.CRMV
        this.adress = this.currentServiceInfo.adress
        this.cep = this.currentServiceInfo.cep
        this.district = this.currentServiceInfo.district
        this.city = this.currentServiceInfo.city
        this.State = this.currentServiceInfo.state
        this.country = this.currentServiceInfo.country
        this.phone = this.currentServiceInfo.phone
        this.celphone = this.currentServiceInfo.celphone
        this.email = this.currentServiceInfo.email
        this.website = this.currentServiceInfo.website

        if(this.crmv !== '-'){
            crmvWasNeeded = true
        }

        this.state = {
            typeDropdownSelection: this.currentServiceInfo.activityType,
            isCRMVNeeded: crmvWasNeeded,
            loading: false
        }

        

    }

    componenWillMount(){
        this.checkCRMV()
    }

    submitForm() {

        if (this.state.isCRMVNeeded) {
            if (this.crmv === '-' || this.crmv === ''){
                return (console.error("Missing CRMV"))
            } 
        }else{
            this.crmv = '-'
        }

        if (this.socialMission === null || this.socialMission === "") {
            this.socialMission = "-"
        }

        this.setState({
            loading: true
        })

        FirebaseRequest.updateServiceProfile({
            name: this.name,
            socialMission: this.socialMission,
            owner: this.owner,
            CPForCNPJ: this.cpf,
            activityType: this.state.typeDropdownSelection,
            CRMV: this.crmv,
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
        .then(() => {
        
            if(this.currentServiceInfo.planType === 'B'){
                FirebaseRequest.updateServicePin({
                    name: this.name,
                    activityType: this.state.typeDropdownSelection,
                    crmv: this.crmv,
                    adress: this.adress,
                    district: this.district,
                    phone: this.phone,
                    celphone: this.celphone,
                    email: this.email,
                    city: this.city,
                    state: this.State,
                    country: this.country,
                    website: this.website
                })
                .then(() => {})
                .catch((err) => console.log("Error updating service pin: ", err.message))
            } 

            this.props.back()
        })
        .catch((err) => {
            this.setState({
                loading: false
            })
            console.error("Error updating user service. ", err.message)
        })
    }

    checkCRMV() {


        if (this.state.typeDropdownSelection !== "Veterinário" &&
            this.state.typeDropdownSelection !== "Clínica Veterinária" &&
            this.state.typeDropdownSelection !== "Consultório Veterinário" &&
            this.state.typeDropdownSelection !== "Hospital Veterinário") {
            this.setState({
                isCRMVNeeded: false
            })
        } else {

            this.setState({
                isCRMVNeeded: true
            })
        }

    }

    render(){
        return(
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
                                    defaultValue={this.currentServiceInfo.name}
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
                                    defaultValue={this.currentServiceInfo.socialMission}
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
                                    ref={(ref) => this._ownerRef = ref}
                                    defaultValue={this.currentServiceInfo.owner}
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
                                    defaultValue={this.currentServiceInfo.CPForCNPJ}
                                    placeholderTextColor="white"
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

                    {/*Activity Type and CRMV */}

                    <View style={styles.rowContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Atividade</Text>
                            <Menu
                                style={styles.dropdown}
                                onSelect={(value) => {
                                                        this.state.typeDropdownSelection = value
                                                        this.checkCRMV()
                                                    }
                                }
                            >
                                <MenuTrigger>
                                    <View style={styles.triggerView}>
                                        <Text style={styles.dropdownText}>{this.state.typeDropdownSelection}</Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions
                                    optionsContainerStyle={styles.dropdownOptions}
                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                >
                                    <MenuOption value="Pet Shop">
                                        <Text style={styles.dropdownText}>Pet Shop</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Veterinário">
                                        <Text style={styles.dropdownText}>Veterinário</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Clínica Veterinária">
                                        <Text style={styles.dropdownText}>Clínica Veterinária</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Consultório Veterinário">
                                        <Text style={styles.dropdownText}>Consultório Veterinário</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Hospital Veterinário">
                                        <Text style={styles.dropdownText}>Hospital Veterinário</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Resgate">
                                        <Text style={styles.dropdownText}>Resgate</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Passeador">
                                        <Text style={styles.dropdownText}>Passeador</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Fotografia">
                                        <Text style={styles.dropdownText}>Fotografia</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Salão de Beleza">
                                        <Text style={styles.dropdownText}>Salão de Beleza</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Hotel/Day Care">
                                        <Text style={styles.dropdownText}>Hotel/Day Care</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Cemitério/Crematório">
                                        <Text style={styles.dropdownText}>Cemitério/Crematório</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Adestrador">
                                        <Text style={styles.dropdownText}>Adestrador</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Acessórios e Roupas Pet">
                                        <Text style={styles.dropdownText}>Acessórios e Roupas Pet</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Transporte e Acessórios">
                                        <Text style={styles.dropdownText}>Transporte e Acessórios</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="ONG/OSCIPS/Grupo de Proteção Animal">
                                        <Text style={styles.dropdownText}>ONG/OSCIPS/Grupo de Proteção Animal</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Pet Sitting">
                                        <Text style={styles.dropdownText}>Pet Sitting</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Creche">
                                        <Text style={styles.dropdownText}>Creche</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Terapia">
                                        <Text style={styles.dropdownText}>Terapia</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Eventos">
                                        <Text style={styles.dropdownText}>Eventos</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Buffets">
                                        <Text style={styles.dropdownText}>Buffets</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Plano de Saúde">
                                        <Text style={styles.dropdownText}>Plano de Saúde</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Fisioterapia">
                                        <Text style={styles.dropdownText}>Fisioterapia</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Acampamento/Clube">
                                        <Text style={styles.dropdownText}>Acampamento/Clube</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Groomer">
                                        <Text style={styles.dropdownText}>Groomer</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Mobiliário e Decoração Pet">
                                        <Text style={styles.dropdownText}>Mobiliário e Decoração Pet</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Higiene/Saúde/Beleza">
                                        <Text style={styles.dropdownText}>Higiene/Saúde/Beleza</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Brinquedos e Jogos para Pets">
                                        <Text style={styles.dropdownText}>Brinquedos e Jogos para Pets</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Alimentos e Acessórios">
                                        <Text style={styles.dropdownText}>Alimentos e Acessórios</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Literatura">
                                        <Text style={styles.dropdownText}>Literatura</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Acupuntura">
                                        <Text style={styles.dropdownText}>Acupuntura</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Centro de Diagnóstico">
                                        <Text style={styles.dropdownText}>Centro de Diagnóstico</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Especialidades Médicas">
                                        <Text style={styles.dropdownText}>Especialidades Médicas</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Farmácia">
                                        <Text style={styles.dropdownText}>Farmácia</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Homeopatia">
                                        <Text style={styles.dropdownText}>Homeopatia</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="Academia/Esporte">
                                        <Text style={styles.dropdownText}>Academia/Esporte</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>CRMV</Text>
                            <View style={styles.inputContainer}>
                                {this.state.isCRMVNeeded ? 
                                (
                                    <TextInput
                                        ref={(ref) => this._crmvRef = ref}
                                        placeholderTextColor="white"
                                        defaultValue={this.currentServiceInfo.CRMV}
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(celphone) => { this.celphone = celphone }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._adressRef.focus()}
                                    />
                                ) : 
                                (
                                        <View style={styles.disabledInput}></View>
                                )} 
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
                                    defaultValue={this.currentServiceInfo.adress}
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
                                    defaultValue={this.currentServiceInfo.cep}
                                    placeholderTextColor="white"
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
                                    defaultValue={this.currentServiceInfo.district}
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
                                    defaultValue={this.currentServiceInfo.city}
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
                                    defaultValue={this.currentServiceInfo.state}
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
                                    defaultValue={this.currentServiceInfo.country}
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
                                    defaultValue={this.currentServiceInfo.phone}
                                    placeholderTextColor="white"
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
                                    defaultValue={this.currentServiceInfo.celphone}
                                    placeholderTextColor="white"
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
                                        defaultValue={this.currentServiceInfo.email}
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
                                        defaultValue={this.currentServiceInfo.website}
                                        placeholderTextColor="white"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(website) => {this.website = website}}
                                        returnKeyType="go"
                                        onSubmitEditing={() => {this.submitForm()}}
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