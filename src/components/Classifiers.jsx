import React from 'react'
import request from 'superagent'
import {browserHistory} from 'react-router'
import ClassifierDetail from './ClassifierDetail'
import Button from './Button'
import Radium from 'radium'

@Radium
export default class CustomClassifiersList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifiers: []
        }
    }

    loadClassifiersFromServer = () => {
        var self = this
        var req = request.get(this.props.route.host + "api/classifiers")

        req.query({ apiKey: this.props.route.apiKey })

        req.end(function(err, res) {
            self.setState({ classifiers: res.body })
        })
    }

    onClick = () => {
        browserHistory.push('/create')
    }

    componentDidMount() {
        this.loadClassifiersFromServer()
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.apiKey !== null){
            this.setState({apiKey: nextProps.apiKey}, function(){
                this.loadClassifiersFromServer()
            })
        }
    }

    render() {
        var self = this
        var classifiers = this.state.classifiers.map(function(classifier){
            return (
                <ClassifierDetail
                    host={self.props.route.host}
                    classifierID={classifier.classifier_id}
                    name={classifier.name}
                    status={classifier.status}
                    key={classifier.classifier_id}
                    apiKey={self.props.route.apiKey}/>
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
