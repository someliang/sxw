/**
 * God bless.
 * User: lonso
 * Email: lonso@foxmail.com
 * Date: 13-12-31
 * Time: 上午11:44
 */

var crypto = require('crypto')
    , async = require('async')
    , querystring = require('querystring')
    , url = require('url')
    , orm = require('orm');

//User
exports.userNew = function(req, res){
    res.render('admin/user/userNew');
};

exports.userCreate = function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var is_admin = req.body.is_admin || 0;
    if (is_admin =='false') {
        is_admin = 0;
    }
    if (!username || !password || !confirmPassword) {
        res.json({isSuccess: false, errorMessage: '请输入完整的新增信息.'});
    } else if(password.length < 6 || confirmPassword.length < 6){
        res.json({isSuccess: false, errorMessage: '密码长度不能小于6.'});
    } else if(!(password === confirmPassword)) {
        res.json({isSuccess: false, errorMessage: '两次输入密码不一致.'});
    } else {
        var User = req.models.user;
        User.find({username: username}).count(function(err, count){
            if (err) {
                console.error('userCreate ====>' + err.message);
                return res.json({isSuccess: false});
            }
            if (count !== 0) {
                res.json({isSuccess: false, errorMessage: '用户名已存在.'});
            } else {
                User.create({
                    username: username,
                    password: crypto.createHash('md5').update(password).digest('hex'),
                    is_admin: is_admin
                }, function(err, item){
                    if (err) {
                        console.error('userCreate creating====>' + err.message);
                        return res.json({isSuccess: false});
                    }
                    res.json({isSuccess: true});
                });
            }
        });
    }
};

exports.users = function(req, res){
    var User = req.models.user;
    User.find().all(function(err, users){
        if (err) {
            console.error('users ====>' + err.message);
            return res.json({isSuccess: false});
        }
        res.json({isSuccess: true, rows: users});
    });
};

exports.userList = function(req, res){
    res.render('admin/user/userList');
};

exports.userUpdate = function(req, res){
    var id = req.body.id;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var is_admin = req.body.is_admin || 0;
    if (is_admin =='false') {
        is_admin = 0;
    }
    if (!id || !username || !password){
        res.json({isSuccess: false, errorMessage: '请填写完整信息.'})
    } else if(password.length < 6){
        res.json({isSuccess: false, errorMessage: '密码长度不能小于6.'})
    } else if(confirmPassword && !(confirmPassword === password)){
        res.json({isSuccess: false, errorMessage: '两次密码输入不一致.'})
    } else {
        var User = req.models.user;
        User.get(id, function(err, user){
            if (err) {
                console.error('userUpate ====>' + err.message);
                return res.json({isSuccess: false});
            }
            var decodePassword = crypto.createHash('md5').update(password).digest('hex');
            if (confirmPassword) {
                if (req.user.is_admin || req.user.id == id) {
                    var decodeConfirmPassword = crypto.createHash('md5').update(confirmPassword).digest('hex');
                    if (decodePassword === decodeConfirmPassword){
                        user.save({
                            username: username,
                            password: crypto.createHash('md5').update(password).digest('hex'),
                            is_admin: is_admin
                        }, function(err){
                            if (err) {
                                console.error('userUpdate updating ====>' + err.message);
                                return res.json({isSuccess: false});
                            }
                            res.json({isSuccess: true});
                        });

                    } else {
                        res.json({isSuccess: false, errorMessage: '两次密码输入不一致.'})
                    }
                }  else {
                    res.json({isSuccess: false, errorMessage: '你只能修改自己的密码.'})

                }
            } else {
                if (user.password === password) {
                    user.save({
                        username: username,
                        is_admin: is_admin
                    }, function(err){
                        if (err) {
                            console.error('userUpdate updating ====>' + err.message);
                            return res.json({isSuccess: false});
                        }
                        res.json({isSuccess: true});
                    });
                } else {
                    if (req.user.is_admin || req.user.id == id) {
                        user.save({
                            username: username,
                            password: decodePassword,
                            is_admin: is_admin
                        }, function(err){
                            if (err) {
                                console.error('userUpdate updating ====>' + err.message);
                                return res.json({isSuccess: false});
                            }
                            res.json({isSuccess: true});
                        });
                    } else {
                        res.json({isSuccess: false, errorMessage: '你只能修改自己的密码.'})

                    }
                }

            }
        });
    }
};
exports.userDelete = function(req, res){
    var ids = req.body.id;
    if (!ids) {
        res.json({isSuccess: false});
    } else {
        ids = ids.split(',');
        var User = req.models.user;
        User.find({id: ids}).remove(function(err){
            if (err) {
                console.error('userDelete ====>' + err.message);
                return res.json({isSuccess: false});
            }
            res.json({isSuccess: true});
        });
    }
};

