import React from 'react'
import ReactDOM from 'react-dom';

import Button from './Button'
import NavLink from './NavLink'
import ApiKeyModal from './ApiKeyModal'
import Styles from './Styles'

var Content = React.createClass({
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
    let apiKey = this.props.route.getApiKey();
    if(nextProps.apiKey !== null){
      this.setState({apiKey: apiKey});
    }
  },

  render: function() {
    var filter = {
      position: 'absolute',
    	background: Styles.colorPrimary,
      mixBlendMode: 'screen',
      width: '60px',
      height: '60px',
      float: 'left',
    }
    return(
      <div>
        <div id="topbar-wrapper">
          <div className="divider" id="page-content-wrapper">
            <div style={filter}></div>
            <img src="watson.png" className="logo"></img>
            <span className="title">Visual Recognition Tool</span>
            <span className="right">
              API Key: {this.state.apiKey || "Unknown"} &nbsp;&nbsp;
              <Button onClick={this.handleShowModal} text={"Update key"}/>
            </span>
          </div>
          <ul className="topbar-nav" id="page-content-wrapper">
            <li><NavLink className="nav-link" to="/" onlyActiveOnIndex={true}>Classifiers</NavLink></li>
            <li><NavLink className="nav-link" to="/collection">Collections (Coming Soon)</NavLink></li>
          </ul>
        </div>
        {this.props.children}
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

module.exports = Content
