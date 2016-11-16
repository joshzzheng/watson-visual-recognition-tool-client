import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import Content from './components/Content'
import Home from './components/Home'
import CreateClassifier from './components/CreateClassifier'

var App = React.createClass({
  getInitialState: function(){
    return {
      apiKey: null,
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
             component={Content}>
        <IndexRoute component={Home} 
                    getApiKey={this.getApiKey}
                    setApiKey={this.setApiKey}
                    apiKey={this.state.apiKey}
                    url={this.state.host + "api/classifiers"}/>
        <Route path="/create" 
               component={CreateClassifier}
               getApiKey={this.getApiKey}
               url={this.state.host + "api/classifiers"}/>
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
