import { StyleSheet } from 'react-native'
import StyleVars from './StyleVars'

export default StyleSheet.create({

  screenContainer:{
    flex: 1,
    flexDirection: 'column',
    backgroundColor: StyleVars.Colors.mediumBackground
  },
  headingText: {
    color: StyleVars.Colors.primary,
    fontSize: 16,
    fontWeight: '600'
  },
  text: {
    color: StyleVars.Colors.primary,
    fontSize: 12,
    fontWeight: '400'
  },
  navBarTitleText: {
    color: StyleVars.Colors.navBarTitle,
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 22,


  }

})
