/**
 * Created by Administrator on 2017/2/3.
 */
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/test';
var common = require('./common');
var dbdata = require('./db_config');

function insert(collectionName,data) {
    var insertDocument = function(db, callback) {
        db.collection(collectionName).insertOne( data, function(err, result) {
            console.log("Inserted a document into the "+collectionName+" collection.");
            callback();
        });
    };
    MongoClient.connect(url, function(err, db) {
        insertDocument(db, function() {
            db.close();
        });
    });
}
function del(){
    var name = 'kafusky';
    var deleteuser = function(db, callback) {
        db.collection('user').deleteMany({ "name": name },function(err, results) {
            console.log("删除成功");
            callback();
        });
    };
    MongoClient.connect(url, function(err, db) {
        deleteuser(db, function() {
            db.close();
        });
    });
}
function findOne() {
    var finduser = function(db, callback) {
        db.collection('user').findOne({'username':dbdata.user.username,hash:common.hashPW(dbdata.user.username,dbdata.user.password)} ,function(err,result){
            if (result != null) {
                callback();
                console.log(result);
            } else {
                console.log("meizhaodao");
                callback();

            }
        });
    };

    MongoClient.connect(url, function(err, db) {
        finduser(db, function() {
            db.close();
        });
    });

};
function update(){
    var update = function(db, callback) {
        db.collection('user').updateOne({ "username": dbdata.user.username },{"$set":{"last_logintime":Date().toString()}},function(err, results) {
            console.log(results);
            callback();
        });
    };
    MongoClient.connect(url, function(err, db) {
        update(db, function() {
            db.close();
        });
    });
}
var tsak = process.argv[2];
function execute(task){
    switch(task){
        case 'insert':
            var collection = process.argv[3];
            var data = process.argv[4];
            insert(collection,dbdata[data]);
            break;
    }
}
execute(tsak);
