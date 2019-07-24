import React, { PropTypes } from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScroolView,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    ListView,
    Alert
} from 'react-native';


import StyleVars from '../styles/StyleVars'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import FareAnimalInfoModal from '../components/FareAnimalInfoModal'


const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var fareAnimals = []


const propTypes = {
    style: PropTypes.object,
};

export default class FarePinCallout extends React.Component {

    constructor(props) {
        super(props)

        this.data = this.props.data

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            dataSource: ds.cloneWithRows(fareAnimals),
            fareAnimalInfoModalVisible: false,
            selectedAnimalInfo: {
                name: 'nome'
            },
            loading: true
        }

    }

    showFareAnimalInfoModal(fareAnimalInfo){
        this.setState({
            selectedAnimalInfo: fareAnimalInfo,
            fareAnimalInfoModalVisible: true
        })
    }

    hideModals(){
        this.setState({
            fareAnimalInfoModalVisible: false
        })
    }

    componentDidMount() {

        fareAnimals = []

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        FirebaseRequest.fetchFareAnimals(this.data.key)
        .then((animalArray) => {

            fareAnimals = animalArray

            this.setState({
                dataSource: ds.cloneWithRows(fareAnimals),
                loading: false
            })

            FirebaseRequest.listenToFarePinAnimalAdded(this.data.key, this.updateAnimalListWhenAdded)
            FirebaseRequest.listenToFarePinAnimalRemoved(this.data.key, this.updateAnimalListWhenRemoved)
        })
        .catch((err) => {
            Alert.alert('', 'Erro ao coletar dados dos animais desta feira.',
                [
                    {
                        text: 'Ok', onPress: () => { }
                    }
                ],
                { cancelable: false }
            )
            this.setState({
                loading: false
            })
        })


    }

    updateAnimalListWhenAdded = (newAnimal) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        fareAnimals.push(newAnimal)

        this.setState({
            dataSource: ds.cloneWithRows(fareAnimals)
        })

    }


    updateAnimalListWhenRemoved = (animalRemoved) => {

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        var index = null

        for (var i = 0; i < fareAnimals.length; i++) {
            if (fareAnimals[i].key === animalRemoved.key) {
                index = i
            }
        }

        if (index !== null) {
            fareAnimals.splice(index, 1)
        }

        this.setState({
            dataSource: ds.cloneWithRows(fareAnimals)
        })

    }


    _renderRow(rowData) {

        return (
            <View style={styles.listViewRowContainer}>       
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.listViewRowInfoContainer}
                    onPress={() => this.showFareAnimalInfoModal(rowData)}
                >
                    <View style={styles.listViewRowImageContainer}>
                        <Image
                            source={{ uri: "data:image/jpeg;base64," + rowData.profilePhoto }}
                            style={styles.commentOwnerImage}
                        />

                    </View>
                    <View style={styles.listViewRowTextContainer}>
                        <Text style={styles.commentOwnerNameText}>{rowData.name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>

                <View style={styles.bubble}>
                    <View style={styles.header}>
                        <View style={styles.headerImageContainer}>
                            <Image
                                source={require("../Resources/Pins/farePin.png")}
                                style={styles.rowIcon}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerText}>FEIRA DE ADOÇÃO</Text>
                        </View>
                        <View>
                        </View>
                    </View>
                    <ScrollView
                        ref="scrollView"
                        keyboardShouldPersistTaps="never"
                        automaticallyAdjustContentInsects={true}
                        alwaysBounceVertical={true}
                        style={styles.scrollView}
                    >
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Nome do Grupo</Text>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>{this.data.pinOwnerName}</Text>
                            </View>
                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Horário de Início</Text>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>{this.data.startingTime}</Text>
                            </View>
                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Horário de Término</Text>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>{this.data.endingTime}</Text>
                            </View>
                        </View>
                        <View style={styles.innerContainer}>
                            <Text style={styles.infoText}>Animais para Adoção</Text>
                        </View>
                        <View style={styles.separatorContainer}>
                            <View style={styles.separator}></View>
                        </View>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => this._renderRow(rowData)}
                        >
                        </ListView>
                    </ScrollView>
                    <View style={styles.footer}>
                        <View>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.5}
                        >
                            <Image
                                source={require("../Resources/shareIcon.png")}
                                style={styles.footerChatImage}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>

                    </View>
                </View>
                <View style={styles.arrow} />
                <FareAnimalInfoModal
                    visible={this.state.fareAnimalInfoModalVisible}
                    hideModals={() => this.hideModals()}
                    petData={this.state.selectedAnimalInfo}
                    pinData={this.data}
                />
            </View>
        );
    }
}

FarePinCallout.propTypes = propTypes;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bubble: {
        backgroundColor: StyleVars.Colors.primary,
        borderRadius: 10,
    },
    amount: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row'
    },
    header: {
        backgroundColor: StyleVars.Colors.milkEmptyPinBackground,
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'space-between',
        paddingHorizontal: 10

    },
    headerText: {
        color: 'white',
        fontSize: 14
    },
    headerImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowIcon: {
        width: windowWidth * 0.06,
        height: windowHeight * 0.06
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    infoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: StyleVars.Colors.secondary,
        width: windowWidth * 0.7,
        paddingVertical: 3,
        marginTop: 5
    },
    smallInfoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: StyleVars.Colors.secondary,
        width: windowWidth * 0.325,
        paddingVertical: 3,
        marginTop: 5,
        marginRight: 10,
        marginLeft: 10
    },
    infoText: {
        color: 'white',
        fontSize: 16
    },
    footer: {
        backgroundColor: StyleVars.Colors.milkEmptyPinBackground,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    modalFooterText: {
        color: 'white',
        fontSize: 16
    },
    modalSaveButtonText: {
        color: 'white',
        fontSize: 16
    },
    arrow: {
        backgroundColor: 'transparent',
        borderWidth: 16,
        borderColor: 'transparent',
        borderTopColor: StyleVars.Colors.milkEmptyPinBackground,
        alignSelf: 'center',
        marginTop: 0
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderWidth: 16,
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        alignSelf: 'center',
        marginTop: -.5,
    },
    footerMessageImage: {
        width: windowWidth * 0.07,
        height: windowHeight * 0.03
    },
    commentOwnerImage: {
        width: windowWidth * 0.17,
        height: windowWidth * 0.17,
        borderRadius: (windowWidth * 0.17) / 2,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5
    },
    listViewRowInfoContainer: {
        flexDirection: 'row',
        backgroundColor: StyleVars.Colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5

    },
    listViewRowContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    commentText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 12
    },
    listViewRowTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 10
    },
    separatorContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    separator: {
        height: 1,
        marginTop: 3,
        marginBottom: 3,
        width: windowWidth * 0.75,
        backgroundColor: 'white'
    },
    listViewRowImageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentOwnerNameText: {
        color: 'white',
        fontSize: 10,
        marginTop: 5
    },
    footerChatImage: {
        width: windowWidth * 0.07,
        height: windowHeight * 0.03
    },
    pinImage: {
        width: windowWidth * 0.8,
        height: windowHeight * 0.298,
        marginBottom: 5
    }

});
