/**
 * Created by admin on 2016/11/19.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Mock from 'mockjs';
import config from '../common/config';
import request from '../common/request';
var Dimensions=require('Dimensions');
var {width,height}=Dimensions.get('window');
var allItems={
    items:[],
    pageNo:1,
    totalPage:0
};
export default class Item extends Component {
    constructor(props) {
        super(props);
        //创建数据源
        this.state = {
            rowData:this.props.rowData,
            up:this.props.up
        };
    }
    render(){
        return (

                <View style={styles.item}>
                    <Text style={styles.title}>{this.props.rowData.title}</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.props.clickItem}>
                        <Image source={{uri:this.props.rowData.qiniu_thumb}} defaultSource={{uri:'http://dummyimage.com/640x320/6f0f5e)'}} style={styles.thumbImg}>
                            <Icon
                                name='ios-play' // 图标
                                size={30}
                                style={styles.play}
                            />
                        </Image>
                    </TouchableOpacity>
                    <View style={styles.itemFooter}>
                        <View style={styles.handBox}>
                            <Icon
                                name={this.state.up ? 'ios-heart' : 'ios-heart-outline'} // 图标
                                size={30}
                                style={[styles.like,this.state.up ? styles.liked : null]}
                                onPress={this._up}
                            />
                            <Text style={styles.commentText}>点赞</Text>
                        </View>

                        <View style={styles.handBox}>
                            <Icon
                                name='ios-chatboxes-outline' // 图标
                                size={30}
                                style={styles.like}
                            />
                            <Text style={styles.commentText}>评论</Text>
                        </View>

                    </View>
                </View>

        )
    }
    //点赞功能
    _up=()=>{
        this.setState({
            up:!this.state.up
        })
    }

}
const styles = StyleSheet.create({

    liked:{
        fontSize:22,
        color:'#f00'
    },
    item:{
        width:width,
        marginBottom:10,
        backgroundColor:'#fff'
    },
    play:{
        position:'absolute',
        right:10,
        bottom:10,
        height:30,
        width:30,
        borderColor:'#fff',
        borderWidth:1,
        borderRadius:15,
        color:'#fff',
        paddingLeft:10
    },
    itemFooter:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#eee'
    },
    handBox:{
        padding:10,
        flexDirection:'row',
        width:width/2-0.5,
        justifyContent:'center',
        backgroundColor:'#fff'
    },
    like:{
        fontSize:22,
        color:'#333'
    },
    commentText:{
        color:'#333',
        marginLeft:5
    },
    title:{
        fontSize:16,
        color:'#333',
        padding:10
    },
    thumbImg:{
        width:width,
        height:width/2,
        resizeMode:'cover'
    },
});
