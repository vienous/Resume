/**
 * Created by Administrator on 2017/2/3.
 */


var crypto = require('crypto');
var db = require('./MongoDb/db')

exports.hashPW = function(userName, pwd){
    var hash = crypto.createHash('md5');
    hash.update(userName + pwd);
    return hash.digest('hex');
}

exports.authenticate = function(username,hash,cb){
    var status = '';
    var last_logintime = '';
    db.validate(username,function (result) {
        if(result){
            if(result.username===username){
                if(result.hash===hash){
                    last_logintime = result.last_logintime;
                    status = 1;
                    cb(status,last_logintime);
                    return ;

                }else{
                    status = 0;
                    cb(status,last_logintime);
                    return ;
                }
            }
        }
        status = 2;
        cb(status,last_logintime);
        return ;
    })
}