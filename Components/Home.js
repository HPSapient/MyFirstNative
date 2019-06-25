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
// ************          Data   *************************
// ************************************************************
let groceryList = [
  "Cheese Burger",
  "French Fries",
  "Coke",
]

let token = ""


// ************************************************************
// ************          Main Class   *************************
// ************************************************************

export default class Home extends React.Component {

  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };


  createElementsFromList(list) {
    return(
      list.map(
        (listElement, i) =>
          <View key={i}>
            <Text style={styles.groceryItem}>{listElement}</Text>
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





  // ************************************************************
  // ************          Rendering   *************************
  // ************************************************************
  async componentDidMount(){
    await this.registerForPushNotificationsAsync();

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
            <Text style={styles.h}>Welcome Back! Would you like your usual?</Text>
          </View>

          <View style={styles.container}>
            <Image
              source={require('../assets/food.png')}
              style={styles.foodImg}
            />
            {this.createElementsFromList(groceryList)}
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
              onPress={()=> this.sendPushNotification()}
              //onPress={() => navigate('HomeScreen')}
              underlayColor='#fff'>
              <Text style={styles.aText}>Edit Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.aButton}
              //onPress={() => navigate('HomeScreen')}
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
