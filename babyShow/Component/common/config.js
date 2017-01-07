'use strict';
const localHost='http://192.168.1.4:3000';
const config={
    api:{
        baseUrl:'http://rap.taobao.org/mockjs/10326',
        list:'/list',
        comment:'/comment',
        bossUrl:'http://iph.api.bossapp.cn',
        courseList:'/app/study/micro/course',
        courseInfo:'/app/course/info',
        imageHeader:'http://iph.api.bossapp.cn/images/',
        saveCompleteVideo:localHost+'/api/saveCompleteVideo',
        checkVideoStatus:localHost+'/api/checkVideoStatus',
        videoList:localHost+'/api/videoList',
        saveComment:localHost+'/api/saveComment',
        commentList:localHost+'/api/commentList'
    },
    qiniu:{
        getsignature:localHost+'/api/signature',
        imageupload:'http://upload.qiniu.com/',
        imageHeader:'http://oh1m2te67.bkt.clouddn.com/',
        verify:localHost+'/api/user/verify',
        updateAvatar:localHost+'/api/user/updateAvatar',
        signUp:localHost+'/api/user/signup',
        signIn:localHost+'/api/user/signin',
        updateUserInfo:localHost+'/api/user/update',
        videoHeader:'http://ohen6z9lb.bkt.clouddn.com/',
        videoMatchQiniu:localHost+'/api/video/match',
        audioMatchQiniu:localHost+'/api/audio/match'
    },
    cloudinary:{
        cloud_name:'rickyshow',
        api_key:'291717125891624',
        api_secret:'esx0SFaM9m60FKsTs4o0UQRmhis',
        base:'http://res.cloudinary.com/rickyshow',
        image:'	https://api.cloudinary.com/v1_1/rickyshow/image/upload',
        video:'	https://api.cloudinary.com/v1_1/rickyshow/video/upload',
        audio:'	https://api.cloudinary.com/v1_1/rickyshow/video/upload',
    },
    headers:{
        headers:{
            'Accept':'application/json',
            // 'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Type':'application/json',
            'vbossUser':'vboss_user_7D2BE7A5FE0303B319DA397938E323B7'
        },
        // follow:20,
        timeout:8000,
        // size:0
    }
};
module.exports=config;