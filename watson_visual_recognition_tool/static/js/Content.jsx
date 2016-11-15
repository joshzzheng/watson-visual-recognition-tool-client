import React from 'react'
import ReactDOM from 'react-dom';

import Home from './Home'
import CreateClassifier from './CreateClassifier'
import NavLink from './NavLink'

var Content = React.createClass({
  render: function() {
    return(
      <div>
        <div id="sidebar-wrapper">
          <ul className="nav nav-pills nav-stacked sidebar-nav">
            <li className="nav-item sidebar-brand">
              <span style={{color:'white'}}>Watson VR Tool</span>
            </li>
            <li>
              <NavLink 
                  className="nav-link" 
                  to="/" 
                  onlyActiveOnIndex={true}>Home
              </NavLink>
            </li>
            <li><NavLink className="nav-link" to="/create">Create Classifier</NavLink></li>
            <li><NavLink className="nav-link" to="/collection">Collections</NavLink></li>
            <li><NavLink className="nav-link" to="/similarity">Similarity Search</NavLink></li>
            <li><NavLink className="nav-link" to="/cloudant">Cloudant</NavLink></li>
            <li><NavLink className="nav-link" to="/calculator">Pricing Calculator</NavLink></li>
          </ul>
        </div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Content