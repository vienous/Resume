var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var common = require('../common');

router.requireAuthentication = function(req, res, next){
    if(req.path=='/favicon.ico'){

    }else{
        if(req.path == "/login"){
            next();
            return;
        }else {
            if(req.cookies["account"] != null){
                var account = req.cookies["account"];
                var username = account.account;
                var hash = account.hash;
                console.log(username+hash);
                common.authenticate(username,hash,function (flag) {
                    if(flag==1){
                        console.log(req.cookies.account.account + " had logined.");
                        next();
                        return;
                    }else{
                        console.log("not login, redirect to /login");
                        res.redirect('/login?'+Date.now());
                    }
                })

            }else{
                console.log("not login, redirect to /login");
                //res.send('xxxxx');
                res.redirect('/login?'+Date.now());
            }

        }

    }


};
module.exports = router;