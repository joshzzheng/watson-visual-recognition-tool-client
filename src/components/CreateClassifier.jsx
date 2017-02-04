import React from 'react'
import Radium from 'radium'
import {browserHistory} from 'react-router'
import request from 'superagent'
import Styles from './Styles'
import TitleCard from './TitleCard'
import Button from './Button'
import Class from './Class'

@Radium
export default class CreateClassifier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifierName: '',
            classes: [
                {negative: true, file: null},
                {name: '', file: null},
            ]
        }
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

    cancel = () => {
        browserHistory.push('/')
    }

    create = () => {
        var req = request.post('/api/create_classifier')

        this.state.classes.map(function(c) {
            req.attach(c.name, c.file[0])
        })
        req.query({ api_key: localStorage.getItem('apiKey') })
        req.query({ name: this.state.classifierName })

        req.then(function(res, err) {
            console.log(res)
            browserHistory.push('/')
        })
    }

    addClass = (e) => {
      var newClasses = $.extend([], this.state.classes)
      newClasses.push({
        name: "",
        file: null
      })
      this.setState({classes: newClasses});
    }

    onDrop = (files) => {
        var self = this
        this.setState({ files: files }, function() {
            this.props.onDrop(this.state.files, function() {
                self.setState({ files: [] })
            })
        })
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
                    Create a new classifier
                </div>
                <div style={[textStyles.base, {marginTop: '5px', marginBottom: '18px'}]}>
                    A classifier is a group of classes that are trained against each other. This allows you identify highly specialized subjects.
                </div>
                <TitleCard
                    placeholder='Classifier name'
                    onChange={this.onTextChange}
                    inputStyle={textStyles.header}>
                    {/*<div style={textStyles.header}>
                        Classes
                    </div>
                    <div style={[textStyles.base, {maxWidth: '800px'}, {marginTop: '5px', marginBottom: '4rem'}]}>
                        A classifier named "fruit" may have a “pear”, “apple”, and “banana” class or just a “banana” class and a collection of negative examples. Negative examples are not used to create a class, but does define what the classifier is not.
                    </div>*/}
                    <div className='row' style={{marginTop: '10px'}}>{this.state.classes.map(function(c, i) {
                        return (
                            <Class
                                negative={c.negative}
                                style={{maxWidth:'30rem'}}
                                key={i}
                                id={i}
                                setClassFile={self.setClassFile}
                                setClassName={self.setClassName}/>
                        )
                    })}</div>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={this.addClass} text='Add class' style={{float: 'left'}}/>
                        <Button onClick={this.cancel} text='Cancel' style={{marginRight: '20px'}}/>
                        <Button onClick={this.create} text='Create' kind='bold'/>
                    </div>
                </TitleCard>
            </div>
        )
    }
}
