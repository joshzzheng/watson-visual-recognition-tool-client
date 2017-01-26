import React from 'react'
import moment from 'moment'
import $ from 'jquery'
import request from 'superagent'
import ClassifyImage from './ClassifyImage'
import classNames from 'classnames'
import ResultList from './ResultList'
import DropButton from './DropButton'
import Styles from './Styles'

var ClassList = React.createClass({
  render: function(){
    var classList = this.props.classes.map(function(name){
      return (
        <li className="list-group-item" key={name.class}>
          {name.class}
        </li>
      );
    })
    return (
      <ul className="list-group list-group-flush"
          style={{marginRight:'2em'}}>
        {classList}
      </ul>
    );
  }
});

var CustomClassifierDetails = React.createClass({
  getInitialState: function() {
    return {
      classifier: {
        classes: []
      }
    };
  },

  loadClassifierDetailsFromServer: function(){
    $.ajax({
      url: this.props.host + "api/classifier" + this.props.classiferID,
      dataType: 'json',
      cache: false,
      data: {apiKey: this.props.apiKey},

      success: function(data) {
        this.setState({classifier: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.host, status, err.toString());
      }.bind(this)
    });
  },

  onDrop: function(files, onFinished) {
      // this.props.addFile(this.props.classes, this.props.rowId, files[files.length-1])
      var self = this
      var req = request.post(this.props.host + "api/classify")

      if (files[0]) {
          req.attach('file', files[0])
      }

      req.field('classifier_id', this.props.classifierID)
      req.field('api_key', this.props.apiKey)

      req.on('progress', function(e) {
          console.log(e.direction + ' Percentage done: ' + e.percent)
      })

      req.end(function(err, res) {
          var results = res.body.images[0].classifiers[0].classes
          results.sort(function(a, b) {
              return b.score - a.score;
          })
          console.log(results)
          self.setState({ file: files[0], results: results })
          onFinished()
      })
  },

  render: function() {
    var textStyle = {
      textDecoration:'none',
      display:'block',
      whiteSpace:'nowrap',
      overflow:'hidden',
      textOverflow:'ellipsis',
      color: Styles.colorTextDark,
      font: Styles.fontDefault,
    }

    var titleStyle = {
      textDecoration:'none',
      display:'block',
      whiteSpace:'nowrap',
      overflow:'hidden',
      textOverflow:'ellipsis',
      color: Styles.colorTextDark,
      font: Styles.fontHeader,
    }

    var cardStyle = {
      maxWidth:'30rem',
      marginBottom:'4rem',
      borderRadius: '5px',
      borderColor: '#dedede',
      borderWidth: 'thin',
      borderStyle: 'solid',
      background: 'white',
      padding: '12px',
    }

    return(
      <div className="col-sm-4">
        <div style={cardStyle}>
            <div style={titleStyle}>{this.props.name}</div>
            <div style={textStyle}><b>ID:</b> {this.props.classifierID}</div>
            <div style={textStyle}><b>Status:</b> {this.props.status}</div>

            <ClassList classes={this.state.classifier.classes} />

            <DropButton
                onDrop={this.onDrop}
                text={"Drag images here to classify them"}
                subtext={"choose your files"} />
            {this.state.results ? <ResultList file={this.state.file} results={this.state.results}/> : null}
        </div>
      </div>
    );
  }
});

module.exports = CustomClassifierDetails;
