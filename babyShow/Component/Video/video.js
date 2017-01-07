import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    ActivityIndicator,
    RefreshControl,
    AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Mine from '../Mine/mine';
import Record from '../Record/record';
import Picture from '../Picture/picture';
import config from '../common/config';
import request from '../common/request';
import Item from './item';
import VideoDetail from './detail';
import BottomTab from '../common/bottomTab';
import getRouteIndex from '../common/getRouteIndex';
import StatusBarR from '../common/statusBar';
import NavBarR from '../common/navbar';
var Dimensions=require('Dimensions');
var {width,height}=Dimensions.get('window');
var allItems={
    items:[],
    pageNo:1,
    totalPage:0,
};
export default class Video extends Component {
    constructor(props) {
        super(props);
        //创建数据源
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            totalCount:0,
            isLoading:true,
            isRefreshing:false,
            barArr:[
                {iconName:'ios-videocam',tabName:'视频',iconSize:'30'},
                {iconName:'ios-recording',tabName:'录制',iconSize:'30'},
                // {iconName:'ios-aperture',tabName:'图片',iconSize:'30'},
                {iconName:'ios-contact',tabName:'我的',iconSize:'30'}
            ]
        };
        this.handleTabChange=this.handleTabChange.bind(this);
    }
    handleTabChange(index){
        let {navigator}=this.props;
        if(navigator){
            var routeStacks=navigator.getCurrentRoutes()
        }
        if(index==2){
            if(navigator){
                var routeIndex=getRouteIndex.getRouteIndex('Mine',routeStacks);
                if(routeIndex!='no'){
                    navigator.jumpTo(navigator.getCurrentRoutes()[routeIndex])
                }else{
                    navigator.push({
                        name:'Mine',
                        component:Mine,
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
    }
    render(){
        return (
            <View style={styles.container}>
                <StatusBarR
                  backColor="rgba(0,0,0,0)"
                  translucent={true}
                />
                <NavBarR
                    titleText="今日秀广场"
                    backColor="#d43d37"
                    height={70}
                />
                <View style={{height:height-80,width:width}}>
                    <ListView
                        style={styles.listViewStyle}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderSingleRow}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        enableEmptySections={true}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={20}
                        renderFooter={()=>this._renderFooter()}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh}
                                tintColor="#ff0000"
                                title="Loading..."
                                titleColor="#00ff00"
                                colors={['#fff']}
                                progressBackgroundColor="#4a8bfc"
                            />
                        }
                    />
                </View>
                <BottomTab
                    barArr={this.state.barArr}
                    tabHeight={50}
                    iconSize={25}
                    tabIndex={0}
                    changeTab={(i)=>this.handleTabChange(i)}
                />
            </View>
        )
    }
    componentWillMount(){
        // var xhr=new XMLHttpRequest();
        // xhr.open('GET','http://api.jisuapi.com/news/channel?appkey=76f6327bd806d98d',true)
        // xhr.send();
        // xhr.onreadystatechange=()=> {
        //     if(xhr.readyState==4 || xhr.status==200){
        //         // console.log('同步请求返回结果:' + xhr.response)
        //     }
        // }
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows([
                // {
                //     "id":"140000200312176150","thumb":"http://dummyimage.com/640x320/2de7fb)","title":"","videoUrl":"'http://v.youku.com/v_show/id_XMTgyMzcwOTA4MA==.html?from=s1.8-1-1.1&spm=a2h0k.8191407.0.0'"
                // }
                // ,
                // {
                //     "id":"610000198008083286","thumb":"http://dummyimage.com/640x320/c74e2e)","title":"","videoUrl":"'http://v.youku.com/v_show/id_XMTgyMzcwOTA4MA==.html?from=s1.8-1-1.1&spm=a2h0k.8191407.0.0'"
                // }
                // ,
                // {
                //     "id":"820000199012118764","thumb":"http://dummyimage.com/640x320/646912)","title":"","videoUrl":"'http://v.youku.com/v_show/id_XMTgyMzcwOTA4MA==.html?from=s1.8-1-1.1&spm=a2h0k.8191407.0.0'"
                // }
            ])
        })
    }
    componentDidMount(){
        AsyncStorage.getItem("token").then((res)=>{
            this.setState({
                token:res
            });
            this._fetchData(allItems.pageNo);
        }).catch((err)=>{
            console.log(err)
        });

        console.log(this.props)
    }
    //下拉刷新
    _onRefresh=()=>{
        allItems.items=[];
        allItems.pageNo=1;
        this.setState({
            isLoading:true,
            isRefreshing:true
        });
        this._fetchData(1)
    };
    //加载更多数据
    loadMoreData=()=>{
        if(this._hasMore() && this.state.isLoading!=true && allItems.items.length>0){
            console.log('触发了加载更多');
            this.setState({
                isLoading:true,
            });
            allItems.pageNo++;
            this._fetchData(allItems.pageNo)
        }
    };
    _renderFooter(){
        if(!this._hasMore() && !this.state.isLoading){
            return(
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>没有更多数据了</Text>
                </View>
            )
        }else{
            return(
                <ActivityIndicator style={styles.loadingMore}/>
            )
        }
    }
    _hasMore(){
        return allItems.items.length!==allItems.totalPage
    }
    //从网络上获取数据,rap.taobao.org
    _fetchData(pageNo){
        var that=this;
        this.setState({
            isLoading:true
        });
        request.post(config.api.videoList,{
            pageNo: pageNo,
            pageSize: 10,
            token:that.state.token
        }).then((res)=>{
            if (res && res.code == 200 && res.data.length > 0) {
                allItems.items=allItems.items.concat(res.data.slice());
                allItems.totalPage=res.total;
                setTimeout(()=>{
                    that.setState({
                        dataSource:this.state.dataSource.cloneWithRows(allItems.items),
                        isLoading:false,
                        isRefreshing:false
                    });
                },200)
            }else{
                alert(res.data)
            }
        }).catch((error)=>{
            console.error(error);
        });
    }
    goDetail=(rowData)=>{
        let {navigator}=this.props;
        if(navigator){
            navigator.push({
                name:'detail',
                component:VideoDetail,
                params:{
                    video:rowData
                }
            })
        }
    };
    /*具体的cell*/
    renderSingleRow=(rowData)=>{
        return(
            <Item
                key={rowData.id}
                rowData={rowData}
                up={false}
                clickItem={()=>this.goDetail(rowData)}
            />
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#F5FCFF',
    },
    loadingMore:{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    listViewStyle:{
        //主轴方向
        width:width,
        height:height-120,
        backgroundColor:'#F5FCFF',
        position:'absolute',
        top:0
    },
});