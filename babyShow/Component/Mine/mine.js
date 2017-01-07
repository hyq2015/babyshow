import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    AsyncStorage,
    Navigator
} from 'react-native';
import * as Progress from 'react-native-progress';
import Storage from 'react-native-storage';
import ListCell from '../common/listcell';
import ActionSheet from 'react-native-actionsheet';
import Login from '../login/login';
import BottomTab from '../common/bottomTab';
import Video from '../Video/video';
import Record from '../Record/record';
import Picture from '../Picture/picture';
let Dimensions = require('Dimensions');
let ImagePicker = require('react-native-image-picker');
let {width, height}=Dimensions.get('window');
let uuid = require('uuid');
var config = require('../common/config');
var request = require('../common/request');
import getRouteIndex from '../common/getRouteIndex';
let storage = new Storage({
    // maximum capacity, default 1000
    size: 1000,

    // Use AsyncStorage for RN, or window.localStorage for web.
    // If not set, data would be lost after reload.
    storageBackend: AsyncStorage,

    // expire time, default 1 day(1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: 1000 * 3600 * 24,

    // cache data in the memory. default is true.
    enableCache: true,

    // if data was not found in storage or expired,
    // the corresponding sync method will be invoked and return
    // the latest data.
    sync: {
        // we'll talk about the details later.
    }
});
const buttons = ['男', '女', '取消'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;
const options = {
    title: '上传头像',
    // customButtons: [
    //     {name: 'fb', title: 'Choose Photo from Facebook'},
    // ],
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从图库中选择',
    cancelButtonTitle: '取消',
    allowsEditing: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
export default class Mine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgurl: false,
            progress: 0,
            uploadComplete: false,
            isUploading: false,
            modalVisible: false,
            modalContent: '',
            modalType: 1,
            inputMaxLength: 10,
            inputReminder: '',
            actionSheetShow: false,
            nickName: '',
            genderName: '',
            userMark: '',
            phoneNumber: '',
            barArr:[
                {iconName:'ios-videocam',tabName:'视频',iconSize:'30'},
                {iconName:'ios-recording',tabName:'录制',iconSize:'30'},
                // {iconName:'ios-aperture',tabName:'图片',iconSize:'30'},
                {iconName:'ios-contact',tabName:'我的',iconSize:'30'}
            ]
        };
        this._onPress = this._onPress.bind(this);
        this._uploadFile = this._uploadFile.bind(this);
        this._updateAvatar = this._updateAvatar.bind(this);
        this._renderModal = this._renderModal.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this._handlePress = this._handlePress.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.logOut = this.logOut.bind(this);
        this.handleTabChange=this.handleTabChange.bind(this);
    }

    componentWillMount() {
        var that=this;
        AsyncStorage.getItem("token").then((res)=> {
            that.setState({
                token: res
            });
        }).catch((err)=> {
            console.log(err)
        });
        AsyncStorage.getItem("loginPhone").then((res)=> {
            that.setState({
                originalPhone: res
            });
            request.post(config.qiniu.verify, {
                phoneNumber:that.state.originalPhone
            }).then((res)=> {
                console.log(JSON.stringify(res));
                if (res.code == 200) {
                    this.setState({
                        imgurl: {uri: res.data.avatar},
                        nickName: res.data.nickName,
                        genderName: res.data.gender == 1 ? '女' : '男',
                        userMark: res.data.mark ? res.data.mark : '这个人很懒,什么也木有留下',
                        phoneNumber: res.data.phoneNumber
                    })
                }
            })
        }).catch((err)=> {
            console.log(err)
        });
    }
    handleTabChange(index){
        let {navigator}=this.props;
        if(navigator){
            var routeStacks=navigator.getCurrentRoutes()
        }
        if(index==0){
            if(navigator){
                var routeIndex=getRouteIndex.getRouteIndex('Video',routeStacks);
                console.log('查询返回的结果为'+routeIndex)
                if(routeIndex!='no'){
                    navigator.jumpTo(navigator.getCurrentRoutes()[routeIndex])
                }else{
                    navigator.push({
                        name:'Video',
                        component:Video,
                        statusBarHidden:true
                    })
                }
            }
        }else if(index==1){
            var routeIndex=getRouteIndex.getRouteIndex('Record',routeStacks);
            if(routeIndex!='no'){
                navigator.jumpTo(navigator.getCurrentRoutes()[routeIndex])
            }else{
                navigator.push({
                    name:'Record',
                    component:Record,
                    statusBarHidden:true
                })
            }
        }
        /*else if(index==2){
            var routeIndex=getRouteIndex.getRouteIndex('Picture',routeStacks);
            if(routeIndex!='no'){
                navigator.jumpTo(navigator.getCurrentRoutes()[routeIndex])
            }else{
                navigator.push({
                    name:'Picture',
                    component:Picture
                })
            }
        }*/
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.avatarBack}>
                    <TouchableOpacity activeOpacity={0.8} onPress={this._onPress} style={{
                        position: 'absolute',
                        top: 100,
                        left: width / 2 - 45,
                        zIndex: 10,
                        width: 90,
                        height: 90
                    }}>
                        {this.state.imgurl ? <Image
                            source={this.state.imgurl}
                            style={styles.header}
                        /> : null}

                    </TouchableOpacity>
                    <Text style={styles.userName}>Ricky_Huang </Text>
                </View>
                {!this.state.uploadComplete && this.state.isUploading ?
                    <Progress.Circle unfilledColor="#172312" borderWidth={0} size={90} indeterminate={false}
                                     animated={true} progress={this.state.progress} style={styles.progress}/> : null}
                <ScrollView style={styles.scrollview}>
                    <ListCell
                        title="昵称"
                        content={this.state.nickName}
                        modalType="1"
                        _renderModal={(title, content, type)=>this._renderModal(title, content, type)}
                    />
                    <ListCell
                        title="性别"
                        content={this.state.genderName}
                        modalType="2"
                        _renderModal={(title, content, type)=>this._renderModal(title, content, type)}
                    />
                    <ListCell
                        title="签名"
                        content={this.state.userMark}
                        modalType="3"
                        _renderModal={(title, content, type)=>this._renderModal(title, content, type)}
                    />
                    <ListCell
                        title="手机号"
                        content={this.state.phoneNumber}
                        modalType="4"
                        _renderModal={(title, content, type)=>this._renderModal(title, content, type)}
                    />
                    <TouchableOpacity activeOpacity={0.8} onPress={this.logOut}>
                        <View style={styles.outerContainer}>
                            <Text style={styles.outButton}>退出登录</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                {/*模态框*/}
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
                                height: 60,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={styles.modalTitle}>请输入{this.state.modalTitle}</Text>
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
                                }} autoFocus={false} keyboardType={this.state.modalType == 4 ? 'numeric' : 'default'}
                                           maxLength={this.state.inputMaxLength} multiline={false}
                                           value={this.state.modalContent} style={styles.innerInput}
                                           underlineColorAndroid="transparent" placeholder="请输入昵称">

                                </TextInput>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <View style={{marginLeft: 10}}>
                                    <Text>{this.state.modalTitle}限制{this.state.inputMaxLength}个字</Text>
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
                                    <TouchableOpacity onPress={this.updateUser}>
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
                {/*actionsheet*/}
                <ActionSheet
                    ref={(o) => this.ActionSheet = o}
                    title="请选择性别"
                    options={buttons}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this._handlePress}
                />
                {/*退出后跳转到登录*/}
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

    logOut() {
        var that = this;
        AsyncStorage.removeItem("loginPhone").then(()=> {
            let {navigator}=that.props;
            if (navigator) {
                navigator.push({
                    name: 'login',
                    component: Login
                })
            }
        }).catch((err)=> {
            alert('删除缓存报错了' + JSON.stringify(err))
        });
    }

    handleTextChange(text) {
        this.setState({
            modalContent: text
        })
    }

    _handlePress(index) {
        var that=this;
        if (index != 2) {
            request.post(config.qiniu.updateUserInfo,{
                gender:index,
                phoneNumber:this.state.originalPhone,
                token:that.state.token
            }).then((res)=> {
                if (res.code != 200) {
                    alert(res.data)
                } else {
                    this.setModalVisible(false);
                    this.setState({
                        genderName: index == 1 ? '女' : '男'
                    })
                }
            }).catch((err)=> {
                console.log(err)
            })
        }
    }

    updateUser() {
        let updateType = this.state.modalType;
        let submitPara = '';
        switch (updateType) {
            case '1':
                submitPara = {
                    nickName:this.state.modalContent,
                    phoneNumber:this.state.originalPhone,
                    token:this.state.token
                };
                break;
            case '3':
                submitPara = {
                    mark:this.state.modalContent,
                    phoneNumber:this.state.originalPhone,
                    token:this.state.token
                };
                break;
            case '4':
                submitPara = {
                    newPhone:this.state.modalContent,
                    phoneNumber:this.state.originalPhone,
                    token:this.state.token
                };
                break;
        }
        ;
        request.post(config.qiniu.updateUserInfo, submitPara).then((res)=> {
            if (res.code != 200) {
                alert(res.data)
            } else {
                switch (updateType) {
                    case '1':
                        this.setState({
                            nickName: this.state.modalContent
                        })
                        break;
                    case '3':
                        this.setState({
                            userMark: this.state.modalContent
                        })
                        break;
                    case '4':
                        this.setState({
                            phoneNumber: this.state.modalContent
                        })
                        break;
                }
                ;
                this.setModalVisible(false)
            }
        }).catch((err)=> {
            console.log(err)
        })
    }

    _uploadFile(body, url) {
        var thisObj = this;
        console.log(body, url);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.send(body);
        xhr.onerror = (e)=> {
            console.log('错误了' + e);
            console.log(xhr);
        };
        xhr.onreadystatechange = ()=> {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log('图片上传成功:' + JSON.parse(xhr.response).key);
                var imguri = JSON.parse(xhr.response).key;
                thisObj.setState({
                    imgurl: {uri: config.qiniu.imageHeader + imguri},
                    uploadComplete: true,
                    progress: 0,
                    isUploading: false
                });
                thisObj._updateAvatar('18030638805', config.qiniu.imageHeader + imguri)
            }
        };
        if (xhr.upload) {
            xhr.upload.onprogress = (event)=> {
                if (event.lengthComputable) {
                    let percent = Number((event.loaded / event.total).toFixed(2));
                    this.setState({
                        progress: percent
                    })
                }
            }
        }
    }

    _updateAvatar(phoneNumber, newAvatar) {
        var that=this;
        request.post(config.qiniu.updateAvatar, {
            phoneNumber:phoneNumber,
            avatar:newAvatar,
            token:that.state.token
        }).then((res)=> {
            if (res.code == 200) {
                console.log('头像更新成功:' + JSON.stringify(res));
                this.setState({
                    imgurl: {uri: res.data.avatar},
                });
            } else {
                console.log(res.data)
            }
        }).catch((e)=> {
            console.log(e)
        })
    }

    _onPress() {
        var that = this;
        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                return
            }
            var avatarFile = 'data:image/jpeg;base64,' + response.data;
            request.post(config.qiniu.getsignature,{
                type:'image',
                cloud:'qiniu'
            }).then(
                (res)=> {
                    if (res && res.code == 200) {
                        console.log('获取到了token:' + res.data);
                        var token = res.data.token;
                        var key = res.data.key;
                        var body = new FormData();
                        body.append('token', token);
                        body.append('key', key);
                        body.append('file', {
                            type: 'image/jpeg',
                            uri: response.uri,
                            name: key
                        });
                        that.setState({
                            uploadComplete: false,
                            isUploading: true
                        });
                        that._uploadFile(body, config.qiniu.imageupload)

                    }
                }
            ).catch((err)=> {
                console.log(err)
            });

        });
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    _renderModal(title, content, type) {
        if (type == 1 || type == 3 || type == 4) {
            this.setState({
                modalTitle: title,
                modalContent: content,
                modalType: type
            })
            this.setModalVisible(true)
        } else {
            this.ActionSheet.show();
        }
        switch (type) {
            case '1':
                this.setState({
                    inputMaxLength: 15,
                });
                break;
            case '3':
                this.setState({
                    inputMaxLength: 20,
                });
                break;
            case '4':
                this.setState({
                    inputMaxLength: 11,
                });
                break;
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        flexDirection: 'column'
    },
    innerInput: {
        borderRadius: 15,
        backgroundColor: '#fff',
        height: 60,
        width: width - 20
    },
    modalTitle: {
        fontSize: 20,
        color: '#1f1e1e'
    },
    innerModal: {
        height: 200, backgroundColor: '#f2f5f4', width: width
    },
    outButton: {
        fontSize: 20,
        color: '#d77877'
    },
    outerContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 20,
        borderBottomColor: '#e7e7e7',
        borderBottomWidth: 1,
        borderTopColor: '#e7e7e7',
        borderTopWidth: 1,
    },
    scrollview: {
        backgroundColor: '#F5FCFF'
    },
    avatarBack: {
        width: width,
        height: 300,
        backgroundColor: '#d43d37',
    },
    userName: {
        fontSize: 16,
        color: '#fff',
        width: width,
        textAlign: 'center',
        position: 'absolute',
        top: 200
    },
    progress: {
        position: 'absolute',
        top: 100,
        left: width / 2 - 45
    },
    header: {
        width: 90,
        height: 90,
        resizeMode: 'cover',
        borderRadius: 45,
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
});