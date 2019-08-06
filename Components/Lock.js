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
  StatusBar,
  Animated,
  } from 'react-native';
  import { Notifications } from 'expo';
  import * as Permissions from 'expo-permissions';

  import Sliders from "react-native-slider";

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
      user: 1,
      dataSource:[],
      fadeValue: new Animated.Value(0),

    };

    _start = () => {
      Animated.spring(this.state.fadeValue, {
        toValue: 1,
      }).start();
    }
    _reverse = () => {
      Animated.spring(this.state.fadeValue, {
        toValue: 0,
      }).start();
    }


    // ************************************************************
    // ************          Class functions   *******************
    // ************************************************************

  spoofFence() {
    this.setState({
      inFenceSpoof: !this.state.inFenceSpoof,
    });

  }

  switchUser() {
    this.setState({
      user: this.state.user != 11 ? this.state.user + 1 : 1
    }
    , () => {
      var start = {
        latitude: this.state.latitude,
        longitude: this.state.longitude
      };
      this.getByProximity(start);
    });

  }

  setUser(number){
    if((number % 1) == 0){
      this.setState({
        user: number
      }
      , () => {
        var start = {
          latitude: this.state.latitude,
          longitude: this.state.longitude
        };
        this.getByProximity(start);
      });
    }

  }

  getByProximity(startPoint) {
      var maxDistanceInKM = 0.15;

      // results is an array of points that are within the maxDistanceInKM
      var result = Geofence.filterByProximity(startPoint, this.state.dataSource, maxDistanceInKM); // use points, maxDistanceInKM); for testing
      //console.log('results[0]');
      //console.log(result[0]);

      // API call to see if there are any recommended meals in the results
      if (result.length > 0){
        var items =[];
        var name;
        var photo_catogory = 'none';
        //set a variable to be the first element of results, then use it for the call (hardcoded location for demo, real func in post-comment)
        fetch("https://x9gctr0aac.execute-api.us-east-1.amazonaws.com/dev/api/favmeal/meal/?uid=" + this.state.user + "&gps=1" + "&lat=" + result[0].latitude + "&lng=" + result[0].longitude)
          .then(response => response.json())
          .then((responseJson)=> {
            console.log('\nResponse from location call');
            console.log(responseJson);
            if (responseJson['data']['meal']){
              items = Object.keys(responseJson['data']['meal']['contents']);
              name = responseJson['data']['meal']['loc_name'];
              photo_catogory = responseJson['data']['meal']['photo_catogory'];

              //Store the found meal, if none store a blank array
              AsyncStorage.setItem('fenceName', name);
              AsyncStorage.setItem('photo_catogory', photo_catogory);

            }
            else{
              name="no location"
              AsyncStorage.setItem('fenceName', name);
              AsyncStorage.setItem('photo_catogory', 'none');
            }
            AsyncStorage.setItem('fence', JSON.stringify(items));
            console.log('Storing');
            console.log(name);
            console.log(items);


            console.log('photo category');
            console.log(photo_catogory);



            // console.log('items');
            // console.log(items);
            // console.log('items length');
            // console.log(items.length);



            // if rec exists for the fence were in
            if (items.length > 0){
              console.log('Fence Active.');
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
            console.log('\n\n');


          })
          .catch(error=>console.log(error))
      }


  }

  // ************************************************************
  // ************          Mounting   *************************
  // ************************************************************

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
          console.log('Current position:');
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
          console.log('\n');
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
          console.log('Current position');
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
          console.log('\n');
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
      fetch("https://x9gctr0aac.execute-api.us-east-1.amazonaws.com/dev/api/locations/")
        .then(response => response.json())
        .then((responseJson)=> {
          //console.log('\nLocation JSON');
          //console.log(responseJson);
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
          console.log('All Fences -- ');
          console.log(this.state.dataSource);
        })
        .catch(error=>console.log(error)) //to catch the errors if any

    }

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchId);
    }

    componentDidUpdate(){
      if(this.state.inFence || this.state.inFenceSpoof){
        this._start();
      }
      else{
        this._reverse();
      }
    }



  // ************************************************************
  // ************          Render   *************************
  // ************************************************************
  render(){
    //conditionals renders
    const inFence = this.state.inFence;
    const inFenceSpoof = this.state.inFenceSpoof;

    let notification;

    if (inFence || inFenceSpoof) {
      notification =
        <Animated.View
          style={{
            opacity: this.state.fadeValue
          }}
        >
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
          </TouchableOpacity>
        </Animated.View>;
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
            <Sliders
              style={styles.slider}
              thumbStyle={styles.sliderThumb}
              minimumValue={1}
              maximumValue={11}
              step={1}
              value={this.state.user}
              onValueChange={value => this.setUser(value)}
            />
            <TouchableOpacity
              style={styles.switchUser}
              onPress={() => this.switchUser()}
              underlayColor='#fff'>
              <Text style={styles.spoofText}>User: {this.state.user}</Text>
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
    marginBottom: hp('40%'),
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
  slider:{
    width:wp('90%'),
  },
  sliderThumb:{
    backgroundColor:'red',
  },
});
