import React from 'react'
import request from 'superagent'
import {browserHistory} from 'react-router'
import ClassifierDetail from './ClassifierDetail'
import Button from './Button'
import Radium from 'radium'
import StackGrid from 'react-stack-grid'

@Radium
export default class Classifiers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifiers: []
        }
    }

    reloadTraining = (timeout) => {
        var self = this
        if (this.state.training != null && this.state.training.length == 1) {
            console.log('reload training data in ' + timeout + ' seconds')
            setTimeout(function() {
                self.loadClassifier(self.state.training[0])
            }, timeout * 1000)
        } else if (this.state.training != null && this.state.training.length > 0) {
            setTimeout(function() {
                self.loadClassifiersFromServer()
            }, timeout * 1000)
        }
    }

    loadClassifier = (classifier_id) => {
        var self = this
        console.log('reloading: ' + classifier_id)

        var req = request.post('/api/classifier_details')

        req.query({ api_key: localStorage.getItem('apiKey') })
        req.query({ classifier_id: classifier_id})

        req.end(function(err, res) {
            if (err != null) {
                console.error('Server error')
            }
            if (res.body != null) {
                console.log(res.body.status)
                if (res.body.status == 'ready') {
                    var newClassifiers = $.extend([], self.state.classifiers)
                    for (var i in newClassifiers) {
                        if (newClassifiers[i].classifier_id == classifier_id) {
                            newClassifiers[i].status = res.body.status
                        }
                    }
                    self.setState({ classifiers: newClassifiers, training: null })
                } else {
                    self.reloadTraining(30)
                }
            }
        })
    }

    loadClassifiersFromServer = () => {
        var self = this

        var req = request.post('/api/list_classifiers')
        req.query({ api_key: localStorage.getItem('apiKey') })
        req.query({ verbose: true })

        req.end(function(err, res) {
            console.log(res)
            var training = []
            var classifiers = []
            if (err != null) {
                console.error('Server error')
            }
            if (res.body != null) {
                if (res.body.statusInfo == 'invalid-api-key') {
                    console.error('Invalid API Key')
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
            for (var i in classifiers) {
                if (classifiers[i].status == 'training') {
                    training.push(classifiers[i].classifier_id)
                }
            }
            self.setState({ classifiers: classifiers, training: training }, function() {
                if (this.state.training != null) {
                    self.reloadTraining(30)
                }
            })
        })
    }

    onClick = () => {
        browserHistory.push('/create_classifier')
    }

    componentDidMount() {
        this.loadClassifiersFromServer()
    }

    // Important!
    componentWillReceiveProps(newProps) {
        this.loadClassifiersFromServer()
    }

    reDraw = () => {
        this.forceUpdate()
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
                    reDraw={self.reDraw}
                    key={classifier.classifier_id || classifier.name}/>
            )
        })
        return (
            <div>
                <div style={{margin: '21px 0px'}}>
                    <Button id="button--classifiers--create" text={"Create classifier"} kind={"bold"} icon={"/btn_create.png"} onClick={this.onClick}/>
                </div>
                <StackGrid columnWidth={300} gutterWidth={40}>{classifiers}</StackGrid>
            </div>
        )
    }
}
