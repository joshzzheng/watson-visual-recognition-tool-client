import React from 'react'
import moment from 'moment'
import $ from 'jquery'
import request from 'superagent'
import ClassifyImage from './ClassifyImage'
import classNames from 'classnames'

var DeleteButton = React.createClass({
  getInitialState: function(){
    return {
      pressed: false
    }
  },

  contextTypes: {
    router: React.PropTypes.object
  },

  deleteClassifier: function(){
    this.setState({pressed: true}, function(){
      var req = request.del(this.props.host + 
                            "api/classifier/" + 
                            this.props.classifierID);
      var self = this;

      req.query('apiKey='+this.props.apiKey)
      req.then(function(res, err){
        self.context.router.push('/');
        self.setState({pressed: false});
      });      
    })
  },

  render: function(){
    var btnClass = classNames({
      'btn': true,
      'btn-sm': true,
      'btn-block': true,
      'disabled': this.state.pressed,
      'loading': this.state.pressed
    });

    return (
      <button className={btnClass}
              onClick={this.deleteClassifier}>
        Delete Classifier
      </button>
    )
  }
});

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
      },
      showClassifyImage: false
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
  
  componentDidMount: function() {
    {/*this.loadClassifierDetailsFromServer();*/}
  },

  componentWillReceiveProps: function(nextProps) {
    {/*this.setState({apiKey: nextProps.apiKey}, function(){
      this.loadClassifierDetailsFromServer();
    });*/}
  },

  toggleClassifyImage: function(){
    if (this.state.showClassifyImage == true) {
      this.setState({
        showClassifyImage: false, 
      })
    } else {
      this.setState({
        showClassifyImage: true,
      });
    }
  },

  render: function() {
    var date = moment(this.state.classifier.created)
                .format("MMMM Do YYYY, h:mm a")

    var textStyle = {
      textDecoration:'none', 
      display:'block',
      whiteSpace:'nowrap', 
      overflow:'hidden',
      textOverflow:'ellipsis'
    }

    let arrowClass = classNames({
      'triangle': true,
      'triangle-right': !this.state.showClassifyImage,
      'triangle-down': this.state.showClassifyImage
    })

    return(
      <div className="col-sm-4">
        <div className="card" 
             style={{
              maxWidth:'30rem',
              marginBottom:'4rem'}}>
          <div className="card-block">
            <h4 className="card-title" style={textStyle}>{this.props.name}</h4>
            <p className="card-text" style={textStyle}>
              <b>ID:</b> {this.props.classifierID}<br/>
              <b>Status:</b> {this.props.status} <br/>
              {/*<b>Created:</b> {date} <br/>
              <b>Owner:</b> {this.state.classifier.owner || "None"}*/}
            </p>          
          </div>
          
          <ClassList classes={this.state.classifier.classes} />
          <div className="card-block">          
            <DeleteButton 
              host={this.props.host}
              classifierID={this.props.classifierID}
              apiKey={this.props.apiKey} />
          </div>

          <div className="card-block">
            <button
              className="btn btn-sm btn-block"
              onClick={this.toggleClassifyImage}>
                Classify Image &nbsp;
                {this.state.showClassifyImage ? 
                  <i className='fa fa-caret-down fa' 
                     aria-hidden="true"/>
                : <i className='fa fa-caret-right fa'
                     aria-hidden="true"/>}
            </button>

            {this.state.showClassifyImage ? 
                <ClassifyImage host={this.props.host} 
                               classifierID={this.props.classifierID}
                               apiKey={this.props.apiKey}/> 
                : null}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CustomClassifierDetails;