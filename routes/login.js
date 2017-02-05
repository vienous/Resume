/**
 * Created by Administrator on 2017/2/3.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var common =require('../common');
var db = require('../MongoDb/db')
var path = require('path');

router.get('/login',function(req,res,next){
    if(isLogined(req)){
        res.redirect('/profile?'+Date.now());
    }else{
        res.render('login',{msg:''});
    }
});
function isLogined (req) {
    // body...
    if(req.cookies["account"] != null){
        var account = req.cookies["account"];
        var username = account.account;
        var hash = account.hash;
        common.authenticate(username, hash,function(flag) {
            if(flag==1){
                console.log(req.cookies.account.account + " had logined.");
                return true;
            }
        });
    }
    return false;
}

function updateLastLoginTime(username,cb){
    db.updateLastLoginTime(username,Date().toString(),function () {
        cb();
    });
}
router.post('/login',function (req,res,next) {
    var username = req.body.login_username;
    var hash = common.hashPW(username, req.body.login_password);
    common.authenticate(username,hash,function (flag,last_logintime) {
        switch(flag){
            case 1: //success
                updateLastLoginTime(username,function () {
                    console.log("login ok, last - " + last_logintime);
                    res.cookie("account", {account: username, hash: hash, last: last_logintime}, {maxAge: 60000});
                    res.redirect('/profile');
                    console.log("after redirect");
                });
                break;
            case 0: //password error
                console.log("password error");
                res.render('login', {msg:"密码错误"});
                break;
            case 2: //user not found
                console.log("user not found");
                res.render('login', {msg:"用户名不存在"});
                break;
        }

    });

});
router.get('/sendfile',function (req,res,next) {
    console.log('发送文件');
    res.sendFile(path.resolve(__dirname,'','../example.html'));
});
router.get('/',function (req,res,next) {
    // console.log('发送文件');
    // res.sendFile(path.resolve(__dirname,'','../example.html'));
    res.redirect('/profile');
});
router.get('/profile',function (req,res,next) {
    var data = {};
    db.find('profile',data,function (result) {
        console.log(result);
        res.render('profile',{data:result})
    })
});
module.exports = router;
