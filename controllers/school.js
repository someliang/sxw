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
    , queryString = require('querystring')
    , moment = require('moment');


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

exports.schoolDetails = function(req, res){
    var id = req.params.id || '';
    if (!id) {
         res.json({isSuccess: false, rows: ''});
    } else {
        var SchoolDetail = req.models.schoolDetail;
        SchoolDetail.find({sxw_school_id: id}).all(function(err, schoolDetails){
            if (err) {
                console.error('SchoolDetail ====>' + err.message);
                return res.json({isSuccess: false});
            }
            res.json({isSuccess: true, rows: schoolDetails});
        })
    }
};

function deleteSchoolInfo(req, id){
    var School = req.models.school;
    var Translation2School = req.models.translation2school;
    async.waterfall([
        function(cb){
            Translation2School.find({sxw_school_id: id}).remove(function(err){
                if (err)
                    console.error('translation 2 school delete ====>' + err.message);
                cb();
            })
        },
        function(t2s, cb){
            School.find({id: id}).remove(function(err){
                if (err)
                    console.error('Schooldelete ====>' + err.message);
                cb();
            })
        }
    ], function(err){
        if (err)
            console.error('delete school info ====>' + err.message);
        console.log('delete school info success');
    })
}


exports.schoolCreate = function(req, res){
    var name = req.body.name.trim();
    var province = req.body.province;
    var category = req.body.category;
    var summary = req.body.summary;
    var description = req.body.description;
    var characterIds = req.body.characterIds;
    var details = req.body.details && JSON.parse(req.body.details);
    var priority = req.body.priority || 0;
    if (!name || !province || !category || !summary || !description || !req.files.file) {
        res.json({isSuccess: false});
    } else {
        var School = req.models.school;
        var Translation2School = req.models.translation2school;
        var SchoolDetail = req.models.schoolDetail;
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
                            if (err) {
                                console.error('school creating ====>' + err.message);
                                cb(err);
                            }
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
                    },
                    function(school, cb){
                        try{
                            async.each(details, function(detail, callback){
                                SchoolDetail.create({
                                    location: detail.location,
                                    vintage: new Date(detail.vintage, 0, 1),
                                    grade: detail.grade,
                                    shift: detail.shift,
                                    admission: detail.admission,
                                    average: detail.average,
                                    science: detail.science,
                                    sxw_school_id: school.id
                                }, function(err, item){
                                    if (err) {
                                        console.error("school create details ====>" + err.message);
                                        cb(err);
                                    }
                                    callback();
                                })
                            }, function(err){
                                if (err) {
                                    console.error('school create  details async ====>' + err.message);
                                    cb(err);
                                }
                                cb(null, school);
                            })
                        }catch(e){
                            deleteSchoolInfo(req, school.id);
                            cb(e);
                        }
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

exports.schoolDetailCreate = function(req, res){
    var id = req.params.id;
    if (!id) {
        res.json({isSuccess: false});
    } else {
        var vintage = req.body.vintage;
        var location = req.body.location;
        var grade = req.body.grade;
        var shift = req.body.shift;
        var admission = req.body.admission;
        var average = req.body.average;
        var science = req.body.science && req.body.science === '文科' && 1 || 0;
        if (!vintage || !location || !grade || !shift || !admission || ! average) {
            return res.json({isSuccess: false});
        } else {

            var SchoolDetail = req.models.schoolDetail;
            SchoolDetail.create({
                vintage: new Date(vintage, 0, 1),
                location: location,
                grade: grade,
                shift: shift,
                admission: admission,
                average: average,
                science: science,
                sxw_school_id: id
            }, function(err){
                if (err) {
                    console.error('shool detail create ====>' + err.message);
                    return res.json({isSuccess: false});
                }
                res.json({isSuccess: true});
            })
        }
    }
};

exports.schoolDetailUpdate = function(req, res){
    var vintage = req.body.vintage;
    var location = req.body.location;
    var grade = req.body.grade;
    var shift = req.body.shift;
    var admission = req.body.admission;
    var average = req.body.average;
    var id = req.body.id;
    var science = req.body.science && req.body.science === '文科' && 1 || 0;
    if (!vintage || !location || !grade || !shift || !admission || ! average || !id) {
        return res.json({isSuccess: false});
    } else {
        var SchoolDetail = req.models.schoolDetail;
        SchoolDetail.get(id, function(err, schoolDetail){
            if (err) {
                console.error('school detail get ====>' + err.message);
                return res.json({isSuccess: false});
            }
            schoolDetail.save({
                vintage: new Date(vintage, 0, 1),
                location: location,
                grade: grade,
                shift: shift,
                admission: admission,
                average: average,
                science: science
            }, function(err){
                if (err) {
                    console.error('shool detail update ====>' + err.message);
                    return res.json({isSuccess: false});
                }
                res.json({isSuccess: true});
            })
        })
    }
};

exports.schoolDetailDelete = function(req, res){
    var ids = req.body.id;
    if (!ids) {
        res.json({isSuccess: false});
    } else {
        ids = ids.split(',');
        var SchoolDetail = req.models.schoolDetail;
        SchoolDetail.find({id: ids}).remove(function(err){
            if (err) {
                console.error('school detail delete ====>' + err.message);
                return res.json({isSuccess: false});
            }
            res.json({isSuccess: true});
        })
    }
};

exports.majorNew = function(req, res){
    res.render('major/majorNew');
};

exports.majorDetails = function(req, res){
    var schoolId = req.params.id || '';
    if (!schoolId) {
        res.json({isSuccess: false, rows: ''});
    } else {
        var Major = req.models.major;
        var MajorDetail = req.models.majorDetail;
        var items = [];
        Major.find({sxw_school_id: schoolId}).all(function(err, majors){
            if (err) {
                console.error('major get by school ====>' + err.message);
                return res.json({isSuccess: false});
            }
            async.each(majors, function(major, callback){
                MajorDetail.find({sxw_major_id: major.id}).all(function(err, majorDetails){
                    if (err) {
                        console.error('major details get by major ====>' + err.message);
                        return res.json({isSuccess: false});
                    }
                    async.each(majorDetails, function(majorDetail, callback){
                        var item = {};
                        item = majorDetail;
                        item.name = major.name;
                        items.push(item);
                        callback();
                    }, function(err){
                        if (err) {
                            console.error('major details async ====>' + err.message);
                            return res.json({isSuccess: false});
                        }
                        callback();
                    })
                })

            }, function(err){
                if (err) {
                    console.error('async majors ====>' + err.message);
                    return res.json({isSuccess: false});
                }
                res.json({isSuccess: true, rows: items});
            })
        })

    }
};

exports.majorCreate = function(req, res){
    var id = req.body.schoolId;
    var name = req.body.name;
    var category = req.body.category;
    var priority = req.body.priority;
    var description = req.body.description;
    var details = req.body.details;
    var science = req.body.science && 1 || 0;
    if (!id || !name || !category || !description) {
        res.json({isSuccess: false});
    } else {
        var Major = req.models.major;
        var MajorDetail = req.models.majorDetail;
        Major.find({name: name, sxw_school_id: id}).count(function(err, count){
            if (err) {
                console.error('major creaet ====>' + err.message);
                return res.json({isSuccess: false});
            }
            if (count ===0) {
                async.waterfall([
                    function(cb){
                        Major.create({
                            category: category,
                            description: description,
                            sxw_school_id: id,
                            name: name,
                            science: science,
                            priority: priority
                        }, function(err, item){
                            if (err) {
                                console.error('major Create ====>' + err.message);
                                cb(err);
                            }
                            cb(null, item);
                        })
                    },
                    function(major, cb){
                        async.each(details, function(detail, callback){
                            MajorDetail.create({
                                vintage: new Date(detail.vintage, 0, 1),
                                location: detail.location,
                                grade: detail.grade,
                                shift: detail.shift,
                                admission: detail.admission,
                                average: detail.average,
                                sxw_major_id: major.id
                            }, function(err){
                                if (err) {
                                    console.error('major detail create ====>' + err.message);
                                    cb(err);
                                }
                                callback();
                            })
                        }, function(err){
                            if (err) {
                                console.error('major detail creating ====>' + err.message);
                                cb(err);
                            }
                            cb();
                        })
                    }

                ], function(err){
                    if (err) {
                        console.error('major creaet ====>' + err.message);
                        return res.json({isSuccess: false});
                    }
                    res.json({isSuccess: true});
                })
            } else {
                res.json({isSuccess: false, errorMessage: '专业名称已存在'})
            }
        })
    }
};

