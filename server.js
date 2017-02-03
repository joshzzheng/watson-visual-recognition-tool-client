var path = require('path');
var express = require('express');
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fileUpload = require('express-fileupload');
var request = require('superagent');
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
app.use(fileUpload());

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('*', function(req, response) {
  response.sendFile(__dirname + '/dist/index.html');
});

app.post('/api/list_classifiers', function(req, res) {
    sa_req = request.get('https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers');

    sa_req.query({ version: req.query.version || '2016-05-19' })
    sa_req.query(req.query)

    sa_req.end(function(err, data) {
        res.send(JSON.parse(data.text))
    });
});

// This isnt working for some reason
// app.post('/api/classify', function(req, res) {
//     sa_req = request.get('https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify');
//
//     sa_req.query({ version: req.query.version || '2016-05-19' });
//     sa_req.query({ api_key: req.query.api_key });
//
//     // sa_req.query({ threshold: 0.0 });
//     // sa_req.query({ classifier_ids: req.query.classifier_ids });
//     // sa_req.query({ owners: ['me','IBM'] });
//
//     sa_req.attach('images_file', req.files.file.data, 'images_file')
//     params = {
//         threshold: 0.0,
//         classifier_ids: req.query.classifier_ids,
//         owners: ['me','IBM'],
//     }
//
//     sa_req.field('parameters', params);
//
//     sa_req.end(function(err, data) {
//         res.send(JSON.parse(data.text))
//     });
// });

app.post('/api/classify', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        api_key: req.query.api_key,
        version_date: req.query.version || '2016-05-19'
    });

    var params = req.query;

    params.images_file = req.files.file.data;

    visual_recognition.classify(params, function(err, data) {
        res.send(data);
    });
});

app.post('/api/detect_faces', function(req, res) {
    var visual_recognition = new VisualRecognitionV3({
        api_key: req.query.api_key,
        version_date: req.query.version || '2016-05-19'
    });

    var params = req.query;

    params.images_file = req.files.file.data;

    visual_recognition.detectFaces(params, function(err, data) {
        res.send(data);
    });
});

// just make the request ourselves, sdk doesnt do much and isnt working as needed
// TODO: add negatives support
app.post('/api/create_classifier', function(req, res) {
    sa_req = request.post('https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers');

    sa_req.query({ api_key: req.query.api_key, version: req.query.version || '2016-05-19' })

    for (var file in req.files) {
        sa_req.attach(file + '_positive_examples', req.files[file].data, 'need_a_filename');
    }

    sa_req.field('name', req.query.name);

    sa_req.end(function(err, data) {
        res.send(data);
    });
});

app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});
