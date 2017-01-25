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

    handleHideModal: function(){
      this.setState({
        showModal: false
      });
    },

    handleShowModal: function(){
      this.setState({
        showModal: true
      });
    },

    componentWillReceiveProps: function(nextProps) {
      let apiKey = this.props.route.getApiKey()
      if (nextProps.apiKey !== null) {
        this.setState({apiKey: apiKey})
      }
    },

  render: function() {
    return (
      <div>
        <TitleBar apiKey={this.state.apiKey}
            onClick={this.handleShowModal}/>
        <TabBar/>
        <div id="page-content-wrapper">
            <Classifiers
              host={this.props.route.host}
              apiKey={this.state.apiKey} />
        </div>
        {
         this.state.showModal ?
           <ApiKeyModal
             showModal={this.state.showModal}
             handleHideModal={this.handleHideModal}
             setApiKey={this.props.route.setApiKey}
           />
           : null
       }
      </div>
    );
  }
});

module.exports = Home
