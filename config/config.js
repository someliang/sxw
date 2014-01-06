/**
 * God bless.
 * User: lonso
 * Email: lonso@foxmail.com
 * Date: 13-12-24
 * Time: 下午1:58
 */

var path = require('path');

var imageSaveFolder = exports.imageSaveFolder  = '/uploadImages/';
exports.imageSavePath = path.resolve(__dirname, "..", 'upload'+imageSaveFolder)+"/" ;
exports.fileManagerRoot = '/var/www/elfinder';