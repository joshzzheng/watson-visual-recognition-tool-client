// import React from 'react'
// import ReactDOM from 'react-dom'
// import { Router, Route, browserHistory, IndexRoute } from 'react-router'
//
// import Content from './components/Content'
// import Home from './components/Home'
// import CreateClassifier from './components/CreateClassifier'

var React = require('react');
var ReactDOM = require('react-dom');
var { Router, Route, browserHistory, IndexRoute } = require('react-router');

var Content = require('./components/Content');
var TitleBar = require('./components/TitleBar');
var Classifiers = require('./components/CustomClassifierList');
var Apps = require('./components/Home');
var CreateClassifier = require('./components/CreateClassifier');

var App = React.createClass({
  getInitialState: function(){
    {/*host:"http://0.0.0.0:5000/""*/}
    return {
      apiKey: localStorage.getItem('apiKey') || null,
      host: "https://watson-visual-recognition-tool.herokuapp.com/"
    }
  },

  getApiKey: function() {
    return this.state.apiKey;
  },

  setApiKey: function(key) {
    this.setState({
      apiKey: key
    });
  },

  render: function(){
    const routes = (
      <Route path="/"
             component={Apps}
             getApiKey={this.getApiKey}
             setApiKey={this.setApiKey}
             apiKey={this.state.apiKey}
             host={this.state.host}>
        <IndexRoute component={Classifiers}
                    getApiKey={this.getApiKey}
                    setApiKey={this.setApiKey}
                    apiKey={this.state.apiKey}
                    host={this.state.host}/>
                  <Route path="/collections"
                    component={Classifiers}
                    getApiKey={this.getApiKey}
                    setApiKey={this.setApiKey}
                    apiKey={this.state.apiKey}
                    host={this.state.host}/>
        <Route path="/create"
               component={CreateClassifier}
               getApiKey={this.getApiKey}
               host={this.state.host}/>
        {/*<Route path="/collections" component={Collections}/>*/}
        {/*<Route path="/similarity" component={Repos}/>*/}
        {/*<Route path="/cloudant" component={About}/>*/}
      </Route>
    );

    return (
      <Router history={browserHistory} routes={routes}/>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById("main")
);
