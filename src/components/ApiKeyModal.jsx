import React from 'react'
import ReactDOM from 'react-dom'
import Button from './Button'
import Styles from './Styles'
import Radium from 'radium'
import request from 'superagent'

@Radium
export default class ApiKeyModal extends React.Component {
    saveApiKey = () => {
        var self = this
        var key = ReactDOM.findDOMNode(this.refs.apiKey).value
        var modal = $(ReactDOM.findDOMNode(this))

        var req = request.post('/api/test_key')

        req.query({ api_key: key })

        req.end(function(err, res) {
            if (res.body.valid) {
                self.props.setApiKey(key)
                self.props.handleHideModal()
                modal.modal('hide')
            } else {
                self.setState({error: 'Invalid api key'})
            }
        })
    }

    logout = () => {
        this.props.setApiKey('')
        this.props.handleHideModal()
        $(ReactDOM.findDOMNode(this)).modal('hide')
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this)).modal('show')
        $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal)
    }

    render() {

        var deleteStyle = {
            backgroundColor: 'transparent',
            backgroundImage: `url(${'/btn_delete.png'})`,
            height: '25px',
            width: '25px',
            backgroundPosition: '0 0',
            backgroundSize: '75px 25px',
            backgroundRepeat: 'no-repeat',
            border: 'none',
            ':hover': {
                backgroundPosition: '-25px 0',
            },
            ':active': {
                backgroundPosition: '-50px 0',
            }
        }

        var error = {
            color: '#F44336',
            font: Styles.fontDefault,
        }

        return (
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <div style={{font: Styles.fontTitle, color: Styles.colorTextDark, display: 'inline-block'}}>Update API key</div>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={deleteStyle}>
                    </button>
                  </div>
                  <div className="modal-body">
                      <p>This tool needs a Watson Visual Recognition API key.</p>
                      <p><a href='https://console.ng.bluemix.net/registration/?target=/catalog/services/visual-recognition/'>Sign up for bluemix to get your free key</a></p>
                      {this.state.error ? <p style={error}>{this.state.error}</p> : null}
                      <form id="api-key-form" role="form" action="#">
                          <div className={this.state.error ? "form-group has-danger" : "form-group"}>
                              <input
                                  ref="apiKey"
                                  className="form-control"
                                  type="text"
                                  placeholder=""/>
                          </div>
                      </form>
                  </div>
                  <div className="modal-footer" style={{textAlign: 'right'}}>
                      <Button onClick={this.logout} text='Log out' style={{marginRight: '20px'}}/>
                      <Button onClick={this.saveApiKey} kind={"bold"} text={"Save key"}/>
                  </div>
                </div>
              </div>
            </div>
        )
    }
}
