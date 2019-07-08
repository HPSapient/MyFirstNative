import React from 'react';
import{
  Image,
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

export default class Main extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };

  render(){
    return(
      <View style={styles.container}>
        <Image
          source={require('../assets/main.png')}
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
    // borderColor: 'red',
    // borderWidth: 3,

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
    //flex: 1,
    resizeMode: 'stretch',
    width: '100%',
    height: '100%',

  },
});
