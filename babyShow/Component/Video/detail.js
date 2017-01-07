/**
 * Created by admin on 2016/11/19.
 */
/**
 * Created by admin on 2016/11/19.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  AsyncStorage,
  StatusBar
} from 'react-native';
import config from '../common/config';
import request from '../common/request';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
var Dimensions = require('Dimensions');
var Orientation = require('react-native-orientation');
var {width, height}=Dimensions.get('window');
var allItems = {
  items: [],
  pageNo: 1,
  totalPage: 0
};
export default class VideoDetail extends Component {
  constructor(props) {
    super(props);
    //创建数据源
    this.state = {
      up: this.props.up,
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'cover',
      duration: this.props.video.duration,
      currentTime: 0.0,
      isLoaded: false,
      videoEnd: false,
      playing: true,
      paused: false,
      videoError: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      totalComment: 0,
      videoData: this.props.video,
      isFullScreen: false,
      flexCompleted:0,
      showPause:false,
      modalVisible:false,
      videoHeight:278,
      videoWidth:Number(width),
      absoluteTop:0,
      translucent :false,
      statusBarBack:'rgba(255,255,255,0)'
    };
    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this.onLoadStart = this.onLoadStart.bind(this);
    this.onError = this.onError.bind(this);
    this.replay = this.replay.bind(this);
    this.resume = this.resume.bind(this);
    this.pause = this.pause.bind(this);
    this.goBack = this.goBack.bind(this);
    this.renderSingleRow = this.renderSingleRow.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this._fetchVideo = this._fetchVideo.bind(this);
    this.presentFullScreen = this.presentFullScreen.bind(this);
    this.dismissFullScreen = this.dismissFullScreen.bind(this);
    this.renderFullScreenBar = this.renderFullScreenBar.bind(this);
    this.comment = this.comment.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.handleDatetime = this.handleDatetime.bind(this);
  }

  componentWillMount() {
    var initial = Orientation.getInitialOrientation();
    console.log('初始方向:');
    console.log(initial);
    AsyncStorage.getItem("token").then((res)=> {
      this.setState({
        token: res
      });
      this.fetchData();
    }).catch((err)=> {
      console.log(err)
    });
    // this._fetchVideo();
  }
  goBack() {
    let {navigator}=this.props;
    if (navigator) {
      navigator.pop()
    }
  }

  _fetchVideo() {
    request.post(config.api.bossUrl + config.api.courseInfo, 'id=' + this.state.videoId).then((res)=> {
      console.log(res);
      if (res.code == 'success') {
        this.setState({
          videoData: res.json
        })
      }
    }).catch((error)=> {
      console.error(error);
    });
  }
  dismissFullScreen() {
    Orientation.lockToPortrait();
    this.setState({
      isFullScreen: false,
      videoHeight:278,
      videoWidth:Number(width),
      resizeMode:'cover',
      absoluteTop:0,
      translucent:false,
      statusBarBack:'rgba(255,255,255,0)'
    })
  }

  presentFullScreen() {
    Orientation.lockToLandscape();
    this.setState({
      isFullScreen: true,
      videoHeight:Number(width),
      videoWidth:Number(height),
      resizeMode:'cover',
      absoluteTop:0,
      translucent:true,
      statusBarBack:'rgba(255,255,255,0.2)'
    })
  }

  onLoadStart(data) {
    console.log('开始加载');
    console.log(data)
  }

  onLoad(data) {
    console.log('正在加载:');
    console.log(data);
    if(data.duration && data.duration>0){
      this.setState({duration: data.duration});
    }
  }

  pause() {
    if (!this.state.paused) {
      this.setState({
        paused: true
      })
    }
    this.setState({
      showPause:true
    })
  }

  resume() {
    this.setState({
      paused: false,
      showPause:false
    })
  }

  onProgress(data) {
    // console.log('progress:');
    // console.log(data);
    this.setState({currentTime: data.currentTime});
    this.setState({
      flexCompleted : this.getCurrentTimePercentage(),
    });
    if (!this.state.isLoaded) {
      this.setState({
        isLoaded: true
      })
    }
  }

  _onEnd(data) {
    this.setState({
      videoEnd: true,
      playing: false,
      flexCompleted:1,
      showPause:false,
      paused:true
    });
  }

  onError() {
    this.setState({
      videoError: true
    })
  }

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return (parseFloat(this.state.currentTime) / parseFloat(this.state.duration)).toFixed(2);
    } else {
      return 0;
    }
  }

  replay() {
    this.player.seek(0);
    this.setState({
      videoEnd: false,
      showPause:false,
      paused:false,
    });
    if(!this.state.playing){
      this.setState({
        playing: true
      })
    }
  }

  fetchData() {
    var that=this;
    request.post(config.api.commentList, {
      creationId: that.state.videoData._id,
      token:that.state.token
    }).then(
      (res)=> {
        console.log(res)
        if (res.code == 200 && res.data.length > 0) {
          that.setState({
            dataSource: that.state.dataSource.cloneWithRows(res.data),
            totalComment: res.total
          })
        }else if(res.code!=200){
          alert(res.data)
        }
      }
    ).catch((err)=> {
      console.log(err)
    })
  }

  renderSingleRow(rowData) {
    return (
      <View style={styles.commentInfo}>
        <Image
          source={{uri: rowData.replyBy.avatar}}
          style={styles.avatar}
        />
        <View style={styles.singleCommentZone}>
          <Text style={styles.nickName} numberOfLines={1}>{rowData.replyBy.nickName}</Text>
          <Text style={styles.commentContent}>{rowData.content}</Text>
          <Text style={styles.commentTime}>
            {this.handleDatetime(rowData.meta.creatAt)}
          </Text>
        </View>

      </View>
    )
  }

  renderFullScreenBar() {
    if (this.state.isLoaded) {
      return (
        this.state.isFullScreen ?
          <Icon
            name="ios-expand-outline"
            size={22}
            onPress={this.dismissFullScreen}
            style={styles.presentFull}
          /> :
          <Icon
            name="ios-expand-outline"
            size={22}
            onPress={this.presentFullScreen}
            style={styles.presentFull}
          />
      )
    } else {
      return null
    }
  }
  //评论
  comment(){
    this.setModalVisible(true)
  }
  setModalVisible(visible){
    this.setState({
      modalVisible:visible
    })
  }
  handleTextChange(text){
    this.setState({
      content:text
    })
  }
  submitComment(){
    var that=this;
    request.post(config.api.saveComment,{
      token:that.state.token,
      creationId:that.state.videoData._id,
      content:that.state.content
    }).then((res)=>{
      if(res && res.code==200){
        console.log(res);
        that.setModalVisible(false);
        that.setState({
          dataSource: that.state.dataSource.cloneWithRows(res.data.data),
          totalComment: res.data.total
        })
      }else{
        alert(res.data)
      }
    }).catch((err)=>{
      alert('请求异常,请稍后再试')
    })
  }
  handleDatetime(timestamp){
    var intStamp=parseInt(timestamp);
    return(
        new Date(intStamp).getFullYear()+'-'+(new Date(intStamp).getMonth()+1)+'-'+new Date(intStamp).getDate()
    );
  }
  render() {
    return (
      <View style={[styles.container]}>
        <StatusBar
          animated={true}
          networkActivityIndicatorVisible={true}
          backgroundColor={this.state.statusBarBack}
          translucent={true}
        />
        {this.state.isFullScreen ? null : <View style={{width:width,height:20,backgroundColor:'#fff'}}><Text></Text></View>}
        <View style={[styles.video]}>
          {/*{Platform.OS==='ios' ? <IosVideoPlayer/> : <AndroidVideoPlayer/>}*/}
           <View style={[styles.innerVideo,{width:this.state.videoWidth,height:this.state.videoHeight-2}]}>
           {!this.state.videoData ? null :
           <Video
           source={{uri: this.state.videoData.qiniu_video}}
           style={[styles.fullScreen,{width:this.state.videoWidth,height:this.state.videoHeight-2}]}
           rate={this.state.rate}
           paused={this.state.paused}
           volume={this.state.volume}
           muted={this.state.muted}
           playInBackground={false}
           resizeMode={this.state.resizeMode}
           controls={false}
           onLoadStart={this.onLoadStart}
           onLoad={this.onLoad}
           onError={this.onError}
           onProgress={this.onProgress}
           onEnd={this._onEnd}
           repeat={false}
           ref={(ref) => this.player = ref}
           />
           }
           </View>
          {this.state.videoError ? <Text style={styles.videoError}>哎哟,视频出错啦</Text> : null}
          {this.state.isLoaded ? null : <ActivityIndicator style={styles.loading}/>}
          {/*,{backgroundColor:'#f00'}*/}
          {this.state.videoEnd && this.state.isLoaded ?
            <View style={[styles.pauseArea,{alignItems:'center',justifyContent:'center',height: this.state.videoHeight-2, width: this.state.videoWidth}]}>
              {this.state.isFullScreen ? null :
                <Icon
                  name="ios-arrow-back"
                  style={styles.backIcon}
                  onPress={this.goBack}
                  size={30}
                  color="rgba(255,255,255,0.5)"
                />
              }
              <Icon
                name='ios-play'
                size={40}
                style={[styles.play]}
                onPress={this.replay}
                color='#fff'
              />
            </View>
            : null}
          {!this.state.videoEnd && this.state.isLoaded ?
            <TouchableOpacity activeOpacity={1} onPress={this.pause} style={[styles.pauseArea,{height: this.state.videoHeight-2, width: this.state.videoWidth}]}>
              {this.state.isFullScreen ? null :
                <Icon
                  name="ios-arrow-back"
                  style={styles.backIcon}
                  onPress={this.goBack}
                  size={30}
                  color="rgba(255,255,255,0.5)"
                />
              }
              {this.state.showPause ? <View style={{alignItems:'center',justifyContent:'center',height: this.state.videoHeight-2, width: this.state.videoWidth}}><Icon
                name='ios-play'
                size={40}
                style={styles.play}
                onPress={this.resume}
                color="#fff"
              /></View>: <Text></Text>}
            </TouchableOpacity> : null}

          {this.renderFullScreenBar()}

          <View style={[styles.progress,{width:this.state.videoWidth}]}>
            <View style={[styles.innerProgressCompleted, {width: this.state.flexCompleted*this.state.videoWidth}]}/>
          </View>
        </View>
        {this.state.isFullScreen ? null :
          <ScrollView
            showsVerticalScrollIndicator={false}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false}
            style={styles.scrollView}
          >
            <View style={styles.titleArea}>
              <Text numberOfLines={1} style={styles.videoTitle}>{this.state.videoData.title}</Text>
              <Text onPress={this.comment}>我要评论</Text>
            </View>
            <View style={[styles.videoInfo, {borderBottomColor: '#e7e7e7', borderBottomWidth: 1}]}>
              <Image
                source={{uri: this.state.videoData.authorAvatar}}
                style={styles.avatar}
                defaultSource={{uri: 'default_avatar'}}
              />
              <View style={styles.descZone}>
                <Text style={styles.nickName}
                      numberOfLines={1}>{this.state.videoData.authorName}</Text>
              </View>
              <View style={styles.thumbUp}>
                <Icon
                  name="ios-heart-outline"
                  size={20}
                />
                <Text style={{marginLeft: 5}}>{this.state.videoData.likeCount}</Text>
              </View>
            </View>
            <View style={styles.commentText}>
              <Text style={{color: '#0087F8', fontSize: 18}}>评论列表</Text>
            </View>
            <ListView
              style={styles.listViewStyle}
              dataSource={this.state.dataSource}
              renderRow={this.renderSingleRow}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              enableEmptySections={true}
            />
          </ScrollView>
        }
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed.")
          }}
        >
          <View style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end'
          }}>
            <View style={styles.innerModal}>
              <View style={{
                width: width,
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={styles.modalTitle}>请输入评论内容</Text>
              </View>
              <View style={{
                height: 80,
                alignItems: 'center',
                flexDirection: 'row',
                width: width,
                justifyContent: 'center'
              }}>
                <TextInput onChangeText={(text)=> {
                  this.handleTextChange(text)
                }}
                autoFocus={false}
                maxLength={80} multiline={true}
                style={styles.innerInput}
                underlineColorAndroid="transparent" placeholder="说点什么吧">
                </TextInput>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop:15}}>
                <View style={{marginLeft: 10}}>
                  <Text>{this.state.modalTitle}限制80个字</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => {
                    this.setModalVisible(!this.state.modalVisible)
                  }}>
                    <View style={{
                      width: 80,
                      backgroundColor: '#cacaca',
                      height: 44,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                      marginRight: 10
                    }}>
                      <Text style={{color: '#fff', fontSize: 16}}>取消</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.submitComment}>
                    <View style={{
                      width: 80,
                      backgroundColor: '#2991d5',
                      height: 44,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                      marginRight: 10
                    }}>
                      <Text style={{color: '#fff', fontSize: 16}}>确定</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF'
  },
  innerInput: {
    borderRadius: 15,
    backgroundColor: '#fff',
    height: 80,
    width: width - 20
  },
  modalTitle: {
    fontSize: 20,
    color: '#1f1e1e'
  },
  innerModal: {
    height: 200, backgroundColor: '#f2f5f4', width: width
  },
  titleArea:{
    flexDirection:'row',justifyContent:'space-between',padding: 10,
    borderBottomColor: '#e7e7e7',
    borderBottomWidth: 1
  },
  presentFull: {
    position: 'absolute',
    bottom: 2,
    right: 5,
    color: '#fff',
  },
  thumbUp: {
    height: 60,
    position: 'absolute',
    right: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentText: {
    padding: 10
  },
  descZone: {
    width: width - 70,
    paddingLeft: 10,
    paddingRight: 10,
  },
  nickName: {
    fontSize: 18,
    fontWeight: '400',
    width: width - 70,
    color: '#3e6295',
    paddingLeft: 10,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentContent: {
    fontSize: 16,
    width: width - 70,
    fontWeight: '400',
    paddingLeft: 10,
    color: '#4e4e4e'
  },
  commentTime: {
    fontSize: 14,
    width: width - 70,
    paddingLeft: 10,
    color: '#939da7',
    marginTop: 10
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover'
  },
  videoInfo: {
    flexDirection: 'row',
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  commentInfo: {
    flexDirection: 'row',
    flex: 1,
    padding: 5,
    alignItems: 'flex-start',
  },
  singleCommentZone: {
    width: width - 60,
    paddingBottom: 10,
    flexDirection: 'column',
  },
  scrollView: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: width,
    backgroundColor: '#fff'
  },
  headTitle: {
    color: '#000',
    fontSize: 18
  },
  backIcon: {
    position: 'absolute',
    top: 0,
    left: 10,
    width: 60,
  },
  videoError: {
    color: '#fff',
    position: 'absolute',
    width: width,
    top: 160,
    left: 0,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  pauseArea: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loading: {
    position: 'absolute',
    top: 130,
    left: width / 2 - 10
  },
  video: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerVideo: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {

  },
  progress: {
    height: 2,
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent:'flex-start'
  },
  innerProgressCompleted: {
    height: 2,
    backgroundColor: '#f75855',
  },
  play: {
    height: 50,
    width: 50,
    paddingLeft: 18,
    paddingTop: 5,
    borderRadius:25,
    borderColor:'#fff',
    borderWidth:1
  },
});
