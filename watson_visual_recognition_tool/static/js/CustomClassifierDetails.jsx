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
      var req = request.del(this.props.url);
      var self = this;

      req.set('apiKey', this.props.apiKey)
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
        Delete
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
      showClassifyImage: false,
      classifyButtonText: "Show Classify Image"
    };
  },
  
  loadClassifierDetailsFromServer: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      data: {apiKey: this.props.apiKey},

      success: function(data) {
        this.setState({classifier: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
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
        classifyButtonText: "Show Classify Image"
      })
    } else {
      this.setState({
        showClassifyImage: true,
        classifyButtonText: "Hide Classify Image"
      });
    }
  },

  render: function() {

    var date = moment(this.state.classifier.created)
                .format("MMMM Do YYYY, h:mm a")

    return(
      <div className="col-sm-2">
        <div className="card" style={{maxWidth:'20rem'}}>
          <div className="card-block">
            <h4 className="card-title">{this.props.name}</h4>
            <p className="card-text">
              <b>ID:</b> {this.props.classifierID} <br/>
              <b>Status:</b> {this.props.status} <br/>
              {/*<b>Created:</b> {date} <br/>
              <b>Owner:</b> {this.state.classifier.owner || "None"}*/}
            </p>          
          </div>
          
          <ClassList classes={this.state.classifier.classes} />
          <div className="card-block">          
            <DeleteButton 
              url={this.props.url} 
              apiKey={this.props.apiKey} />
          </div>

          <div className="card-block">
            <button 
              className="btn btn-sm btn-block"
              onClick={this.toggleClassifyImage}>
                {this.state.classifyButtonText}</button>
                {this.state.showClassifyImage ? 
                    <ClassifyImage url={'/api/classify'} 
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