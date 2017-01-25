import React from 'react'
import ReactDOM from 'react-dom'
import Classifiers from './Classifiers'
import TitleBar from './TitleBar'
import TabBar from './TabBar'
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
      <div>
        <TitleBar/>
        <TabBar/>
        <div id="page-content-wrapper">
            <Classifiers
              host={this.props.route.host}
              apiKey={this.state.apiKey} />
        </div>
      </div>
    );
  }
});

module.exports = Home
