import React from 'react';
import{
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  StatusBar } from 'react-native';
  import { Notifications } from 'expo';
  import * as Permissions from 'expo-permissions';

  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


  import LogoTitle from './Header'

// ************************************************************
// ************          Main Class   *************************
// ************************************************************

export default class Order extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };

  render(){
    return(
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/pickup.png')}
          style={styles.pickup}
          resizeMode={'stretch'}
        >
          <TouchableOpacity
            style={styles.orderButton}
            onPress={
              () => this.props.navigation.navigate( 'Main' )
            }
            //onPress={() => navigate('HomeScreen')}
            underlayColor='#fff'>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    )
  }

}




// ************************************************************
// ************          StyleSheet   *************************
// ************************************************************

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
  ordNum:{
    fontSize: 30,
    fontFamily: 'HelveticaNeue-Light',// sans-serif,
    //backgroundColor: "grey",
    marginLeft: 10,
    marginTop:100,
  },
  logoBig:{
    height: 90,
    width: 90,
    //backgroundColor: "blue",
  },
  pickup:{
    flex: 1,
    alignSelf: 'stretch',
    width: undefined,
    height: undefined,
    alignItems: 'center',
    justifyContent: 'flex-end',

  },
  orderButton:{
    alignSelf: 'stretch',
    paddingTop:40,
    paddingLeft:90,
    paddingRight:90,
    paddingBottom:25,
    backgroundColor:'white',
    borderRadius:10,
    borderColor: 'black',
    opacity: 0,
    
  },
  orderText:{
      color:'#fff',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10,
      color:'black',
      fontSize:25,

  },
});
