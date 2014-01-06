/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 13-12-19
 * Time: 下午2:36
 * To change this template use File | Settings | File Templates.
 */
var path = require('path')
    , crypto = require('crypto')
    , fs = require('fs')
    , async = require('async');

var imageSaveFolder  = '/uploadImages/';
var imageSavePath = path.resolve(__dirname, "..", 'upload'+imageSaveFolder)+"/" ;


exports.upload = function(req, res){
    if (req.files.upfile) {
        var fileName = crypto.createHash('md5').update((new Date().getTime()).toString()).digest('hex');
        var saveFile = imageSavePath + fileName;
        var savePath = imageSaveFolder + fileName;
        var tmp_path = req.files.upfile.path;
        var is = fs.createReadStream(tmp_path);
        var os = fs.createWriteStream(saveFile);
        is.pipe(os);
        is.on('end',function() {
            res.json({state: 'SUCCESS', url: savePath});
        });
    } else {
        res.json({state: 'Failure'});
    }
};

exports.imageManger = function(req, res){
    var resImageSrc = '';
    fs.readdir(imageSavePath, function(err, files) {
        async.each(files, function(file, callback){
            resImageSrc += imageSaveFolder + file + 'ue_separate_ue';
            callback();
        }, function(err ){
            if (err) {
                console.error("imageManger ====>" + err.message);
                return res.json({isSuccess: false});
            }
            res.send(resImageSrc);
            res.end();
        });
    });
};
