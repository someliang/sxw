/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 13-12-19
 * Time: 上午11:47
 * To change this template use File | Settings | File Templates.
 */

var config = require('../config/config.js')
    , imageSavePath = config.imageSavePath
    , imageSaveFolder = config.imageSaveFolder
    , crypto = require('crypto')
    , fs = require('fs');

exports.formatBoolean = function(value) {
    if (value === 'true')
        return 1;
    else
        return 0;
};

var getFullParentName = exports.getFullParentName = function(model, item, cb){
    if (item.category != 0) {
        model.get(item.category, function(err, parent) {
            if (err) {
                console.error("getFullParentName ====>"+ err.message);
                cb(err, null);
            }
            if (parent.code === 'country') {
                cb(null, item.name);
            } else {
                parent.name += '-'+ item.name;
                getFullParentName(model, parent, cb);
            }
        })
    } else {
        cb(null, item.name);
    }
};

exports.saveUploadFile = function(req, cb){
    var fileName = crypto.createHash('md5').update((new Date().getTime()).toString()).digest('hex');
    var saveFile = imageSavePath + fileName;
    var savePath = imageSaveFolder + fileName;
    var tmp_path = req.files.file.path;
    var is = fs.createReadStream(tmp_path);
    var os = fs.createWriteStream(saveFile);
    is.pipe(os);
    is.on('end',function() {
        fs.unlinkSync(tmp_path);
        cb(null, savePath);

    });
    is.on('error', function(err){
        cb(err);
    })
};