'use strict'

import React, {Component} from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Image,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'

import Menu, {
    MenuContext,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-menu'

import ImagePicker from 'react-native-image-picker'

const dismissKeyboard = require("dismissKeyboard")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class AnimalStreetModal extends Component{

    constructor(props){
        super(props)

        this.ageAmount = this.props.data.ageAmount
        this.qtd = this.props.data.qtd

        this.state = {
            specieDropdownSelection: this.props.data.specie,
            sizeDropdownSelection: this.props.data.size,
            ageTypeDropdownSelection: this.props.data.ageType,
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            specieChanged: false,
            ageTypeChanged: false,
            sizeChanged: false,
            ageAmountChanged: false,
            qtdChanged: false,
            image1Changed: false,
            image2Changed: false,
            image3Changed: false,
            image4Changed: false,
            loading: false
        }

        if(this.props.data.image1){
            this.state.image1 = this.props.data.image1
        }

        if (this.props.data.image2) {
            this.state.image2 = this.props.data.image2
        }

        if (this.props.data.image3) {
            this.state.image3 = this.props.data.image3
        }
        
        if (this.props.data.image4) {
            this.state.image4 = this.props.data.image4
        }
    }

    hide() {

        this.setState({
            specieChanged: false,
            ageTypeChanged: false,
            sizeChanged: false,
            ageAmountChanged: false,
            qtdChanged: false,
            image1Changed: false,
            image2Changed: false,
            image3Changed: false,
            image4Changed: false
        })

        this.props.hideModals()
    }

    selectPhotoTapped(imageTapped) {
        const options = {
            title: 'Select an Option',
            quality: 0.5,

        }

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {

            }
            else if (response.error) {
                console.warn('Image Picker error', response.error)
            }
            else {

                if(imageTapped === 0){

                    if (!this.props.data.image1 && !this.state.image1Changed) {
                        this.setState({
                            image1: response.data,
                            image1Changed: true
                        })
                    } else if (!this.props.data.image2 && !this.state.image2Changed) {
                        this.setState({
                            image2: response.data,
                            image2Changed: true
                        })
                    } else if (!this.props.data.image3 && !this.state.image3Changed) {
                        this.setState({
                            image3: response.data,
                            image3Changed: true
                        })
                    } else {
                        this.setState({
                            image4: response.data,
                            image4Changed: true
                        })
                    }

                } else if(imageTapped === 1){
                    this.setState({
                        image1: response.data,
                        image1Changed: true
                    })
                } else if (imageTapped === 2) {
                    this.setState({
                        image2: response.data,
                        image2Changed: true
                    })
                } else if (imageTapped === 3) {
                    this.setState({
                        image3: response.data,
                        image3Changed: true
                    })
                } else if (imageTapped === 4) {
                    this.setState({
                        image4: response.data,
                        image4Changed: true
                    })
                }
                
            }
        })
    }

    updatePin(){

        this.setState({
            loading: true
        })

        var oldImage1 = null
        var oldImage2 = null
        var oldImage3 = null
        var oldImage4 = null

        if(this.props.data.image1){
            oldImage1 = this.props.data.image1
        }

        if (this.props.data.image2) {
            oldImage2 = this.props.data.image2
        }

        if (this.props.data.image3) {
            oldImage3 = this.props.data.image3
        }

        if (this.props.data.image4) {
            oldImage4 = this.props.data.image4
        }


        FirebaseRequest.updatePin({
            specie: this.state.specieChanged ? this.state.specieDropdownSelection : this.props.data.specie,
            size: this.state.sizeChanged ? this.state.sizeDropdownSelection : this.props.data.size,
            ageType: this.state.ageTypeChanged ? this.state.ageTypeDropdownSelection : this.props.data.ageType,
            ageAmount: this.state.ageAmountChanged ? this.ageAmount : this.props.data.ageAmount,
            qtd: this.state.qtdChanged ? this.qtd : this.props.data.qtd,
            image1: this.state.image1Changed ? this.state.image1 : oldImage1,
            image2: this.state.image2Changed ? this.state.image2 : oldImage2,
            image3: this.state.image3Changed ? this.state.image3 : oldImage3,
            image4: this.state.image4Changed ? this.state.image4 : oldImage4
        },this.props.data.pinID,this.props.data.key)
        .then(() => { 
            this.setState({
                loading: false
            })
            this.hide()
        })
        .catch((err) => {
            alert('Erro ao tentar atualizar informações do pin.')
            this.setState({
                loading: false
            })
        })
    }

    render(){
        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={()=> {}}
                 >
                <MenuContext style={{ flex: 1 }} ref="MenuContext" lazyRender={200}>
                    <TouchableWithoutFeedback 
                        onPress={() => this.hide()}
                    >
                            <View style={styles.modalContainer}>
                                <TouchableWithoutFeedback
                                    onPress={() => dismissKeyboard()}
                                >
                                    <View style={styles.innerModalContainer}>
                                        <View style={styles.modalHeader}>
                                            <View style={styles.modalHeaderImageContainer}>
                                                <Image 
                                                    source={require("../Resources/animalStreetIcon.png")}
                                                    style={styles.rowIcon}
                                                    resizeMode='contain'
                                                />
                                            </View>
                                            <View style={styles.modalHeaderTextContainer}>
                                                <Text style={styles.modalHeaderText}>ANIMAL NA RUA</Text>
                                            </View>
                                        </View>
                                        <View style={styles.modalTextContainerDark}>
                                            <Text style={styles.modalText}>Data:</Text>
                                            <Text style={styles.infoText}>{this.props.data.creationDay + "/" + this.props.data.creationMonth + "/" + this.props.data.creationYear}</Text>
                                        </View>
                                        <View style={styles.modalTextContainerLight}>
                                            <Text style={styles.modalText}>Espécie:</Text>
                                            <Menu
                                                style={styles.dropdown}
                                                onSelect={(value) => this.setState({ specieDropdownSelection: value, specieChanged: true })}
                                            >
                                                <MenuTrigger>
                                                    <Text style={styles.dropdownText}>{this.specieChanged ? this.state.specieDropdownSelection : this.props.data.specie}</Text>
                                                </MenuTrigger>
                                                <MenuOptions
                                                    optionsContainerStyle={styles.dropdownOptions}
                                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                                >
                                                    <MenuOption value="Ave">
                                                        <Text style={styles.dropdownText}>Ave</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Cão">
                                                        <Text style={styles.dropdownText}>Cão</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Cavalo">
                                                        <Text style={styles.dropdownText}>Cavalo</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Coelho">
                                                        <Text style={styles.dropdownText}>Coelho</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Gato">
                                                        <Text style={styles.dropdownText}>Gato</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Mamífero">
                                                        <Text style={styles.dropdownText}>Mamífero</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Peixe">
                                                        <Text style={styles.dropdownText}>Peixe</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Suíno">
                                                        <Text style={styles.dropdownText}>Suíno</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Réptil">
                                                        <Text style={styles.dropdownText}>Réptil</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Roedor">
                                                        <Text style={styles.dropdownText}>Roedor</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                </MenuOptions>
                                            </Menu>  
                                        </View>
                                        <View style={styles.modalTextContainerDark}>
                                            <Text style={styles.modalText}>Porte:</Text>
                                            <Menu
                                                style={styles.dropdown}
                                                onSelect={(value) => this.setState({ sizeDropdownSelection: value , sizeChanged: true})}
                                            >
                                                <MenuTrigger>
                                                    <Text style={styles.dropdownText}>{this.state.sizeChanged ? this.state.sizeDropdownSelection : this.props.data.size}</Text>
                                                </MenuTrigger>
                                                <MenuOptions
                                                    optionsContainerStyle={styles.dropdownOptions}
                                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                                >
                                                    <MenuOption value="Pequeno">
                                                        <Text style={styles.dropdownText}>Pequeno</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Médio">
                                                        <Text style={styles.dropdownText}>Médio</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Grande">
                                                        <Text style={styles.dropdownText}>Grande</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                </MenuOptions>
                                            </Menu>
                                        </View>
                                        <View style={styles.modalTextContainerLight}>
                                            <Text style={styles.modalText}>Idade:</Text>
                                            <TextInput 
                                                ref={(ref) => this._ageAmountRef = ref}
                                                placeholder={this.props.data.ageAmount}
                                                placeholderTextColor="white"
                                                selectionColor="white"
                                                keyboardType="numeric"
                                                style={styles.input}
                                                underlineColorAndroid='transparent'
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                onChangeText={(ageAmount) => {this.ageAmount = ageAmount
                                                                                this.setState({
                                                                                    ageAmountChanged: true
                                                                                })
                                                                              }
                                                             }
                                                returnKeyType="next"
                                                onSubmitEditing={() => this._qtdRef.focus()}
                                            />
                                            <Menu
                                                style={styles.dropdown}
                                                onSelect={(value) => this.setState({ ageTypeDropdownSelection: value, ageTypeChanged: true })}
                                            >
                                                <MenuTrigger>
                                                    <Text style={styles.dropdownText}>{this.state.ageTypeChanged ? this.state.ageTypeDropdownSelection : this.props.data.ageType}</Text>
                                                </MenuTrigger>
                                                <MenuOptions
                                                    optionsContainerStyle={styles.dropdownOptions}
                                                    renderOptionsContainer={(options) => <ScrollView>{options}</ScrollView>}
                                                >
                                                    <MenuOption value="Dia(s)">
                                                        <Text style={styles.dropdownText}>Dia(s)</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Mês(meses)">
                                                        <Text style={styles.dropdownText}>Mês(meses)</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                    <MenuOption value="Ano(s)">
                                                        <Text style={styles.dropdownText}>Ano(s)</Text>
                                                        <View style={styles.separator}></View>
                                                    </MenuOption>
                                                </MenuOptions>
                                            </Menu>
                                        </View>
                                        <View style={styles.modalTextContainerDark}>
                                            <Text style={styles.modalText}>Quantidade:</Text>
                                            <TextInput 
                                                ref={(ref) => this._qtdRef = ref}
                                                placeholder={this.props.data.qtd}
                                                placeholderTextColor="white"
                                                selectionColor="white"
                                                style={styles.input}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                underlineColorAndroid='transparent'
                                                keyboardType="numeric"
                                                onChangeText={(qtd) => {this.qtd = qtd
                                                                        this.setState({
                                                                            qtdChanged: true
                                                                        })}}
                                                returnKeyType="done"
                                                onSubmitEditing={() => {}}
                                            />
                                        </View>
                                        <View style={styles.modalTextContainerLight}>
                                            <Text style={styles.modalText}>Fotos:</Text>
                                        </View>
                                        <View style={styles.imagesContainer}>
                                            {this.props.data.image1 ?
                                                (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={styles.profileImageContainer}
                                                        onPress={() => this.selectPhotoTapped(1)}
                                                    >
                                                    {this.state.image1Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image1 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.props.data.image1 }}
                                                                style={styles.profileImage}
                                                            />
                                                        )
                                                    }       
                                                    </TouchableOpacity>
                                                ) :
                                                (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={styles.profileImageContainer}
                                                        onPress={() => this.state.image1Changed ? (this.selectPhotoTapped(1)) : (this.selectPhotoTapped(0))}
                                                    >
                                                        {this.state.image1Changed ?
                                                            (
                                                                <Image
                                                                    source={{ uri: "data:image/jpeg;base64," + this.state.image1 }}
                                                                    style={styles.profileImage}
                                                                />
                                                            ) :
                                                            (
                                                                <View style={styles.noPhotoBackground}>
                                                                    <Text style={styles.noPhotoBackgroundText}>+</Text>
                                                                </View>
                                                            )
                                                        }
                                                    </TouchableOpacity>
                                                )
                                            }
                                            {this.props.data.image2 ?
                                                (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={styles.profileImageContainer}
                                                        onPress={() => this.selectPhotoTapped(2)}
                                                    >
                                                    {this.state.image2Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image2 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.props.data.image2 }}
                                                                style={styles.profileImage}
                                                            />
                                                        )
                                                    }   
                                                    </TouchableOpacity>
                                                ) :
                                                (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={styles.profileImageContainer}
                                                        onPress={() => this.state.image2Changed ? (this.selectPhotoTapped(2)) : (this.selectPhotoTapped(0))}
                                                    >
                                                        {this.state.image2Changed ?
                                                            (
                                                                <Image
                                                                    source={{ uri: "data:image/jpeg;base64," + this.state.image2 }}
                                                                    style={styles.profileImage}
                                                                />
                                                            ) :
                                                            (
                                                                <View style={styles.noPhotoBackground}>
                                                                    <Text style={styles.noPhotoBackgroundText}>+</Text>
                                                                </View>
                                                            )
                                                        }
                                                    </TouchableOpacity>
                                                )
                                            }
                                            {this.props.data.image3 ?
                                                (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={styles.profileImageContainer}
                                                        onPress={() => this.selectPhotoTapped(3)}
                                                    >
                                                    {this.state.image3Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image3 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.props.data.image3 }}
                                                                style={styles.profileImage}
                                                            />
                                                        )
                                                    }   
                                                    </TouchableOpacity>
                                                ) :
                                                (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={styles.profileImageContainer}
                                                        onPress={() => this.state.image3Changed ? (this.selectPhotoTapped(3)) : (this.selectPhotoTapped(0))}
                                                    >
                                                        {this.state.image3Changed ?
                                                            (
                                                                <Image
                                                                    source={{ uri: "data:image/jpeg;base64," + this.state.image3 }}
                                                                    style={styles.profileImage}
                                                                />
                                                            ) :
                                                            (
                                                                <View style={styles.noPhotoBackground}>
                                                                    <Text style={styles.noPhotoBackgroundText}>+</Text>
                                                                </View>
                                                            )
                                                        }
                                                    </TouchableOpacity>
                                                )
                                            }
                                            {this.props.data.image4 ?
                                                (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={styles.profileImageContainer}
                                                        onPress={() => this.selectPhotoTapped(4)}
                                                    >
                                                    {this.state.image4Changed ?
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.state.image4 }}
                                                                style={styles.profileImage}
                                                            />
                                                        ) :
                                                        (
                                                            <Image
                                                                source={{ uri: "data:image/jpeg;base64," + this.props.data.image4 }}
                                                                style={styles.profileImage}
                                                            />
                                                        )
                                                    }   
                                                    </TouchableOpacity>
                                                ) :
                                                (
                                                    <TouchableOpacity
                                                        activeOpacity={0.5}
                                                        style={styles.profileImageContainer}
                                                        onPress={() => this.state.image4Changed ? (this.selectPhotoTapped(4)) : (this.selectPhotoTapped(0))}
                                                    >
                                                        {this.state.image4Changed ?
                                                            (
                                                                <Image
                                                                    source={{ uri: "data:image/jpeg;base64," + this.state.image4 }}
                                                                    style={styles.profileImage}
                                                                />
                                                            ) :
                                                            (
                                                                <View style={styles.noPhotoBackground}>
                                                                    <Text style={styles.noPhotoBackgroundText}>+</Text>
                                                                </View>
                                                            )
                                                        }
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </View>
                                        <View style={styles.modalFooter}>
                                            <TouchableOpacity
                                                activeOpacity={0.5}
                                                onPress={() => {this.updatePin()} }
                                            >
                                            <Text style={styles.modalSaveButtonText}>{this.state.loading ? 'Salvando' : 'Salvar'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                activeOpacity={0.5}
                                            >
                                                <Image 
                                                    source={require("../Resources/shareIcon.png")}
                                                    style={styles.footerImage}
                                                    resizeMode='contain'
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                activeOpacity={0.5}
                                                onPress={() => this.hide()}
                                            >
                                            <Text style={styles.modalFooterText}>Sair</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>  
                        </TouchableWithoutFeedback>
                    </MenuContext>
                </Modal>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.listViewBackground
    },
    modalContainer:{
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalTextContainerLight:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 10
    },
    modalTextContainerDark:{
        backgroundColor: StyleVars.Colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    modalHeader:{
        backgroundColor: StyleVars.Colors.animalStreetPinBackground,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10

    },
    modalHeaderTextContainer:{
       flex: 2,
       justifyContent: 'center'
    },
    modalHeaderText:{
        color: 'white',
        fontSize: 18
    },
    modalText:{
        color: 'white',
        fontSize: 16
    },
    innerModalContainer:{
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10
    },
    modalFooter:{
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    modalFooterText:{
        color: 'white',
        fontSize: 18
    },
    modalSaveButtonText:{
        color: "rgb(224, 176, 4)",
        fontSize: 18
    },
    modalHeaderImageContainer:{
        alignItems: 'center',
        flex: 1
    },
    rowIcon:{
        width: windowWidth * 0.10,
        height: windowHeight * 0.08
    },
    input: {
        width: windowWidth * 0.2,
        color: 'white',
        fontSize: 14,
        marginLeft: 5,
        marginTop: 6,
        height: windowHeight * 0.06,
        alignItems: 'center'
    },
    footerImage:{
        width: windowWidth * 0.06,
        height: windowHeight * 0.04
    },
    infoText:{
        color: 'white',
        fontSize: 14,
        marginLeft: 5,
        marginTop: 2
    },
    dropdown:{
        width: windowWidth * 0.4,
        marginLeft: 5,
        marginTop: 2
    },
    dropdownText:{
        color: 'white',
        fontSize: 14
    },
    dropdownOptions:{
        marginTop: 20,
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        width: windowWidth * 0.4,
        height: windowHeight * 0.2,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 5
    },
    separator:{
        height: 0.5,
        marginTop: 5,
        backgroundColor: '#CCC'
    },
    imagesContainer: {
        flexDirection: 'row',
        paddingHorizontal: 5
    },
    noPhotoBackground: {
        width: windowWidth * 0.17,
        height: windowWidth * 0.17,
        borderRadius: (windowWidth * 0.17) / 2,
        backgroundColor: StyleVars.Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    noPhotoBackgroundText: {
        color: 'white',
        fontSize: 25,
        textAlign: 'center'
    },
    profileImageContainer: {
        width: windowWidth * 0.2,
        height: windowHeight * 0.12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    profileImage: {
        width: windowWidth * 0.17,
        height: windowWidth * 0.17,
        borderRadius: (windowWidth * 0.17) / 2,
    }
})
