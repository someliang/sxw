/**
 * God bless.
 * User: lonso
 * Email: lonso@foxmail.com
 * Date: 13-12-31
 * Time: 上午9:52
 */


exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
};
