/**
 * Created by Dell on 2016/11/30.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Image,
    Navigator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Mine from './mine';
var Dimensions = require('Dimensions');
var {width, height}=Dimensions.get('window');
export default class MineNav extends Component {
    constructor(props) {
        super(props);
        //创建数据源
        this.state = {
        };
    }
    render() {
        return (
            <Navigator
                tabLabel="ReactNative"
                initialRoute={{name: 'Mine', component: Mine}}
                configureScene={
                    (route)=>{
                        //页面之间的跳转动画
                        return Navigator.SceneConfigs.FadeAndroid;
                        {/*return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight*/}
                        {/*return Navigator.SceneConfigs.PushFromRight;*/}
                    }
                }
                renderScene={(route, navigator) => {
                    let Component=route.component;
                    return <Component {...route.params} navigator={navigator}/>
                }
                }
            />
        );
    }
}
const styles = StyleSheet.create({

});