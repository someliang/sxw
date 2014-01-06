
/**
 * Module dependencies.
 */
var express = require('express')
    , http = require('http')
    , path = require('path')
    , consolidate = require('consolidate')
    , ejs = require('ejs')
    , orm = require('orm')
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , flash = require('connect-flash')
    , crypto = require('crypto');

var app = express();

//LOGGER SETTINGS
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' } //控制台输出
    ],
    replaceConsole : true
});

exports.logger=function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
};
//DB ORM SETTINGS
var User;
app.use(orm.express('mysql://root:@127.0.0.1/sxw', {
    define: function (db, models, next) {
        db.settings.set('properties.primary_key', 'id');
        models.translation = db.define('sxw_translation', {
            code: {type: 'text' },
            category: {type: 'text' },
            name: {type: 'text'},
            priority: {type: 'number', rational: true}
        });
        User = models.user = db.define('sxw_user', {
            username: {type: 'text'},
            password: {type: 'text'},
            is_admin: {type: 'boolean'}
        });

        db.sync(function (err) {
            if(err) throw err;
            console.log('sync databases done!');
        });
        next();
    }
}));

// user validation
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.get(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        process.nextTick(function () {
            User.find({username: username}).all(function (err, users) {
                if (err) {
                    return done(err);
                } else if (users.length === 0) {
                    return done(null, false, { message: '未知用户名:' + username });
                } else if (users[0].password !== crypto.createHash('md5').update(password).digest('hex')) {
                    return done(null, false, { message: '密码错误.' });
                }
                else return done(null, users[0]);
            });
        });
    }
));


Array.prototype.contains = function (k, callback) {
    var self = this;
    return (function check(i) {
        if (i >= self.length) {
            return callback(false);
        }
        if (self[i] === k) {
            return callback(true);
        }
        return process.nextTick(check.bind(null, i + 1));
    }(0));
};



// all environments
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');
    app.engine('.html', consolidate.swig);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.bodyParser({uploadDir:__dirname + 'upload/images'}));
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.static(path.join(__dirname, '/upload')));
    app.use(express.methodOverride());
    app.use(express.cookieParser('node_cms'));
    app.use(express.cookieSession());
    app.use(express.session({ secret: 'node_cms lonso' }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    var routes = require('./routes/routers');
    routes(app);
});




// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
    console.log('oh,god..Oops..!!');
    console.log('god bless sxw!!!!');
    console.log('god bless sxw on port ' + app.get('port'));
});
