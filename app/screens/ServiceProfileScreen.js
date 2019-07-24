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
    ListView,
    Alert
} from 'react-native'

import StyleVars from '../styles/StyleVars'
import CommentModal from '../components/CommentModal'
import RatingModal from '../components/RatingModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var comments = []



export default class ServiceProfileScreen extends Component{


    constructor(props){
        super(props)

        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})

        this.state = {

            dataSource: ds.cloneWithRows(comments),

            commentModalVisible: false,
            ratingModalVisible: false,
            addingToFavorite: false,
            isFavorite: false,
            searchingIfFavorite: true,
            favoriteKey: ''
        }

        this.data = this.props.data
        comments = []

    }

  componentDidMount(){

      comments = []

      FirebaseRequest.fetchServiceComments(this.data.key, this.fillCommentArray)
      FirebaseRequest.listenToRatingChanges(this.data.key, this.updateRating)

      var favouriteServicesAndGroupsArray = []

      if (FirebaseRequest.getCurrentUserFavoriteServicesAndGroups()) {

          favouriteServicesAndGroupsArray = FirebaseRequest.getCurrentUserFavoriteServicesAndGroups()

          for (var i = 0; i < favouriteServicesAndGroupsArray.length; i++) {

              if (favouriteServicesAndGroupsArray[i].key === this.data.key) {

                  this.setState({
                      isFavorite: true,
                      favoriteKey: favouriteServicesAndGroupsArray[i].favoriteKey
                  })  
                  break
              }
          }

          this.setState({
              searchingIfFavorite: false
          })  

      } else {
          FirebaseRequest.fetchUserFavoriteServicesAndGroups()
              .then((servicesAndGroupsArray) => {
                  favouriteServicesAndGroupsArray = servicesAndGroupsArray

                  for (var i = 0; i < favouriteServicesAndGroupsArray.length; i++) {

                      if (favouriteServicesAndGroupsArray[i].key === this.data.key) {

                          this.setState({
                              isFavorite: true,
                              favoriteKey: favouriteServicesAndGroupsArray[i].favoriteKey
                          })  
                          break
                      }
                  }

                  this.setState({
                      searchingIfFavorite: false
                  })  

              })
              .catch((err) => console.error("Error while fetching user favorite services. ", err.message))
      }

  }

  componentWillUnmount(){

      FirebaseRequest.removeCommentsListener(this.data.key)
      FirebaseRequest.removeRatingListener(this.data.key)

      comments = []
  }

  updateRating = (newRating) => {
        this.data.rating.averageRating = newRating
  }

  fillCommentArray = (comment) => {

      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

      FirebaseRequest.fetchPersonInfo(comment.authorID)
          .then((personInfo) => {

              var commentInfo = {
                  ownerName: personInfo.name + ' ' + personInfo.surname,
                  ownerProfileImage: personInfo.profileImage,
                  message: comment.message
              }
              comments.push(commentInfo)

              this.setState({
                  dataSource: ds.cloneWithRows(comments)
              })

          })
          .catch((err) => { console.error("Error while trying to fetch comment author info: ", err.message) })
  }



  showCommentModal(){
      this.setState({
          commentModalVisible: true
      })
  }

  showRatingModal(){
      this.setState({
          ratingModalVisible: true
      })
  }
   

  hideModals(){
    this.setState({
        ratingModalVisible: false,
        commentModalVisible: false
    })
  }

  addToUserFavorites(){

    this.setState({
        addingToFavorite: true
    })

    FirebaseRequest.addServiceOrGroupToFavorites(this.data.key,false)
    .then((key) => {

        this.setState({
            addingToFavorite: false,
            isFavorite: true,
            favoriteKey: key
        })
    })
    .catch((err) => {console.error("Error while adding service to favorites. ", err.message)})
  }  

  removeFromUserFavorites() {

      Alert.alert('', 'Gostaria de remover este serviço dos favoritos?',
          [

              {
                  text: 'Cancelar', onPress: () => { }
              },
              {
                  text: 'Ok', onPress: () => {
                      this.setState({
                          addingToFavorite: true
                      })

                      FirebaseRequest.removeServiceOrGroupFromFavorites(this.state.favoriteKey)
                          .then(() => {

                              this.setState({
                                  addingToFavorite: false,
                                  isFavorite: false
                              })

                              Alert.alert('Sucesso', 'Serviço removido.')
                          })
                          .catch((err) => {
                              Alert.alert('Atenção', 'Erro ao remover serviço.')
                              this.setState({
                                  addingFriend: false
                              })
                          })
                  }
              }
          ],
          { cancelable: false }
      )


  }

   _renderRow(rowData){

       return(
           <View style={styles.listViewRowContainer}>
            <View style={styles.listViewRowInfoContainer}>
            <View style={styles.listViewRowImageContainer}>
                <Image 
                    source={{ uri: "data:image/jpeg;base64," + rowData.ownerProfileImage}}
                    style={styles.commentOwnerImage}
                />
               
            </View>
            <View style={styles.listViewRowTextContainer}>
                <Text style={styles.commentText}>{rowData.message}</Text>
                <Text style={styles.commentOwnerNameText}>{rowData.ownerName}</Text>
            </View>
            
            </View>
          </View>
       )
   }

    renderStars(){

        if( 0 <= this.data.rating.averageRating && this.data.rating.averageRating < 0.5 ){
            return(
                <Image 
                    source={require("../Resources/Stars/none.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if( 5 <= this.data.rating.averageRating && this.data.rating.averageRating < 1.0 ){
            return(
                <Image 
                    source={require("../Resources/Stars/half.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if( 1.0 <= this.data.rating.averageRating && this.data.rating.averageRating < 1.5 ){
            return(
                <Image 
                    source={require("../Resources/Stars/one.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if( 1.5 <= this.data.rating.averageRating && this.data.rating.averageRating < 2.0 ){
            return(
                <Image 
                    source={require("../Resources/Stars/oneAndAHalf.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if( 2.0 <= this.data.rating.averageRating && this.data.rating.averageRating < 2.5 ){
            return(
                <Image 
                    source={require("../Resources/Stars/two.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if( 2.5 <= this.data.rating.averageRating && this.data.rating.averageRating < 3.0 ){
            return(
                <Image 
                    source={require("../Resources/Stars/twoAndAHalf.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if( 3.0 <= this.data.rating.averageRating && this.data.rating.averageRating < 3.5 ){
            return(
                <Image 
                    source={require("../Resources/Stars/three.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if( 3.5 <= this.data.rating.averageRating && this.data.rating.averageRating < 4.0 ){
            return(
                <Image 
                    source={require("../Resources/Stars/threeAndAHalf.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if( 4.0 <= this.data.rating.averageRating && this.data.rating.averageRating < 4.5 ){
            return(
                <Image 
                    source={require("../Resources/Stars/four.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else if( 4.5 <= this.data.rating.averageRating && this.data.rating.averageRating < 5.0 ){
            return(
                <Image 
                    source={require("../Resources/Stars/fourAndAHalf.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }
        else{
            return(
                <Image 
                    source={require("../Resources/Stars/five.png")}
                    style={styles.starsImage}
                    resizeMode='contain'
                />
            )
        }

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
                    <View style={styles.innerContainer}>
                        <Image 
                            source={{uri: "data:image/jpeg;base64," + this.data.backgroundImage}}
                            style={styles.profileImage}
                         
                        />
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.infoDescriptionText}>Endereço: </Text>
                            <Text style={styles.infoText}>{this.data.adress}</Text>
                        </View>
                        <Text style={styles.infoText}>{this.data.district}, {this.data.city}, {this.data.state}, {this.data.country}</Text>
                        <View style={styles.textContainer}>
                            <Text style={styles.infoDescriptionText}>Telefone: </Text>
                            <Text style={styles.infoText}>{this.data.phone}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.infoDescriptionText}>Horário: </Text>
                            <Text style={styles.infoText}>{this.data.openingHour} - {this.data.closingHour}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.infoDescriptionText}>Site: </Text>
                            <Text style={styles.infoText}>{this.data.website}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.infoDescriptionText}>E-mail: </Text>
                            <Text style={styles.infoText}>{this.data.email}</Text>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        
                        { !this.state.searchingIfFavorite ? 
                          (
                                this.state.isFavorite ?
                                    (
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={styles.favouriteButtonContainer}
                                            onPress={() => this.removeFromUserFavorites()}
                                        >
                                            <View style={styles.favoriteButtonDisabled}>
                                                <Image
                                                    source={require("../Resources/brokenHeartIcon.png")}
                                                    style={styles.heartIcon}
                                                    resizeMode='contain'
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    ) :
                                    (
                                        this.state.addingToFavorite ?
                                            (
                                                <View style={styles.favouriteButtonContainer}>
                                                    <View style={styles.favoriteButtonDisabled}>
                                                        <Image
                                                            source={require("../Resources/heartDisabledIcon.png")}
                                                            style={styles.heartIcon}
                                                            resizeMode='contain'
                                                        />
                                                    </View>
                                                </View>
                                            ) :
                                            (
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    style={styles.favouriteButtonContainer}
                                                    onPress={() => this.addToUserFavorites()}
                                                >
                                                    <View style={styles.favouriteButton}>
                                                        <Image
                                                            source={require("../Resources/heartIcon2.png")}
                                                            style={styles.heartIcon}
                                                            resizeMode='contain'
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                    )
                          ): 
                          (
                                <View style={styles.favouriteButtonContainer}>
                                    <View style={styles.favoriteButtonDisabled}>
                                        <Image
                                            source={require("../Resources/heartIcon2.png")}
                                            style={styles.heartIcon}
                                            resizeMode='contain'
                                        />
                                    </View>
                                </View>
                          )    
                        } 
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.spaceBetweenContainer}>
                            <Text style={styles.ratingText}>Avaliação: {this.data.rating.averageRating.toFixed(1)}</Text>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.showCommentModal()}
                            >
                                <Text style={styles.commentButtonText}>Comentar</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                            style={styles.rowContainer}
                            activeOpacity={0.5}
                            onPress={() => this.showRatingModal()}
                        >
                            {this.renderStars()}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separatorContainer}>
                        <View style={styles.separator}></View>
                    </View>       
                    <ListView 
                        dataSource={ this.state.dataSource }
                        renderRow={(rowData) => this._renderRow(rowData)}
                    >
                    </ListView>     
                </ScrollView>
                <CommentModal
                    visible={this.state.commentModalVisible}
                    hideModals={() => this.hideModals()}
                    ID={this.data.key}
                    isGroup={false}
                />
                <RatingModal
                    visible={this.state.ratingModalVisible}
                    hideModals={() => this.hideModals()}
                    ID={this.data.key}
                    isGroup={false}
                />
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
        alignItems: 'center'
    },
    infoContainer:{
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: StyleVars.Colors.secondary
    },
    infoText:{
        color: 'white',
        fontSize: 16,
        marginBottom: 4
    },
    profileImage:{
        height: windowHeight * 0.4,
        width: windowWidth
    },
    moneyIcon:{
        height: windowHeight * 0.048,
        width: windowWidth * 0.1
    },
    heartIcon: {
        height: windowHeight * 0.05,
        width: windowWidth * 0.1
    },
    starsImage:{
        height: windowHeight * 0.1,
        width: windowWidth * 0.6
    },
    // separator:{
    //     flex: 1,
    //     height: 2,
    //     marginTop: 5,
    //     marginBottom: 5,
    //     marginHorizontal: 10,
    //     backgroundColor: 'white'
    // },
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
        justifyContent:'center'
    },
    spaceBetweenContainer:{
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    textContainer:{
       flexDirection: 'row'
    },
    imageContainer:{
        justifyContent: 'center'
    },
    rowText:{
        color: 'white',
        fontSize: 10
    },
    caracteristicsContainer:{
        backgroundColor: StyleVars.Colors.listViewBackground,
        flex: 1
    },
    caractersticsInnerContainer:{
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 12
    },
    caracteristicsInfoContainer:{
        flex: 1,
        alignItems: 'center'
    },
    saleButtonContainer:{
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    saleButton:{
        borderRadius: 10,
        backgroundColor: 'darkgreen',
        paddingHorizontal: windowWidth * 0.17,
        paddingVertical: 20
    },
    favouriteButtonContainer:{
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    favouriteButton:{
        borderRadius: 10,
        backgroundColor: 'darkred',
        paddingHorizontal: windowWidth * 0.4,
        paddingVertical: 20
    },
    favoriteButtonDisabled:{
        borderRadius: 10,
        backgroundColor: 'rgba(139,0,0,0.2)',
        paddingHorizontal: windowWidth * 0.4,
        paddingVertical: 20
    },
    ratingText:{
        color: 'yellow',
        fontSize: 14
    },
    commentButtonText:{
        color: 'deepskyblue',
        fontSize: 14
    },
    infoDescriptionText:{
         color: 'deepskyblue',
         fontSize: 16,
         marginBottom: 4
    },
  commentOwnerImage:{
    width: windowWidth * 0.17,
    height: windowWidth * 0.17,
    borderRadius: (windowWidth * 0.17)/2,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5
  },
  listViewRowInfoContainer:{
      flexDirection: 'row',
      backgroundColor: StyleVars.Colors.secondary,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5

  },
  listViewRowContainer:{
      paddingHorizontal: 10,
      paddingVertical: 5
  },
  commentText:{
      textAlign: 'center',
      color: 'white',
      fontSize: 12
  },
  listViewRowTextContainer:{
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      paddingHorizontal:10
  },
  separatorContainer:{
      justifyContent: 'center',
      alignItems: 'center'
  },
  separator: {
        height: 1,
        marginTop: 7,
        marginBottom: 2,
        width: windowWidth * 0.95,
        backgroundColor: 'white'
    },
  listViewRowImageContainer:{
      justifyContent: 'center',
      alignItems: 'center'
  },
  commentOwnerNameText:{
      color: 'white',
      fontSize: 10,
      marginTop: 5
  },
  loadingView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
  loadingText: {
      color: 'white',
      fontSize: 16,
      marginTop: 20
  }

})