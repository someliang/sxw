/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 12/10/13
 * Time: 8:35 PM
 * To change this template use File | Settings | File Templates.
 */

exports.index = function(req, res){
    res.render('index');
};

exports.login = function(req, res){
    res.render('login');
};

exports.doLogin = function(req, res){
    res.render('login', {message:"lonso error"});
};

exports.logout = function(req, res){
    req.logout();
    res.redirect('/');
};
