/**
 * Created by Dell on 2016/11/30.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';
import Video from './Video/video';
import Mine from './Mine/mine';
import Record from './Record/record';
import Picture from './Picture/picture';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import RickyTabBar from '../tabBar';
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabNames: ['视频', '录制', '图片', '我的'],
            tabIconNames: ['ios-videocam', 'ios-recording', 'ios-aperture', 'ios-contact'],
            isSigned:false,
        };
    }
    componentDidMount(){

    }
    render() {
        return (
            <Video/>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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
});

