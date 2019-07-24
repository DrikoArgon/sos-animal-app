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
  ListView
} from 'react-native';


import StyleVars from '../styles/StyleVars'
import SendMessageModal from '../components/SendMessageModal'
import EditPinCommentModal from '../components/EditPinCommentModal'
import DeleteCommentModal from '../components/DeleteCommentModal'
import PinCommentModal from '../components/PinCommentModal'
import FirebaseRequest from '../Firebase/FirebaseRequest'
import PinOwnerInfoModal from '../components/PinOwnerInfoModal'
import PinReportModal from '../components/PinReportModal'


const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

var comments = []
export default class FreeRidePinCallout extends React.Component {

  constructor(props){
      super(props)

      this.data = this.props.data

      const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
        this.state = {
            dataSource: ds.cloneWithRows(comments),
            imagesDataSource: ds.cloneWithRows(this.props.data.images),
            sendMessageModalVisible: false,
            commentModalVisible: false,
            deleteCommentModalVisible: false,
            editCommentModalVisible: false,
            pinOwnerInfoModalVisible: false,
            reportModalVisible: false,
            selectedCommentMessage: null,
            selectedCommentID: null,
            loadingOwnerInfo: true,
            userInfo: {
                name: '',
                surname: '',
                state: '',
                city: '',
                country: ''
            },
            pinReports: {
                falseReports: this.data.reports.falseReports.falseReportsAmount,
                inapropriateContentReports: this.data.reports.inapropriateContentReports.inapropriateContentReportsAmount,
                isServicePin: false
            }
        }

  }

  componentDidMount() {

      comments = []

      this.searchUserInfo()
      FirebaseRequest.fetchPinComments(this.data.key, this.fillCommentArray)
      FirebaseRequest.listenToPinCommentChanges(this.data.key, this.updateCommentListWhenChanged)
      FirebaseRequest.listenToPinCommentRemoved(this.data.key, this.updateCommentListWhenRemoved)
      FirebaseRequest.listenToPinFalseReportChanges(this.data.key, this.updateFalseReports)
      FirebaseRequest.listenToPinInapropriateContentReportChanges(this.data.key, this.updateInapropriateContentReports)
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


  updateCommentListWhenChanged = (changedComment) => {

      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
      var index = null

      for (var i = 0; i < comments.length; i++) {
          if (comments[i].key === changedComment.key) {
              comments[i].message = changedComment.message
              break
          }
      }

      this.setState({
          dataSource: ds.cloneWithRows(comments)
      })

  }

  updateCommentListWhenRemoved = (commentRemoved) => {

      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
      var index = null

      for (var i = 0; i < comments.length; i++) {
          if (comments[i].key === commentRemoved.key) {
              index = i
          }
      }

      if (index !== null) {
          comments.splice(index, 1)
      }

      this.setState({
          dataSource: ds.cloneWithRows(comments)
      })

  }

  updateFalseReports = (newReportAmount) => {

      var inapropriateContentReportsAmount = this.state.pinReports.inapropriateContentReports

      this.setState({
          pinReports: {
              falseReports: newReportAmount,
              inapropriateContentReports: inapropriateContentReportsAmount
          }
      })

  }

  updateInapropriateContentReports = (newReportAmount) => {

      var falseReportsAmount = this.state.pinReports.falseReports

      this.setState({
          pinReports: {
              falseReports: falseReportsAmount,
              inapropriateContentReports: newReportAmount
          }
      })
  }

  searchUserInfo() {


      FirebaseRequest.fetchPersonInfo(this.props.data.pinOwnerID)
          .then((personInfo) => {
              this.setState({
                  userInfo: personInfo,
                  loadingOwnerInfo: false
              })
          })
          .catch((err) => { alert("Erro ao encontrar informações do dono do pin.", err.message) })


  }

  showReportModal() {
      this.setState({
          reportModalVisible: true
      })
  }


  showPinOwnerInfoModal() {
      this.setState({
          pinOwnerInfoModalVisible: true
      })
  }

  showCommentModal(){
      this.setState({
          commentModalVisible: true
      })
  }

  showEditCommentModal(rowData) {

      this.setState({
          editCommentModalVisible: true,
          selectedCommentID: rowData.key,
          selectedCommentMessage: rowData.message
      })
  }

  showDeleteCommentModal(rowData) {
      this.setState({
          deleteCommentModalVisible: true,
          selectedCommentID: rowData.key
      })
  }

  showSendMessageModal(){
      this.setState({
          sendMessageModalVisible: true
      })
  }
   
  hideModals() {

      this.setState({
          sendMessageModalVisible: false,
          commentModalVisible: false,
          editCommentModalVisible: false,
          deleteCommentModalVisible: false,
          pinOwnerInfoModalVisible: false,
          reportModalVisible: false
      })
  }  

  _renderRow(rowData) {

      return (
          <View style={styles.listViewRowContainer}>
              {this.data.pinOwnerID === FirebaseRequest.getCurrentUserID() ?
                  (
                      rowData.authorID === FirebaseRequest.getCurrentUserID() ?
                          (
                              <TouchableOpacity
                                  activeOpacity={0.5}
                                  style={styles.listViewRowInfoContainer}
                                  onPress={() => this.showEditCommentModal(rowData)}
                              >
                                  <View style={styles.listViewRowImageContainer}>
                                      <Image
                                          source={rowData.ownerProfileImage ? { uri: 'data:image/jpeg;base64,' + rowData.ownerProfileImage  } : require("../Resources/meuPerfilIcon.png")}
                                          style={styles.commentOwnerImage}
                                      />

                                  </View>
                                  <View style={styles.listViewRowTextContainer}>
                                      <Text style={styles.commentText}>{rowData.message}</Text>
                                      <Text style={styles.commentOwnerNameText}>{rowData.ownerName}</Text>
                                  </View>
                              </TouchableOpacity>
                          )
                          :
                          (
                              <TouchableOpacity
                                  activeOpacity={0.5}
                                  style={styles.listViewRowInfoContainer}
                                  onPress={() => this.showDeleteCommentModal(rowData)}
                              >
                                  <View style={styles.listViewRowImageContainer}>
                                      <Image
                                          source={rowData.ownerProfileImage ? { uri: 'data:image/jpeg;base64,' + rowData.ownerProfileImage  } : require("../Resources/meuPerfilIcon.png")}
                                          style={styles.commentOwnerImage}
                                      />

                                  </View>
                                  <View style={styles.listViewRowTextContainer}>
                                      <Text style={styles.commentText}>{rowData.message}</Text>
                                      <Text style={styles.commentOwnerNameText}>{rowData.ownerName}</Text>
                                  </View>
                              </TouchableOpacity>
                          )
                  )
                  :
                  (
                      rowData.authorID === FirebaseRequest.getCurrentUserID() ?
                          (
                              <TouchableOpacity
                                  activeOpacity={0.5}
                                  style={styles.listViewRowInfoContainer}
                                  onPress={() => this.showEditCommentModal(rowData)}
                              >
                                  <View style={styles.listViewRowImageContainer}>
                                      <Image
                                          source={rowData.ownerProfileImage ? { uri: 'data:image/jpeg;base64,' + rowData.ownerProfileImage  } : require("../Resources/meuPerfilIcon.png")}
                                          style={styles.commentOwnerImage}
                                      />

                                  </View>
                                  <View style={styles.listViewRowTextContainer}>
                                      <Text style={styles.commentText}>{rowData.message}</Text>
                                      <Text style={styles.commentOwnerNameText}>{rowData.ownerName}</Text>
                                  </View>
                              </TouchableOpacity>
                          )
                          :
                          (
                              <View style={styles.listViewRowInfoContainer} >
                                  <View style={styles.listViewRowImageContainer}>
                                      <Image
                                          source={rowData.ownerProfileImage ? { uri: 'data:image/jpeg;base64,' + rowData.ownerProfileImage  } : require("../Resources/meuPerfilIcon.png")}
                                          style={styles.commentOwnerImage}
                                      />

                                  </View>
                                  <View style={styles.listViewRowTextContainer}>
                                      <Text style={styles.commentText}>{rowData.message}</Text>
                                      <Text style={styles.commentOwnerNameText}>{rowData.ownerName}</Text>
                                  </View>
                              </View>
                          )
                  )
              }
          </View>
      )
  }
  _renderImageRow(rowData) {

      return (
          <Image
              source={{ uri: "data:image/jpeg;base64," + rowData }}
              style={styles.pinImage}
              resizeMode='contain'
          />
      )
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        
        <View style={styles.bubble}>
            <View style={styles.header}>
                <View style={styles.headerImageContainer}>
                    <Image 
                        source={require("../Resources/freeRideIcon.png")}
                        style={styles.rowIcon}
                        resizeMode='contain'
                    />
                </View>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>TRANSPORTE SOLIDÁRIO (PRECISO)</Text>
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
                <ListView
                    dataSource={this.state.imagesDataSource}
                    renderRow={(rowData) => this._renderImageRow(rowData)}
                    contentContainerStyle={styles.listView}
                    horizontal={true}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                >
                </ListView>
                <View style={styles.innerContainer}>
                    <Text style={styles.infoText}>Destino</Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{this.data.destination}</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.infoText}>Espécie</Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{this.data.specie}</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.infoText}>Idade</Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{this.data.ageAmount} {this.data.ageType}</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.infoText}>Porte</Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{this.data.size}</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.infoText}>Quantidade</Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{this.data.qtd}</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    <Text style={styles.infoText}>Criado por</Text>
                    {this.state.loadingOwnerInfo ?
                        (
                            <View style={styles.displayContainer}>
                                <View style={styles.userInfoDisplay}>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.loadingText}>Carregando...</Text>
                                    </View>
                                </View>
                            </View>
                        )
                        :
                        (
                            <View style={styles.displayContainer}>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={styles.userInfoDisplay}
                                    onPress={() => this.showPinOwnerInfoModal()}
                                >
                                    <View style={styles.userInfoContainer}>
                                        <View style={styles.imageContainer}>
                                            <Image
                                                source={this.state.userInfo.profileImage ? { uri: 'data:image/jpeg;base64,' + this.state.userInfo.profileImage } : require("../Resources/meuPerfilIcon.png")}
                                                style={styles.pinOwnerImage}
                                            />
                                        </View>
                                        <View style={styles.userInfoNameContainer}>
                                            <Text style={styles.rowText}>{this.state.userInfo.name} {this.state.userInfo.surname}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )

                    }
                </View>
                <View style={styles.separatorContainer}>
                    <View style={styles.separator}></View>
                </View>
                <ListView 
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => this._renderRow(rowData)}
                    enableEmptySections={true}
                >
                </ListView>
            </ScrollView>
            <View style={styles.footer}>
{/*
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.showSendMessageModal()}
                >
                     <Image 
                        source={require("../Resources/messageIcon.png")}
                        style={styles.footerMessageImage}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
*/}
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.showCommentModal()}
                >
                    <Image 
                        source={require("../Resources/balloon.png")}
                        style={styles.footerChatImage}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                >
                   <Image 
                        source={require("../Resources/shareIcon.png")}
                        style={styles.footerChatImage}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.showReportModal()}
                >
                    <Image
                        source={require("../Resources/reportIcon.png")}
                        style={styles.footerChatImage}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>
        </View>
         <View style={styles.arrow} />
         <SendMessageModal
            visible={this.state.sendMessageModalVisible}
            hideModals={() => this.hideModals()}
            isMessageFromPin={true}
            data={this.data}
         />
         <PinCommentModal
            visible={this.state.commentModalVisible}
            hideModals={() => this.hideModals()}
            headerColor={StyleVars.Colors.freeRidePinBackground}
            pinID={this.data.key}
        />
         <EditPinCommentModal
             visible={this.state.editCommentModalVisible}
             hideModals={() => this.hideModals()}
             headerColor={StyleVars.Colors.freeRidePinBackground}
             pinID={this.data.key}
             commentID={this.state.selectedCommentID}
             message={this.state.selectedCommentMessage}
         />
         <DeleteCommentModal
             visible={this.state.deleteCommentModalVisible}
             hideModals={() => this.hideModals()}
             headerColor={StyleVars.Colors.freeRidePinBackground}
             pinID={this.data.key}
             commentID={this.state.selectedCommentID}
         />
         <PinOwnerInfoModal
             visible={this.state.pinOwnerInfoModalVisible}
             hideModals={() => this.hideModals()}
             pinOwnerData={this.state.userInfo}
             pinData={this.data}
         />
         <PinReportModal
             visible={this.state.reportModalVisible}
             hideModals={() => this.hideModals()}
             pinData={this.data}
             pinReportsData={this.state.pinReports}
             headerColor={StyleVars.Colors.freeRidePinBackground}
         />
      </View>
    );
  }
}

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
  rowContainer:{
      flexDirection: 'row'
  },
  header:{
    backgroundColor: StyleVars.Colors.freeRidePinBackground,
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 10

  },
  headerText:{
     color: 'white',
     fontSize: 11
  },
  headerImageContainer:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowIcon:{
    width: windowWidth * 0.06,
    height: windowHeight * 0.06
  },
  innerContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 5
  },
  infoContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      backgroundColor: StyleVars.Colors.secondary,
      width: windowWidth * 0.7,
      paddingVertical: 3,
      marginTop: 5
  },
  smallInfoContainer:{
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
  footer:{
    backgroundColor: StyleVars.Colors.freeRidePinBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
 },
  modalFooterText:{
    color: 'white',
    fontSize: 16
  },
  modalSaveButtonText:{
    color: 'white',
    fontSize: 16
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: StyleVars.Colors.freeRidePinBackground,
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
  footerMessageImage:{
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
        marginTop: 3,
        marginBottom: 3,
        width: windowWidth * 0.75,
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
  footerChatImage:{
      width: windowWidth * 0.07,
      height: windowHeight * 0.03
  },
  pinImage: {
      width: windowWidth * 0.8,
      height: windowHeight * 0.298,
      marginBottom: 5
  },
  displayContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10
  },
  userInfoContainer: {
      flexDirection: 'row',
      borderRadius: 10,
      paddingHorizontal: 25,
      paddingVertical: 5,
      width: windowWidth * 0.75,
      height: windowHeight * 0.18,
      alignItems: 'center'

  },
  userInfoDisplay: {
      backgroundColor: StyleVars.Colors.secondary,
      borderRadius: 10,
      paddingVertical: 10,
      width: windowWidth * 0.75,
      height: windowHeight * 0.18,
      alignItems: 'center',
      justifyContent: 'center'
  },
  textContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 15
  },
  imageContainer: {
      justifyContent: 'center',
      marginBottom: 7,
      marginTop: 5,
      marginRight: 15
  },
  pinOwnerImage: {
      height: windowWidth * 0.22,
      width: windowWidth * 0.22,
      borderRadius: (windowWidth * 0.22) / 2
  },
  userInfoNameContainer: {
      alignItems: 'center',
      justifyContent: 'center'
  },
  rowText: {
      color: 'white',
      fontSize: 12
  },
  loadingText: {
      color: 'white',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 5
  },     
});
