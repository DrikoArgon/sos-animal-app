'use strict'

import React, {Component} from 'react'
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Menu, {
    MenuContext,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-menu'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class ServiceRegistrationScreen extends Component{

    constructor(props){
        super(props)

        this.name = null
        this.socialMission = null
        this.owner = null
        this.cpf = null
        this.crmv = null
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

        this.state = {
            typeDropdownSelection: "Selecione",
            openingHourDropdownSelection: "Selecione",
            closingHourDropdownSelection: "Selecione",
            isCRMVNeeded: false
        }


    }

    submitForm(){

        if (!this.name ||
            !this.owner ||
            !this.cpf ||
            !this.state.typeDropdownSelection === "Selecione" ||
            !this.state.openingHourDropdownSelection === "Selecione" ||
            !this.state.closingHourDropdownSelection === "Selecione" ||
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
            !this.passwordConfirmation){

            Alert.alert('', "Faltam informações",
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }

        if(this.state.isCRMVNeeded && !this.crmv){
            Alert.alert('', "Por favor, insira um CRMV",
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }else{
            this.crmv = '-'
        }

        if(this.password !== this.passwordConfirmation){
            Alert.alert('', "As senhas não são iguais.",
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
        }

        if(this.socialMission === null || this.socialMission === ""){
            this.socialMission = "-"
        }

        
        this.props.toRoute(Routes.defineServiceImages({
            name: this.name,
            socialMission: this.socialMission,
            owner: this.owner,
            cpf: this.cpf,
            activityType: this.state.typeDropdownSelection,
            openingHour: this.state.openingHourDropdownSelection,
            closingHour: this.state.closingHourDropdownSelection,
            crmv: this.crmv,
            adress: this.adress,
            cep: this.cep,
            district: this.district,
            city: this.city,
            state: this.State,
            country: this.country,
            phone: this.phone,
            celphone: this.celphone,
            email: this.email,
            website :this.website,
            password: this.password,
        }))
    }

    checkCRMV(){

        
        if (this.state.typeDropdownSelection !== "Veterinário" &&
            this.state.typeDropdownSelection !== "Clínica Veterinária" &&
            this.state.typeDropdownSelection !== "Consultório Veterinário" &&
            this.state.typeDropdownSelection !== "Hospital Veterinário")
        {
            this.setState({
                isCRMVNeeded: false
            }) 
        }else{

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
                                    ref={(ref) => this._ownerRef = ref}
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
                                        keyboardType="numeric"
                                        selectionColor="white"
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onChangeText={(crmv) => { this.crmv = crmv }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => this._adressRef.focus()}
                                    />
                                ): 
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

                    {/*Opening Hour and Closing Hour Fields */}

                    <View style={styles.rowContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Abre às</Text>
                            <Menu
                                style={styles.dropdown}
                                onSelect={(value) => this.setState({ openingHourDropdownSelection: value })}
                            >
                                <MenuTrigger>
                                    <View style={styles.triggerView}>
                                        <Text style={styles.dropdownText}>{this.state.openingHourDropdownSelection}</Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions
                                    optionsContainerStyle={styles.dropdownOptions}
                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                >
                                    <MenuOption value="00:00">
                                        <Text style={styles.dropdownText}>00:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="01:00">
                                        <Text style={styles.dropdownText}>01:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="02:00">
                                        <Text style={styles.dropdownText}>02:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="03:00">
                                        <Text style={styles.dropdownText}>03:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="04:00">
                                        <Text style={styles.dropdownText}>04:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="05:00">
                                        <Text style={styles.dropdownText}>05:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="06:00">
                                        <Text style={styles.dropdownText}>06:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="07:00">
                                        <Text style={styles.dropdownText}>07:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="08:00">
                                        <Text style={styles.dropdownText}>08:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="09:00">
                                        <Text style={styles.dropdownText}>09:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="10:00">
                                        <Text style={styles.dropdownText}>10:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="11:00">
                                        <Text style={styles.dropdownText}>11:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="12:00">
                                        <Text style={styles.dropdownText}>12:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="13:00">
                                        <Text style={styles.dropdownText}>13:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="14:00">
                                        <Text style={styles.dropdownText}>14:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="15:00">
                                        <Text style={styles.dropdownText}>15:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="16:00">
                                        <Text style={styles.dropdownText}>16:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="17:00">
                                        <Text style={styles.dropdownText}>17:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="18:00">
                                        <Text style={styles.dropdownText}>18:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="19:00">
                                        <Text style={styles.dropdownText}>19:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="20:00">
                                        <Text style={styles.dropdownText}>20:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="21:00">
                                        <Text style={styles.dropdownText}>21:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="22:00">
                                        <Text style={styles.dropdownText}>22:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="23:00">
                                        <Text style={styles.dropdownText}>23:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Fecha às</Text>
                            <Menu
                                style={styles.dropdown}
                                onSelect={(value) => this.setState({ closingHourDropdownSelection: value }) }
                            >
                                <MenuTrigger>
                                    <View style={styles.triggerView}>
                                        <Text style={styles.dropdownText}>{this.state.closingHourDropdownSelection}</Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions
                                    optionsContainerStyle={styles.dropdownOptions}
                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                >
                                    <MenuOption value="00:00">
                                        <Text style={styles.dropdownText}>00:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="01:00">
                                        <Text style={styles.dropdownText}>01:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="02:00">
                                        <Text style={styles.dropdownText}>02:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="03:00">
                                        <Text style={styles.dropdownText}>03:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="04:00">
                                        <Text style={styles.dropdownText}>04:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="05:00">
                                        <Text style={styles.dropdownText}>05:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="06:00">
                                        <Text style={styles.dropdownText}>06:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="07:00">
                                        <Text style={styles.dropdownText}>07:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="08:00">
                                        <Text style={styles.dropdownText}>08:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="09:00">
                                        <Text style={styles.dropdownText}>09:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="10:00">
                                        <Text style={styles.dropdownText}>10:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="11:00">
                                        <Text style={styles.dropdownText}>11:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="12:00">
                                        <Text style={styles.dropdownText}>12:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="13:00">
                                        <Text style={styles.dropdownText}>13:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="14:00">
                                        <Text style={styles.dropdownText}>14:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="15:00">
                                        <Text style={styles.dropdownText}>15:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="16:00">
                                        <Text style={styles.dropdownText}>16:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="17:00">
                                        <Text style={styles.dropdownText}>17:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="18:00">
                                        <Text style={styles.dropdownText}>18:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="19:00">
                                        <Text style={styles.dropdownText}>19:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="20:00">
                                        <Text style={styles.dropdownText}>20:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="21:00">
                                        <Text style={styles.dropdownText}>21:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="22:00">
                                        <Text style={styles.dropdownText}>22:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                    <MenuOption value="23:00">
                                        <Text style={styles.dropdownText}>23:00</Text>
                                        <View style={styles.separator}></View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
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
                                    onChangeText={(passwordConfirmation) => { this.passwordConfirmation = passwordConfirmation}}
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
     },
     dropdown: {
         height: windowHeight * 0.07,
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
     disabledInput:{
         flex: 1,
         alignItems: 'center',
         height: windowHeight * 0.07,
         backgroundColor: StyleVars.Colors.listViewBackground,
         borderRadius: 5
     }

})