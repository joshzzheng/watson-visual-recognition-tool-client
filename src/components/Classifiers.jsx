import React from 'react'
import request from 'superagent'
import {browserHistory} from 'react-router'
import ClassifierDetail from './ClassifierDetail'
import Button from './Button'
import Constants from './Constants'
import Radium from 'radium'

@Radium
export default class Classifiers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifiers: []
        }
    }

    loadClassifiersFromServer = () => {
        var self = this
        var req = request.get(Constants.host + "api/classifiers")
        req.query({ apiKey: localStorage.getItem('apiKey') })

        req.end(function(err, res) {
            if (res.body != null) {
                self.setState({ classifiers: res.body })
            }
        })
    }

    onClick = () => {
        browserHistory.push('/create')
    }

    componentDidMount() {
        this.loadClassifiersFromServer()
    }

    // Important!
    componentWillReceiveProps(newProps) {
        this.loadClassifiersFromServer()
    }

    render() {
        var self = this
        var classifiers = this.state.classifiers.map(function(classifier) {
            return (
                <ClassifierDetail
                    host={self.props.route.host}
                    classifierID={classifier.classifier_id}
                    name={classifier.name}
                    status={classifier.status}
                    key={classifier.classifier_id}/>
            )
        })
        return (
            <div>
                <div style={{margin: '21px 0px'}}>
                    <Button text={"Create classifier"} kind={"bold"} icon={"btn_create.png"} onClick={this.onClick}/>
                </div>
                <div className='row'>{classifiers}</div>
            </div>
        )
    }
}
