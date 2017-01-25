import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button'

var ApiKeyModal = React.createClass({
  componentDidMount: function() {
    $(ReactDOM.findDOMNode(this)).modal('show');
    $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);
  },

  saveApiKey: function() {
    console.log('save the key!')
    var key = ReactDOM.findDOMNode(this.refs.apiKey).value
    this.props.setApiKey(key)
    localStorage.setItem('apiKey', key)
    this.props.handleHideModal()
  },

  render: function(){
    return (
      <div className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title">Please Enter Your Watson VR API Key:</h4>
            </div>
            <div className="modal-body">
              <p>WARNING: This app will not function without an Watson VR API key.</p>
              <form id="api-key-form" role="form" action="#">
                <div className="form-group">
                  <input
                    ref="apiKey"
                    className="form-control"
                    type="text"
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                </div>
              </form>
            </div>
            <div className="modal-footer">
                <Button onClick={this.saveApiKey} type="button" dataDismiss="modal" kind={"bold"} text={"Save key"}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = ApiKeyModal
