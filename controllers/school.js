/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 1/7/14
 * Email: lonso@foxmail.com
 * God Bless !.
 */

var async = require('async')
    , util = require('../util/utils');


exports.schools = function(req, res){

};

exports.schoolNew = function(req, res){
     res.render('school/schoolNew')
};

exports.schoolList = function(req, res){

};



exports.schoolCreate = function(req, res){
    var name = req.body.name.trim();
    var province = req.body.province;
    var category = req.body.category;
    var summary = req.body.summary;
    var description = req.body.description;
    var characterIds = req.body.characterIds;
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
                            description: description
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
                            cb(null, null);
                        })
                    }
                ], function(err){
                    if (err) {
                        console.error('schoolCreate saving====>' + err.message);
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
