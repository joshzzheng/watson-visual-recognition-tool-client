import React from 'react'
import ReactDOM from 'react-dom'
import CustomClassifierList from './CustomClassifierList'
import ApiKeyModal from './ApiKeyModal'

var Home = React.createClass({
  getInitialState: function() {
    if(this.props.route.getApiKey()){
      return {
        apiKey: this.props.route.getApiKey(),
        showModal: false
      }
    } else {
      return {
        apiKey: null,
        showModal: true
      };
    }
  },

  componentWillReceiveProps: function(nextProps) {
    let apiKey = this.props.route.getApiKey();
    if(nextProps.apiKey !== null){
      this.setState({apiKey: apiKey});
    }
  },

  render: function() {
    return (
      <div id="page-content-wrapper">
          <CustomClassifierList
            host={this.props.route.host}
            apiKey={this.state.apiKey} />
      </div>
    );
  }
});

module.exports = Home
