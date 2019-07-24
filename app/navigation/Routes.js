'use strict'

import LoginScreen from '../screens/LoginScreen'
import MainScreen from '../screens/MainScreen'
import MenuScreen from '../screens/MenuScreen'
import MapScreen from '../screens/MapScreen'
import MapFiltersScreen from '../screens/MapFiltersScreen'
import SignupScreen from '../screens/SignupScreen'
import FacebookSignUpScreen from '../screens/FacebookSignUpScreen'
import ProfileScreen from '../screens/ProfileScreen'
import PinSelectionScreen from '../screens/PinSelectionScreen'
import EditProfileScreen from '../screens/EditProfileScreen'
import AddAdditionalContactInfoScreen from '../screens/AddAdditionalContactInfoScreen'
import AccountDeactivationScreen from '../screens/AccountDeactivationScreen'

import MySOSScreen from '../screens/MySOSScreen'

import ShareAppScreen from '../screens/ShareAppScreen'

import MyFriendsScreen from '../screens/MyFriendsScreen'
import LevelsScreen from '../screens/LevelsScreen'
import HowToEarnPointsScreen from '../screens/HowToEarnPointsScreen'
import OnlineFriendsScreen from '../screens/OnlineFriendsScreen'
import FriendProfileScreen from '../screens/FriendProfileScreen'
import FindFriendToAddScreen from '../screens/FindFriendToAddScreen'

import MessagesScreen from '../screens/MessagesScreen'

import AboutTheAppScreen from '../screens/AboutTheAppScreen'
import AppTermsScreen from '../screens/AppTermsScreen'

import MyPetScreen from '../screens/MyPetScreen'
import AddNewPetScreen from '../screens/AddNewPetScreen'
import PetEditScreen from '../screens/PetEditScreen'
import PetProfileScreen from '../screens/PetProfileScreen'

import AdoptPetScreen from '../screens/AdoptPetScreen'
import PetsToAdoptScreen from '../screens/PetsToAdoptScreen'
import MyFavouritesAdoptPetScreen from '../screens/MyFavouritesAdoptPetScreen'
import PetToAdoptProfileScreen from '../screens/PetToAdoptProfileScreen'

import PetServicesScreen from '../screens/PetServicesScreen'
import PetServicesSearchScreen from '../screens/PetServicesSearchScreen'
import MyFavouritesPetServicesScreen from '../screens/MyFavouritesPetServicesScreen'
import ServiceProfileScreen from '../screens/ServiceProfileScreen'
import ServiceRegistrationScreen from '../screens/ServiceRegistrationScreen'

import DefinePlanScreen from '../screens/DefinePlanScreen'
import AnnouncerLoginScreen from '../screens/AnnouncerLoginScreen'
import AnnouncerAreaScreen from '../screens/AnnouncerAreaScreen'
import AnnouncerMessageScreen from '../screens/AnnouncerMessageScreen'
import AnnouncerPlanScreen from '../screens/AnnouncerPlanScreen'
import DefineServiceImagesScreen from '../screens/DefineServiceImagesScreen'
import AnnouncerCodeValidationScreen from '../screens/AnnouncerCodeValidationScreen'
import AnnouncerChangeDataMenuScreen from '../screens/AnnouncerChangeDataMenuScreen'
import AnnouncerChangeProfileDataScreen from '../screens/AnnouncerChangeProfileDataScreen'
import AnnouncerChangeImagesScreen from '../screens/AnnouncerChangeImagesScreen'

import ONGRegistrationScreen from '../screens/ONGRegistrationScreen'
import DefineGroupImagesScreen from '../screens/DefineGroupImagesScreen'
import ONGLoginScreen from '../screens/ONGLoginScreen'
import ONGAreaScreen from '../screens/ONGAreaScreen'
import GroupProfileScreen from '../screens/GroupProfileScreen'
import ONGAnimalsScreen from '../screens/ONGAnimalsScreen'
import ONGMessageScreen from '../screens/ONGMessageScreen'
import ONGFaresScreen from '../screens/ONGFaresScreen'
import ONGMembersScreen from '../screens/ONGMembersScreen'
import ONGChangeDataMenuScreen from '../screens/ONGChangeDataMenuScreen'
import ONGChangeProfileDataScreen from '../screens/ONGChangeProfileDataScreen'
import ONGChangeImagesScreen from '../screens/ONGChangeImagesScreen'
import FindMemberToAddScreen from '../screens/FindMemberToAddScreen'
import NewFareScreen from '../screens/NewFareScreen'
import SelectFareAnimalsScreen from '../screens/SelectFareAnimalsScreen'
import FareHistoryScreen from '../screens/FareHistoryScreen'
import FareDetailsScreen from '../screens/FareDetailsScreen'
import FarePaymentScreen from '../screens/FarePaymentScreen'
import AddNewAnimalScreen from '../screens/AddNewAnimalScreen'
import AnimalEditScreen from '../screens/AnimalEditScreen'

import StreetAnimalPinCreationScreen from '../screens/StreetAnimalPinCreationScreen'
import RunawayAnimalPinCreationScreen from '../screens/RunawayAnimalPinCreationScreen'
import FreeRidePinCreationScreen from '../screens/FreeRidePinCreationScreen'
import TemporaryHomePinCreationScreen from '../screens/TemporaryHomePinCreationScreen'
import MilkFullPinCreationScreen from '../screens/MilkFullPinCreationScreen'
import MilkEmptyPinCreationScreen from '../screens/MilkEmptyPinCreationScreen'

import BackButton from '../components/BackButton'
import BackByANumberButton from '../components/BackByANumberButton'
import EditButton from '../components/EditButton'
import EditPetButton from '../components/EditPetButton'
import EditAnimalButton from '../components/EditAnimalButton'
import NewMessageButton from '../components/NewMessageButton'
import FindFriendToAddButton from '../components/FindFriendToAddButton'
import FindMemberToAddButton from '../components/FindMemberToAddButton'
import AddNewPetButton from '../components/AddNewPetButton'
import AddNewAnimalButton from '../components/AddNewAnimalButton'
import AddFriendButton from '../components/AddFriendButton'
import AddMemberButton from '../components/AddMemberButton'

class Routes {
  get(route, args){
    if("undefined" == typeof this[route]){
      console.warn("No route found with name: " + route)
      return false
    }else{
      return this[route].call(this, args)
    }
  }

  login(){
    return{
      name: "login",
      title: "Login",
      component: LoginScreen,
      hideNavigationBar: true,
      leftButton: null,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null

    }
  }

  main(){
    return{
      name: "main",
      title: "Main",
      component: MainScreen,
      hideNavigationBar: true,
      leftButton: null,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  menu(){
    return{
      name: "menu",
      title: "Menu",
      component: MenuScreen,
      hideNavigationBar: false,
      leftButton: null,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

   map(){
    return{
      name: "map",
      title: "Map",
      component: MapScreen,
      hideNavigationBar: true,
      leftButton: null,
      rightButton: null,
      statusBarStyle: "dark-content",
      data: null
    }
  }

  mapFilter(){
    return{
      name: "mapFilter",
      title: "Filtros",
      component: MapFiltersScreen,
      hideNavigationBar: false,
      leftButton: null,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

   signup(){
    return{
      name: "signup",
      title: "Cadastro",
      component: SignupScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

   signupWithFacebook(data) {
     return {
       name: "signupWithFacebook",
       title: "Cadastro",
       component: FacebookSignUpScreen,
       hideNavigationBar: false,
       leftButton: BackButton,
       rightButton: null,
       statusBarStyle: "light-content",
       data: data
     }
   }

  profile(){
    return{
      name: "profile",
      title: "Meu Perfil",
      component: ProfileScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  pin(){
    return{
      name: "pin",
      title: "SOS",
      component: PinSelectionScreen,
      hideNavigationBar: false,
      leftButton: null,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

   edit(){
    return{
      name: "edit",
      title: "Editar Informações",
      component: EditProfileScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  addAdditionalContactInfo(petInfo) {
    return {
      name: "addAdditionalContactInfo",
      title: "Editar Informações",
      component: AddAdditionalContactInfoScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: petInfo
    }
  }

  deactivate(){
    return{
      name: "deactivate",
      title: "Desativar Conta",
      component: AccountDeactivationScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  myLevel(protectionLevelName) {

    var data = {
      protectionLevelName: protectionLevelName
    }

    return {
      name: "myLevel",
      title: "Nível de Proteção Animal",
      component: LevelsScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: data
    }
  }

  howToEarnPoints(){

    return {
      name: "howToEarnPoints",
      title: "Como Ganhar Pontos",
      component: HowToEarnPointsScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  mySOS(){
     return{
      name: "mySOS",
      title: "Meus SOS",
      component: MySOSScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  myFriends(){
    return{
      name: "myFriends",
      title: "Meus Amigos",
      component: MyFriendsScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: FindFriendToAddButton,
      statusBarStyle: "light-content",
      data: null
    }
  }

  findFriendToAdd(){
    return{
      name: "findFriendToAdd",
      title: "Adicionar Amigos",
      component: FindFriendToAddScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  onlineFriends(){
    return{
      name: "onlineFriends",
      title: "Amigos Online",
      component: OnlineFriendsScreen,
      hideNavigationBar: false,
      leftButton: null,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  friendProfile(friendData, isFriend,isGroupSearching,requestAlreadySent){

    if(isFriend){ //Already a friend

      if(isGroupSearching){
        friendData = Object.assign(friendData, { isMember: true })
      } else{
        friendData = Object.assign(friendData, { isFriend: true })
      }
      return{ //Create friend profile screen with send message button
        name: "friendProfile",
        title: "Perfil",
        component: FriendProfileScreen,
        hideNavigationBar: false,
        leftButton: BackButton,
        rightButton: NewMessageButton,
        statusBarStyle: "light-content",
        data: friendData
      }
    } else{
      if(isGroupSearching){ //If is a group account seeing this profile
        if(requestAlreadySent){ //If member request already sent

          return { //Render the screen without any button on the right side
            name: "friendProfile",
            title: "Perfil",
            component: FriendProfileScreen,
            hideNavigationBar: false,
            leftButton: BackButton,
            rightButton: null,
            statusBarStyle: "light-content",
            data: friendData
          }
        } else{ //If the request was not sent, render the Add Member button on the right side
          return {
            name: "friendProfile",
            title: "Perfil",
            component: FriendProfileScreen,
            hideNavigationBar: false,
            leftButton: BackButton,
            rightButton: AddMemberButton,
            statusBarStyle: "light-content",
            data: friendData
          }
        }
        
      } else{ //If is a user account seeing this profile

        if (requestAlreadySent) { //If friend request already sent


          return { //Render the screen without any button on the right side
            name: "friendProfile",
            title: "Perfil",
            component: FriendProfileScreen,
            hideNavigationBar: false,
            leftButton: BackButton,
            rightButton: null,
            statusBarStyle: "light-content",
            data: friendData
          }
        } else {
          return { //If the request was not sent, render the Add Friend button on the right side
            name: "friendProfile",
            title: "Perfil",
            component: FriendProfileScreen,
            hideNavigationBar: false,
            leftButton: BackButton,
            rightButton: /* AddFriendButton */ null,
            statusBarStyle: "light-content",
            data: friendData
          }
        }
      } 
    }
  }

  messages(increaseCallback,decreaseCallback){

    var data = {
      increaseCallback: increaseCallback,
      decreaseCallback: decreaseCallback
    }

    return{
      name: "messages",
      title: "Mensagens",
      component: MessagesScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: NewMessageButton,
      statusBarStyle: "light-content",
      data: data
    }
  }

  about(){
    return{
      name: "about",
      title: "Sobre o App",
      component: AboutTheAppScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  terms(){
    return {
      name: "terms",
      title: "Regulamento",
      component: AppTermsScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

/////////////////////////////  My Pet //////////////////////////////////////////

  myPet(){
    return{
      name: "myPet",
      title: "Meu Pet",
      component: MyPetScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  petProfile(petData,isOwner,isGroupLooking){

    if(isGroupLooking){
      if(isOwner){

        petData = Object.assign(petData, { isOwner: true })

        return {
          name: "petProfile",
          title: petData.name,
          component: PetProfileScreen,
          hideNavigationBar: false,
          leftButton: BackButton,
          rightButton: null,
          statusBarStyle: "light-content",
          data: petData
        }
      } else{

        petData = Object.assign(petData, { isOwner: false })

        return {
          name: "petProfile",
          title: petData.name,
          component: PetProfileScreen,
          hideNavigationBar: false,
          leftButton: BackButton,
          rightButton: null,
          statusBarStyle: "light-content",
          data: petData
        }
      }
    } else {
      if (isOwner) {

        petData = Object.assign(petData, { isOwner: true })

        return {
          name: "petProfile",
          title: petData.name,
          component: PetProfileScreen,
          hideNavigationBar: false,
          leftButton: BackButton,
          rightButton: null,
          statusBarStyle: "light-content",
          data: petData
        }
      } else {

        petData = Object.assign(petData, { isOwner: false })

        return {
          name: "petProfile",
          title: petData.name,
          component: PetProfileScreen,
          hideNavigationBar: false,
          leftButton: BackButton,
          rightButton: null,
          statusBarStyle: "light-content",
          data: petData
        }
      }
    }
   
  }

  addNewPet(){
    return{
      name: "addNewPet",
      title: "Adicionar Pet",
      component: AddNewPetScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  editPet(petData){
    return {
      name: "editPet",
      title: "Alterar Dados",
      component: PetEditScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: petData
    }
  }

////////////////////////////// Pet Adoption /////////////////////////////////////

  adoptPet(){
    return{
      name: "adoptPet",
      title: "Adote Um Pet",
      component: AdoptPetScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  petsToAdopt(filters){
    return{
      name: "petsToAdopt",
      title: "Adote Um Pet",
      component: PetsToAdoptScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: filters
    }
  }

  petToAdoptProfile(petData){
    return{
      name: "petToAdoptProfile",
      title: petData.name,
      component: PetToAdoptProfileScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: petData
    }
  }

  myFavouriteAdoptPet(){
    return{
      name: "myFavouriteAdoptPet",
      title: "Meus Favoritos",
      component: MyFavouritesAdoptPetScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

////////////////////////////// Announcer & Service ////////////////////////////////////

  petServices(){
    return{
      name: "petServices",
      title: "Serviços Pet",
      component: PetServicesScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  petServicesSearch(filters){
    return{
      name: "petServicesSearch",
      title: "Serviços Pet",
      component: PetServicesSearchScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: filters
    }
  }

  myFavouritesPetServices(){
    return{
      name: "myFavouriteAPetServices",
      title: "Meus Favoritos",
      component: MyFavouritesPetServicesScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  serviceProfile(serviceData){
    return{
      name: "serviceProfile",
      title: serviceData.name,
      component: ServiceProfileScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: NewMessageButton,
      statusBarStyle: "light-content",
      data: serviceData
    }
  }

  serviceRegistration(){
    return{
      name: "serviceRegistration",
      title: 'Cadastro Anunciante',
      component: ServiceRegistrationScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  defineServiceImages(registrationInfo){
    return{
      name: "defineServiceImages",
      title: 'Cadastro Anunciante',
      component: DefineServiceImagesScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: registrationInfo
    }
  }

  announcerLogin(){
    return{
      name: "announcerLogin",
      title: 'Espaço Anunciante',
      component: AnnouncerLoginScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  announcerArea(data){
    return{
      name: "announcerArea",
      title: 'Espaço Anunciante',
      component: AnnouncerAreaScreen,
      hideNavigationBar: false,
      leftButton: BackByANumberButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: data
    }
  }

  announcerMessage(increaseCallback,decreaseCallback){

    var data = {
      increaseCallback: increaseCallback,
      decreaseCallback: decreaseCallback
    }

    return{
      name: "announcerMessage",
      title: 'Mensagens',
      component: AnnouncerMessageScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: data
    }
  }

   announcerChangeData(){
    return{
      name: "announcerChangeData",
      title: 'Alterar Dados',
      component: AnnouncerChangeDataMenuScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  announcerChangeProfile(){
    return{
      name: "announcerChangeProfile",
      title: 'Alterar Dados',
      component: AnnouncerChangeProfileDataScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  announcerChangeImage(){
    return{
      name: "announcerChangeImage",
      title: 'Alterar Dados',
      component: AnnouncerChangeImagesScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

   announcerPlan(){
    return{
      name: "announcerPlan",
      title: 'Meu Plano',
      component: AnnouncerPlanScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  announcerCode(){
    return{
      name: "announcerCode",
      title: 'Validar Código',
      component: AnnouncerCodeValidationScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  definePlan(registrationInfo){
    return{
      name: "definePlan",
      title: 'Cadastro Anunciante',
      component: DefinePlanScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: registrationInfo
    }
  }

////////////////////////////// ONG/Group //////////////////////////////////////////////////  

  ongRegistration(){
    return{
      name: "ongRegistration",
      title: 'Cadastro ONG/Grupo',
      component: ONGRegistrationScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  defineGroupImages(registrationInfo){
    return{
      name: "defineGroupImages",
      title: 'Cadastro ONG/Grupo',
      component: DefineGroupImagesScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: registrationInfo
    }
  }

  ongLogin(){
    return{
      name: "ongLogin",
      title: 'Espaço ONG/Grupo',
      component: ONGLoginScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  ongArea(data){
    return{
      name: "ongArea",
      title: 'Espaço ONG/Grupo',
      component: ONGAreaScreen,
      hideNavigationBar: false,
      leftButton: BackByANumberButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: data
    }
  }

  ongChangeData() {
    return {
      name: "ongChangeData",
      title: 'Alterar Dados',
      component: ONGChangeDataMenuScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  ongChangeProfile() {
    return {
      name: "ongChangeProfile",
      title: 'Alterar Dados',
      component: ONGChangeProfileDataScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  ongChangeImage() {
    return {
      name: "ongChangeImage",
      title: 'Alterar Dados',
      component: ONGChangeImagesScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  ongAnimals(){
    return{
      name: "ongAnimals",
      title: 'Nossos Animais',
      component: ONGAnimalsScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: AddNewAnimalButton,
      statusBarStyle: "light-content",
      data: null
    }
  }

  editAnimal(petData) {
    return {
      name: "editAnimal",
      title: "Alterar Dados",
      component: AnimalEditScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: petData
    }
  }

  addNewAnimal(data){
    return{
      name: "addNewAnimal",
      title: 'Adicionar Animal',
      component: AddNewAnimalScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: data
    }
  }

  ongFares(){
    return{
      name: "ongFares",
      title: 'Nossas Feiras',
      component: ONGFaresScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  fareHistory(){
    return{
      name: "fareHistory",
      title: 'Histórico de Feiras',
      component: FareHistoryScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  newFare(){
    return{
      name: "newFare",
      title: 'Nova Feira de Adoção',
      component: NewFareScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  fareDetails(fareData){
    return {
      name: "fareDetails",
      title: 'Dados da Feira',
      component: FareDetailsScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: fareData
    }
  }

  farePayment(){
    return{
      name: "farePayment",
      title: 'Pagamento Feira',
      component: FarePaymentScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  selectFareAnimal(selectCallback,deselectCallback){

    var data = {
      addAnimalToArray: selectCallback,
      removeAnimalFromArray: deselectCallback
    } 

    return{
      name: "selectFareAnimal",
      title: 'Animais Presentes',
      component: SelectFareAnimalsScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: data
    }
  }

  findMemberToAdd(){
    return{
      name: "findMemberToAdd",
      title: 'Adicionar Membros',
      component: FindMemberToAddScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  ongMembers(){
    return{
      name: "ongMembers",
      title: 'Membros',
      component: ONGMembersScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: FindMemberToAddButton,
      statusBarStyle: "light-content",
      data: null
    }
  }

  ongMessage(increaseCallback,decreaseCallback){

    var data = {
      increaseCallback: increaseCallback,
      decreaseCallback: decreaseCallback
    }

    return{
      name: "ongMessage",
      title: 'Mensagens',
      component: ONGMessageScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: data
    }
  }

  ongProfile(ongData, isMember, requestAlreadySent) {

    if (isMember) {

       ongData = Object.assign(ongData,{accountType: 'group'})
  
      return {
        name: "ongProfile",
        title: ongData.name,
        component: GroupProfileScreen,
        hideNavigationBar: false,
        leftButton: BackButton,
        rightButton: NewMessageButton,
        statusBarStyle: "light-content",
        data: ongData
      }
    } else {
      if (requestAlreadySent) {
        return {
          name: "ongProfile",
          title: ongData.name,
          component: GroupProfileScreen,
          hideNavigationBar: false,
          leftButton: BackButton,
          rightButton: null,
          statusBarStyle: "light-content",
          data: ongData
        }
      } else {
        ongData = Object.assign(ongData, {isUserLooking: true})
        
        return {
          name: "ongProfile",
          title: ongData.name,
          component: GroupProfileScreen,
          hideNavigationBar: false,
          leftButton: BackButton,
          rightButton: AddMemberButton,
          statusBarStyle: "light-content",
          data: ongData
        }
      }
    }
   
  }


/////////////////////////////// Pin Creation ////////////////////////////////////////////////

  pinCreationStreetAnimal(){
    return{
      name: "pinCreationStreetAnimal",
      title: 'Animal na Rua',
      component: StreetAnimalPinCreationScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  pinCreationRunawayAnimal(){
    return{
      name: "pinCreationRunawayAnimal",
      title: 'Animal Fugiu',
      component: RunawayAnimalPinCreationScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  pinCreationTemporaryHome(){
    return{
      name: "pinCreationTemporaryHome",
      title: 'Lar Temporário',
      component: TemporaryHomePinCreationScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  pinCreationMilkFull(){
    return{
      name: "pinCreationMilkFull",
      title: 'Mãe de Leite (Tenho)',
      component: MilkFullPinCreationScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  pinCreationMilkEmpty(){
    return{
      name: "pinCreationMilkEmpty",
      title: 'Mãe de Leite (Preciso)',
      component: MilkEmptyPinCreationScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  pinCreationFreeRide(){
    return{
      name: "pinCreationFreeRide",
      title: 'Transporte Solidário',
      component: FreeRidePinCreationScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }

  //////////////////////////////////////// Share app /////////////////////////////////////

  shareApp() {
    return {
      name: "shareApp",
      title: "Divulgar o App",
      component: ShareAppScreen,
      hideNavigationBar: false,
      leftButton: BackButton,
      rightButton: null,
      statusBarStyle: "light-content",
      data: null
    }
  }
  
}

export default new Routes()
