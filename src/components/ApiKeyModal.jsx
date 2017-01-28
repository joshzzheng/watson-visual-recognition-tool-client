import React from 'react'
import ReactDOM from 'react-dom'
import Button from './Button'

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
                            <p>This app needs a Watson Visual Recognition API key</p>
                            <p>Don’t have an API key? <a href='https://console.ng.bluemix.net/registration/?target=/catalog/services/visual-recognition/'>Click here!</a></p>
                            <form id="api-key-form" role="form" action="#">
                                <div className="form-group">
                                    <input
                                        ref="apiKey"
                                        className="form-control"
                                        type="text"
                                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"/>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <Button dataDismiss="modal" onClick={this.saveApiKey} kind={"bold"} text={"Save key"}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
