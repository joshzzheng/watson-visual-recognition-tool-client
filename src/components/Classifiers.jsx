import React from 'react'
import request from 'superagent'
import {browserHistory} from 'react-router'
import ClassifierDetail from './ClassifierDetail'
import Button from './Button'
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

        var req = request.post('/api/list_classifiers')
        req.query({ api_key: localStorage.getItem('apiKey') })
        req.query({ verbose: true })

        req.end(function(err, res) {
            console.log(res)
            var classifiers = []
            if (err != null) {
                console.error('Server error')
            }
            if (res.body != null) {
                if (res.body.statusInfo == 'invalid-api-key') {
                    console.error('Invalid API Key')
                    self.props.invalidApiKey()
                    return
                } else if (res.body.status == 'ERROR') {
                    console.error('There was an error fetching classifiers')
                }
                classifiers = res.body.classifiers
                classifiers.sort(function(a, b) {
                    return new Date(b.created) - new Date(a.created)
                })
                classifiers.push({name: 'Default', status: 'ready'}, {name: 'Faces', status: 'ready'})
            }
            self.setState({ classifiers: classifiers })
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
                    key={classifier.classifier_id || classifier.name}/>
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
