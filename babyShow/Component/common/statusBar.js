/**
 * Created by admin on 2016/12/9.
 */
import React, {Component} from 'react';
import {
  StatusBar
} from 'react-native';
export default class StatusBarR extends Component{
  constructor(props){
    super(props);

  }
  render(){
    return(
      <StatusBar
        barStyle="default"
        backgroundColor={this.props.backColor ? this.props.backColor : "#fff"}
        hidden={this.props.statusBarHidden ? this.props.statusBarHidden : false}
        translucent={this.props.translucent ? this.props.translucent : false}
      />
    )
  }
}