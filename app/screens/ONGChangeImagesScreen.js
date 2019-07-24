'use strict'

import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ListView,
    Switch,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import ImagePicker from 'react-native-image-picker'
import SalePaymentModal from '../components/SalePaymentModal'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class ONGChangeImagesScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            logoImage: FirebaseRequest.getCurrentGroup().logoImage,
            backgroundImage: FirebaseRequest.getCurrentGroup().backgroundImage,
            switchState: FirebaseRequest.getCurrentGroup().sale,
            salePaymentModalVisible: false
        }

    }

    showSalePaymentModal() {
        this.setState({
            salePaymentModalVisible: true
        })
    }

    hideModals() {
        this.setState({
            salePaymentModalVisible: false
        })
    }

    selectPhotoTapped(isLogo) {
        const options = {
            title: 'Selecione uma opção',
            takePhotoButtonTitle: 'Tirar Foto...',
            chooseFromLibraryButtonTitle: 'Escolher da Biblioteca...',
            quality: 0,

        }

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {

            }
            else if (response.error) {
                console.warn('Image Picker error', response.error)
            }
            else {


                if (isLogo) {
                    this.setState({
                        logoImage: response.data
                    })
                } else {
                    this.setState({
                        backgroundImage: response.data
                    })
                }



            }
        })
    }


    updateGroupImages() {

        this.setState({
            loading: true
        })

        FirebaseRequest.updateGroupProfile({
            logoImage: this.state.logoImage,
            backgroundImage: this.state.backgroundImage,
        })
            .then(() => this.props.back())
            .catch((err) => {
                this.setState({
                    loading: false
                })
                console.error("Error while updating group: ", err.message)

            })

    }

    updateSaleStatus(value) {

        if (value === true) {
            this.showSalePaymentModal()
        } else {

            Alert.alert('Atenção', 'Deseja mesmo cancelar a promoção?',
                [
                    {
                        text: 'Cancelar', onPress: () => { }
                    },
                    {
                        text: 'Ok', onPress: () => {
                            FirebaseRequest.updateGroupSaleStatus(false)
                                .then(() => {
                                    this.setState({
                                        switchState: false,
                                    })
                                })
                                .catch((err) => {
                                    Alert.alert('', "Erro ao atualizar informações da promoção.",
                                        [
                                            {
                                                text: 'Ok', onPress: () => { }
                                            }
                                        ],
                                        { cancelable: false }
                                    )
                                })
                        }
                    }

                ],
                { cancelable: false }
            )

        }

    }

    acceptPayment() {

        FirebaseRequest.updateGroupSaleStatus(true)
            .then(() => {
                Alert.alert('Sucesso', 'Promoção Ativada',
                    [
                        {
                            text: 'Ok', onPress: () => {
                                this.setState({
                                    switchState: true,
                                    salePaymentModalVisible: false
                                })
                            }
                        }
                    ],
                    { cancelable: false }
                )
            })
            .catch((err) => {
                Alert.alert('', "Erro ao atualizar informações da promoção.",
                    [
                        {
                            text: 'Ok', onPress: () => { }
                        }
                    ],
                    { cancelable: false }
                )
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    ref="scrollView"
                    keyboardShouldPersistTaps="never"
                    automaticallyAdjustContentInsects={true}
                    alwaysBounceVertical={true}
                    style={styles.scrollView}
                >
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Imagem da Logo</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: "data:image/jpeg;base64," + this.state.logoImage }}
                                style={styles.logoImageStyle}
                            />
                        </View>
                        <View style={styles.defineImageButtonContainer}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.defineImageButton}
                                onPress={() => this.selectPhotoTapped(true)}
                            >
                                <Text style={styles.defineImageButtonText}>Definir imagem</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Imagem de Fundo</Text>
                        <Text style={styles.smallerHeaderText}>Promoção?</Text>
                        <Switch
                            onValueChange={(value) => { this.updateSaleStatus(value) }}
                            value={this.state.switchState}
                            style={{ marginLeft: 5 }}
                        >
                        </Switch>
                    </View>

                    <View style={styles.innerContainer}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: "data:image/jpeg;base64," + this.state.backgroundImage }}
                                style={styles.backgroundImageStyle}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.defineImageButtonContainer}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.defineImageButton}
                                onPress={() => this.selectPhotoTapped(false)}
                            >
                                <Text style={styles.defineImageButtonText}>Definir imagem</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.choosePlanButtonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.choosePlanButton}
                            onPress={() => this.updateGroupImages()}
                        >
                            <Text style={styles.choosePlanButtonText}>{this.state.loading ? "Alterando..." : "Alterar"}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <SalePaymentModal
                    visible={this.state.salePaymentModalVisible}
                    hideModals={() => this.hideModals()}
                    acceptPayment={() => this.acceptPayment()}
                />
            </View>
        )
    }




}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: StyleVars.Colors.primary
    },
    innerContainer: {
        alignItems: 'center',
        paddingVertical: 6
    },
    profileImage: {
        height: windowHeight * 0.3,
        width: windowWidth * 0.3
    },
    nameText: {
        fontSize: 20,
        color: 'white'
    },
    locationText: {
        fontSize: 16,
        color: 'white'
    },
    rowContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgb(103,46,1)',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    headerText: {
        color: 'orange',
        fontSize: 16
    },
    smallerHeaderText: {
        color: 'orange',
        fontSize: 12,
        marginLeft: windowWidth * 0.17
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15
    },
    rowText: {
        color: 'white',
        fontSize: 10
    },
    defineImageButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    defineImageButton: {
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    defineImageButtonText: {
        color: 'white',
        fontSize: 18
    },
    choosePlanButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    choosePlanButton: {
        backgroundColor: '#003000',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.8,
        marginBottom: 20,
        alignItems: 'center'
    },
    choosePlanButtonText: {
        color: 'lime',
        fontSize: 20
    },
    imageContainer: {
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        width: windowWidth * 0.8,
        height: windowHeight * 0.3,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoImageStyle: {
        width: windowWidth * 0.45,
        height: windowWidth * 0.45,
        borderRadius: (windowWidth * 0.45) / 2
    },
    backgroundImageStyle: {
        width: windowWidth * 0.7,
        height: windowWidth * 0.7
    }
})