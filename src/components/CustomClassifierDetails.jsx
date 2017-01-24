import React from 'react'
import moment from 'moment'
import $ from 'jquery'
import request from 'superagent'
import ClassifyImage from './ClassifyImage'
import classNames from 'classnames'

import DropButton from './DropButton'

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

  render: function() {
    var textStyle = {
      textDecoration:'none',
      display:'block',
      whiteSpace:'nowrap',
      overflow:'hidden',
      textOverflow:'ellipsis',
      color: '#404040',
      fontFamily: 'Helvetica, sans-serif',
      fontWeight: '200',
      fontSize: '14px',
    }

    var titleStyle = {
      textDecoration:'none',
      display:'block',
      whiteSpace:'nowrap',
      overflow:'hidden',
      textOverflow:'ellipsis',
      color: '#404040',
      fontWeight: '600',
      fontSize: '21px',
      fontFamily: 'Helvetica, sans-serif',
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
              addImageFile={this.addImageFile}
              text={"Drag images here to classify them"}
              subtext={"choose your files"} />
        </div>
      </div>
    );
  }
});

module.exports = CustomClassifierDetails;
