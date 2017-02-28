var path = require('path');
var express = require('express');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fileUpload = require('express-fileupload');
var request = require('superagent');
var multer = require('multer');
var fs = require('fs');
var crypto = require('crypto');
var unzip = require('unzip2');
var mime = require('mime-types');
var app = express();
//var PORT = process.env.PORT || 8080 //heroku
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
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('*', function(req, response) {
  response.sendFile(__dirname + '/dist/index.html');
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

app.post('/api/delete_collection', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        api_key: req.query.api_key,
        version_date: req.query.version || '2016-05-19'
    });

    visual_recognition.deleteCollection({collection_id: req.query.collection_id }, function(err, data) {
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
            for (var file in req.files) {
                fs.unlinkSync(req.files[file].path);
            }
            res.send(data);
        });
    });
});


app.post('/api/create_collection', function(req, res) {
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
            name: req.query.name
        }

        console.log(req.query.name);

        var done = false;
        var images_received = 0;
        var count = 0;

        var success = 0

        visual_recognition.createCollection(params, function(err, data) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                fs.createReadStream(req.files[0].path)
                  .pipe(unzip.Parse())
                  .on('entry', function (entry) {
                      // Skip all the trash files
                      var type = mime.lookup(entry.path);
                      var patt = new RegExp("^__MACOSX/[^/]+/\._");
                      if (patt.test(entry.path) || (type !== 'image/png' && type !== 'image/jpg' && type !== 'image/jpeg')) {
                          // Avoid memory leak
                          entry.autodrain();
                          return;
                      }

                      console.log(entry.path + ' : ' + type);
                      count++;
                      setTimeout(function (entry) {
                          var params = {
                              collection_id: data.collection_id,
                              image_file: entry
                          }

                          // Avoid memory leak
                          entry.autodrain();
                          visual_recognition.addImage(params, function(err, data) {
                              images_received++;
                              console.log(images_received + ' / ' + count);

                              if (data != null) {
                                  success++;
                              }

                              if (done && count == images_received) {
                                  console.log(success);
                                  res.send({success: true});
                              }
                          });
                          // You must wait at least 1 second between uploads
                          // Says documentation, lets push it ;)
                      }, count * 300, entry)
                })
                .on('close', function() {
                    fs.unlinkSync(req.files[0].path);
                    done = true;
                });
            });
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
