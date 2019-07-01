import React from 'react';
import{
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  StatusBar } from 'react-native';
  import { Notifications, Location, TaskManager } from 'expo';
  import * as Permissions from 'expo-permissions';

  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

  import LogoTitle from './Header'


// ************************************************************
// ************          Data   *************************
// ************************************************************
let theUsual = [
  "Bacon Cheeseburger",
  "Medium French Fries",
  "Medium Coke",
]

let users = [
  "Sam",
  "Tom",
  "Ned",
]

let token = ""


// ************************************************************
// ************          Main Class   *************************
// ************************************************************

export default class Home extends React.Component {

  state = {
      user: 'Sam', // make this a call to database to get curr user
    };

  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };

  createElementsFromList(list) {
    return(
      list.map(
        (listElement, i) =>
          <View key={i} style={styles.container}>
            <Text style={styles.theUsualTextStyle}>{listElement}</Text>
          </View>
      )
    )
  }

  // ************************************************************
  // ************          Launching   *************************
  // ************************************************************

  registerForPushNotificationsAsync = async() => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    token = await Notifications.getExpoPushTokenAsync();

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    console.log(token);


    }

  registerForLocationsAsync = async() => {

    let permit = await Permissions.askAsync(Permissions.LOCATION);
    //alert(JSON.stringify(permit));

    console.log("I got location permission");

  }





  // ************************************************************
  // ************          Rendering   *************************
  // ************************************************************
  async componentDidMount(){
    await this.registerForPushNotificationsAsync();
    await this.registerForLocationsAsync();

  }

  sendPushNotification = () => {
    let response = fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: token,
        sound: 'default',
        title: 'Welcome Back',
        body: 'The usual?'
      })
    });
  };

//Dep: pre nav header
  // <View style={styles.header}>
  //   <Image
  //     source={require('../assets/arch.png')}
  //     style={styles.logo}
  //   />
  // </View>


  render(){


    return (
        <View style={styles.container}>
          <View>
            <Text style={styles.h}>Welcome back {this.state.user}! {'\n'}Would you like your usual?</Text>
          </View>

          <View style={styles.container}>
            <Image
              source={require('../assets/food.png')}
              style={styles.foodImg}
            />
            {this.createElementsFromList(theUsual)}
          </View>

          <View style={styles.container}>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={
                () => this.props.navigation.navigate( 'Order' )
              }
              //onPress={() => navigate('HomeScreen')}
              underlayColor='#fff'>
              <Text style={styles.orderText}>Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.aButton}
              //onPress={()=> this.sendPushNotification()}
              onPress={
                () => this.props.navigation.navigate( 'Edit' )
                //() => this.switchUser()
              }
              underlayColor='#fff'>
              <Text style={styles.aText}>Edit Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.aButton}
              onPress={
                () => this.props.navigation.navigate( 'Main' )
              }
              underlayColor='#fff'>
              <Text style={styles.aText}>New Order</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
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
    justifyContent: 'flex-start',
  },
  theUsualTextStyle:{
    textAlign: 'center',
    fontSize: hp('3%'),
    flex: 1,
    fontFamily: 'HelveticaNeue',// sans-serif,
    //borderColor: 'black',
    //borderWidth: 1,
    //backgroundColor: "grey",
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
    fontSize: hp('2.5%'),
    fontFamily: 'HelveticaNeue-UltraLight',// sans-serif,
    //backgroundColor: "grey",
    marginTop: hp('2%'),
    textAlign: 'center',
  },
  logo:{
    height: hp('2%'),
    width: wp('2%'),
    marginTop: hp('2%'),
    marginBottom: hp('0.5%'),
    //backgroundColor: "blue",
  },
  foodImg:{
    height: hp('28%'),
    width: hp('28%'),
    marginTop: hp('1%'),
    //marginBottom: hp('0.2%'),
    //backgroundColor: "blue",

  },
  orderButton:{
    marginTop:hp('1.5%'),
    paddingTop:hp('4%'),
    paddingLeft:wp('33%'),
    paddingRight:wp('33%'),
    paddingBottom:hp('4%'),
    backgroundColor:'#ffc300',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  orderText:{
      color:'#fff',
      textAlign:'center',
      color:'black',
      fontSize: hp('4.1%'),

  },
  aButton:{
    marginTop:hp('5%'),
  },
  aText:{
      color:'#fff',
      textAlign:'center',
      color:'black',
      fontSize:hp('2.5%'),
      textDecorationLine: 'underline',
  },
});
