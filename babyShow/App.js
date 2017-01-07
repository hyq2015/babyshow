/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  AsyncStorage,
} from 'react-native';
import Login from './Component/login/login';
import Video from './Component/Video/video';
import StatusBarR from './Component/common/statusBar';
var Dimensions = require('Dimensions');
var {width, height}=Dimensions.get('window');
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSigned: 2,
      statusBar:null
    };
    this.handleChangeNav=this.handleChangeNav.bind(this);
  }

  componentWillMount() {
    var that = this;
    AsyncStorage.getItem("loginPhone").then((res)=> {
      if (res) {
        that.setState({
          isSigned: 1
        })
      } else {
        that.setState({
          isSigned: 0
        })
      }
    }).catch((err)=> {
      console.log(err)
    });
  }
  handleChangeNav(targetRoute){
    // let statusBarColor='';
    // if(targetRoute.name.toUpperCase()=='VIDEO'){
    //   statusBarColor="#d43d37";
    // }else if(targetRoute.name.toUpperCase()=='MINE'){
    //   statusBarColor="rgba(100,193,52,0.8)";
    // }else{
    //   statusBarColor="#fff";
    // }
    // this.setState({
    //   statusBar:<StatusBarR
    //     backColor={statusBarColor}
    //   />
    // })
  }
  render() {
    // alert(this.state.isSigned);
    if (this.state.isSigned == 1) {
      return (
        <Navigator
          tabLabel="ReactNative"
          initialRoute={{name: 'Video', component: Video,statusBarHidden: true}}
          configureScene={
            (route)=> {
              //页面之间的跳转动画
              if(route.name!='detail'){
                return Navigator.SceneConfigs.FadeAndroid;
              }else{
                return Navigator.SceneConfigs.PushFromRight;
              }
            }
          }
          onWillFocus={this.handleChangeNav}
          renderScene={(route, navigator) => {
            let Component = route.component;
            return (<View style={{flex:1}}>
              {/*{this.state.statusBar}*/}
              <Component {...route.params} navigator={navigator}/>
            </View>)
          }
          }
        />
      )
    } else if (this.state.isSigned == 0) {
      return (
        <Navigator
          tabLabel="ReactNative"
          initialRoute={{name: 'Login', component: Login}}
          configureScene={
            (route)=> {
              //页面之间的跳转动画
              return Navigator.SceneConfigs.FadeAndroid;
              {/*return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight*/
              }
              {/*return Navigator.SceneConfigs.PushFromRight;*/
              }
            }
          }
          renderScene={(route, navigator) => {
            let Component = route.component;
            return (
              <Component {...route.params} navigator={navigator}/>
            )
          }
          }
        />
      )
    } else {
      return (
        <View
          style={{flex: 1, backgroundColor: 'rgba(100,193,52,0.8)', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: '#fff'}}>正在获取用户登录信息,请稍后...</Text>
        </View>
      )
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f00',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  loadingMore: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

