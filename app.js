var express = require('express')
  , catapult = require('./routes/catapult')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , exphbs  = require('express-handlebars')
  , hbshelpers = require('./lib/handlebarsHelpers')
  , timeshelpers = require('./lib/timesHelpers')
  , indexOfHelpers = require('./lib/indexOfHelpers')
  , momentHelpers = require('./lib/momentHelpers')
  , ifArrayHelper = require('./lib/ifArrayHelper')
  , jsonhelpers = require('./lib/jsonHelpers');

var favicon = require('serve-favicon')
  , logger = require('morgan')
  , connect        = require('connect')
  , methodOverride = require('method-override')
  , bodyParser = require('body-parser')
  , multer = require('multer')
  , errorHandler = require('errorhandler')
  , config = require('./config')
  , moment = require('moment');

moment.locale('es');

mongoose.connect(config.db.mongodb, function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

var app = express();

// all environments
app.set('port', config.application.port);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
                            defaultLayout: 'main',
                            helpers: { md: hbshelpers.md,
                                       json: jsonhelpers.json,
                                       times: timeshelpers.times,
                                       index_of: indexOfHelpers.index_of,
                                       moment: momentHelpers.moment,
                                       ifArray: ifArrayHelper.ifArray}
                        }));
app.set('view engine', 'handlebars');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    res.locals.api = config.application.gmaps_api;
    next();
});

app.use('/', catapult);

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(config.application.port, function(){
  console.log('Express server listening on port ' + config.application.port);
});
