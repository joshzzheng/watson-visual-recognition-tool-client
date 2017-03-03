import React from 'react'
import request from 'superagent'
import Classifiers from './Classifiers'
import TitleBar from './TitleBar'
import TabBar from './TabBar'
import ApiKeyModal from './ApiKeyModal'
import LandingPage from './LandingPage'

export default class Base extends React.Component {
    constructor(props) {
        super(props)
        this.state = {showModal: false}
    }

    setApiKey = (key) => {
        // Our two points of entry (ApiKeyModal/LandingPage) should give us:
        // a valid key or null
        localStorage.setItem('apiKey', key)
        this.forceUpdate()
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
                {localStorage.getItem('apiKey') == 'undefined' || localStorage.getItem('apiKey') == null || localStorage.getItem('apiKey') == ''? <LandingPage setApiKey={this.setApiKey}/> :
                    <div>
                        <TitleBar onClick={this.handleShowModal}/>
                        <TabBar/>
                        <div id="page-content-wrapper">
                            {/*This is to force an update*/}
                            {React.cloneElement(this.props.children)}
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
