/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 13-12-13
 * Time: 下午3:13
 * To change this template use File | Settings | File Templates.
 */
var logger = require('../app').logger('translation')
    , async = require('async')
    , validator = require('validator')
    , url = require('url')
    , querystring = require('querystring')
    , orm = require('orm')
    , util = require('../util/utils')
    , moment = require('moment');


exports.getTranslations = function(req, res){
    var Translation = req.models.translation;
    Translation.find().all(function(err, translations){
        if (err) {
            console.error("translationList ====>"+ err.message);
            res.json({isSuccess: false});
        }
        res.json({rows: translations, isSuccess: true});
    })
};

exports.translationList = function(req, res){
    res.render('translation/translationList');
};


exports.getTranslationSelectStyle = function(req, res){
    var Translation = req.models.translation;
    Translation.find().all(function(err, translations){
        res.render('translation/translationSelectStyle', {translations: translations});
    })
};

exports.getLocationSelectStyle = function(req, res){
    getTranslationByFlag(req, 'province', function(err, translations){
        if (err) {
            console.error("getLocationSelectStyle ====>" + err.message);
            return res.json({isSuccess: false});
        }
        res.render('translation/translationSelectStyle', {translations: translations});
    })
};

exports.getVintages = function(req, res){
    var currentYear = moment().format("YYYY");
    var end = currentYear - 50;
    var items = [];
    for(var i=currentYear; i > end; i--) {
        var item = {};
        item.id = i;
        item.name = i;
        items.push(item);
    }
    res.json({isSuccess: true, items: items});
};


exports.translationNew = function(req, res){
    var Translation = req.models.translation;
    Translation.find().all(function(err, translations){
        res.render('translation/translationNew', {translations: translations});
    })
};

exports.translationCreate = function(req, res){
    var code = req.body.code;
    var name = req.body.name.trim();
    var priority = req.body.priority || 0;
    try{
        validator.check(priority).isInt();
    }catch(err){
        console.error("translationCreate  priority ====>"+err.message);
        return res.json({isSuccess: false});
    }
    if (!code || !name){
        res.json({isSuccess : false});
    } else {
    var oper = req.body.oper;
    var Translation = req.models.translation;
    if (oper) {
        var category = req.body.category;
        if (category) {
            var categoryFlags = category.trim().split('-');
            async.each(categoryFlags, function(categoryFlag, callback) {
                Translation.find({name:categoryFlag}, function(err, cf) {
                    if ( !cf.length) {
                        return callback('err',null);
                    } else {
                        callback();
                    }
                })
            }, function (err) {
                if (err) {
                    res.json({isSuccess: false});
                } else {
                    var categoryName = categoryFlags[categoryFlags.length - 1];
                    Translation.find({name: categoryName}, function (err, items) {
                        if (err) {
                            console.error("translationCreate oper ====>" + err.message);
                            res.json({isSuccess: false});
                        } else {
                            Translation.create({
                                code: code.toLowerCase(),
                                name: name,
                                category: items[0].id,
                                priority: priority
                            }, function (err, item) {
                                if (err) {
                                    console.error("translationCreate ====>" + err.message);
                                    res.json({isSuccess: false});
                                }
                                res.json({isSuccess: true, item: item})
                            });
                        }
                    });
                }
            });
        } else {
            Translation.create({
                code: code.toLowerCase(),
                name: name,
                category: 0,
                priority: priority
            }, function (err, item) {
                if (err) {
                    console.error("translationCreate ====>" + err.message);
                    res.json({isSuccess: false});
                }
                res.json({isSuccess: true, item: item})
            });
        }
    }  else {
        var categoryName = req.body.categoryName || '';
        var categoryId = req.body.categoryId || 0;
        if (!categoryName) {
            Translation.create({
                code: code.toLowerCase(),
                name: name,
                category: 0,
                priority: priority
            }, function (err, item) {
                if (err) {
                    console.error("translationCreate ====>" + err.message);
                    res.json({isSuccess: false});
                }
                res.json({isSuccess: true, item: item})
            });
        } else {
            Translation.get(categoryId, function (err, item) {
                if (err) {
                    console.error("translationCreate find category ====>" + err.message);
                    return res.json({isSuccess: false});
                }
                util.getFullParentName(Translation, item, function (err, fullParentName) {
                    if (fullParentName === categoryName.trim()) {
                        Translation.create({
                            code: code.toLowerCase(),
                            name: name,
                            category: categoryId,
                            priority: priority
                        }, function (err, item) {
                            if (err) {
                                console.error("translationCreate ====>" + err.message);
                                res.json({isSuccess: false});
                            }
                            res.json({isSuccess: true, item: item})
                        });
                    } else {
                        res.json({isSuccess: false});
                    }
                });
            });
        }
    }
    }
};

exports.translationUpdate = function(req, res){
    var priority = req.body.priority || 0;
    try{
        validator.check(priority).isInt();
    }catch(err){
        console.error("translationUpdate  priority ====>"+err.message);
        return res.json({isSuccess: false});
    }
    var code = req.body.code;
    var name = req.body.name.trim();
    var id = req.body.id;
    if (!code || !name || !id){
        res.json({isSuccess: false});
    } else {
        var Translation = req.models.translation;
        var category = req.body.category || 0;
        if (category) {
            var categoryFlags = category.trim().split('-');
            async.each(categoryFlags, function(categoryFlag, callback) {
                Translation.find({name:categoryFlag}, function(err, cf) {
                    if ( !cf.length) {
                        return callback('err',null);
                    } else {
                        callback();
                    }
                })
            }, function (err) {
                if (err) {
                    res.json({isSuccess: false});
                } else {
                    var categoryName = categoryFlags[categoryFlags.length - 1];
                    Translation.find({name: categoryName}, function (err, items) {
                        if (err) {
                            console.error("translationUpdate oper ====>" + err.message);
                            res.json({isSuccess: false});
                        } else {
                            Translation.get(id, function(err, item){
                                if (err) {
                                    console.error("translationUpdate ====>"+err.message);
                                    return res.json({isSuccess: false});
                                }
                                item.save({
                                    code : code.toLowerCase(),
                                    name : name,
                                    category : items[0].id,
                                    priority: priority
                                }, function(err){
                                    if (err) {
                                        console.error("translationUpdate ====>"+err.message);
                                        res.json({isSuccess: false});
                                    }
                                    res.json({isSuccess: true})
                                });
                            });


                        }
                    });
                }
            });
        } else {
            res.json({isSuccess: false});
        }

    }
};


function allownDelete(req, ids, cb){
    var Link = req.models.link;
    Link.find({flag: ids}, function(err, links){
        if (links.length !== 0){
            cb(false, links[0].flag);
        } else {
            cb(true);
        }
    })
}

exports.translationDelete = function(req, res){
    var ids = req.body.id;
    if (!ids) {
        res.json({isSuccess: false});
    } else {
        var Translation = req.models.translation;
        ids = ids.split(",");
        allownDelete(req, ids, function(allown, flagId){
            if(allown){
                Translation.find({id: ids}).remove(function(err){
                    if (err) {
                        console.error("translationDelete ====>" + err.message);
                        return res.json({isSuccess: false});
                    }
                    res.json({isSuccess: true});
                })
            }else{
                return res.json({isSuccess: false, isNotAllown: true, flagId: flagId});
            }
        })
    }
};


//自动提示分类父类别信息
exports.getCategory = function(req, res){
    var Translation = req.models.translation;
    var items = [];
    var name_startsWith = querystring.parse(url.parse(req.url).query).name_startsWith;
    Translation.find().all(function(err, translations){
        if (err) {
            console.error("translationList ====>"+ err.message);
            res.json({isSuccess: false});
        }
        async.each(translations, function(translation, callback){
            util.getFullParentName(Translation, translation, function(err, fullParentName) {
                if (err) {
                    console.error("getCategory ====>" + err.message);
                    return res.json({isSuccess: false});
                }
                var item = {};
                if (name_startsWith) {
                    if(fullParentName.indexOf(name_startsWith.trim()) != -1){
                        item.id = translation.id;
                        item.name = fullParentName;
                        item.categoryName = translation.name;
                        items.push(item);
                    }
                    callback();

                } else {
                    item.id = translation.id;
                    item.name = fullParentName;
                    item.categoryName = translation.name;
                    items.push(item);
                    callback();
                }
            });

        }, function(err){
            if (err) {
                console.error("getCategory ====>" + err.message);
                return res.json({isSuccess: false});
            }
            res.json({rows: items, isSuccess: true});

        });
    })
};


function getTranslationByFlag(req, flag, cb){
    var Translation = req.models.translation;
    Translation.find({code: flag}).all(function(err, items){
        cb(err, items)
    })
}


exports.getProvinces = function(req, res){
    getTranslationByFlag(req, 'province', function(err, items){
        if (err) {
            console.error("getProvinces ====>" + err.message);
            return res.json({isSuccess: false});
        }
        res.json({isSuccess: true, items: items});
    })
};

exports.getSchoolCategories = function(req, res){
    getTranslationByFlag(req, 'schoolcategory', function(err, items){
        if (err) {
            console.error("getSchoolCategories ====>" + err.message);
            return res.json({isSuccess: false});
        }
        res.json({isSuccess: true, items: items});
    })
};

exports.getSchoolCharacters = function(req, res) {
    getTranslationByFlag(req, 'character', function(err, items){
        if (err) {
            console.error("getSchoolCharacters ====>" + err.message);
            return res.json({isSuccess: false});
        }
        res.json({isSuccess: true, items: items});
    })
};

exports.getMajorCategories = function(req, res){
    getTranslationByFlag(req, 'majorcategory', function(err, items){
        if (err) {
            console.error("getSchoolCharacters ====>" + err.message);
            return res.json({isSuccess: false});
        }
        res.json({isSuccess: true, items: items});
    })
};

exports.getGrades = function(req, res) {
    getTranslationByFlag(req, 'grade', function(err, items){
        if (err) {
            console.error("getGrades ====>" + err.message);
            return res.json({isSuccess: false});
        }
        res.json({isSuccess: true, items: items});
    })
};