/**
 * Created by Administrator on 2017/2/3.
 */
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/test';
//验证用户名密码
exports.validate = function (username, cb) {
    var finduser = function(db, callback) {
        db.collection('user').findOne({'username':username} ,function(err,result){
            cb(result);
            callback();
        });
    };
    MongoClient.connect(url, function(err, db) {
        finduser(db, function() {
            db.close();
        });
    });

};
exports.find = function (collectionName,data, cb) {
    var finduser = function(db, callback) {
        db.collection(collectionName).findOne(data ,function(err,result){
            cb(result);
            callback();
        });
    };
    MongoClient.connect(url, function(err, db) {
        finduser(db, function() {
            db.close();
        });
    });

};

exports.updateLastLoginTime = function(username,time,cb_1){
    var update = function(db, callback) {
        db.collection('user').updateOne({ "username":username },{"$set":{"last_logintime":time}},function(err, results) {
            callback();
        });
    };

    MongoClient.connect(url, function(err, db) {
        update(db, function() {
            db.close();
        });
        cb_1();
    });
}