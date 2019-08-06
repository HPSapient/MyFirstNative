import React from 'react';
import{
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  StatusBar,
  Animated,
} from 'react-native';
import { Notifications, Location, TaskManager } from 'expo';
import * as Permissions from 'expo-permissions';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import LogoTitle from './Header'

import Swipeable from 'react-native-swipeable-row';


// ************************************************************
// ************          Data   *************************
// ************************************************************
let theUsual = [
  "Bacon Cheeseburger",
  "Medium French Fries",
  "Medium Coke",
]

let userNames = [
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
      user: userNames[1],
      items: [],
      locName:"no location",
      photo_catogory:"none",
      prices:[],
      total:0,
      marginValue: new Animated.Value(hp('5%')),
      isSwiping: true,
    };

    _start = () => {
      Animated.spring(this.state.marginValue, {
        toValue: 0,
      }).start();
    }

  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };

  // ************************************************************
  // ************        Class FUnctions   *************************
  // ************************************************************

  generatePrices(){
    if(this.state.items != null){
      console.log('items.length');
      console.log(this.state.items.length);
      var prices = [];

      for (i=0;i<this.state.items.length;i++){
        prices.push((Math.random() * 10).toFixed(2));
      }
      console.log('prices');
      console.log(prices);
      this.setState({
        prices: prices,
        total: (prices.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)).toFixed(2),
      })
    }

  }

  createElementsFromList(list) {
    if(list !=null){
      let rightButtons = [
        <TouchableOpacity style={styles.swipeButton} onPress={this.removeItem()}>
          <Text style={styles.swipeText}>remove</Text>
        </TouchableOpacity>,
      ];

      return(
        list.map(
          (listElement, i) =>
            <Swipeable key={i} style={styles.swipe} rightButtons={rightButtons} onSwipeStart={() => this.setState({isSwiping: true})}
              onSwipeRelease={() => this.setState({isSwiping: false})}>
              <View style={styles.containerHorizontalBetween}>
                <Text style={styles.meal} adjustsFontSizeToFit={true}>{listElement}</Text>
                <Text style={styles.price} >${this.state.prices[i]}</Text>
              </View>
            </Swipeable>
        )
      )
    }

  }

  removeItem() {
    console.log('pressed')
    // let filteredArray = this.state.items.filter(item => item !== "Large Chocolate Milk")
    // this.setState({items: filteredArray});
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


    //replace by storing meal locally on lock
    console.log('retrieving');
    await AsyncStorage.getItem('fence').then((value) =>
      this.setState({
        items:JSON.parse(value),
      }),
    );
    this.generatePrices();

    AsyncStorage.getItem('fenceName').then((value) =>
      this.setState({
        locName:value
      })
    );

    AsyncStorage.getItem('photo_catogory').then((value) =>
      this.setState({
        photo_catogory:value
      })
    );

    this.generatePrices();

  }

  componentDidUpdate(){
    this._start();
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




  render(){


    let image;
    image =
      <Image
        source={require('../assets/arch.png')}
        style={styles.foodImg}
      />

    if(this.state.photo_catogory == "F"){
      image =
        <Image
          source={require('../assets/food.png')}
          style={styles.foodImg}
        />
    } else if (this.state.photo_catogory == "D"){
      image =
        <Image
          source={require('../assets/drink.png')}
          style={styles.foodImg}
        />
    } else if (this.state.photo_catogory == "FD" || this.state.photo_catogory == "DF"){
      image =
        <Image
          source={require('../assets/meal.png')}
          style={styles.foodImg}
        />
    } else {
      image = <View style={styles.foodImg}/>
        // <Image
        //   source={require('../assets/arch.png')}
        //   style={styles.foodImg}
        // />
    }

    return (
        <View style={styles.container}>
          <View>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.welcomeTop}>Welcome back to {this.state.locName}</Text>
            <Text style={styles.welcomeBottom}>Would you like your usual?</Text>
          </View>

          <View style={styles.containerBetween}>
            {image}
            <Animated.ScrollView scrollEnabled={this.state.isSwiping} style={{width: wp('100%'), flex: 1, marginTop: this.state.marginValue}}>
              {this.createElementsFromList(this.state.items)}
              <View style={styles.totalContainer}>
                <Text style={styles.total} >Total:</Text>
                <Text style={styles.total} >${this.state.total}</Text>
              </View>
            </Animated.ScrollView>

          </View>

          <View style={styles.containerSmall}>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={
                () => this.props.navigation.navigate( 'Order' )
              }
              //onPress={() => navigate('HomeScreen')}
              >
              <Text style={styles.orderText}>ORDER</Text>
            </TouchableOpacity>

            <View style={styles.containerHorizontal}>
              <TouchableOpacity
                style={styles.aButton}
                //onPress={()=> this.sendPushNotification()}
                onPress={
                  () => this.props.navigation.navigate( 'Edit' )
                  //() => this.switchUser()
                }
                >
                <Text style={styles.aText}>Edit Order</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.aButton}
                onPress={
                  () => this.props.navigation.navigate( 'Main' )
                }
                >
                <Text style={styles.aText}>New Order</Text>
              </TouchableOpacity>
            </View>
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
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerTop: {
    flex: 1,
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    //marginTop: hp('0.5%')
  },
  containerBetween: {
    flex: 1,
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerHorizontalBetween: {
    //flex: 1,
    flexDirection: 'row',
    //backgroundColor: 'grey',
    justifyContent: 'flex-end',
    width: wp('94.5%'),
    marginTop: hp('1.5%'),
    marginLeft: wp('5.5%'),
    //marginRight: hp('1.5%'),
    // borderColor: 'red',
    // borderWidth: 3,
    borderBottomColor: 'grey',
    paddingBottom: hp('1%'),

    borderBottomWidth: 0.25,

  },
  containerHorizontal: {
    //flex: 1,
    flexDirection: 'row',
    //backgroundColor: '#fff',
    //alignItems: 'flex-end',
    justifyContent: 'center',
    width: wp('100%'),
    // borderColor: 'red',
    // borderWidth: 3,

  },
  containerSmall: {
    flex: 0.35,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  theUsualTextStyle:{
    textAlign: 'center',
    paddingBottom: hp('2%'),
    paddingLeft: hp('3%'),
    paddingRight: hp('3%'),
    width: 0,
    flexGrow: 1,
    flex: 1,
    fontSize: hp('3%'),
    fontFamily: 'HelveticaNeue',// sans-serif,
    borderColor: 'black',
    //borderWidth: 0.2,
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
  welcomeTop:{
    fontWeight: '200',
    fontSize: hp('2.5%'),
    fontFamily: 'HelveticaNeue-UltraLight',// sans-serif,
    //backgroundColor: "grey",
    marginTop: hp('1.5%'),
    marginLeft: wp('4%'),
    marginRight: wp('4%'),
    textAlign: 'center',

  },
  welcomeBottom:{
    fontSize: hp('2.7%'),
    marginTop: hp('0.8%'),
    fontFamily: 'HelveticaNeue-UltraLight',// sans-serif,
    //backgroundColor: "grey",
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
    flex: 1,
    height: hp('27%'),
    width: wp('100%'),
    marginTop: hp('0.8%'),
    //marginBottom: hp('2.2%'),
    resizeMode: 'contain',


    //marginBottom: hp('0.2%'),
    //backgroundColor: "blue",

  },
  orderButton:{
    //marginTop:hp('1.5%'),
    paddingTop:hp('2%'),
    paddingLeft:wp('27%'),
    paddingRight:wp('27%'),
    paddingBottom:hp('2%'),
    backgroundColor:'#ffc300',
    borderRadius:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,

  },
  orderText:{
      color:'#fff',
      textAlign:'center',
      color:'white',
      fontWeight: '900',
      fontSize: hp('4.1%'),
      letterSpacing: wp('2%'),

  },
  aButton:{
    marginTop:hp('2.3'),
    marginLeft: wp('1.5%'),
    marginRight:wp('1.5%'),
    paddingTop: hp('0.5%'),
    paddingBottom: hp('0.5%'),
    paddingLeft: wp('9%'),
    paddingRight: wp('9%'),
    borderColor:'#ffc300',
    borderWidth: 2,
    borderRadius:10,
  },
  aText:{
      color:'#ffc300',
      textAlign:'center',
      fontSize:hp('2.5%'),
      fontWeight: '600',
      //textDecorationLine: 'underline',
  },
  meal:{
    flex: 0.7,
    fontSize: hp('2.3%'),
    fontFamily: 'System',// sans-serif,
    textAlign: 'left',
    fontWeight: '900',
    alignSelf: 'center',
    // backgroundColor: "grey",
    // borderColor: 'black',
    // borderWidth: 1,

    //marginLeft: wp('6%'),
  },
  price:{
    flex: 0.3,
    fontSize: hp('2.3%'),
    fontFamily: 'System',// sans-serif,
    textAlign: 'right',
    alignSelf: 'center',
    fontWeight:'400',

    //backgroundColor: "red",
    marginRight: wp('6%')
  },
  total:{
    //flex: 0.3,
    fontSize: hp('2.3%'),
    fontFamily: 'HelveticaNeue',// sans-serif,
    //marginLeft: wp('6%'),
    marginRight: wp('6%'),
    fontWeight: '400',
    //marginRight: wp('6%')
  },
  totalContainer: {
    //flex: 1,
    flexDirection: 'row',
    //backgroundColor: 'grey',
    justifyContent: 'space-between',
    width: wp('94.5%'),
    marginLeft: wp('5.5%'),
    marginTop: hp('3%'),

  },
  swipe:{

  },
  swipeButton:{
    backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',

  },
  swipeText:{
    position: 'relative',
    color: 'white',
    fontWeight: '700',
    marginLeft: wp('3.4%'),

  },
});
