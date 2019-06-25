import React from 'react';
import{
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  StatusBar } from 'react-native';
  import { Permissions, Notifications } from 'expo';



  // ************************************************************
  // ************          Load Components   ********************
  // ************************************************************
  import Home from './Components/Home'
  import Order from './Components/Order'

  import { createStackNavigator, createAppContainer } from 'react-navigation'

  const RootStack = createStackNavigator({
      Home: Home,
      Order: Order,
  } )

export default class App extends React.Component {

  render(){
    return(
      <AppContainer/>
    )
  }
}

const AppContainer = createAppContainer(RootStack)


// ************************************************************
// ************          StyleSheet   *************************
// ************************************************************

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  groceryItem:{
    fontSize: 30,
    fontFamily: 'HelveticaNeue-Light',// sans-serif,
    //backgroundColor: "grey",
    margin: 1,
  },
  header:{
    alignItems: 'center',
    justifyContent: 'flex-start',
    //backgroundColor: "grey",
    alignSelf: "stretch",
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 0.5,
  },
  h:{
    fontSize: 20,
    fontFamily: 'HelveticaNeue-UltraLight',// sans-serif,
    //backgroundColor: "grey",
    padding: 1,
    marginTop: 25,
  },
  logo:{
    height: 40,
    width: 40,
    marginTop: 40,
    marginBottom: 10,
    //backgroundColor: "blue",
  },
  foodImg:{
    height: 150,
    width: 150,
    marginTop: 40,
    marginBottom: 10,
    //backgroundColor: "blue",

  },
  orderButton:{
    marginRight:10,
    marginLeft:10,
    marginTop:15,
    paddingTop:25,
    paddingLeft:80,
    paddingRight:80,
    paddingBottom:25,
    backgroundColor:'gold',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  orderText:{
      color:'#fff',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10,
      color:'black',
      fontSize:25,

  },
  aButton:{
    marginRight:10,
    marginLeft:10,
    marginTop:25,

  },
  aText:{
      color:'#fff',
      textAlign:'center',
      color:'black',
      fontSize:20,
      textDecorationLine: 'underline',
  },
});
