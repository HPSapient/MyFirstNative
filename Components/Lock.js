import React from 'react';
import{
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  AsyncStorage,
  StatusBar } from 'react-native';
  import { Notifications } from 'expo';
  import * as Permissions from 'expo-permissions';

  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

  import Geofence from 'react-native-expo-geofence';

  import LogoTitle from './Header'

  //list of geofences
  let points = [
    //McDonalds
    { latitude: 41.884630, longitude: -87.628950},

    //Sapient
    { latitude: 41.886908563672634, longitude: -87.62846003453808},
    { latitude: 41.88718464091348, longitude:  -87.62842929529477 },
  ]

// ************************************************************
// ************          Main Class   *************************
// ************************************************************

export default class Lock extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
      latitude: null,
      longitude: null,
      error: null,
      inFence: false,
      inFenceSpoof: false,
      user: 10, // make this a call to database to get curr user. SuperUser: 10 has southwest buttermilk everywhere
      dataSource:[],

    };

  spoofFence() {
    this.setState({
      inFenceSpoof: !this.state.inFenceSpoof,
    });

  }

  switchUser() {
    this.setState({
      user: this.state.user != 10 ? this.state.user + 1 : 1
    }
    , () => {
      var start = {
        latitude: this.state.latitude,
        longitude: this.state.longitude
      };
      this.getByProximity(start);
    });

  }



  getByProximity(startPoint) {
      var maxDistanceInKM = 0.15;

      // results is an array of points that are within the maxDistanceInKM
      var result = Geofence.filterByProximity(startPoint, this.state.dataSource, maxDistanceInKM); // use points, maxDistanceInKM); for testing

      // API call to see if there are any recommended meals in the results
      if (result.length > 0){
        var items =[];
        //set a variable to be the first element of results, then use it for the call
        fetch("https://t9litrciwd.execute-api.us-east-1.amazonaws.com/dev/api/favmeal/meal/?uid=" + this.state.user + "&gps=0&loc_id=3") // hardcoding location for testing (3 and 4 have res), switch to current location
          .then(response => response.json())
          .then((responseJson)=> {
            //console.log('\nResponse from location call');
            //console.log(responseJson);
            if (responseJson['data']['meal']){
              items = Object.keys(responseJson['data']['meal']['contents']);
            }


            console.log('items');
            console.log(items);
            // console.log('items length');
            // console.log(items.length);

            //Store the found meal, if none store a blank array
            AsyncStorage.setItem('fence', JSON.stringify(items));
            console.log('Storing');
            console.log(items);

            // if rec exists for the fence were in
            if (items.length > 0){
              console.log('Fence Triggered.');
              var distance = result[0].distanceInKM;
              console.log('Distance:');
              console.log(distance);
              this.setState({
                inFence: true,
              });
              this.render()
            }
            else{
              this.setState({
                inFence: false
              });
              this.render()
            }
            console.log('result length:');
            console.log(result.length);


          })
          .catch(error=>console.log(error))
      }


  }



    componentDidMount() {
      //set initial position, check for fence
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
          console.log('\n\n');
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
          var start = {
            latitude: this.state.latitude,
            longitude: this.state.longitude
          };
          this.getByProximity(start);
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 1 },
      );

      //update location on move, check for fence
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
          console.log('\n\n');
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
          var start = {
            latitude: this.state.latitude,
            longitude: this.state.longitude
          };
          this.getByProximity(start);
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 1 },
      );

      //pull all fences from api
      fetch("https://t9litrciwd.execute-api.us-east-1.amazonaws.com/dev/api/locations/")
        .then(response => response.json())
        .then((responseJson)=> {
          //console.log('\n!!!');
          //console.log(responseJson['data'][0]['lat']);
          var locs = []
          for (var i = 0; i < responseJson['data'].length; i++){
            //console.log(responseJson['data'][i]['lat'], responseJson['data'][i]['lng']);
            //console.log('\n');
            locs.push({latitude: responseJson['data'][i]['lat'], longitude: responseJson['data'][i]['lng']});
          }
          // console.log('locs');
          // console.log(locs);
          this.setState({
            dataSource: locs,
          })
           console.log('datasource -- ');
           console.log(this.state.dataSource);
        })
        .catch(error=>console.log(error)) //to catch the errors if any

    }

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchId);
    }

  // notification() {
  //   if(self.state.inFence == true)
  //   {
  //     return(
  //
  //     )
  //   }
  //   else{
  //     return(
        // <Image
        //   source={require('../assets/lock.png')}
        //   style={styles.pickup}
        // />
  //     )
  //   }
  // }
  render(){
    //conditionals renders
    const inFence = this.state.inFence;
    const inFenceSpoof = this.state.inFenceSpoof;

    // notification
    let notification;

    if (inFence || inFenceSpoof) { // add user condition here
      notification =
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={
            () => this.props.navigation.navigate( 'Home' )
          }
          //onPress={() => navigate('HomeScreen')}
          underlayColor='#fff'>
          <ImageBackground
            source={require('../assets/notification.png')}
            style={styles.note}
          >
            <View style={styles.containerVerticalTopLeft}>
              <View style={styles.containerHorizontal}>
                <Image
                  source={require('../assets/arch.png')}
                  style={{ width: 25, height: 25, marginLeft: 12, marginTop: 2, }}
                />
                <Text style={styles.noteTopText}>McDonalds</Text>
              </View>
              <Text style={styles.noteMiddleText}>Welcome Back!</Text>
              <Text style={styles.noteBottomText}>Would you like the usual?</Text>
            </View>


          </ImageBackground>
        </TouchableOpacity>;
    } else {
      notification = <View/>
    }


    //spoof button
    let spoofButton;

    if (inFenceSpoof) {
      spoofButton =
        <TouchableOpacity
          style={styles.spoofButtonOn}
          onPress={() => this.spoofFence()}
          //onPress={() => navigate('HomeScreen')}
          underlayColor='#fff'>
          <Text style={styles.spoofText}>Spoof Fence</Text>
        </TouchableOpacity>;
    } else {
      spoofButton =
        <TouchableOpacity
          style={styles.spoofButtonOff}
          onPress={() => this.spoofFence()}
          //onPress={() => navigate('HomeScreen')}
          underlayColor='#fff'>
          <Text style={styles.spoofText}>Spoof Fence</Text>
        </TouchableOpacity>;
    }

    // renders this
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/lock.png')}
          resizeMode= 'stretch'
          style={styles.lockBack}
        >
          <View style={styles.container}>
            {notification}
            <TouchableOpacity
              style={styles.switchUser}
              onPress={() => this.switchUser()}
              underlayColor='#fff'>
              <Text style={styles.spoofText}>{this.state.user}</Text>
            </TouchableOpacity>
            {spoofButton}
          </View>
        </ImageBackground>
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
    justifyContent: 'flex-end',
    // borderColor: 'red',
    // borderWidth: 3,

  },
  containerVerticalTopLeft: {
    flex: 1,
    //backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // borderColor: 'red',
    // borderWidth: 3,

  },
  containerHorizontal: {
    //flex: 1,
    flexDirection: 'row',
    //backgroundColor: '#fff',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    // borderColor: 'red',
    // borderWidth: 3,

  },
  lockBack:{
    // flex: 1,
    // alignSelf: 'stretch',
    // width: undefined,
    // height: undefined,
    height: hp('100%'),
    width: wp('100%'),
    alignItems: 'center',
    //resizeMode: 'stretch',
    justifyContent: 'flex-start',
  },
  notificationButton:{
    marginBottom: hp('45%'),
    // paddingTop:20,
    // paddingLeft:90,
    // paddingRight:90,
    // paddingBottom:25,
    //backgroundColor:'white',
    borderRadius:10,
    //opacity: 0.8,
    overflow: 'hidden',
  },
  spoofText:{
      color:'#fff',
      textAlign:'center',
      paddingLeft : wp('2%'),
      paddingRight : wp('2%'),
      color:'black',
      fontSize: hp('3%'),

  },
  noteTopText:{
      marginLeft: wp('2%'),
      color:'#fff',
      textAlign:'center',
      color:'black',
      fontSize: hp('1.8%'),
      fontFamily: 'HelveticaNeue-Light',

  },
  noteMiddleText:{
      marginTop: hp('1%'),
      marginLeft: wp('3%'),
      color:'#fff',
      textAlign:'center',
      color:'black',
      fontSize: hp('2%'),
      fontFamily: 'HelveticaNeue-Bold',

  },
  noteBottomText:{
      marginLeft: wp('3%'),
      color:'#fff',
      textAlign:'center',
      color:'black',
      fontSize: hp('2%'),
      fontFamily: 'HelveticaNeue-Light',

  },
  spoofButtonOff:{
    marginBottom: hp('7.35%'),
    backgroundColor:'white',
    borderRadius:100,
    opacity: 0.65,
  },
  spoofButtonOn:{
    marginBottom: hp('7.35%'),
    backgroundColor:'green',
    borderRadius:100,
    opacity: 0.65,
  },
  switchUser:{
    marginBottom: hp('0.8%'),
    backgroundColor:'white',
    borderRadius:100,
    opacity: 0.65,
  },
  note:{
    height: 80,
    width: wp('93%'),
    resizeMode: 'stretch',
  },
});
