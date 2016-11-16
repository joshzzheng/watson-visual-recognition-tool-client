import React from 'react'
import Dropzone from 'react-dropzone'
import request from 'superagent'
import $ from "jquery"
import classNames from 'classnames'

var ResultList = React.createClass({
  render: function(){
    var resultList = this.props.results.map(function(result){
      return (
        <li className="list-group-item" key={result.class}>
          <b>{result.class} : {result.score} </b>
        </li>
      );
    })
    return (
      <div>
        <ul> {resultList} </ul>
      </div>
    );
  }
});

var ImageDropzoneButton = React.createClass({
  getInitialState: function () {
    return {
      files: [],
      text: "Select Image"
    };
  },

  onDrop: function (files) {
    this.setState({
      files: files,
      text: files[files.length-1].name
    });
    var mostRecentFile = files[files.length-1];
    this.props.addImageFile(mostRecentFile.name, mostRecentFile)
  },

  onOpenClick: function () {
    this.refs.dropzone.open();
  },

  render: function () {
    return (
      <Dropzone 
        ref="dropzone" 
        onDrop={this.onDrop} 
        multiple={false}
        className="btn"
        style={{
          border: "dotted", 
          height: "4rem",
          lineHeight: "2rem",
          marginBottom: "1rem"
        }}> 
        {this.state.text}
      </Dropzone>
    );
  }
});

var ClassifyImageButton = React.createClass({
  getInitialState: function(){
    return {
      pressed: false
    }
  },

  contextTypes: {
    router: React.PropTypes.object
  },

  classifyImage: function(e) {
    e.preventDefault();
    this.setState({pressed: true}, function() {
      var self = this;

      var req = request.post(this.props.host + "api/classify");

      if (this.props.imageFile){
        req.attach('file', this.props.imageFile);
      }

      req.field('classifier_id', this.props.classifierID);
      req.field('api_key', this.props.apiKey);
      
      if (this.props.imageURL) {
        req.field('image_url', this.props.imageURL);
      }

      req.then(function(res, err){
        var newResults = $.extend([], self.state.classes);
        res.body.images[0].classifiers[0].classes.map(function(c){
          newResults.push(c);
        });
        newResults.sort(function(a, b) {
            return b.score - a.score;
        });
        self.props.setResults(newResults, true);
        self.props.resetState();  
        self.setState({pressed: false});
      });
    });
  },

  render: function(){
    var btnClass = classNames({
      'btn': true,
      'btn-sm': true,
      'btn-primary': true,
      'disabled': this.state.pressed,
      'loading': this.state.pressed
    });

    return (
      <button className={btnClass}
              onClick={this.classifyImage}>
        Classify Image
      </button>
    )
  }
});

var ClassifyImage = React.createClass({
  getInitialState: function () {
    return {
      imageURL: "",
      imageFileName: "",
      imageFile: null,
      results: [],
      hasResults: false
    };
  },

  resetState: function(){
    this.setState({
      imageURL: "",
      imageFileName: "",
      imageFile: null      
    });
  },

  setResults: function(newResults, hasResults){
    this.setState({
      results: newResults, 
      hasResults: hasResults
    });
  },

  handleImageURLChange: function(e) {
    this.setState({ imageURL: e.target.value });
  },

  addImageFile: function(imageFileName, imageFile) {
    this.setState({ 
      imageFileName: imageFileName,
      imageFile: imageFile
    });
  },

  render: function () {
    return (
      <div>
        <div className="card-block">
          <ImageDropzoneButton addImageFile={this.addImageFile} />
          <br/>
          <input type="text" 
                 className="form-control"
                 placeholder="Image URL"
                 value={this.state.imageURL}
                 onChange={this.handleImageURLChange} />
          <br/>
          <ClassifyImageButton
            imageFile={this.state.imageFile}
            imageURL={this.state.imageURL}
            resetState={this.resetState}
            setResults={this.setResults}
            host={this.props.host}
            classifierID={this.props.classifierID}
            apiKey={this.props.apiKey} />

        </div>
        <div className="card-block">
          {this.state.hasResults ? <h7>Result:</h7> : null}
          <ResultList results={this.state.results} />
        </div>
      </div>
    );
  }
});

module.exports = ClassifyImage