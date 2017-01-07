import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomTab from '../common/bottomTab';
import Video from '../Video/video';
import Mine from '../Mine/mine';
import Record from '../Record/record';
import getRouteIndex from '../common/getRouteIndex';
import VideoPlayer from 'react-native-video';
var config = require('../common/config');
var request = require('../common/request');
var Dimensions = require('Dimensions');
var {width, height}=Dimensions.get('window');
export default class Picture extends Component {
  constructor(props) {
    super(props);
    //创建数据源
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      barArr: [
        {iconName: 'ios-videocam', tabName: '视频', iconSize: '30'},
        {iconName: 'ios-recording', tabName: '录制', iconSize: '30'},
        {iconName: 'ios-aperture', tabName: '图片', iconSize: '30'},
        {iconName: 'ios-contact', tabName: '我的', iconSize: '30'}
      ]
    };
    this.renderSingleRow = this.renderSingleRow.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.fetchList = this.fetchList.bind(this);
  }

  componentWillMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows([
        {id: 1, qiniu_thumb: 'http://v1.qzone.cc/skin/201603/30/20/02/56fbc04e2c068752.jpg%21600x600.jpg'},
        {id: 2, qiniu_thumb: 'http://v1.qzone.cc/skin/201603/30/20/02/56fbc04e2c068752.jpg%21600x600.jpg'},
        {id: 3, qiniu_thumb: 'http://v1.qzone.cc/skin/201603/30/20/02/56fbc04e2c068752.jpg%21600x600.jpg'},
        {id: 4, qiniu_thumb: 'http://v1.qzone.cc/skin/201603/30/20/02/56fbc04e2c068752.jpg%21600x600.jpg'}
      ])
    });
    this.fetchList();
  }

  fetchList() {
    var that = this;
    request.get(config.api.videoList, {
      pageNo: 1,
      pageSize: 10
    }).then((res)=> {
      console.log(res);
      if (res && res.code == 200 && res.data.length > 0) {
        that.setState({
          dataSource: that.state.dataSource.cloneWithRows(res.data)
        })
      }

    }).catch((err)=> {
      alert('请求视频列表报错')
    })
  }

  handleTabChange(index) {
    let {navigator}=this.props;
    if (navigator) {
      var routeStacks = navigator.getCurrentRoutes()
    }
    if (index == 0) {
      if (navigator) {
        var routeIndex = getRouteIndex.getRouteIndex('Video', routeStacks);
        if (routeIndex != 'no') {
          navigator.jumpTo(navigator.getCurrentRoutes()[routeIndex])
        } else {
          navigator.push({
            name: 'Video',
            component: Video
          })
        }
      }
    } else if (index == 1) {
      var routeIndex = getRouteIndex.getRouteIndex('Record', routeStacks);
      if (routeIndex != 'no') {
        navigator.jumpTo(navigator.getCurrentRoutes()[routeIndex])
      } else {
        navigator.push({
          name: 'Record',
          component: Record
        })
      }
    } else if (index == 3) {
      var routeIndex = getRouteIndex.getRouteIndex('Mine', routeStacks);
      if (routeIndex != 'no') {
        navigator.jumpTo(navigator.getCurrentRoutes()[routeIndex])
      } else {
        navigator.push({
          name: 'Mine',
          component: Mine
        })
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          玩家分享
        </Text>
        <ListView
          style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={this.renderSingleRow}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          enableEmptySections={true}
        />
        {/*/!**/}
        <View style={styles.addBtn}>
          <TouchableOpacity activeOpacity={0.8}>
            <Icon
              name="ios-add"
              size={30}
              color='#fff'
            />
          </TouchableOpacity>
        </View>
        {/**!/*/}
        <BottomTab
          barArr={this.state.barArr}
          tabHeight={50}
          iconSize={25}
          tabIndex={2}
          changeTab={(i)=>this.handleTabChange(i)}
        />
      </View>
    );
  }

  renderSingleRow(rowData) {
    return (
      <View style={{marginBottom: 5, height: 220, width: width, backgroundColor: '#000'}} key={rowData.id}>
        <Image
          source={{uri: rowData.qiniu_thumb}}
          style={styles.img}
        />
        <Icon
          name='ios-play'
          size={40}
          style={styles.play}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  videoPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: 220,
    width: width,
  },
  play: {
    position: 'absolute',
    height: 50,
    width: 50,
    top: 80,
    left: width / 2 - 25,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    color: '#fff',
    paddingLeft: 18,
    paddingTop: 5
  },
  listView: {
    height: height - 120,
    width: width
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    height: 30,
    alignItems: 'center',
    color: '#4a8bfc'
  },
  img: {
    width: width,
    height: 220,
    resizeMode: 'cover'
  },
  addBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#2990FF',
    height: 40,
    width: width - 40,
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center'
  },
});