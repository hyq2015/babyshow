import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  NetInfo,
  TouchableOpacity,
  AsyncStorage,
  Modal,
  TextInput
} from 'react-native';
import * as Progress from 'react-native-progress';
import BottomTab from '../common/bottomTab';
import Video from 'react-native-video';
import VideoModule from '../Video/video';
import Mine from '../Mine/mine';
import Picture from '../Picture/picture';
import getRouteIndex from '../common/getRouteIndex';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBarR from '../common/navbar';
import StatusBarR from '../common/statusBar';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
var _=require('lodash');
let Dimensions = require('Dimensions');
let ImagePicker = require('react-native-image-picker');
let {width, height}=Dimensions.get('window');
let uuid = require('uuid');
var config = require('../common/config');
var request = require('../common/request');
const options = {
  title: '上传视频',
  takePhotoButtonTitle: '录制10秒视频',
  chooseFromLibraryButtonTitle: '选择已有视频',
  cancelButtonTitle: '取消',
  videoQuality: 'high',
  mediaType: 'video',
  durationLimit: 10,
  noData: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
    waitUntilSaved: true
  },
  originalPhone: '',
  audioName: 'gogo.aac'
};
var defaultState={
  barArr: [
    {iconName: 'ios-videocam', tabName: '视频', iconSize: '30'},
    {iconName: 'ios-recording', tabName: '录制', iconSize: '30'},
    // {iconName: 'ios-aperture', tabName: '图片', iconSize: '30'},
    {iconName: 'ios-contact', tabName: '我的', iconSize: '30'}
  ],
  
  //video
  videoPreview: '',
  progress: 0,
  videoUploadComplete: false,
  paused: false,
  videoUploading:false,
  videoPreviewState: false,
  videoUploadState:'未选择视频',
  showVideoProgress:false,
  videoId:null,
  //audio
  canRecordAudio: false,
  isRecording: false,
  recordFinished: false,
  audioPlaying: false,
  hasRecorded:false,
  audioProgress:0.01,
  audioUploading:false,
  audioUploadComplete:false,
  audioUploadState:'未选择音频',
  audioId:null,
  //modal
  modalVisible:false,
  isPublish:false,
  publishProgress:0.2,
  canPublishVideo:false
};
export default class Record extends Component {
  constructor(props) {
    super(props);
    var thisState=_.clone(defaultState);
    this.state = thisState;
    this._onPress = this._onPress.bind(this);
    this._uploadFile = this._uploadFile.bind(this);
    this.uploadVideo = this.uploadVideo.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this._recordAudio = this._recordAudio.bind(this);
    this.onLoadStart = this.onLoadStart.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this.prepareRecordingPath = this.prepareRecordingPath.bind(this);
    this.replayAudio = this.replayAudio.bind(this);
    this.uploadAudio = this.uploadAudio.bind(this);

    this._initAudio = this._initAudio.bind(this);

    this.beginRecord = this.beginRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.startPlay = this.startPlay.bind(this);
    this.uploadAudioToServer = this.uploadAudioToServer.bind(this);
    this.confirmPublish = this.confirmPublish.bind(this);
    this.cancelPublish = this.cancelPublish.bind(this);
    this.checkVideoStatus = this.checkVideoStatus.bind(this);
  }

  componentWillMount() {
    AsyncStorage.getItem("loginPhone").then((res)=> {
      this.setState({
        originalPhone: res
      })
    }).catch((err)=> {
      console.log(err)
    });
    AsyncStorage.getItem("token").then((res)=> {
      this.setState({
        token: res
      });
    }).catch((err)=> {
      console.log(err)
    });
    NetInfo.fetch().done((status)=> {
      console.log('网络Status:' + status);
    });

  }
  componentDidMount() {
    this._initAudio();
  }
  checkVideoStatus(){
    var that=this;
    request.post(config.api.checkVideoStatus,{
      audioId:that.state.audioId,
      videoId:that.state.videoId
    }).then((res)=>{
      if(res && res.code==200){
        that.setState({
          modalVisible:true
        })
      }else{
        alert(res.data)
      }
    }).catch((err)=>{
      alert('请求失败')
    })
  }
  confirmPublish(){
    var _that=this;
    this.setState({
      isPublish:true
    });
    request.post(config.api.saveCompleteVideo,{
      videoId:_that.state.videoId,
      audioId:_that.state.audioId,
      videoTitle:_that.state.videoTitle,
      token:_that.state.token,
    }).then((res)=>{
      if(res && res.code==200){
        alert('视频发布成功');
        var newState=_.clone(defaultState);
        _that.setState(newState);
      }
    }).catch((err)=>{
      _that.setState({
        isPublish:false
      });
      alert('视频发布失败')
    })
  }
  cancelPublish(){
    this.setState({
      modalVisible:false,
      isPublish:false
    });
  }
  beginRecord(){
    // let audioPath = AudioUtils.DocumentDirectoryPath + '/gougou.aac';
    // this.prepareRecordingPath(audioPath);
    AudioRecorder.startRecording();
  }
  stopRecord(){
      AudioRecorder.stopRecording().then((res)=>{
        console.log('音频存储完毕:,位置为');
        console.log(res)
      })
  }
  startPlay(){
    AudioRecorder.playRecording();
  }
  _initAudio() {
    let audioPath = AudioUtils.DocumentDirectoryPath +'/gougou.aac';
    console.log('MainBundlePath:'+AudioUtils.MainBundlePath);
    console.log('CachesDirectoryPath:'+AudioUtils.CachesDirectoryPath);
    console.log('DocumentDirectoryPath:'+AudioUtils.DocumentDirectoryPath);
    console.log('LibraryDirectoryPath:'+AudioUtils.LibraryDirectoryPath);
    console.log('PicturesDirectoryPath:'+AudioUtils.PicturesDirectoryPath);
    console.log('MusicDirectoryPath:'+AudioUtils.MusicDirectoryPath);
    console.log('DownloadsDirectoryPath:'+AudioUtils.DownloadsDirectoryPath);
    this.setState({
      audioPath:audioPath
    });
    console.log('音频保存路径:');
    console.log(audioPath);
    this.prepareRecordingPath(audioPath);
    AudioRecorder.onProgress = (data) => {

      // this.setState({currentTime: Math.floor(data.currentTime)});
    };
    AudioRecorder.onFinished = (data) => {
      // this.setState({finished: data.finished});
      console.log(`Finished recording: ${data.finished}`);
    };
  }


  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000,
    });
  }

  replayAudio() {
    if (this.state.audioPlaying) {
      AudioRecorder.stopPlaying()
    }
    this.setState({
      audioPlaying: true,
      paused: false
    });
    this.refs.player.seek(0.1);
    AudioRecorder.playRecording();
  }
  onLoadStart() {
    this.refs.player.seek(0.1);
  }

  startRecord() {
    let audioPath = AudioUtils.DocumentDirectoryPath +'/gougou.aac';
    this.prepareRecordingPath(audioPath);
    if (!this.state.isRecording) {
      this.refs.player.seek(0.1);
    } else {
      return
    }
    AudioRecorder.startRecording();
    this.setState({
      paused: false,
      isRecording: true,
      audioUploadState: '音频录制中...',
      audioUploadComplete:false
    })
  }


  _onEnd() {
    this.refs.player.seek(0.1);
    if (this.state.isRecording) {
      this.setState({
        audioUploadState: '音频录制完成',
        hasRecorded:true
      });
      AudioRecorder.stopRecording();
    }
    if (this.state.audioPlaying) {
      // AudioRecorder.stopPlaying();
      this.setState({
        audioPlaying: false,
      });
    }
    this.setState({
      paused: true,
      isRecording: false,
      recordFinished: true
    });
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
            component: VideoModule,
            statusBarHidden:true
          })
        }
      }
    } else if (index == 2) {
      var routeIndex = getRouteIndex.getRouteIndex('Mine', routeStacks);
      if (routeIndex != 'no') {
        navigator.jumpTo(navigator.getCurrentRoutes()[routeIndex])
      } else {
        navigator.push({
          name: 'Mine',
          component: Mine,
          statusBarHidden:true
        })
      }
    }
    /*else if (index == 2) {
      var routeIndex = getRouteIndex.getRouteIndex('Picture', routeStacks);
      if (routeIndex != 'no') {
        navigator.jumpTo(navigator.getCurrentRoutes()[routeIndex])
      } else {
        navigator.push({
          name: 'Picture',
          component: Picture
        })
      }
    }*/
  }

  _recordAudio() {

  }
  //fetch上传音频
  uploadAudioToServer(body,url,type){
    fetch(url,{
      method:'POST',
      headers:{
        'Content-Type':'multipart/form-data'
      },
      body:body,
    }).then((res)=>res.json()).then((res)=>{
      console.log('音频上传成功:');
      console.log(res)
    }).catch((err)=>{
      console.log('音频上传报错:');
      console.log(err)
    })
  }

//上传视频
  _uploadFile(body, url,type) {
    var thisObj = this;
    console.log(body, url);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.send(body);
    xhr.onerror = (e)=> {
      alert('错误了' + JSON.stringify(e));
      if(type=='video'){
        thisObj.setState({
          videoUploadState:'视频上传失败'
        })
      }else{
        thisObj.setState({
          audioUploadState:'音频上传失败'
        })
      }
      // alert(xhr);
    };
    xhr.onreadystatechange = ()=> {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if(type=='video'){
          console.log('视频上传成功:' + xhr.response);
          var videouri = JSON.parse(xhr.response).key;

          //用这个id去七牛查询持久化处理结果 [GET] http://api.qiniu.com/status/get/prefop?id=<persistentId>,在查询返回结果中,唯一的key再加上自己七牛空间的名字便可以访问到处理好的资源文件了
          var persistentId = JSON.parse(xhr.response).persistentId;
          
          //将七牛返回的persistentId传递给后台
          var videoUrl = config.qiniu.videoMatchQiniu;
          request.post(videoUrl, {
            key:videouri,
            persistentId:persistentId,
            phoneNumber:thisObj.originalPhone,
            token:thisObj.state.token
          }).then((res)=> {
            if (!res || res.code != 200) {
              thisObj.setState({
                videoUploadState:'视频上传失败'
              });
            } else {
              console.log('视频同步到数据库成功!')
              console.log(res);
              thisObj.setState({
                // videoPreviewState: true,
                // videoPreview: {uri: config.qiniu.videoHeader + videouri},
                videoUploadComplete: true,
                progress: 0,
                videoUploading:false,
                videoUploadState:'视频上传成功',
                videoId:res.data
              })
            }
          }).catch((err)=> {
            thisObj.setState({
              videoUploadState:'视频上传失败'
            })
          })
        }else{
          request.post(config.qiniu.audioMatchQiniu,{
            videoId:thisObj.state.videoId,
            public_id:JSON.parse(xhr.response).public_id,
            audio:xhr.response,
            token:thisObj.state.token
          }).then((res)=>{
            if(res && res.code==200){
              thisObj.setState({
                audioProgress: 0.01,
                audioUploading:false,
                audioUploadComplete:true,
                audioUploadState:'音频上传成功',
                audioId:res.data,
                canPublishVideo:true
              })
            }

          }).catch((err)=> {
            thisObj.setState({
              audioProgress: 0.01,
              audioUploading:false,
              audioUploadComplete:true,
              audioUploadState:'音频上传失败',
            })
          });
          console.log(xhr.response);
        }
      }
    };
    if (xhr.upload) {
      xhr.upload.onprogress = (event)=> {
        if (event.lengthComputable) {
          let percent = Number((event.loaded / event.total).toFixed(2));
          if(type=='video'){
            thisObj.setState({
              progress: percent
            })
          }else{
            thisObj.setState({
              audioProgress: percent
            })
          }
        }
      }
    }
  }
  //上传音频
  uploadAudio(){
    if(this.state.audioUploading){
      return
    }
    this.setState({
      audioUploading:true,
      audioUploadState:'音频上传中'
    });
    var that = this;
    var timestamp=Date.now();
    var tags='app,audio';
    var folder='audio';
    request.post(config.qiniu.getsignature, {
      type:'audio',
      cloud:'cloudinary',
      timestamp:timestamp
    }).then(
      (res)=> {
        if (res && res.code == 200) {
          console.log('获取到了token:');
          console.log(res.data);
          var signature = res.data.token;
          var key = res.data.key;
          var body = new FormData();
          body.append('signature', signature);
          body.append('key', key);
          body.append('folder', folder);
          body.append('tags', tags);
          body.append('timestamp', timestamp);
          body.append('resource_type','audio');
          body.append('api_key', config.cloudinary.api_key);
          body.append('file', {
            type: 'audio/aac',
            uri: 'file://'+AudioUtils.DocumentDirectoryPath+'/gougou.aac',
            name: 'gougou.aac'
          });
          that._uploadFile(body, config.cloudinary.audio,'audio')

        }
      }
    ).catch((err)=> {
      console.log(err);
      that.setState({
        audioUploadState:'音频上传失败'
      })
    });
  }
  //上传视频
  uploadVideo(){
    var that = this;
    if(this.state.videoUploading){
      return
    }
    this.setState({
      videoUploading:true,
      videoUploadState:'视频上传中'
    });
    request.post(config.qiniu.getsignature, {
      type:'video',
      cloud:'qiniu',
    }).then(
      (res)=> {
        if (res && res.code == 200) {
          console.log('获取到了token:');
          console.log(res.data);
          var token = res.data.token;
          var key = res.data.key;
          var body = new FormData();
          body.append('token', token);
          body.append('key', key);
          body.append('file', {
            type: 'video/mp4',
            uri: that.state.videoPath,
            name: key
          });
          that.setState({
            videoUploadComplete: false,
            showVideoProgress:true
          });
          that._uploadFile(body, config.qiniu.imageupload,'video')
        }
      }
    ).catch((err)=> {
      console.log(err);
      that.setState({
        videoUploadState:'视频上传失败'
      });
    });
  }
  _onPress() {
    var that = this;
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        return
      }
      var videoPreviewUri = 'file://' + response.path;
      var newState=_.clone(defaultState);
      newState.videoPreview={uri:videoPreviewUri};
      newState.videoPreviewState=true;
      that.setState(newState);
      that.setState({
        videoPath:videoPreviewUri,
        canRecordAudio: true,
        videoUploadState:'已选择视频'
      });
      console.log('视频返回结果:' + JSON.stringify(response));
      //注意此处选择已有视频跟录制后的视频返回的路径不同,导致设置video src的时候报错,所以这里自行拼接res.path
      // console.log(videoPreviewUri);
      // that.setState({
      //   videoPreview:{uri:videoPreviewUri},
      //   videoPreviewState: true,
      // });
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBarR
          backColor="rgba(0,0,0,0)"
          translucent={true}
        />
        <NavBarR
          titleText="点击选择视频"
          pressNavBar={()=>this._onPress()}
          backColor="#d43d37"
          height={70}
        />
        {/*<Text style={styles.welcome} onPress={this._onPress}>*/}
          {/*点击选择视频*/}
        {/*</Text>*/}
        {this.state.canPublishVideo ?
          <TouchableOpacity style={{position:'absolute',right:10,top:8}} onPress={this.checkVideoStatus} activeOpacity={0.8}>
            <View style={styles.publish}>
              <Icon
                name="logo-chrome"
                size={25}
                color='#ee735c'
              /><Text>发布</Text>
            </View>
          </TouchableOpacity>
          : null}
        {this.state.videoPreviewState ?
          <View style={styles.videoArea}>
            <Video
              source={this.state.videoPreview}
              style={styles.fullScreen}
              rate={1}
              paused={this.state.paused}
              volume={5}
              muted={true}
              playInBackground={false}
              onLoad={this.onLoadStart}
              resizeMode='contain'
              controls={true}
              repeat={false}
              onEnd={this._onEnd}
              ref="player"
            />
          </View> : null
        }
        {this.state.recordFinished && !this.state.isRecording && this.state.hasRecorded ?
          <TouchableOpacity style={{position:'absolute',right:10,top:290}} onPress={this.replayAudio}>
            <View style={styles.previewStyle}>
              <Icon
                name="ios-play"
                size={20}
                color="#ee735c"
              />
              <Text style={{color:'#ee735c'}}>预览</Text>
            </View>
          </TouchableOpacity> : null}
        {!this.state.videoUploadComplete && this.state.showVideoProgress ?
          <View style={styles.videoProgressContainer}>
            <Progress.Circle showsText={true} size={50} color="#fff" animated={true}
                             progress={this.state.progress}/>
          </View>
           : null}
        {this.state.canRecordAudio ? <View style={{justifyContent: 'center', alignItems: 'center', marginTop: -30}}>
          <TouchableOpacity activeOpacity={1} onPress={this.startRecord}>
            <View style={[styles.recordContainer, {backgroundColor: this.state.isRecording ? 'gray' : '#ee735c'}]}>
              <Icon
                name="ios-mic"
                size={50}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
        </View> : null}
        {!this.state.videoUploadComplete && this.state.videoPreviewState ?
          <TouchableOpacity activeOpacity={0.8} onPress={this.uploadVideo}>
            <View style={styles.uploadAudio}>
              <Text style={{color:'#fff'}}>上传视频</Text>
            </View>
          </TouchableOpacity> : null
        }

        {this.state.recordFinished && !this.state.isRecording && this.state.hasRecorded && this.state.videoUploadComplete && !this.state.audioUploadComplete ?
          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={this.uploadAudio}>
              <View style={styles.uploadAudio}>
                <Text style={{color:'#fff'}}>上传录音</Text>
              </View>
            </TouchableOpacity>
          </View>
         : null
        }
        {this.state.audioUploading ? <View style={styles.audioProgressContainer}>
          <Progress.Circle
            showsText={true}
            size={50}
            animated={true}
            progress={this.state.audioProgress}
            color="#ee735c"
          />
        </View> : null}
        {/*直接录音
          <View>
            <Text onPress={this.beginRecord} style={{marginLeft:20,marginTop:50}}>直接录音</Text>
            <Text onPress={this.stopRecord} style={{marginLeft:20,marginTop:50}}>停止录音</Text>
            <Text onPress={this.startPlay} style={{marginLeft:20,marginTop:50}}>播放录音</Text>
            <Text onPress={this.uploadAudio} style={{marginTop:50}}>上传录音</Text>
          </View>
         */}
         <View style={styles.currentStatus}>
           <Text>当前状态:</Text>
           <View style={{flexDirection:'row'}}>
             <Text>视频:</Text><Text style={{color:'#ee735c'}}>{this.state.videoUploadState}</Text>
           </View>
           <View style={{flexDirection:'row'}}>
             <Text>音频:</Text><Text style={{color:'#ee735c'}}>{this.state.audioUploadState}</Text>
           </View>
         </View>
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed.")
          }}
        >
          <View style={styles.textContainer}>
            <TextInput underlineColorAndroid="transparent" placeholder="为视频添加一个标题吧" maxLength={15} style={styles.textInput}
              onChangeText={(text)=>{
                this.setState({
                  videoTitle:text
                })
              }}>
            </TextInput>
          </View>
          {this.state.isPublish ?
            <View style={{width:width,marginTop:20,flexDirection:'column',alignItems:'center'}}>
              <Text style={{textAlign:'center',marginBottom:10}}>正在发布中...</Text>
              <Progress.Circle
                showsText={true}
                size={50}
                animated={true}
                progress={this.state.publishProgress}
              />
            </View>
            : null}

          <View style={styles.submitContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={this.confirmPublish}>
              <View style={[styles.submitBtn,{borderColor:'#0699DD'}]}>
                <Text style={{color:'#0699DD'}}>发布视频</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={this.cancelPublish}>
              <View style={[styles.submitBtn,{borderColor:'#CCC'}]}>
                <Text style={{color:'#CCC'}}>取消发布</Text>
              </View>
            </TouchableOpacity>
          </View>

        </Modal>

          <BottomTab
          barArr={this.state.barArr}
          tabHeight={50}
          iconSize={25}
          tabIndex={1}
          changeTab={(i)=>this.handleTabChange(i)}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    flexDirection: 'column'
  },
  publish:{
    flexDirection:'row',alignItems:'center',width:60,height:30,justifyContent:'space-around',borderWidth:1,borderColor:'#ee735c',borderRadius:5,
  },
  submitContainer:{
    flexDirection:'row',
    justifyContent:'space-around'
  },
  submitBtn:{
    backgroundColor:'transparent',
    height:40,
    width:width/3,
    borderRadius:5,
    alignItems:'center',
    justifyContent:'center',
    marginTop:100,
    borderWidth:1
  },
  textContainer:{
    borderBottomColor:'#ccc',
    borderBottomWidth:1,
    height:50,
    marginTop:50
  },
  textInput:{
    textAlign:'center'
  },
  previewStyle:{
    width:60,height:30,
    flexDirection:'row',
    justifyContent:'space-around',alignItems:'center',
    borderWidth:1,
    borderRadius:5,
    borderColor:'#ee735c',
    backgroundColor:'transparent',
    // position:'absolute',
  },
  currentStatus:{
    width:width,
    flexDirection:'column',
    alignItems:'center',
    marginTop:20
  },
  audioProgressContainer:{
    height:50,flexDirection:'row',justifyContent:'center',marginTop:10
  },
  videoProgressContainer:{
    position:'absolute',
    left:0,
    top:150,
    width:width,
    height:50,
    flexDirection:'row',justifyContent:'center'
  },
  uploadAudio:{
    flexDirection:'row',
    justifyContent:'center',
    padding:10,
    width:width-20,
    height:40,
    borderRadius:5,
    backgroundColor:'#ee735c',
    alignSelf:'center',
    marginTop:20
  },
  recordContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cd: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  videoArea: {
    width: width,
    height: 275,
    backgroundColor: 'black'
  },
  fullScreen: {
    height: 275,
    width: width,
  },
});