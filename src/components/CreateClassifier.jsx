import React from 'react'
import Radium from 'radium'
import {browserHistory} from 'react-router'
import request from 'superagent'
import Styles from './Styles'
import Constants from './Constants'
import Card from './Card'
import Button from './Button'
import Class from './Class'

@Radium
export default class CreateClassifier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifierName: "testing",
            classes: [
                {name: "my_cool_class", file: null},
                {name: "this_is_fun", file: null}
            ]
        }
    }

    setClassFile = (file, key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses[key].file = file
        this.setState({ classes: newClasses })
    }

    cancel = () => {
        browserHistory.push('/')
    }

    create = () => {
        var req = request.post(Constants.host + "api/classifiers")
        var apiKey = localStorage.getItem('apiKey')

        console.log('Api key: ' + apiKey)
        console.log('Classifer name: ' + this.state.classifierName)

        this.state.classes.map(function(c) {
            req.attach(c.name, c.file)
            console.log('name: ' + c.name +', file: ' + c.file)
        })

        req.field('api_key', apiKey)
        req.field('classifier_name', this.state.classifierName)

        req.then(function(res, err) {
            console.log(res)
            console.error(res.body.error)
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
                <div style={textStyles.header}>
                    Create a new classifier
                </div>
                <div style={[textStyles.base, margin]}>
                    A classifier is a group of classes that are trained against each other. This allows you identify highly specialized subjects.
                </div>
                <input type="text"
                    style={textStyles.header}
                    placeholder='Classifier name' />
                <Card>
                    <div style={textStyles.header}>
                        Classes
                    </div>
                    <div style={[textStyles.base, {maxWidth: '800px'}, margin]}>
                        A classifier named "fruit" may have a “pear”, “apple”, and “banana” class or just a “banana” class and a collection of negative examples. Negative examples are not used to create a class, but does define what the classifier is not.
                    </div>
                    {this.state.classes.map(function(c, i) {
                        return (
                            <Class key={i}
                                id={i}
                                setClassFile={self.setClassFile}/>
                        )
                    })}
                    <Button onClick={this.addClass} text='Add class'/>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={this.cancel} text='Cancel' style={{marginRight: '20px'}}/>
                        <Button onClick={this.create} text='Create' kind='bold'/>
                    </div>
                </Card>
            </div>
        )
    }
}
