import React from 'react'
import ReactDOM from 'react-dom'
import Button from './Button'
import Styles from './Styles'
import Radium from 'radium'

@Radium
export default class ApiKeyModal extends React.Component {
    saveApiKey = () => {
        var key = ReactDOM.findDOMNode(this.refs.apiKey).value
        this.props.setApiKey(key)
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
            backgroundImage: `url(${'btn_delete.png'})`,
            height: '25px',
            width: '25px',
            backgroundSize: 'contain',
            border: 'none',
            ':hover': {
                backgroundImage: `url(${'btn_delete_hover.png'})`,
            },
            ':active': {
                backgroundImage: `url(${'btn_delete_pressed.png'})`,
            }
        }
        return (
            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <div style={{font: Styles.fontTitle, color: Styles.colorTextDark, display: 'inline-block'}}>Update API key</div>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={deleteStyle}>
                    </button>
                  </div>
                  <div className="modal-body">
                      <p>This app needs a Watson Visual Recognition API key</p>
                      <p>Don’t have an API key? <a href='https://console.ng.bluemix.net/registration/?target=/catalog/services/visual-recognition/'>Click here!</a></p>
                      <form id="api-key-form" role="form" action="#">
                          <div className="form-group">
                              <input
                                  ref="apiKey"
                                  className="form-control"
                                  type="text"
                                  placeholder=""/>
                          </div>
                      </form>
                  </div>
                  <div className="modal-footer" style={{textAlign: 'right'}}>
                      <Button dataDismiss="modal" text='Cancel' style={{marginRight: '20px'}}/>
                      <Button onClick={this.saveApiKey} kind={"bold"} text={"Save key"}/>
                  </div>
                </div>
              </div>
            </div>
        )
    }
}
