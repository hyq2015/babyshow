'use strict';
import Mock from 'mockjs';
import config from './config';
import queryString from 'query-string';
import _ from 'lodash';
let request={};
request.get=(url,params)=>{
    if(params){
        url+='?'+queryString.stringify(params)
    }
    return fetch(url)
        .then((res)=>res.json())
        .then((res)=>{
            // var objdata=eval('(' + res + ')');
            // var objdata=JSON.parse(res);
            return Mock.mock(res)
        })
};
request.post=(url,body)=>{
    //lodash合并为对象
    let map=_.extend(config.headers,{
        body:JSON.stringify(body),
        method:'post'
    });
    return fetch(url,map)
        .then((res)=>res.json())
        .then((res)=>{
            // var objdata=eval('(' + res + ')');
            return Mock.mock(res)
        });
};
module.exports=request;