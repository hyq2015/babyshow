/**
 * Created by Dell on 2016/12/1.
 */
'use strict';
module.exports={
    getRouteIndex(name,arr){
        // console.log('路由名字:'+name)
        // console.log('路由堆栈:'+JSON.stringify(arr))
        for(var i=0;i<arr.length;i++){
            if(arr[i].name.toUpperCase()==name.toUpperCase()){
                return i
            }
        }
        return 'no'
    }
}