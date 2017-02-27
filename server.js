require('dotenv').config()
var path = require('path');
var express = require('express');
var request = require('superagent');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fileUpload = require('express-fileupload');
var request = require('superagent');
var multer = require('multer');
var fs = require('fs');
var crypto = require('crypto');
var mime = require('mime-types');
var MongoClient = require('mongodb').MongoClient;
var app = express();

// Connection URL
var url = 'mongodb://testdude:test@ds161039.mlab.com:61039/visual-recognition';

var PORT = process.env.VCAP_APP_PORT || 8080; //bluemix

// using webpack-dev-server and middleware in development environment
if(process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require('./webpack.config');
  var compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html');
});

app.get('/token-redirect', function(req, res) {
    console.log('received temporary code');
    console.log('ask for access_token');
    var api_key = req.query.api_key;

    request.post('https://github.com/login/oauth/access_token')
    .query({client_id: process.env.CLIENT_ID})
    .query({client_secret: process.env.CLIENT_SECRET})
    .query({code: req.query.code})
    .end(function(err, response) {
        console.log('received access_token')
        var access_token = response.body.access_token;
        console.log(access_token);
        console.log(api_key);
        MongoClient.connect(url, function(err, db) {
            db.collection('inserts').insertOne({
                api_key: api_key,
                access_token: access_token
            });
        });
    });
    res.redirect('/');
});

app.get('/github-login', function(req, response) {
    console.log('redirecting to github...');
    response.redirect(
        'https://github.com/login/oauth/authorize?scope=public_repo&client_id='
        + process.env.CLIENT_ID
        + '&redirect_uri='
        + 'http://localhost:8080/token-redirect?api_key=' + req.query.api_key
    );
});

app.get('*', function(req, response) {
  response.sendFile(__dirname + '/dist/index.html');
});

app.post('/check_key', function(req, res) {
    var api_key = req.query.api_key;
    MongoClient.connect(url, function(err, db) {
        db.collection('inserts').find({api_key:api_key}, function(err, cursor){
            cursor.toArray(function(err, items) {
                 res.send({has_token: items[0] != null});
             });
        });
    });
});

app.post('/api/list_repos', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        db.collection('repos').find(function(err, cursor){
            cursor.toArray(function(err, items) {
                console.log(items)
                res.send(items)
             });
        });
    });
});

app.post('/api/list_classifiers', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        api_key: req.query.api_key,
        version_date: req.query.version || '2016-05-19'
    });

    visual_recognition.listClassifiers(req.query, function(err, data) {
        res.send(data);
	});
});

app.post('/api/list_collections', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        api_key: req.query.api_key,
        version_date: req.query.version || '2016-05-19'
    });

    visual_recognition.listCollections(req.query, function(err, data) {
        res.send(data);
	});
});

app.post('/api/delete_classifier', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        api_key: req.query.api_key,
        version_date: req.query.version || '2016-05-19'
    });

    visual_recognition.deleteClassifier({classifier_id: req.query.classifier_id }, function(err, data) {
        res.send(data);
    });
});

app.post('/api/classifier_details', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        api_key: req.query.api_key,
        version_date: req.query.version || '2016-05-19'
    });

    visual_recognition.getClassifier({classifier_id: req.query.classifier_id }, function(err, data) {
        res.send(data);
	});
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '.tmp/uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});

// Multer config
const upload = multer({
    limits: {
        files: 1,
        fileSize: 2 * 1024 * 1024 // 2mb
    },
    fileFilter: function(req, file, cb) {
        var type = file.mimetype;
        if (type !== 'image/png' && type !== 'image/jpg' && type !== 'image/jpeg') {
            cb(new Error('Invalid image type'));
        } else {
            cb(null, true);
        }
    },
    storage: storage
});

var fileUpload = upload.single('file')
app.post('/api/classify', function(req, res) {
    fileUpload(req, res, function (err) {
        if (err) {
            res.send(err);
            return;
        }

        var visual_recognition = new VisualRecognitionV3({
            api_key: req.query.api_key,
            version_date: req.query.version || '2016-05-19'
        });

        var params = req.query;

        params.images_file = fs.createReadStream(req.file.path);

        console.log(req.file.path)

        fs.readdir('.tmp/uploads/', (err, files) => {
            files.forEach(file => {
                console.log(file);
            });
        })

        visual_recognition.classify(params, function(err, data) {
            fs.unlinkSync(req.file.path);
            res.send(data);
        });

    });
});

app.post('/api/detect_faces', function(req, res) {
    fileUpload(req, res, function (err) {
        if (err) {
            res.send(err);
            return;
        }

        var visual_recognition = new VisualRecognitionV3({
            api_key: req.query.api_key,
            version_date: req.query.version || '2016-05-19'
        });

        var params = req.query;

        params.images_file = fs.createReadStream(req.file.path);

        visual_recognition.detectFaces(params, function(err, data) {
            fs.unlinkSync(req.file.path);
            res.send(data);
        });
    });
});

const zipUpload = multer({
    limits: {
        fileSize: 100 * 1024 * 1024 // 100mb
    },
    fileFilter: function(req, file, cb) {
        var type = file.mimetype;
        if (type !== 'application/zip') {
            cb(new Error('Invalid zip file'));
        } else {
            cb(null, true);
        }
    },
    storage: storage
});

var filesUpload = zipUpload.array('files')
app.post('/api/create_classifier', function(req, res) {
    filesUpload(req, res, function (err) {
        if (err) {
            res.send(err);
            return;
        }

        var githubDone = false;
        var watsonDone = false;

        function ready() {
            console.log('GitHub: ' + githubDone + ', Watson: ' + watsonDone);
            if (githubDone && watsonDone) {
                console.log('unlinking');
                for (var file in req.files) {
                    fs.unlinkSync(req.files[file].path);
                }
            }
        }

        var api_key = req.query.api_key;
        var name = req.query.name;
        MongoClient.connect(url, function(err, db) {
            db.collection('inserts').find({api_key:api_key}, function(err, cursor){
                cursor.toArray(function(err, items) {
                    if (items[0] != null) {
                        var access_token = items[0].access_token
                        console.log('create new repo ' + name + ', with: ' + access_token)
                        request.post('https://api.github.com/user/repos')
                        .set('Authorization', 'token ' + access_token)
                        .send({ name: name })
                        .end(function(err, response) {
                            console.log(response.body.message);
                            var repo_url = response.body.url;
                            var temp_url = response.body.html_url;
                            console.log(repo_url + ' created');
                            var classes = [];
                            for (var file in req.files) {
                                if (req.files[file].originalname == 'NEGATIVE_EXAMPLES') {
                                } else {
                                    classes.push(req.files[file].originalname);
                                }
                            }
                            MongoClient.connect(url, function(err, db) {
                                db.collection('repos').insertOne({
                                    temp: temp_url,
                                    repo: repo_url,
                                    name: name,
                                    classes: classes
                                });
                            });
                            console.log('add new file')
                            for (var file in req.files) {
                                // This is a little wonky
                                setTimeout(function(file) {
                                    if (req.files[file].originalname == 'NEGATIVE_EXAMPLES') {
                                        console.log(repo_url + '/contents/negative_examples.zip');
                                        fs.readFile(req.files[file].path, function (err, data) {
                                            request.put(repo_url + '/contents/negative_examples.zip')
                                            .set('Authorization', 'token ' + access_token)
                                            .send({ message: 'negative' })
                                            .send({ content: new Buffer(data, 'binary').toString('base64') })
                                            .end(function(err, response) {
                                                console.log('success');
                                            });
                                        });
                                    } else {
                                        console.log(repo_url + '/contents/' + req.files[file].originalname + '_positive_examples.zip');
                                        fs.readFile(req.files[file].path, function (err, data) {
                                            request.put(repo_url + '/contents/' + req.files[file].originalname + '_positive_examples.zip')
                                            .set('Authorization', 'token ' + access_token)
                                            .send({ message: req.files[file].originalname })
                                            .send({ content: new Buffer(data, 'binary').toString('base64') })
                                            .end(function(err, response) {
                                                console.log('success');
                                            });
                                        });
                                    }
                                }, file * 5000, file);
                            }
                            githubDone = true;
                            ready();
                        });
                    }
                });
            });
        });

        var visual_recognition = new VisualRecognitionV3({
            api_key: req.query.api_key,
            version_date: req.query.version || '2016-05-19'
        });

        var params = {
            name: req.query.name
        }

        for (var file in req.files) {
            console.log(req.files[file])
            if (req.files[file].originalname == 'NEGATIVE_EXAMPLES') {
                params['negative_examples'] = fs.createReadStream(req.files[file].path);
            } else {
                params[req.files[file].originalname + '_positive_examples'] = fs.createReadStream(req.files[file].path);
            }
        }

        visual_recognition.createClassifier(params, function(err, data) {
            watsonDone = true;
            ready();
            res.send(data);
        });
    });
});

app.post('/api/update_classifier', function(req, res) {
    filesUpload(req, res, function (err) {
        if (err) {
            res.send(err);
            return;
        }

        var visual_recognition = new VisualRecognitionV3({
            api_key: req.query.api_key,
            version_date: req.query.version || '2016-05-19'
        });

        var params = {
            classifier_id: req.query.classifier_id
        }

        for (var file in req.files) {
            console.log(req.files[file])
            if (req.files[file].originalname == 'NEGATIVE_EXAMPLES') {
                params['negative_examples'] = fs.createReadStream(req.files[file].path);
            } else {
                params[req.files[file].originalname + '_positive_examples'] = fs.createReadStream(req.files[file].path);
            }
        }

        visual_recognition.retrainClassifier(params, function(err, data) {
            for (var file in req.files) {
                fs.unlinkSync(req.files[file].path);
            }
            res.send(data);
        });
    });
});

app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});
