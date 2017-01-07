/**
 * Created by admin on 2016/11/30.
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
    TouchableOpacity,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var Dimensions=require('Dimensions');
var {width,height}=Dimensions.get('window');
export default class BottomTab extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.renderTab=this.renderTab.bind(this);
    }
    renderTab(){
        let tabBarArr=[];
        for(let i=0;i<this.props.barArr.length;i++){
            let singleTab=this.props.barArr[i];
            tabBarArr.push(
                <TouchableOpacity key={i} activeOpacity={0.8} onPress={()=>this.props.changeTab(i)}>
                    <View style={[styles.singleTab,{height:this.props.tabHeight ? this.props.tabHeight : 50}]}>
                        <Icon
                            name={singleTab.iconName}
                            size={this.props.iconSize ? this.props.iconSize : 30}
                            color={i==this.props.tabIndex ? '#6B8E23' : '#ADADAD'}
                        />
                        <Text style={{fontSize:12,color:i==this.props.tabIndex ? '#6B8E23' : '#ADADAD'}}>{singleTab.tabName}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        return tabBarArr
    }
    render() {
        return(
            <View style={[{height:this.props.tabHeight ? this.props.tabHeight : 50,backgroundColor:this.props.backColor ? this.props.backColor : '#efefef'},styles.tabBar]}>
                {this.renderTab()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    tabBar: {
        flexDirection:'row',justifyContent:'space-around',position:'absolute',bottom:0,left:0,
        width:width
    },
    singleTab:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:80,
    },
});

