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
    return (
      <div>
        <div id="page-content-wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="container">
                  <h2>Watson Visual Recognition Tool</h2>
                  <div class="divider"></div>
                  
                  <h4>
                    API Key: {this.state.apiKey || "Unknown"} &nbsp;&nbsp;
                    <button className="btn btn-default"
                            onClick={this.handleShowModal}>
                      Update Key
                    </button>
                  </h4>

                  <div class="divider"></div>
                  
                  <CustomClassifierList 
                    url="/api/classifiers" 
                    apiKey={this.state.apiKey} />
                </div>
              </div>
            </div>
          </div>
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