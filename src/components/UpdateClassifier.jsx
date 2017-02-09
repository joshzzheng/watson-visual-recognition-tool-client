import React from 'react'
import Radium from 'radium'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'
import request from 'superagent'
import Styles from './Styles'
import TitleCard from './TitleCard'
import Button from './Button'
import Class from './Class'
import ProgressModal from './ProgressModal'
import StackGrid from 'react-stack-grid';

var myNum = 2

@Radium
export default class UpdateClassifier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifierName: '',
            classes: [
                {negative: true, file: null, id: 0}
            ],
            errors: false,
            upload: false,
        }
    }

    componentDidMount() {
        var self = this
        var newClasses = $.extend([], this.state.classes)
        var req = request.post('/api/classifier_details')

        req.query({ api_key: localStorage.getItem('apiKey') })
        req.query({ classifier_id: this.props.params.classifierID })

        req.end(function(err, res) {
            if (err != null) {
                console.error('Server error')
            }
            if (res.body != null) {
                self.setState({classifierName: res.body.name})
                res.body.classes.map(function(c) {
                    newClasses.push({
                        name: c.class,
                        file: null,
                        id: myNum,
                        defaultClass: true,
                    })
                    myNum++
                })
            }
            self.setState({classes: newClasses})
        })
    }

    onTextChange = (text) => {
        this.setState({ classifierName: text.target.value })
    }

    setClassFile = (file, key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses[key].file = file
        this.setState({ classes: newClasses })
    }

    setClassName = (text, key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses[key].name = text.target.value
        this.setState({ classes: newClasses })
    }

    deleteClass = (key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses.splice(key, 1)
        this.setState({classes: newClasses})
    }

    cancel = () => {
        browserHistory.push('/')
    }

    errorCheck = () => {
        alert('This feature is not yet available')
    }

    // This is kind of messy but helps show progress faster
    create = (onProgress, onFinished) => {

    }

    addClass = (e) => {
      var newClasses = $.extend([], this.state.classes)
      newClasses.push({
        name: "",
        file: null,
        id: myNum
      })
      myNum++
      this.setState({classes: newClasses})
    }

    render() {
        var textStyles = {
            base: {
                color: Styles.colorTextLight,
                font: Styles.fontDefault,
            },
            header: {
                color: Styles.colorTextDark,
                font: Styles.fontHeader,
            }
        }

        var margin = {
            marginTop: '5px',
        }

        var self = this
        return (
            <div>
                <div style={[textStyles.header, {marginTop: '30px', marginBottom: '5px'}]}>
                    Update classifier
                </div>
                <div style={[textStyles.base, {marginTop: '5px', marginBottom: '18px'}]}>
                    A classifier is a group of classes that are trained against each other. This allows you identify highly specialized subjects.
                </div>
                <TitleCard
                    errors={self.state.errors}
                    placeholder='Classifier name'
                    title={self.state.classifierName}
                    fixedTitle={true}
                    onChange={this.onTextChange}
                    inputStyle={textStyles.header}>
                    <StackGrid columnWidth={292} gutterWidth={40} style={{marginTop: '10px'}}>{this.state.classes.map(function(c, i) {
                        return (
                            <Class
                                errors={self.state.errors}
                                negative={c.negative}
                                title={c.name}
                                fixedTitle={c.defaultClass}
                                style={{maxWidth:'30rem'}}
                                key={c.id}
                                id={i}
                                setClassFile={self.setClassFile}
                                setClassName={self.setClassName}
                                delete={self.deleteClass}/>
                        )
                    })}</StackGrid>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={this.addClass} text='Add class' style={{float: 'left'}}/>
                        <Button onClick={this.cancel} text='Cancel' style={{marginRight: '20px'}}/>
                        <Button onClick={this.errorCheck} text='Update' kind='bold'/>
                    </div>
                </TitleCard>
                {this.state.upload ?
                    <ProgressModal
                        load={this.create}/>
                    : null
                }
            </div>
        )
    }
}
