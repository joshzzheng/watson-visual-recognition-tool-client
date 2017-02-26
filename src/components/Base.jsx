import React from 'react'
import Classifiers from './Classifiers'
import TitleBar from './TitleBar'
import TabBar from './TabBar'
import ApiKeyModal from './ApiKeyModal'
import LandingPage from './LandingPage'
import request from 'superagent'

export default class Base extends React.Component {
    constructor(props) {
        super(props)
        this.state = {showModal: false}
    }

    setApiKey = (key) => {
        console.log('setting key')
        localStorage.setItem('apiKey', key)
        if (key == null || key == '') {
            this.forceUpdate()
            return
        }

        var self = this
        var req = request.post('/check_key')
        req.query({ api_key: key })
        req.end(function(err, res) {
            console.log(res.body.has_token)
            if (!res.body.has_token) {
                var answer = confirm ("Would you like to link to GitHub in order to gain access to public classifiers?")
                if (answer) {
                    window.location.assign('http://localhost:8080/github-login?api_key=' + key)
                } else {
                    self.forceUpdate()
                }
            } else {
                self.forceUpdate()
            }
        })
    }

    invalidApiKey = () => {
        this.setApiKey('')
    }

    handleShowModal = () => {
        this.setState({
            showModal: true
        })
    }

    handleHideModal = () => {
        this.setState({
            showModal: false
        })
    }

    render() {
        return (
            <div>
                {localStorage.getItem('apiKey') == null || localStorage.getItem('apiKey') == ''? <LandingPage setApiKey={this.setApiKey}/> :
                    <div>
                        <TitleBar onClick={this.handleShowModal}/>
                        <TabBar/>
                        <div id="page-content-wrapper">
                            {/*This is to force an update*/}
                            {React.cloneElement(this.props.children, {invalidApiKey: this.invalidApiKey})}
                        </div>
                        {this.state.showModal ?
                            <ApiKeyModal
                                handleHideModal={this.handleHideModal}
                                setApiKey={this.setApiKey}/>
                            : null
                        }
                    </div>
                }
            </div>
        )
    }
}
