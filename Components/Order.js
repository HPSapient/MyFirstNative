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
        <Text style={styles.ordNum}>Thank you! Your Order Number is
          <Text style={{fontWeight: 'bold'}} fontSize={220}> 1738</Text>
        </Text>
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
    alignItems: 'flex-start',
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
});
