import React from 'react'
import Dropzone from 'react-dropzone'
import request from 'superagent'
import Styles from './Styles'

var DropButton = React.createClass({
  	getInitialState: function(){
				return {
          files: [],
          hover: false
        }
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

    toggleHover: function(){
				this.setState({hover: !this.state.hover})
    },

    render: function() {
    		var textStyle = {
            color: Styles.colorTextLight,
            fontWeight: '500',
            paddingBottom: '5px',
            textAlign: 'center',
        };
        var orStyle = {
        		color: Styles.colorTextLight,
            textAlign: 'center',
            fontWeight: '200',
        }
    		var subtextStyle = {
            color: Styles.colorPrimary,
        };
        var dropzoneStyle = {
            width: '100%',
            cursor: 'pointer',
            alignSelf: 'center',
            borderRadius: '5px',
            borderColor: '#959595',
            borderWidth: 'thin',
            borderStyle: 'dashed',
            fontSize: '14px',
            fontFamily: 'Helvetica, sans-serif',
            background: '#fcfcfc',
            padding: '25px 0px',
        };
        if (this.state.hover) {
        		subtextStyle.textDecoration = 'underline';
        } else {
        		subtextStyle.textDecoration = 'none';
        }

        return (
            <Dropzone ref="dropzone"
                onDrop={this.onDrop}
                multiple={false}
                style={dropzoneStyle}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}>
                		<div style={textStyle}>
        								{this.props.text}
                    </div>
                    <div style={orStyle}>
        								Or <span style={subtextStyle}>{this.props.subtext}</span>
                    </div>
      			</Dropzone>
        );
    }
});

module.exports = DropButton;
