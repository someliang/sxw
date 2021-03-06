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
    app.get('/getLocationSelectStyle', translation.getLocationSelectStyle);
    app.get('/getGradeSelectStyle', translation.getGradeSelectStyle);
    app.get('/getVintageSelectStyle', translation.getVintageSelectStyle);
    app.get('/getVintages', translation.getVintages);
    app.get('/getCategory', translation.getCategory);
    app.get('/getProvinces', translation.getProvinces);
    app.get('/getSchoolCategories', translation.getSchoolCategories);
    app.get('/getSchoolCharacters', translation.getSchoolCharacters);
    app.get('/getMajorCharacters', translation.getMajorCharacters);
    app.get('/getMajorCategories', translation.getMajorCategories);
    app.get('/getGrades', translation.getGrades);



    //school
    app.get('/school/new', school.schoolNew);
    app.get('/school/list', school.schoolList);
    app.get('/schoolDetails/:id', school.schoolDetails);
    app.get('/school/update', school.schoolUpdateForm);
    app.get('/schools', school.schools);
    app.post('/school', school.schoolCreate);
    app.get('/school', school.schoolRead);
    app.put('/school', school.schoolUpdate);
    app.delete('/school', school.schoolDelete);

    //major
    app.get('/school/major/new', school.majorNew);
    app.get('/majorDetails/:id', school.majorDetails);
    app.get('/major/majorDetails/:id', school.majorDetailByMajor);
    app.post('/school/major', school.majorCreate);
    app.get('/school/major', school.majorRead);
    app.post('/schoolDetail/:id', school.schoolDetailCreate);
    app.put('/schoolDetail/:id', school.schoolDetailUpdate);
    app.delete('/schoolDetail/:id', school.schoolDetailDelete);
    app.get('/school/major/update', school.majorUpdateForm);


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