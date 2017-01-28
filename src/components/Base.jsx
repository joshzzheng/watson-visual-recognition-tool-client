import React from 'react'
import Classifiers from './Classifiers'
import TitleBar from './TitleBar'
import TabBar from './TabBar'
import ApiKeyModal from './ApiKeyModal'

export default class Base extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: localStorage.getItem('apiKey') == null
        }
    }

    setApiKey = (key) => {
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
                <TitleBar onClick={this.handleShowModal}/>
                <TabBar/>
                <div id="page-content-wrapper">
                    {/*This is to force an update*/}
                    {React.cloneElement(this.props.children, {})}
                </div>
                {this.state.showModal ?
                    <ApiKeyModal
                        showModal={this.state.showModal}
                        handleHideModal={this.handleHideModal}
                        setApiKey={this.setApiKey}/>
                    : null
                }
            </div>
        )
    }
}
