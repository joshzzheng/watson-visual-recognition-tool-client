import React from 'react'
import moment from "moment"
import $ from "jquery"
import CustomClassifierDetails from './CustomClassifierDetails'

var CustomClassifiersList = React.createClass({
  loadClassifiersFromServer: function(){
    $.ajax({
      url: this.props.host + "api/classifiers",
      dataType: 'json',
      cache: false,
      data: { apiKey: this.state.apiKey },
      success: function(data) {
        this.setState({classifiers: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.host + "api/classifiers", status, err.toString());
      }.bind(this)
    });
  },
  
  getInitialState: function() {
    return {
      classifiers: [],
      apiKey: this.props.apiKey
    };
  },

  componentDidMount: function() {
    this.loadClassifiersFromServer();
  },

  componentWillReceiveProps: function(nextProps) {
    if(nextProps.apiKey !== null){
      this.setState({apiKey: nextProps.apiKey}, function(){
         this.loadClassifiersFromServer();
      })
    }
  },

  render: function() {
    var classifiers = [];

    var self = this;
    this.state.classifiers.forEach(function(classifier){
      classifiers.push(
        <CustomClassifierDetails
          host={self.props.host}
          classifierID={classifier.classifier_id}
          name={classifier.name}
          status={classifier.status}
          key={classifier.classifier_id} 
          apiKey={self.state.apiKey} 
        />);
    });
    return (
      <div>
        {
          this.state.classifiers.length > 0 ? 
            <h4>Your Classifiers:</h4> :
            <h4>No classifiers found!</h4>
        }
        <div className='row'>{classifiers}</div>
      </div>
    );
  }
});

module.exports = CustomClassifiersList;