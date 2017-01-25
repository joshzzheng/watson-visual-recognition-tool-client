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
        files: files
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
            font: Styles.fontBold,
            paddingBottom: '5px',
            textAlign: 'center',
        };
        var orStyle = {
        		color: Styles.colorTextLight,
            font: Styles.fontDefault,
            textAlign: 'center',
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
            background: '#fcfcfc',
            padding: '25px 0px',
        };
        if (this.state.hover) {
        		subtextStyle.textDecoration = 'underline';
        } else {
        		subtextStyle.textDecoration = 'none';
        }

        var imgStyle = {
          display: 'table',
          margin: 'auto',
          maxHeight: '100%',
          maxWidth: '100%',
        };

        var container = {
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '45px',
            height: '45px',
            border: '1px solid #dedede',
            overflow: 'hidden',
        }

        var inLineTextStyle = {
          display: 'inline-flex',
          verticalAlign: 'middle',
          color: 'inherit'
        }

        return (
            <Dropzone ref="dropzone"
                onDrop={this.onDrop}
                multiple={false}
                style={dropzoneStyle}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}>
                {this.state.files.length > 0 ?
                  <div>
                    {this.state.files.map((file) => <div style={container}><img style={imgStyle} src={file.preview}/></div> )}
                    <div style={inLineTextStyle}>Uploading {this.state.files[this.state.files.length - 1].name}...</div>
                  </div> :
                  <div><div style={textStyle}>
                    {this.props.text}
                  </div>
                  <div style={orStyle}>
                     Or <span style={subtextStyle}>{this.props.subtext}</span>
                  </div></div>
                  }

      			</Dropzone>
        );
    }
});

module.exports = DropButton;
