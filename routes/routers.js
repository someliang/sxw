/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 12/10/13
 * Time: 8:38 PM
 * To change this template use File | Settings | File Templates.
 */

var index = require('../controllers/index.js')
    , school = require('../controllers/school.js')
    , translation = require('../controllers/translation.js')
    , uploadController = require('../controllers/upload.js')
    , authenticate = require('../config/authenticate.js')
    , admin = require('../controllers/admin.js')
    , passport = require('passport')
    , async = require('async');

module.exports = function (app) {
    app.get('/login', index.login);
    app.get('/logout', index.logout);
    app.post('/upload', uploadController.upload);
    app.post('/imageManger', uploadController.imageManger);
    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.render('login', info); }
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        })(req, res, next);
    });

    app.all('*', authenticate.ensureAuthenticated);

    //basic
    app.get('/', index.index);
    app.get('/getTranslationSelectStyle', translation.getTranslationSelectStyle);
    app.get('/getCategory', translation.getCategory);
    app.get('/getProvinces', translation.getProvinces);
    app.get('/getSchoolCategories', translation.getSchoolCategories);
    app.get('/getSchoolCharacters', translation.getSchoolCharacters);

    //school
    app.get('/school/new', school.schoolNew);
    app.get('/school/list', school.schoolList);
    app.post('/school', school.schoolCreate);





    //translation url
    app.get('/translations', translation.getTranslations);
    app.get('/translation/list', translation.translationList);
    app.get('/translation/new', translation.translationNew);
    app.post('/translation', translation.translationCreate);
    app.put('/translation', translation.translationUpdate);
    app.delete('/translation', translation.translationDelete);

    //admin
    //user
    app.get('/admin/user/new', admin.userNew);
    app.get('/admin/users', admin.users);
    app.get('/admin/user/list', admin.userList);
    app.post('/admin/user', admin.userCreate);
    app.put('/admin/user', admin.userUpdate);
    app.delete('/admin/user', admin.userDelete);

};