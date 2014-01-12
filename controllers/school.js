/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 1/7/14
 * Email: lonso@foxmail.com
 * God Bless !.
 */

var async = require('async')
    , util = require('../util/utils')
    , url = require('url')
    , queryString = require('querystring');


function getTranslationName(req, id, cb){
    var Translation = req.models.translation;
    Translation.get(id, function(err, item){
        cb(err, item);
    })

}

exports.schools = function(req, res){
    var School = req.models.school;
    School.find().all(function(err, schools){
        if (err) {
            console.error("schools ====>" + err.message);
            return res.json({isSuccess: false});
        }
        var items = [];
        async.each(schools, function(school, callback){
            async.parallel({
                getProvince: function(cb){
                    getTranslationName(req, school.province, function(err, item){
                        cb(err, item);
                    })
                },
                getCategory: function(cb){
                    getTranslationName(req, school.category, function(err, item){
                        cb(err, item);
                    })
                }
            }, function(err, result){
                if (err) throw(err);
                school.province = result.getProvince.name;
                school.category = result.getCategory.name;
                items.push(school);
                callback();
            })
        }, function(err){
            if (err) {
                console.error("schools ====>" + err.message);
                return res.json({isSuccess: false});
            }
            res.json({isSuccess: true, rows: items});
        })
    })

};

exports.schoolNew = function(req, res){
     res.render('school/schoolNew')
};

exports.schoolList = function(req, res){
    res.render('school/schoolList');
};

exports.schoolUpdateForm = function(req, res){
    res.render('school/schoolUpdate');
};



exports.schoolCreate = function(req, res){
    var name = req.body.name.trim();
    var province = req.body.province;
    var category = req.body.category;
    var summary = req.body.summary;
    var description = req.body.description;
    var characterIds = req.body.characterIds;
    var priority = req.body.priority || 0;
    if (!name || !province || !category || !summary || !description || !req.files.file) {
        res.json({isSuccess: false});
    } else {
        var School = req.models.school;
        var Translation2School = req.models.translation2school;
        School.find({name: name}).count(function(err, count){
            if (err) {
                console.error('schoolCreate school count====>' + err.message);
                return res.json({isSuccess: false});
            }
            if (count === 0) {
                async.waterfall([
                    function(cb){
                        util.saveUploadFile(req, function(err, savePath){
                            err && cb(err);
                            cb(null, savePath);
                        })
                    },
                    function(savePath, cb){
                        School.create({
                            name: name,
                            badge: savePath,
                            province: province,
                            category: category,
                            summary: summary,
                            description: description,
                            priority: priority
                        }, function(err, item){
                            err && cb(err);
                            cb(null, item);
                        })
                    },
                    function(school, cb){
                        var characterIdList = characterIds.substr(0, characterIds.length-1).split(',');
                        async.each(characterIdList, function(characterId, callback){
                            Translation2School.create({
                                sxw_translation_id: characterId,
                                sxw_school_id: school.id
                            }, function(err){
                                err && cb(err);
                                callback();
                            })
                        }, function(err){
                            err && cb(err);
                            cb(null, school);
                        })
                    }
                ], function(err, result){
                    if (err) {
                        console.error('schoolCreate saving====>' + err.message);
                        return res.json({isSuccess: false});
                    }
                    Translation2School.find({sxw_school_id: result.id}).all(function(err, t2ss){
                        if (err) {
                            console.error("school read character ====>" + err.message);
                            res.json({isSuccess: false});
                        }
                        var characterIds = [];
                        async.each(t2ss, function(character, callback){
                            characterIds.push(character.sxw_translation_id);
                            callback();
                        }, function(err){
                            if (err) {
                                console.error("school read character ====>" + err.message);
                                res.json({isSuccess: false});
                            }
                            result.characters = characterIds;
                            res.json({isSuccess: true, item: result});
                        })
                    });
                })
            } else {
                res.json({isSuccess: false, errorMessage: '所填写的学校名称已存在,请核对后再填写.'});
            }
        })
    }
};


exports.schoolRead = function(req, res){
    var id = queryString.parse(url.parse(req.url).query).id;
    if (!id) {
        res.json({isSuccess: false});
    } else {
        var School = req.models.school;
        var Translation2School = req.models.translation2school;
        async.parallel({
            school: function(cb){
                School.get(id, function(err, item){
                    cb(err, item);
                })
            },
            characters: function(cb){
                Translation2School.find({sxw_school_id: id}).all(function(err, t2ss){
                    cb(err, t2ss);
                })
            }
        }, function(err, result){
            if (err) {
                console.error("school read ====>" + err.message);
                res.json({isSuccess: false});
            }
            var characterIds = [];
            async.each(result.characters, function(character, callback){
                characterIds.push(character.sxw_translation_id);
                callback();
            }, function(err){
                if (err) {
                    console.error("school read character ====>" + err.message);
                    res.json({isSuccess: false});
                }
                result.school.characters = characterIds;
                res.json({isSuccess: true, item: result.school});
            })
        })
    }
};

exports.schoolUpdate = function(req, res){
    var name = req.body.name.trim();
    var id = req.body.id;
    var province = req.body.province;
    var category = req.body.category;
    var summary = req.body.summary;
    var description = req.body.description;
    var characterIds = req.body.characterIds;
    var priority = req.body.priority || 0;
    if (!name || !province || !category || !summary || !description || !id) {
        res.json({isSuccess: false});
    } else {
        var School = req.models.school;
        var Translation2School = req.models.translation2school;
        School.find({name: name}).count(function(err, count){
            if (err) {
                console.error('schoolUpdate school count====>' + err.message);
                return res.json({isSuccess: false});
            }
            if (count < 2) {
                async.waterfall([
                    function(cb){
                        util.saveUploadFile(req, function(err, savePath){
                            err && cb(err);
                            cb(null, savePath);
                        })
                    },
                    function(savePath, cb){
                        School.get(id, function(err, school){
                            err && cb(err);
                            if (savePath) {
                                school.save({
                                    name: name,
                                    badge: savePath,
                                    province: province,
                                    category: category,
                                    summary: summary,
                                    description: description,
                                    priority: priority
                                }, function(err){
                                    err && cb(err);
                                    cb(null, null);
                                })
                            } else {
                                school.save({
                                    name: name,
                                    province: province,
                                    category: category,
                                    summary: summary,
                                    description: description,
                                    priority: priority
                                }, function(err){
                                    err && cb(err);
                                    cb(null, null);
                                })
                            }
                        })
                    },
                    function(school, cb){
                        var characterIdList = characterIds.substr(0, characterIds.length-1).split(',');
                        Translation2School.find({sxw_school_id: id}).remove(function(err){
                            err && cb(err);
                            async.each(characterIdList, function(characterId, callback){
                                Translation2School.create({
                                    sxw_translation_id: characterId,
                                    sxw_school_id: id
                                }, function(err){
                                    err && cb(err);
                                    callback();
                                })
                            }, function(err){
                                err && cb(err);
                                cb(null, null);
                            })
                        })
                    }
                ], function(err){
                    if (err) {
                        console.error('schoolUpdate saving====>' + err.message);
                        return res.json({isSuccess: false});
                    }
                    res.json({isSuccess: true});
                })
            } else {
                res.json({isSuccess: false, errorMessage: '所填写的学校名称已存在,请核对后再填写.'});
            }
        })
    }
};

exports.schoolDelete = function(req, res){
    var ids = req.body.id;
    if (!ids) {
        res.json({isSuccess: false});
    } else {
        var School = req.models.school;
        var Translation2School = req.models.translation2school;
        ids = ids.split(",");
        Translation2School.find({sxw_school_id: ids}).remove(function(err){
            if (err) {
                console.error("schoolDelete ====>" + err.message);
                return res.json({isSuccess: false});
            }
            School.find({id: ids}).remove(function(err){
                if (err) {
                    console.error("schoolDelete ====>" + err.message);
                    return res.json({isSuccess: false});
                }
                res.json({isSuccess: true});
            });
        })
    }
};

exports.majorCreate = function(req, res){
    res.render('major/majorNew');
};