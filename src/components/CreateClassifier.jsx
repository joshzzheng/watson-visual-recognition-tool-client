import React from 'react'
import request from 'superagent'
import $ from "jquery"
import classNames from 'classnames'

import DropzoneButton from './DropzoneButton'

var ClassRow = React.createClass({
  handleRowClassNameChange: function(e) {
    this.props.handleClassNameChange(e, this.props.classes, this.props.rowId)
  },

  render: function() {
    return (
      <div className="form-group">
        <label className="col-sm-2 form-label">
          {this.props.classes[this.props.rowId].label}
        </label>
        <div className="col-sm-4">
          <input type="text"
                 className="form-input"
                 value={this.props.classes[this.props.rowId].name}
                 onChange={this.handleRowClassNameChange}
                 placeholder={this.props.classes[this.props.rowId].placeholder} />
        </div>
        <DropzoneButton rowId={this.props.rowId}
                        classes={this.props.classes}
                        addFile={this.props.addFile} />
      </div>
    )
  }
});

var SubmitButton = React.createClass({
  getInitialState: function() {
    return {
      pressed: false
    };
  },

  contextTypes: {
    router: React.PropTypes.object
  },

  submitClassifier: function(e) {
    e.preventDefault();
    this.setState({pressed: true}, function(){
      var self = this;
      var req = request.post(this.props.host + "api/classifiers");
      var apiKey = this.props.getApiKey();

      this.props.classes.map(function(c){
        req.attach(c.name, c.file);
      });

      req.field('api_key', apiKey);
      req.field('classifier_name', this.props.classifierName);
      req.then(function(res, err){
        self.context.router.push('/')
      });
    });
  },

  render: function() {
    var btnClass = classNames({
      'btn': true,
      'btn-primary': true,
      'disabled': this.state.pressed,
      'loading': this.state.pressed
    });

    return (
      <button className={btnClass}
              onClick={this.submitClassifier}>
        Create Classifer
      </button>
    )
  }
});

var CreateClassifier = React.createClass({
  getInitialState: function() {
    return {
      classifierName: "",
      classes: [
        {label: "Class 1", name: "", placeholder: "negatives", file: null},
        {label: "Class 2", name: "", placeholder: "<class name>", file: null}
      ]
    };
  },

  resetState: function() {
    this.setState({
      classifierName: "",
      classes: [
        {label: "Class 1", name: "", placeholder: "negatives", file: null},
        {label: "Class 2", name: "", placeholder: " <class name>", file: null}
      ]
    });
  },

  handleClassifierNameChange: function(e){
    this.setState({ classifierName: e.target.value });
  },

  handleClassNameChange: function(e, classes, rowId) {
    var newClasses = $.extend([], classes);
    newClasses[rowId].name = e.target.value;
    this.setState({ classes: newClasses });
  },

  addFile: function(classes, rowId, file) {
    var newClasses = $.extend([], classes);
    newClasses[rowId].file = file;
    this.setState({ classes: newClasses });
  },

  addNewClass: function(e) {
    e.preventDefault();
    var newClasses = $.extend([], this.state.classes);
    newClasses.push({
      label: "Class " + this.state.classes.length.toString(),
      name: "",
      placeholder: "<class name>",
      file: null
    });
    this.setState({classes: newClasses});
  },

  render() {
    var fileUploadStyle = {
      display: 'none'
    }

    var self = this;
    var classRowList = this.state.classes.map(function(r, i){
      return (
        <ClassRow classes={self.state.classes}
                  addFile={self.addFile}
                  handleClassNameChange={self.handleClassNameChange}
                  rowId={i}
                  key={i} />
      )
    });

    return (
      <div id="page-content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="container">
                <h2>Create New Classifer</h2>
                <hr />
                <p>
                  <a className="btn btn-link"
                     data-toggle="collapse"
                     href="#sizeLimitInfo"
                     aria-expanded="false"
                     aria-controls="sizeLimitInfo">
                    What are the size limits?
                  </a>
                </p>
                <div className="collapse" id="sizeLimitInfo">
                  <div>
                    <p>There are size limitations for training calls and data:</p>
                    <ul>
                      <li>The service accepts a maximum of 10,000 images or 100 MB per .zip file.</li>
                      <li>The service requires a minimum of 10 images per .zip file.</li>
                      <li>The service accepts a maximum of 256 MB per training call.</li>
                    </ul>
                    <p>There are also size limitations for classification calls:</p>
                    <ul>
                      <li>The POST /v3/classify methods accept a maximum of 20 images per batch.</li>
                      <li>The POST /v3/detect_faces methods accept a maximum of 15 images per batch.</li>
                    </ul>
                  </div>
                </div>

                <form className="form-horizontal">
                  <div className="form-group">
                    <label className="col-sm-2 form-label">
                      Classifer Name
                    </label>
                    <div className="col-sm-5">
                      <input type="text"
                             className="form-input"
                             value={this.state.classifierName || ""}
                             placeholder="<classifier name>"
                             onChange={this.handleClassifierNameChange} />
                    </div>
                  </div>

                  {classRowList}

                  <div className="row" style={{marginBottom: '2%'}}>
                    <button className="btn"
                            onClick={this.addNewClass}>
                      Add Class
                    </button>
                  </div>

                  <div className="row">
                    <SubmitButton
                      host={this.props.route.host}
                      getApiKey={this.props.route.getApiKey}
                      classifierName={this.state.classifierName}
                      classes={this.state.classes}/>
                  </div>
                  <br/>
                  <div className="row">
                    Depending on this size of the training files,
                    this call can take several minutes to complete. Be patient!
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CreateClassifier;
