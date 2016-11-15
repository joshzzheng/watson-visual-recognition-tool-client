import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import Content from './Content'
import Home from './Home'
import CreateClassifier from './CreateClassifier'

var App = React.createClass({
  getInitialState: function(){
    return {
      apiKey: null
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
                    apiKey={this.state.apiKey}/>
        <Route path="/create" 
               component={CreateClassifier}
               getApiKey={this.getApiKey}
               url="/api/classifiers"/>
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
