/**
 * Created by admin on 2016/12/9.
 */
import React, {Component} from 'react';
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
var Dimensions=require('Dimensions');
let {width,height}=Dimensions.get('window');
export default class NavBarR extends Component{
  constructor(props){
    super(props);

  }
  render(){
    return(
    <TouchableOpacity onPress={this.props.pressNavBar} activeOpacity={1}>
      <View style={[styles.titleContainer,{backgroundColor:this.props.backColor ? this.props.backColor :'#fff',height:this.props.height ? this.props.height : 50}]}>
        <Text style={styles.title}>{this.props.titleText}</Text>
      </View>
    </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  title:{
    color:'#fff',
    fontSize:18
  },
  titleContainer:{
    width:width,
    alignItems:'center',
    justifyContent:'center',
    marginTop:0
  }
});