/**
 * Created by Dell on 2016/11/30.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Image,
    TextInput,
    ToastAndroid,
    AsyncStorage,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from '../Video/video';
var request=require('../common/request');
var config=require('../common/config');
var Dimensions = require('Dimensions');
var {width, height}=Dimensions.get('window');
var timer;
let reg=/^1[3|4|5|7|8][0-9]{9}$/;
export default class Login extends Component {
    constructor(props) {
        super(props);
        //创建数据源
        this.state = {
            activeColor:'#77cfee',
            cansubmit:false,
            verifyBtnText:'点击获取验证码',
            verifyBtnValid:true,
            verifyCode:'',
            phoneNumber:''
        };
        this._getVerifyCode=this._getVerifyCode.bind(this);
        this.handleInputVal=this.handleInputVal.bind(this);
        this._signIn=this._signIn.bind(this);
        this.handleInputCode=this.handleInputCode.bind(this);
        this._checkSubmit=this._checkSubmit.bind(this);
    }
    componentWillMount(){
        this.setState({

        })
    }
    componentWillUnmount(){
        if(timer){
            clearInterval(timer);
        }
    }
    _getVerifyCode(){
        if(!reg.test(this.state.phoneNumber)){
            ToastAndroid.show('请输入正确的手机号', ToastAndroid.SHORT)
            return;
        }
        var that=this;
        request.post(config.qiniu.signUp,{
            phoneNumber:that.state.phoneNumber
        }).then(
            (res)=>{
                if(res.code!=200){
                    alert(res.data)
                }else{
                    that.setState({
                        verifyBtnValid:false,
                        token:res.data.token
                    });
                    var timeLeft=60;
                     timer=setInterval(()=>{
                        timeLeft--;
                        if(timeLeft<=0){
                            clearInterval(timer);
                            that.setState({
                                verifyBtnValid:true,
                                verifyBtnText:'重新获取验证码'
                            })
                        }else{
                            that.setState({
                                verifyBtnText:'剩余'+timeLeft+'s'
                            })
                        }
                    },1000)
                }
            }
        ).catch((err)=>{
            console.log(err)
        })
    }
    _signIn(){
        var that=this;
        if(!reg.test(this.state.phoneNumber) || !this.state.verifyCode){
            ToastAndroid.show('输入信息有误,请重新输入', ToastAndroid.SHORT)
            return;
        }
        request.post(config.qiniu.signIn,{
            verifyCode:this.state.verifyCode,
            phoneNumber:this.state.phoneNumber,
            // token:that.state.token
            token:'41615c2f-b3dc-42e6-ba8d-935be62ee449'
        }).then(
            (res)=>{
                if(res.code!=200){
                    alert(res.data)
                }else{
                    console.log('注册成功返回的数据为:')
                    console.log(res.data);
                    AsyncStorage.setItem("token",res.data.token).then((res)=>{
                        console.log(JSON.stringify(res))
                    }).catch((err)=>{
                        console.log(err)
                    });
                    AsyncStorage.setItem("loginPhone",res.data.phone).then((res)=>{
                        console.log(JSON.stringify(res))
                    }).catch((err)=>{
                        console.log(err)
                    });
                    let {navigator}=this.props;
                    Keyboard.dismiss();
                    if(navigator){
                        navigator.push({
                            name:'Video',
                            component:Video
                        })
                    }
                }
            }
        ).catch((err)=>{
            console.log(err)
        })
    }
    handleInputVal(event){
        this.setState({
            phoneNumber:event.nativeEvent.text
        });
        setTimeout(()=>{
            this._checkSubmit()
        },50)
    }
    handleInputCode(event){
        this.setState({
            verifyCode:event.nativeEvent.text
        });
        setTimeout(()=>{
            this._checkSubmit()
        },50)
    }
    _checkSubmit(){
        if(reg.test(this.state.phoneNumber) && this.state.verifyCode.length==4){
            this.setState({
                cansubmit:true,
                activeColor:'#4a8bfc'
            })
        }else{
            if(this.state.cansubmit==true){
                this.setState({
                    cansubmit:false,
                    activeColor:'#77cfee'
                })
            }
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>用户登录</Text>
                </View>
                <View style={styles.firstLine}>
                    <Icon
                        name="ios-phone-portrait-outline"
                        size={20}
                        style={styles.phoneIcon}
                    />
                    <TextInput onChange={(event)=>this.handleInputVal(event)} maxLength={11} keyboardType='numeric' placeholder='请输入手机号码' underlineColorAndroid="transparent" style={styles.phoneInput}></TextInput>
                </View>
                <View style={styles.secondLine}>
                    <TextInput maxLength={4} onChange={(event)=>this.handleInputCode(event)} keyboardType='numeric' underlineColorAndroid="transparent" style={styles.verifyCode}></TextInput>
                    <TouchableOpacity activeOpacity={0.8} onPress={this._getVerifyCode} disabled={!this.state.verifyBtnValid}>
                        <View style={styles.getVerifyCode}>
                            <Text style={styles.getCodeTitle}>{this.state.verifyBtnText}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.8} disabled={!this.state.cansubmit} onPress={this._signIn}>
                    <View style={[styles.registerContainer,{backgroundColor:this.state.activeColor}]}>
                        <Text style={styles.registerText}>登 录</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    registerContainer:{
        width:width-4,
        height:50,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4a8bfc',
        borderRadius:10,
        marginTop:20,
        justifyContent:'center',
        alignSelf:'center'
    },
    registerText:{
        color:'#fff'
    },
    firstLine:{
        width:width,
        height:50,
        borderWidth:1,
        borderColor:'#e7e7e7',
        alignItems:'center',
        flexDirection:'row',
        paddingLeft:10,
        backgroundColor:'#fff',
        marginTop:20,
        borderRadius:10
    },
    phoneInput:{
        height:40,
        width:width-40,
        color:'#303030'
    },
    phoneIcon:{
        width:20,
    },
    title:{
        fontSize:20,
        color:'#303030'
    },
    titleContainer:{
        flexDirection:'row',
        justifyContent:'center',
        height:60,
        alignItems:'center',
        backgroundColor:'#fff',
        borderBottomColor:'#a7a7a7',
        borderBottomWidth:1
    },
    secondLine:{
        flexDirection:'row',
        alignItems:'center',
        height:50,
        justifyContent:'space-between',
        marginTop:10
    },
    verifyCode:{
        width:width-140,
        borderWidth:1,
        borderColor:'#e7e7e7',
        borderRadius:10,
        color:'#303030',
        paddingLeft:10,
        backgroundColor:'#fff'
    },
    getVerifyCode:{
        width:120,
        backgroundColor:'#4a8bfc',
        borderRadius:10,
        alignItems:'center',
        flexDirection:'column',
        justifyContent:'center',
        height:50,
    },
    getCodeTitle:{
        color:'#fff',
    },
});