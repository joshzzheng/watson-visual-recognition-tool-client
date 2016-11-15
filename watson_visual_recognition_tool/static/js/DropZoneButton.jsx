import React from 'react'
import Dropzone from 'react-dropzone'
import request from 'superagent'

var DropzoneButton = React.createClass({
  getInitialState: function () {
    return {
      files: [],
      text: "Drag File Here or Click To Select"
    };
  },

  onDrop: function (files) {
    this.setState({
      files: files,
      text: files[files.length-1].name
    });
    this.props.addFile(this.props.classes, 
                       this.props.rowId, 
                       files[files.length-1])
  },

  onOpenClick: function () {
    this.refs.dropzone.open();
  },

  render: function () {
    var dropzoneStyle = {
      border: "dotted"
    };

    return (
      <Dropzone ref="dropzone" 
                onDrop={this.onDrop} 
                multiple={false}
                className="btn btn-secondary"
                style={dropzoneStyle}> 
        {this.state.text}
      </Dropzone>
    );
  }
});

module.exports = DropzoneButton;