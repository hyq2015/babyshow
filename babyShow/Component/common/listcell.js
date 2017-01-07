/**
 * Created by admin on 2016/11/29.
 */
'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var Dimensions=require('Dimensions');
var {width,height}=Dimensions.get('window');
export default class ListCell extends Component {
    constructor(props){
        super(props);
        this.state={

        }
    }
    render() {
        return (
        <TouchableOpacity activeOpacity={0.8} onPress={()=>this.props._renderModal(this.props.title,this.props.content,this.props.modalType)}>
            <View style={styles.container}>
                <Text style={styles.title}>
                    {this.props.title}
                </Text>
                <View style={styles.rightContent}>
                    <Text style={styles.content} numberOfLines={1}>
                        {this.props.content}
                    </Text>
                    <Icon
                        name="ios-arrow-forward"
                        color='#b1b1b1'
                        size={25}
                        style={styles.forward}
                    />
                </View>
            </View>
        </TouchableOpacity>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:10,
        paddingRight:10,
        borderBottomColor:'#e7e7e7',
        borderBottomWidth:1
    },
    forward:{
        position:'relative',
    },
    rightContent:{
        flexDirection:'row',
        alignItems:'center'
    },
    title: {
        fontSize: 18,
        fontWeight:'400',
    },
    content:{
        fontSize: 16,
        color:'#999999',
        width:width*0.6,
        marginRight:10,
        textAlign:'right'
    },
});