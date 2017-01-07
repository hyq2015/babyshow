/**
 * Created by admin on 2016/12/8.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import Login from '../login/login';
import App from '../../App';
import Swiper from 'react-native-swiper' ;
let Dimensions = require('Dimensions');
let ImagePicker = require('react-native-image-picker');
let {width, height}=Dimensions.get('window');
let uuid = require('uuid');
export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.enterPage=this.enterPage.bind(this);
  }
  enterPage(){
    let {navigator}=this.props;
    if(navigator){
      navigator.push({
        name:'app',
        component:App
      })
    }
  }
  render() {
    return (
      <Swiper style={styles.wrapper} showsButtons={false} loop={false}>
        <View style={styles.slide1}>
          <Image
            source={{uri:'dog1'}}
            style={styles.dog1}
          />
          <Text style={[styles.text,{width:width-120}]}>给狗狗拍一个短视频</Text>
        </View>
        <View style={styles.slide2}>
          <Image
            source={{uri:'dog'}}
            style={styles.dog}
          />
          <Text style={[styles.text,{width:width-80}]}>给狗狗录音</Text>
        </View>
        <View style={styles.slide3}>
          <Image
            source={{uri:'dog2'}}
            style={styles.dog2}
          />
          <Text style={[styles.text]}>发布狗狗秀</Text>
          <Text style={styles.login} onPress={this.enterPage}>立即体验</Text>
        </View>
      </Swiper>
    );
  }


}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    flexDirection: 'column'
  },
  login:{
    width:200,padding:15,
    borderWidth:1,
    borderColor:'#1296db',
    borderRadius:10,
    textAlign:'center',
    color:'#1296db',
    position:'absolute',
    bottom:100,
    left:width/2-100
  },
  wrapper:{

  },
  text:{
    color:'#1296db',fontSize:20,marginTop:20,height:40,width:width-20,textAlign:'center',
    borderBottomColor:'#1296db',
    borderBottomWidth:1,
  },
  dog1:{
    width:128,
    height:128
  },
  dog:{
    width:128,
    height:128
  },
  dog2:{
    width:180,
    height:128
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});