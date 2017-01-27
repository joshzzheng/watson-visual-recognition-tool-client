import React from 'react'
import Classifiers from './Classifiers'
import TitleBar from './TitleBar'
import TabBar from './TabBar'
import ApiKeyModal from './ApiKeyModal'

export default class Base extends React.Component {
    constructor(props) {
        super(props)
        if(this.props.route.getApiKey()) {
            this.state = {
                apiKey: this.props.route.getApiKey(),
                showModal: false
            }
        } else {
            this.state = {
                apiKey: null,
                showModal: true
            }
        }
    }

    handleHideModal = () => {
        this.setState({
            showModal: false
        })
    }

    handleShowModal = () => {
        this.setState({
            showModal: true
        })
    }

    componentWillReceiveProps(nextProps) {
        let apiKey = this.props.route.getApiKey()
        if (nextProps.apiKey !== null) {
            this.setState({apiKey: apiKey})
        }
    }

    render() {
        return (
            <div>
                <TitleBar apiKey={this.state.apiKey}
                    onClick={this.handleShowModal}/>
                <TabBar/>
                <div id="page-content-wrapper">
                    {this.props.children}
                </div>
                {this.state.showModal ?
                    <ApiKeyModal
                        showModal={this.state.showModal}
                        handleHideModal={this.handleHideModal}
                        setApiKey={this.props.route.setApiKey}/>
                    : null
                }
            </div>
        )
    }
}
