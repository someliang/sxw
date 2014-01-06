/**
 * Created with JetBrains WebStorm.
 * User: lonso
 * Date: 13-12-19
 * Time: 上午11:47
 * To change this template use File | Settings | File Templates.
 */

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