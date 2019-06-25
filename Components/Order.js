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
        <Image
          source={require('../assets/pickup.png')}
          style={styles.pickup}
        />
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
    flex:1,
    resizeMode:"contain",

  },
});
