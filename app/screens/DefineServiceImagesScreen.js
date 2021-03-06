'use strict'

import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ListView
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import Routes from '../navigation/Routes'
import ImagePicker from 'react-native-image-picker'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export default class DefineServiceImagesScreen extends Component{

    constructor(props){
        super(props)

        this.data = this.props.data

        this.state = {
            logoImageSource: null,
            logoImage: null,
            backgroundImageSource: null,
            backgroundImage: null,
        }

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

                let source = { uri: response.uri }

                if(isLogo){     
                    this.setState({
                        logoImageSource: source,
                        logoImage: response.data
                    })
                }else{
                    this.setState({
                        backgroundImageSource: source,
                        backgroundImage: response.data
                    })
                }

                

            }
        })
    }

    goToDefinePlan(){

        if(this.state.logoImage === null || this.state.backgroundImage === null){
            return(console.error("Image(s) missing"))
        }

        this.data.logoImage = this.state.logoImage
        this.data.backgroundImage = this.state.backgroundImage
        this.props.toRoute(Routes.definePlan(this.data))

    }

    render(){
        return(
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
                                source={this.state.logoImageSource ? this.state.logoImageSource : require("../Resources/meuPerfilIcon.png")}
                                style={this.state.logoImageSource ? styles.logoImageStyle : styles.profileImage}
                                resizeMode={this.state.logoImageSource ? null : 'contain'}
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
                    </View>

                     <View style={styles.innerContainer}>
                        <View style={styles.imageContainer}>
                            <Image 
                                source={this.state.backgroundImageSource ? this.state.backgroundImageSource : require("../Resources/meuPerfilIcon.png")}
                                style={this.state.backgroundImageSource ? styles.backgroundImageStyle : styles.profileImage}
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
                                    onPress={() => {this.goToDefinePlan()}
                                    }
                                >
                                <Text style={styles.choosePlanButtonText}>Definir Plano</Text>
                            </TouchableOpacity>
                     </View>     
                </ScrollView>
            </View>
        )
    }




}

const styles = StyleSheet.create({

    container:{
        flex: 1,
        backgroundColor: StyleVars.Colors.primary
    },
    innerContainer: {
        alignItems: 'center',
        paddingVertical: 6
    },
    profileImage:{
        height: windowHeight * 0.3,
        width: windowWidth * 0.3
    },
    nameText:{
        fontSize: 20,
        color: 'white'
    },
    locationText:{
        fontSize: 16,
        color: 'white'
    },
    rowContainer:{
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    headerContainer:{
        flex: 1,
        backgroundColor: 'rgb(103,46,1)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    headerText:{
        color: 'orange',
        fontSize: 16
    },
    textContainer:{
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15
    },
    // imageContainer:{
    //     justifyContent: 'center'
    // },
    rowText:{
        color: 'white',
        fontSize: 10
    },
     defineImageButtonContainer:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    defineImageButton:{
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.7,
        marginBottom: 5,
        alignItems: 'center'
    },
    defineImageButtonText:{
        color: 'white',
        fontSize: 18
    },
    choosePlanButtonContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    choosePlanButton:{
        backgroundColor: '#003000',
        borderRadius: 5,
        paddingVertical: 5,
        width: windowWidth * 0.8,
        marginBottom: 5,
        alignItems: 'center'
    },
    choosePlanButtonText:{
        color: 'lime',
        fontSize: 20
    },
    imageContainer:{
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 5,
        width: windowWidth * 0.8,
        height: windowHeight * 0.3,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoImageStyle:{
        width: windowWidth * 0.45,
        height: windowWidth * 0.45,
        borderRadius: (windowWidth * 0.45)/2
    },
    backgroundImageStyle:{
        width: windowWidth * 0.7,
        height: windowWidth * 0.7
    }

})